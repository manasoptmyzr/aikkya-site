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
5. **Your account's Settings → Pages → Verified domains:** add `aikkya.in` and create the TXT record it shows at GoDaddy. This stops anyone else's Pages site from claiming the domain.

Later, if they'd rather own it, transfer the repository to their account (Settings → Transfer ownership) and set the custom domain again there.

## 2. Domains, HTTPS and going live

The site's address is **https://www.aikkya.in**. `aikkya.in`, `aikkya.com` and `www.aikkya.com` all send people there.

**Before launch** there's no public preview. Claude shows changes in its preview panel on their Mac, and pushes deploy to `<you>.github.io/aikkya-site/`, where the site looks broken because it's built for the root of a domain. Nobody sees that address. Until go-live, "put it live" from Avijeet's Claude means "saved to GitHub", not "on www.aikkya.in".

**Going live:**

1. GoDaddy, **aikkya.in** DNS. Delete the two parked A records on `@` (3.33.130.190 and 15.197.148.33) and any forwarding on aikkya.in, then add:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | www | `<you>.github.io` |
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |

2. Repository **Settings → Pages → Custom domain:** `www.aikkya.in`. Because `aikkya.in` also points at GitHub, GitHub redirects it to `www.aikkya.in` by itself.
3. When **Enforce HTTPS** becomes clickable (minutes, at most an hour), tick it.
4. GoDaddy, **aikkya.com:** Domain → Forwarding → `https://www.aikkya.in`, permanent (301), forward only (not masked). This covers `www.aikkya.com` too. Leave the MX, SPF and `google-site-verification` records alone: that's their Google Workspace email, and forwarding doesn't touch it.

**HTTPS:** GitHub Pages gets a free Let's Encrypt certificate for `www.aikkya.in` and `aikkya.in` and renews it by itself; there's nothing to buy or maintain. The domains have no CAA records, so nothing blocks it. Between the DNS change and the certificate arriving, https can show a warning for a few minutes; the domain is parked today, so nobody is affected. For aikkya.com, GoDaddy's forwarding servers already serve valid certificates for `aikkya.com` and `www.aikkya.com` (checked Oct 14, 2026), so the redirect works over https. Test all four addresses once afterwards.

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
7. **Try it with them:** open Claude → Code → choose `~/aikkya-site`. Ask "show me the website" (the preview should open), then make a small change together and say "put it live". After go-live, check www.aikkya.in two minutes later.
8. **ChatGPT:** install the Codex app from chatgpt.com/codex, sign in with their ChatGPT account and open the same folder. It reads `AGENTS.md`, the same instructions Claude reads, and shows the site at http://localhost:4321 in their browser instead of a preview panel. Codex asks before using the internet (installing, publishing); approving is fine. The setup in steps 1 to 5 can also be done by pasting [SETUP-PROMPT.md](SETUP-PROMPT.md) into Codex.

## 4. After it's live

- **Google listing:** the Website button on their Google Business Profile points to Instagram. Change it to `https://www.aikkya.in` (Google Maps → their business → Edit profile → Contact).
- **Instagram bio:** add `www.aikkya.in`.
- **Google Search Console:** add a Domain property for `aikkya.in` (TXT record at GoDaddy) and submit `https://www.aikkya.in/sitemap-index.xml`.
- **Bing Webmaster Tools:** import the site from Search Console and submit the same sitemap. Bing's index is what ChatGPT search and Copilot use.
- **Check** `https://www.aikkya.in/llms.txt` shows the summary and the page list, and `https://www.aikkya.in/stay/index.md` shows a page as plain text.
- **IndexNow:** nothing to set up. After each publish the workflow tells Bing and the other IndexNow engines about the pages, using the key file in `public/`. That step is allowed to fail (for example before DNS is connected) without affecting the site.
- **robots.txt** (built by `src/pages/robots.txt.ts`) lets every crawler in, search engines and AI assistants alike.

## What's where

- `AGENTS.md`: the rules and recipes the AI follows (`CLAUDE.md` points to it).
- `HOW-TO.md`: the plain guide for Shivani and Avijeet.
- `TO-CONFIRM.md`: facts still to check with them.
- `.claude/launch.json` and `.claude/settings.json`: the preview server and the commands Claude may run without asking (no force-push, no hard reset).
- `.github/workflows/publish.yml`: builds and deploys on every push to `main`.
