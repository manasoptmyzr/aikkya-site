// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import seoAi from './integrations/seo-ai.mjs';

export default defineConfig({
  site: 'https://aikkya.com',
  trailingSlash: 'ignore',
  compressHTML: true,
  integrations: [
    sitemap({
      // Journal posts tell search engines when they were written.
      serialize(item) {
        const date = item.url.match(/\/journal\/(\d{4}-\d{2}-\d{2})-/)?.[1];
        if (date) item.lastmod = new Date(date).toISOString();
        return item;
      },
    }),
    // Checks every page and writes the plain-text copies for AI tools.
    seoAi(),
  ],
  // Photos inside journal posts get smaller copies for phones.
  image: { layout: 'constrained' },
});
