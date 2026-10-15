// Runs after every build, so every page (including ones added later) gets the
// same treatment without anyone having to remember:
//
// 1. Checks the basics search engines and AI tools rely on. Problems stop the
//    build, so a broken page can't go live.
// 2. Writes a plain markdown copy of every page next to it (/stay/index.md),
//    and all of them together in /llms-full.txt.
// 3. Fills the page list in /llms.txt.
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';

let SITE = '';
const PAGE_ORDER = ['/', '/stay/', '/us/', '/journal/', '/kind-words/', '/getting-here/', '/say-hello/'];
const BANNED = [/\bbook now\b/i, /\bbook your stay\b/i, /\breserve now\b/i];

// Size limits. Photos in src/ are resized by the build, but big originals slow every
// build and bloat the repository; files in public/ are sent to visitors exactly as they are.
const IMAGE = /\.(jpe?g|png|webp|avif|gif|svg|heic)$/i;
const SRC_IMAGE_LIMIT = 3 * 1024 * 1024;
const PUBLIC_IMAGE_LIMIT = 300 * 1024;
const ROBOTS_DIRECTIVES = ['user-agent', 'allow', 'disallow', 'sitemap'];

const allFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? allFiles(path) : [path];
  });

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : name.endsWith('.html') ? [path] : [];
  });

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '_' });
turndown.remove(['script', 'style', 'svg', 'nav']);
turndown.addRule('hidden', {
  filter: (node) => node.getAttribute && node.getAttribute('aria-hidden') === 'true',
  replacement: () => '',
});
turndown.addRule('picture', {
  filter: 'picture',
  replacement: (_, node) => {
    const img = node.querySelector('img');
    return img && img.getAttribute('alt') ? `\n\n![${img.getAttribute('alt')}](${new URL(img.getAttribute('src'), SITE)})\n\n` : '';
  },
});
turndown.addRule('image', {
  filter: 'img',
  replacement: (_, node) => {
    const alt = node.getAttribute('alt');
    return alt ? `![${alt}](${new URL(node.getAttribute('src'), SITE)})` : '';
  },
});
turndown.addRule('absoluteLinks', {
  filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
  replacement: (content, node) => {
    const href = node.getAttribute('href');
    return content.trim() ? `[${content.trim()}](${new URL(href, SITE)})` : '';
  },
});
turndown.addRule('definitionTerm', { filter: 'dt', replacement: (content) => `\n\n**${content.trim()}**\n` });
turndown.addRule('definitionText', { filter: 'dd', replacement: (content) => `${content.trim()}\n` });

const pageUrl = (root, file) => '/' + relative(root, file).split('\\').join('/').replace(/index\.html$/, '');

const linkExists = (root, href) => {
  const path = decodeURI(href.split(/[?#]/)[0]);
  if (path === '' || path === '/') return true;
  const target = join(root, path);
  if (path.endsWith('/')) return existsSync(join(target, 'index.html'));
  return existsSync(target) || existsSync(join(target, 'index.html'));
};

export default function seoAi() {
  return {
    name: 'aikkya-seo-ai',
    hooks: {
      'astro:config:done': ({ config }) => {
        SITE = config.site.replace(/\/$/, '');
      },
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const errors = [];
        const warnings = [];
        const titles = new Map();
        const pages = [];

        for (const file of walk(root)) {
          const url = pageUrl(root, file);
          const notFoundPage = url === '/404.html';
          const doc = parse(readFileSync(file, 'utf8'));
          const problem = (msg) => errors.push(`${url}: ${msg}`);
          const note = (msg) => warnings.push(`${url}: ${msg}`);

          const title = doc.querySelector('title')?.text.trim();
          const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
          if (!title) problem('no <title>');
          else if (titles.has(title)) problem(`same title as ${titles.get(title)}: "${title}"`);
          else titles.set(title, url);
          if (title && title.length > 65) note(`title is ${title.length} characters; search results cut it at about 60`);
          if (!description) problem('no description');
          else if (description.length < 50 || description.length > 170) note(`description is ${description.length} characters; 50 to 160 reads best`);
          if (!notFoundPage && !doc.querySelector('link[rel="canonical"]')) problem('no canonical link');

          const h1s = doc.querySelectorAll('h1');
          if (h1s.length !== 1) problem(`has ${h1s.length} main headings (h1); it needs exactly one`);

          for (const img of doc.querySelectorAll('img')) {
            const alt = img.getAttribute('alt');
            const hidden = img.closest('[aria-hidden="true"]');
            if (alt === undefined || (alt.trim() === '' && !hidden)) {
              problem(`photo ${img.getAttribute('src')} has no description (alt text)`);
            }
          }

          for (const a of doc.querySelectorAll('a[href^="/"]')) {
            const href = a.getAttribute('href');
            if (!linkExists(root, href)) problem(`link to ${href} goes nowhere`);
          }

          for (const s of doc.querySelectorAll('script[src]')) {
            if (/^(https?:)?\/\//.test(s.getAttribute('src'))) problem(`loads a script from another site: ${s.getAttribute('src')}`);
          }
          if (doc.querySelector('iframe')) problem('has an embed (iframe); the site keeps everything on its own pages');
          for (const l of doc.querySelectorAll('link[rel="stylesheet"]')) {
            if (/^(https?:)?\/\//.test(l.getAttribute('href') ?? '')) problem(`loads styles or fonts from another site: ${l.getAttribute('href')}`);
          }

          // Only the main picture at the top may load straight away; the rest wait (logo excepted).
          const eager = doc
            .querySelectorAll('img')
            .filter((img) => (img.getAttribute('loading') === 'eager' || img.getAttribute('fetchpriority') === 'high') && !img.closest('template') && !img.closest('header'));
          if (eager.length > 1) problem(`${eager.length} photos load straight away; only the main one at the top should (the rest load lazily, or after the page)`);

          for (const ld of doc.querySelectorAll('script[type="application/ld+json"]')) {
            try { JSON.parse(ld.text); } catch { problem('has broken structured data (JSON-LD)'); }
          }

          const main = doc.querySelector('main');
          const text = main?.text ?? '';
          for (const re of BANNED) if (re.test(text)) problem(`says "${text.match(re)[0]}"; Aikkya doesn't take bookings online`);

          if (notFoundPage || !main) continue;
          const footer = doc.querySelector('footer.foot');
          const toMarkdown = (html) =>
            turndown.turndown(html).replace(/^[ \t\u00a0]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
          const markdown = [toMarkdown(main.innerHTML), footer ? toMarkdown(footer.innerHTML) : '']
            .filter(Boolean)
            .join('\n\n---\n\n');
          writeFileSync(join(root, url, 'index.md'), `${markdown}\n`);
          pages.push({ url, title, description, markdown });
        }

        // Image sizes (see the limits at the top).
        const projectRoot = fileURLToPath(new URL('../', import.meta.url));
        for (const [folder, limit] of [['src', SRC_IMAGE_LIMIT], ['public', PUBLIC_IMAGE_LIMIT]]) {
          for (const file of allFiles(join(projectRoot, folder)).filter((f) => IMAGE.test(f))) {
            const size = statSync(file).size;
            if (size > limit) {
              errors.push(`${relative(projectRoot, file)} is ${Math.round(size / 1024)} KB; the limit is ${Math.round(limit / 1024)} KB (shrink it: sips -Z 2400 for photos, or re-save as WebP)`);
            }
          }
        }

        // robots.txt: only the standard lines, so every crawler and checking tool reads it cleanly.
        const robotsPath = join(root, 'robots.txt');
        if (existsSync(robotsPath)) {
          for (const line of readFileSync(robotsPath, 'utf8').split('\n')) {
            const key = line.split(':')[0].trim().toLowerCase();
            if (line.trim() && !line.trim().startsWith('#') && !ROBOTS_DIRECTIVES.includes(key)) {
              errors.push(`robots.txt has a line search tools don't recognise: "${line.trim()}"`);
            }
          }
        }

        // Journal freshness: the newest published post should be at most 2 days old (see AGENTS.md, "Publish").
        const journalDir = fileURLToPath(new URL('../src/content/journal/', import.meta.url));
        const newest = readdirSync(journalDir)
          .filter((name) => /^\d{4}-\d{2}-\d{2}-/.test(name) && existsSync(join(journalDir, name, 'index.md')))
          .filter((name) => !/^draft:\s*true\s*$/m.test(readFileSync(join(journalDir, name, 'index.md'), 'utf8')))
          .map((name) => name.slice(0, 10))
          .sort()
          .pop();
        if (newest) {
          const days = Math.floor((Date.now() - Date.parse(`${newest}T00:00:00Z`)) / 86_400_000);
          if (days > 2) {
            warnings.push(`the newest journal post is ${days} days old (${newest}). Publish a new one with this change: see "Publish" in AGENTS.md`);
          }
        }

        if (warnings.length) logger.warn(`Worth a look:\n- ${warnings.join('\n- ')}`);
        if (errors.length) {
          throw new Error(`The site isn't ready to publish:\n- ${errors.join('\n- ')}`);
        }

        const rank = (u) => (PAGE_ORDER.includes(u) ? PAGE_ORDER.indexOf(u) : PAGE_ORDER.length);
        pages.sort((a, b) => rank(a.url) - rank(b.url) || b.url.localeCompare(a.url));

        const list = pages
          .map((p) => `- [${p.title}](${SITE}${p.url}index.md): ${p.description}`)
          .join('\n');
        const llmsPath = join(root, 'llms.txt');
        if (existsSync(llmsPath)) {
          writeFileSync(llmsPath, readFileSync(llmsPath, 'utf8').replace('<!-- pages -->', list));
        }

        const full = pages
          .map((p) => `<page url="${SITE}${p.url}" title="${p.title}">\n\n${p.markdown}\n\n</page>`)
          .join('\n\n');
        writeFileSync(
          join(root, 'llms-full.txt'),
          `# Aikkya Farms: every page of ${SITE}, as plain text\n\n${full}\n`,
        );

        logger.info(`Checked ${pages.length + 1} pages. Wrote markdown copies, llms.txt and llms-full.txt.`);
      },
    },
  };
}
