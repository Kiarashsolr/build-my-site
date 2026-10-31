# Build My Site

Instructions that help an AI coding agent guide a beginner through building a one-page website for their brand, and putting it online with Firebase Hosting.

You make the decisions. The agent does the technical work, drafts the words, and checks its own mistakes.

## Start here (Windows)

Press the Windows key, type `cmd`, and press Enter. Copy each box with its copy button, then right-click in the black window to paste, and press Enter. If it asks you to agree, type `Y`. If Windows asks to allow changes, click Yes.

**1. Git**

```
winget install -e --id Git.Git
```

**2. Node**

```
winget install -e --id OpenJS.NodeJS.LTS
```

**3. Claude Code**

```
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**4. Close the black window and open a new one.** Then make a folder and start your agent in it, one line at a time:

```
mkdir my-site
```

```
cd my-site
```

```
claude --model sonnet --effort medium
```

If `claude` isn't recognized:

```
%USERPROFILE%\.local\bin\claude --model sonnet --effort medium
```

**5. Put your hand up** so your teacher can log you in.

## Give it the instructions

Click the copy button on this box, paste it into your agent, and press Enter:

```
Run this here: git clone https://github.com/Kiarashsolr/build-my-site .
Then read AGENTS.md and follow it step by step. Talk to me the way it says.
```

Then answer its questions. Bring your style guide, logo, pictures, the addresses of websites you like, and a few real things about you. The more you bring, the more it's yours.

## What's in here

| Path | What it is |
|---|---|
| `AGENTS.md` | The agent's main rules |
| `guides/` | One guide per step, plus the writing and design guides |
| `templates/layouts/` | Eight designed page layouts the agent adapts to your brand |
| `templates/shapes.html` | Ready-made shapes: a record, a wheel, bubbles and more |
| `scripts/check.mjs` | Tests the site for broken links, hard-to-read colours, private information and AI-sounding phrases |
| `scripts/shot.mjs` | Takes phone and desktop screenshots, so the agent can look at its work |
| `scripts/serve.mjs` | Local preview, with a button for leaving comments on any part of the page |
| `scripts/clean-images.mjs` | Removes hidden data from pictures, such as where a photo was taken |
| `scripts/read-pptx.mjs` | Reads a PowerPoint style guide |
| `scripts/deploy.mjs`, `check-live.mjs` | Publish with your Firebase key, test the published site |
| `scripts/look.mjs`, `open.mjs`, `shrink.mjs` | Take a picture of a website you like, open a page, shrink a big image |
| `TEACHER.md`, `teacher/` | Notes for the teacher, and a backup setup |

Needs Node 20 or newer and Chrome or Edge. The scripts have no dependencies.

The student's own files stay on their laptop unless they choose to publish the site. What they type, and any file the agent reads, goes to the AI service to be processed, so only bring things that are fine to share.
