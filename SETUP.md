# One-time setup (for Manas)

About an hour, most of it on Shivani and Avijeet's Mac. Nothing here costs money: GitHub Pages is free, and both domains are paid up to October 2029 at GoDaddy. Editing needs a Claude Pro or ChatGPT Plus plan they already have or buy.

## 1. GitHub account and repository

1. Create a GitHub account for Aikkya, ideally on their `@aikkya.com` Google Workspace address. Turn on two-factor sign-in with a passkey or an authenticator app on Shivani's phone.
2. Create a **public** repository called `aikkya-site` under that account. GitHub Pages is only free for public repositories. Nothing in it is private: it's the same content as the website.
3. Push this folder to it (from your machine, after adding yourself as a collaborator, or from theirs):

   ```sh
   git remote add origin https://github.com/<their-account>/aikkya-site.git
   git push -u origin main
   ```

4. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The first run of the **Publish** workflow deploys the site.
5. Still in **Settings → Pages**, set **Custom domain** to `aikkya.com`. Tick **Enforce HTTPS** once the certificate is ready (can take up to an hour after DNS).
6. In the account's **Settings → Pages → Verified domains**, add `aikkya.com` and create the TXT record it asks for. This stops anyone else's Pages site claiming the domain.

## 2. DNS at GoDaddy

**aikkya.com** (keep the existing MX, SPF and `google-site-verification` records: that's their Google Workspace email):

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
| CNAME | www | `<their-account>.github.io` |

Delete the two parked A records on `@` (3.33.130.190 and 15.197.148.33) and any GoDaddy domain forwarding on aikkya.com.

**aikkya.in:** in GoDaddy, Domain → Forwarding → forward to `https://aikkya.com`, permanent (301), forward only. Leave its DNS as GoDaddy sets it.

No nameserver move is needed.

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

6. **Try it with them:** open Claude → Code → choose `~/aikkya-site`. Ask "show me the website" (the preview should open), then make a small change together and say "put it live". Check aikkya.com two minutes later.
7. **ChatGPT (optional):** install the Codex app, sign in, open the same folder. It reads `AGENTS.md`, the same instructions Claude reads.

## 4. After it's live

- **Google listing:** the Website button on their Google Business Profile points to Instagram. Change it to `https://aikkya.com` (Google Maps → their business → Edit profile → Contact).
- **Instagram bio:** add `aikkya.com`.
- **Google Search Console:** add a Domain property for `aikkya.com` (TXT record at GoDaddy) and submit `https://aikkya.com/sitemap-index.xml`.
- **Bing Webmaster Tools:** import the site from Search Console and submit the same sitemap. Bing's index is what ChatGPT search and Copilot use.
- **Check** `https://aikkya.com/llms.txt` shows the summary.

## What's where

- `AGENTS.md`: the rules and recipes the AI follows (`CLAUDE.md` points to it).
- `HOW-TO.md`: the plain guide for Shivani and Avijeet.
- `TO-CONFIRM.md`: facts still to check with them.
- `.claude/launch.json` and `.claude/settings.json`: the preview server and the commands Claude may run without asking (no force-push, no hard reset).
- `.github/workflows/publish.yml`: builds and deploys on every push to `main`.
