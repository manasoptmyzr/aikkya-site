# Aikkya website: notes for the AI working on it

This file is for Claude, ChatGPT/Codex or any other AI helping Shivani and Avijeet change their website. Read it before every task.

## Who you're helping

Shivani and Avijeet run Aikkya, a farm stay on a hillside in Seetla, near Mukteshwar in Kumaon. They are not technical and shouldn't need to be. They'll ask in plain words: "add this to the journal", "change the price", "put it live".

- Do the work yourself. Don't ask them technical questions or show them code unless they ask.
- After a change, show them the page in the preview and say in one or two plain sentences what changed.
- Ask "Shall I put this live?" before publishing. If they already said to put it live, publish once the build passes, then send them the link.
- If you're unsure what they mean, ask one short question in plain words.
- If something is beyond you (passwords, GitHub account, domain, DNS), tell them to ask Manas.

## How the site should feel

Aikkya is a home, not a hotel. They screen their guests, and they aren't trying to grow a business. Keep these rules even if a request seems to go against them, and check with them first:

- No "Book now", booking widgets, availability calendars, discounts, "only 2 rooms left", popups or chat widgets. The only way in is "Say hello" on WhatsApp.
- No analytics, trackers, cookie banners or third-party scripts, including Instagram embeds. The footer says "no cookies and no trackers" and that must stay true.
- Keep pages light. Photos go through the build, which makes small copies automatically.
- Write the way they write on Instagram: plain, warm, short, first person ("we"). No sales language. Avoid words like nestled, haven, oasis, escape, curated, immerse, unwind, rejuvenate, luxurious, unparalleled, "more than just", "whether you're … or …". No emojis. Avoid em dashes.
- When they give you text, keep their words. Fix typos only. Don't "improve" it unless they ask.
- Never invent facts: amenities, distances, practices, awards, history. If something is missing, ask them.
- Guest reviews are copied word for word. Trim with "…" if needed, never reword.

## Where things are

| What | File |
|---|---|
| Prices, phone/WhatsApp, address, Instagram link, check-in times | `src/site.ts` |
| Rooms (text, photos, sleeps, size) | `src/content/rooms/*.md` |
| Journal posts ("Life at Aikkya") | `src/content/journal/YYYY-MM-DD-short-name/index.md`, photos in the same folder |
| Kind words (guest reviews) | `src/content/kind-words.yaml` |
| In the news | `src/content/press.yaml` |
| Questions on the Getting here page | `src/content/questions.yaml` |
| Text on the home, Us, Stay and Say hello pages | `src/pages/index.astro`, `us.astro`, `stay.astro`, `say-hello.astro` |
| Photos used on pages | `src/assets/photos/` |
| Colours and type | `src/styles/site.css` |
| The drawing at the top of the home page | `src/assets/photos/cottage-sketch.jpg`, made from `cottage-dusk.jpg` with `scripts/pencil-sketch.swift` (options at the top of that file) |
| The faint cracked-plaster background | `public/kintsugi.svg`, drawn by `scripts/make-kintsugi.mjs` (change the numbers at the top and run `node scripts/make-kintsugi.mjs`) |
| Things still to check with Shivani and Avijeet | `TO-CONFIRM.md` |

These build themselves from the files above, so don't edit them by hand: `/llms.txt` (a summary for AI assistants), `/llms-full.txt` (every page as plain text), a markdown copy of every page (`/stay/index.md`), the sitemap, the journal RSS feed, and the structured data search engines read.

In the YAML files, entries show in the order of the number at the start of their name (`01-…`, `02-…`). Give a new entry the next number, or renumber if they want it higher up.

## Search engines and AI tools: built in

The site is set up so search engines and AI assistants (ChatGPT, Claude, Perplexity, Google) can read it properly, and every new page or post gets the same treatment automatically. Don't undo any of this.

What happens on every build (`integrations/seo-ai.mjs`):
- Every page is checked. The build stops, with a plain list of what to fix, if a page has no title, no description, more or fewer than one main heading, a photo without a description, a link to a page that doesn't exist, a script or embed from another site, broken structured data, or the words "book now". Long titles or descriptions only get a warning.
- A markdown copy of every page is written next to it, all pages are joined into `/llms-full.txt`, and the page list in `/llms.txt` is filled in.

Also automatic: the facts about Aikkya (address, map location, rooms, prices, hosts) go into structured data on every page from `src/site.ts`; journal posts get article data, breadcrumbs and their date in the sitemap; and after each publish, Bing and the other IndexNow search engines are told about the pages.

When writing, help search and AI tools by being plain and specific:
- Give each post a clear title that says what it's about, and describe every photo in plain words.
- Name places where they belong naturally (Seetla, Mukteshwar, Kumaon, Nainital). Never stuff keywords.
- Facts go in one place (`src/site.ts`, the YAML files), so the site, `/llms.txt` and the structured data never disagree.

### Adding a new page

Make `src/pages/<name>.astro` using the `Base` layout with a `title` and a `description` (50 to 160 characters), exactly one `<h1>`, and add it to the menu in `src/components/Header.astro`. The sitemap, markdown copy, llms.txt entry and checks happen by themselves.

## Common jobs

### Add a journal post

1. Make a folder `src/content/journal/YYYY-MM-DD-short-name/` (date of the post, lowercase words with dashes).
2. Put the photos in that folder with short lowercase names (`first-snow.jpg`).
   - iPhone photos are often HEIC. Convert: `sips -s format jpeg -Z 2400 IMG_1234.HEIC --out first-snow.jpg`
   - Shrink big JPEGs: `sips -Z 2400 first-snow.jpg`
3. Write `index.md`:

   ```md
   ---
   title: First snow
   date: 2026-12-18
   photo: ./first-snow.jpg
   photoAlt: Snow on the slate roof of Kintsugi, early morning
   instagram: https://www.instagram.com/p/XXXXXXXX/
   ---
   The text. Leave a blank line between paragraphs.

   ![The dogs in the snow](./dogs.jpg)
   ![The view from the deck](./view.jpg)
   ```

   - `photo` is the big picture at the top (optional). `instagram` is optional, for posts that were on Instagram first.
   - Photo lines placed one after another, with no blank line between, sit side by side.
   - Every photo needs a description of what's in it (for people who can't see it, and for search).
4. Preview it, show them, publish when they say so.

If they paste an Instagram caption, use it as the text and drop the hashtags. If the caption opens with a few words that work as a title ("Sounds of monsoon."), use them as the title and start the text after them; otherwise pick a few words from it and keep the text whole.

Photos usually arrive in `~/Downloads` (AirDrop, WhatsApp). Copy them into the post folder with plain `cp` commands, one per line, and never move or delete their originals. If a photo is already on the site in another post, mention it to them.

### Bring in many Instagram posts at once

Ask them to download their Instagram data: Instagram app → Settings → Accounts Center → Your information and permissions → Download your information → the Aikkya account → Some of your information → Posts → Download to device, format JSON, media quality High. It arrives as a zip by email. Unzip it somewhere outside this folder (Downloads is fine).

- Posts are in `your_instagram_activity/media/posts_1.json` (sometimes `content/posts_1.json`). Each post has `media` (photos with `uri` paths inside the export and `creation_timestamp`) and a caption in `title`, either on the post or on its first photo.
- The text is mis-encoded. Fix it with `Buffer.from(text, 'latin1').toString('utf8')` (or the equivalent in Python).
- Create the posts with `draft: true` in the front matter, then show them a short list (date, first line) and publish only the ones they choose by removing `draft: true`.
- Skip videos and reels for now: the site doesn't show video.

### Change prices, phone number or check-in times

Edit `src/site.ts`. Prices appear on the Stay page, the Getting here questions, `/llms.txt` and the structured data automatically.

### Add a guest review

Add an entry to `src/content/kind-words.yaml` with the next number: first name, month and year, where it was written (Airbnb, Google, a letter…), and the exact words. `featured: true` also shows it on the home page; keep that to three.

### Add a newspaper or magazine piece

Add it to `src/content/press.yaml`, with the link if there is one.

### Turn a photo into a drawing like the home page

`swift -O scripts/pencil-sketch.swift photo.jpg drawing.jpg 2800 --wash --light` (add `--crop=left,top,right,bottom` fractions to trim first). Daytime photos work best; dark or evening ones can look gloomy even with `--light`. The drawing is on white, so put it on a page with `mix-blend-mode: multiply` (see `.hero` in `src/pages/index.astro`) and its edges melt into the background.

### Change a room

Edit its file in `src/content/rooms/`. Photos are listed at the top; the first one is the big one.

## Preview

Run `npm run dev` and open http://localhost:4321. In the Claude desktop app, the preview panel uses `.claude/launch.json`. If `node_modules` is missing, run `npm install` first. Open the page you changed and show them.

## Publish

1. `npm run build` must finish without errors.
2. `git status` should show only what you changed. Add those paths (or everything, if that's all there is), commit with a one-line `-m` message, and push:

   ```sh
   git add src/content/journal/2026-12-18-first-snow
   git commit -m "Add journal post: First snow"
   git push
   ```

3. The site updates at https://www.aikkya.in in about two minutes. `gh run list --limit 1` shows whether it finished.

Before launch, www.aikkya.in still shows a GoDaddy parking page. If it does (fetch it to check), don't say the change is live: say it's saved and will appear on www.aikkya.in once Manas switches the domain on.

If `git push` is rejected because something changed elsewhere, run `git pull --rebase` and push again.

## Undo

Every publish is kept. To undo the last one: `git revert HEAD --no-edit`, then `git push`. To undo an older one, find it with `git log --oneline` and revert that commit. Never use `git reset --hard` or force-push.

## Don't change without Manas

- `src/pages/robots.txt.ts`, the IndexNow key file (`public/<32 letters and numbers>.txt`), `.github/workflows/` (publishing), `integrations/seo-ai.mjs` (the checks), `astro.config.mjs`, `package.json`.
- Don't add packages or upgrade Astro. Don't add analytics, embeds or anything that loads from another site.
- Don't delete posts or photos unless they ask.

## If the build fails

If it says "The site isn't ready to publish", it lists each problem with the page it's on: fix those. Otherwise read the error. It's usually a typo in the front matter (the part between `---` lines), a date not in `YYYY-MM-DD` form, or a photo name that doesn't match the file. Fix it and build again. If you can't, tell them plainly and suggest they message Manas.

## Technical notes

- Astro 7, static output, content collections in `src/content.config.ts`, images through `astro:assets` (`src/components/Photo.astro`).
- Fonts are self-hosted (Newsreader, Tiro Devanagari Hindi, Tiro Bangla). Nothing loads from Google.
- Hosting: GitHub Pages, deployed by `.github/workflows/publish.yml` on every push to `main`. The domain is set in the repository's Pages settings, not in a file.
- Astro docs: https://docs.astro.build. For a long-running dev server you can use `npx astro dev --background`, then `npx astro dev stop`.
