# Setting up a new Mac

The same prompt works in ChatGPT's Codex app and in Claude's desktop app.

**With ChatGPT (Codex):** install the Codex app from chatgpt.com/codex and sign in with your ChatGPT account. Choose your home folder (the one with your name) as the project, and paste everything in the box below. Codex asks before it uses the internet or installs anything: say yes to those during setup.

**With Claude:** open the Claude app, click **Code**, choose your home folder, and paste the same box.

```
I'm Avijeet. Our friend Manas built the website for our farm stay, Aikkya, and added me to its GitHub repository, manasoptmyzr/aikkya-site. I'm not technical. Please set up this Mac so I can change the website just by talking to you. Explain each step in one plain sentence. When something needs my password or a login, tell me what will pop up and let me do it myself. Never ask me to type a password into this chat. If you need my approval to use the internet or install something, tell me why in plain words.

1. Check what's already on this Mac: git, Node.js (22.12 or newer) and the GitHub CLI (gh). Install only what's missing:
   - git: run `xcode-select --install` and tell me to click Install in the window that appears (it can take about 10 minutes).
   - Node.js: download the official macOS installer for the current LTS version from nodejs.org and open it, so I can click through it.
   - GitHub CLI: download the official macOS installer (.pkg) from the latest release on github.com/cli/cli and open it.
2. Sign me in to GitHub with `gh auth login --web --git-protocol https --hostname github.com`. Show me the one-time code and tell me to finish in the browser. Then run `gh auth setup-git`.
3. If my invitation to manasoptmyzr/aikkya-site is still waiting (`gh api user/repository_invitations`), accept it.
4. Set my git name to my first name and my git email to my GitHub "noreply" address (from `gh api user`: it looks like 12345+username@users.noreply.github.com), so my personal email doesn't show in the public history.
5. Download the site with `gh repo clone manasoptmyzr/aikkya-site ~/aikkya-site`, then run `npm install` and `npm run build` inside it. Tell me plainly if anything fails.
6. Read ~/aikkya-site/AGENTS.md and ~/aikkya-site/HOW-TO.md, and tell me in five short lines how I'll use this day to day.
7. Finally, tell me how to open the aikkya-site folder as my project in this app from now on, and to ask "show me the website" there.

Don't publish anything during setup.
```

If someone else is setting up (Shivani, say), change "I'm Avijeet" to their name.
