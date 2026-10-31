# Build My Site

Instructions that help an AI coding agent guide a beginner through building a one-page website for their brand, and putting it online with Firebase Hosting.

You make the decisions. The agent does the technical work, drafts the words, and checks its own mistakes.

## How to use it

Open your AI agent in an empty folder. Click the copy button on this box, paste it into the agent, and press Enter:

```
Run this here: git clone https://github.com/Kiarashsolr/build-my-site .
Then read AGENTS.md and follow it step by step. Talk to me the way it says.
```

Then answer its questions. You can bring your style guide, logo, pictures and any websites you liked, but you don't have to.

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
| `scripts/check-live.mjs`, `open.mjs`, `shrink.mjs` | Test the published site, open a page, shrink a big image |
| `teacher/`, `TEACHER.md` | Setup and clean-up for the teacher |

Needs Node 20 or newer and Chrome or Edge. The scripts have no dependencies.

The student's own files stay on their laptop unless they choose to publish the site. What they type, and any file the agent reads, goes to the AI service to be processed, so only bring things that are fine to share.
