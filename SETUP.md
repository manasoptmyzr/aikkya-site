# One-time setup (for Manas)

About an hour, most of it on Shivani and Avijeet's Mac. Nothing here costs money: GitHub Pages is free, and both domains are paid up to October 2029 at GoDaddy. Editing needs a Claude Pro or ChatGPT Plus plan they already have or buy.

## 1. GitHub repository (under Manas's account)

1. Create a **public** repository `aikkya-site` on your personal GitHub account. GitHub Pages is only free for public repositories; nothing in it is private.
2. Push this folder:

   ```sh
   git remote add origin https://github.com/<you>/aikkya-site.git
   git push -u origin main
   ```

3. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
4. **Settings → Collaborators → Add people:** Avijeet's (and Shivani's) GitHub username. They each need a free GitHub account and accept the emailed invite. Collaborators can push, and every push publishes.
5. **Your account's Settings → Pages → Verified domains:** add `aikkya.com` and create the TXT record it shows at GoDaddy. This stops anyone else's Pages site from claiming the domain.

Later, if they'd rather own it, transfer the repository to their account (Settings → Transfer ownership) and set the custom domain again there.

## 2. Domains, HTTPS and going live

**Before launch: a preview address.** Without a custom domain, Pages serves the site at `<you>.github.io/aikkya-site/`, and this site is built for the root of a domain, so styles and links break there. Use a preview subdomain instead:

- GoDaddy, aikkya.com DNS: add `CNAME preview → <you>.github.io`.
- Repository **Settings → Pages → Custom domain:** `preview.aikkya.com`. Tick **Enforce HTTPS** once it's offered.

Every push (yours or Avijeet's) then shows at https://preview.aikkya.com. Search engines are pointed at aikkya.com by every page's canonical link, so the preview won't compete with the real site.

**Going live:**

1. GoDaddy, aikkya.com DNS. Keep the MX, SPF and `google-site-verification` records: that's their Google Workspace email.

   | Type | Name | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |
   | CNAME | www | `<you>.github.io` |

   Delete the two parked A records on `@` (3.33.130.190 and 15.197.148.33) and any forwarding on aikkya.com. Remove the `preview` CNAME once it's no longer needed.
2. Repository **Settings → Pages → Custom domain:** change it to `aikkya.com`. GitHub checks the DNS, then requests a certificate.
3. When **Enforce HTTPS** becomes clickable (minutes, at most an hour), tick it.

**HTTPS:** GitHub Pages gets a free Let's Encrypt certificate for the custom domain and renews it by itself; there's nothing to buy or maintain. It covers `aikkya.com` and `www.aikkya.com` (www redirects to the main address). The domain has no CAA records, so nothing blocks the certificate. Between the DNS switch and the certificate arriving, https can show a warning for a few minutes; the domain is parked today, so nobody is affected.

**aikkya.in:** GoDaddy → Domain → Forwarding → `https://aikkya.com`, permanent (301). GoDaddy's forwarding servers already serve a valid certificate for aikkya.in (checked Oct 14, 2026), so `https://aikkya.in` redirects cleanly. Test it once after setting it up.

## 3. Their Mac

1. **Claude:** install the desktop app from claude.ai/download and sign in with their account (Pro or higher for the Code tab).
2. **Node.js:** the LTS installer from nodejs.org (22.12 or newer).
3. **Git:** open Terminal and run `xcode-select --install`.
4. **GitHub CLI:** the macOS installer from cli.github.com. Then:

   ```sh
   gh auth login        # GitHub.com → HTTPS → Login with a web browser
   gh auth setup-git
   git config --global user.name "Aikkya"
   git config --global user.email "<the GitHub account's email>"
   ```

5. **The site folder:**

   ```sh
   gh repo clone <their-account>/aikkya-site ~/aikkya-site
   cd ~/aikkya-site && npm install
   ```

6. **Permissions:** the project's `.claude/settings.json` lets Claude edit files in the folder, read `~/Downloads` and run the publishing commands without asking. The first time Claude reads Downloads, macOS asks for access; click Allow with them so they don't meet it alone.
7. **Try it with them:** open Claude → Code → choose `~/aikkya-site`. Ask "show me the website" (the preview should open), then make a small change together and say "put it live". Check aikkya.com two minutes later.
8. **ChatGPT (optional):** install the Codex app, sign in, open the same folder. It reads `AGENTS.md`, the same instructions Claude reads.

## 4. After it's live

- **Google listing:** the Website button on their Google Business Profile points to Instagram. Change it to `https://aikkya.com` (Google Maps → their business → Edit profile → Contact).
- **Instagram bio:** add `aikkya.com`.
- **Google Search Console:** add a Domain property for `aikkya.com` (TXT record at GoDaddy) and submit `https://aikkya.com/sitemap-index.xml`.
- **Bing Webmaster Tools:** import the site from Search Console and submit the same sitemap. Bing's index is what ChatGPT search and Copilot use.
- **Check** `https://aikkya.com/llms.txt` shows the summary and the page list, and `https://aikkya.com/stay/index.md` shows a page as plain text.
- **IndexNow:** nothing to set up. After each publish the workflow tells Bing and the other IndexNow engines about the pages, using the key file in `public/`. That step is allowed to fail (for example before DNS is connected) without affecting the site.
- **robots.txt** allows every crawler and says, through Content-Signal, that the content may be used for search, for AI answers and for training. That suits the goal of being visible to AI tools; if they'd rather not have it used for training, change `ai-train=yes` to `ai-train=no`.

## What's where

- `AGENTS.md`: the rules and recipes the AI follows (`CLAUDE.md` points to it).
- `HOW-TO.md`: the plain guide for Shivani and Avijeet.
- `TO-CONFIRM.md`: facts still to check with them.
- `.claude/launch.json` and `.claude/settings.json`: the preview server and the commands Claude may run without asking (no force-push, no hard reset).
- `.github/workflows/publish.yml`: builds and deploys on every push to `main`.
