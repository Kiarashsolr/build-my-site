# Teacher notes

## Once, before class

1. In a private window, sign in with the class Google account and open https://console.firebase.google.com/?forceCheckTos=true. Accept the terms. Count the projects there, plus any deleted in the last 30 days. The free plan usually allows about 5 to 10 in total, and you need room for 4 and a spare. If you're short, have a second class Google account ready.
2. If the class Claude account is a Free, Pro or Max plan, turn off model training at claude.ai/settings/data-privacy-controls. Chats are then kept 30 days, not 5 years.
3. Many students on one Claude account share its usage limit. If one hits the limit, all of them do.

## On each laptop, about 5 to 10 minutes (estimate)

Windows, in PowerShell:

```
irm https://raw.githubusercontent.com/Kiarashsolr/build-my-site/HEAD/teacher/setup-windows.ps1 | iex
```

It installs Node, Git, the GitHub CLI and Claude Code, presets the agent, makes an empty `my-site` folder in the home folder, and opens the agent there. If Windows asks for an admin password and you don't have it, click No. The script then installs Node and Git without admin rights. Only saving to GitHub is lost.

The login tab opens in their normal browser by itself: close it without signing in, press `c` in the agent to copy the address, paste it into a private window (Ctrl+Shift+N), sign in, and close the window. Then say yes to trusting the folder.

If the script says STOP, the agent is not preset. Fix what it says and run the script again.

What the preset does (`teacher/settings.json`):

- Sonnet at medium effort.
- The agent's normal commands run without yes/no boxes. Anything else still asks, and so does a permanent publish.
- Artifacts are off, and so are connectors from the logged-in account, such as Drive or Gmail. A student never sees your connected accounts.
- Web search, subagents, auto memory and feedback prompts are off.

Mac: no script. Install Node LTS from nodejs.org, run `xcode-select --install` for Git, `curl -fsSL https://claude.ai/install.sh | bash` for Claude Code, and copy `teacher/settings.json` to `~/.claude/settings.json`. Make an empty folder and run `claude` in it.

## In class

1. Tell them at the start: "Leave the black window open. Don't press Ctrl+C or Esc. If a box asks yes or no, put your hand up and don't press anything. To copy your link, use the address bar of your browser." Keep laptops plugged in, with lids open.
2. The student finds this repo on GitHub and copies the prompt from the page. An account isn't needed to do this.
3. They paste it into the agent.
4. Have them drag their style guide, logo and pictures into `my-stuff/` when the agent asks.
5. Walk around. The agent calls you for the Firebase login, and for anything that failed twice.

## Where you'll be called

| Moment | What to do |
|---|---|
| Firebase login: a private window opens, and the agent shows a session ID | Check the session ID matches, sign in with the class Google account, and paste the code it gives you into the agent. Close the window. If no window opened, copy the address from the chat into a private window (Ctrl+Shift+N) |
| Project creation fails on terms | In a private window, accept the terms at https://console.firebase.google.com/?forceCheckTos=true, then tell the agent it's done |
| Project limit reached | Deleting won't help: a deleted project still counts for 30 days. Log the laptop into your second class Google account (`npx.cmd -y firebase-tools@latest logout`, then tell the agent to log in again), and have it make a new project there |
| `check.mjs` fails on a student's own word | Decide with the student. To keep it, tell the agent to delete that one line from `scripts/banned-words.txt` on this laptop. Never do this for a PRIVACY line |
| The agent asks you to confirm a permanent site | Only if a parent really agreed. Type that into the agent yourself |
| The agent stopped and asked the student to talk to you, or `progress.md` says "Paused: waiting for teacher" | Talk with the student privately and follow your institute's safeguarding procedure. Scroll the chat only if you need to. Tell the agent when to continue |
| A yes/no box you weren't expecting | Read it. Say yes only if it's a normal command for this project |
| Agent says "Interrupted" | Type "keep going" |
| Back at a PowerShell prompt, or the window was closed | Use the restart command below |
| Laptop slept or Wi-Fi dropped | Wake it and wait a minute. If the agent shows an error, type "keep going" |
| Window title starts with "Select" and nothing moves | Press Esc once. A click paused the window |

Use a private window for every login of yours, so nothing stays on their laptop.

## Before they leave

```
irm https://raw.githubusercontent.com/Kiarashsolr/build-my-site/HEAD/teacher/end-of-class.ps1 | iex
```

It stops the agent and the preview, logs out of Firebase, GitHub and Claude, puts the settings back, and confirms each logout. The student's files stay. Their preview link keeps working for 30 days, because the project lives on the class Google account.

On a Mac: `npx -y firebase-tools@latest logout`, `gh auth logout --hostname github.com`, `claude auth logout`, and delete `~/.claude/settings.json` if you put it there.

## Things worth knowing

- **Default publishing is a preview link that expires after 30 days.** A permanent `*.web.app` address happens only when you confirm a parent agreed. See `guides/05-publish.md`.
- **To restart a session:** in a new PowerShell window run `cd "$HOME\my-site"; claude --continue`, then type "read AGENTS.md and continue". It picks up from `progress.md`. Don't run `claude` from any other folder.
- **To look over a student's shoulder,** read `progress.md` and `brand.md`.
- **To take a site down now:** for a preview link, go to console.firebase.google.com with the class account, open the project, then Hosting. In the preview channel's row, click the three dots and choose Delete channel. For a permanent site, run `npx -y firebase-tools@latest hosting:disable --project <project-id> --force` in your own terminal, logged in with the class account. The project ID is in the student's `progress.md`, so keep a list of the four IDs.

## Changing the rules

- Writing style: `guides/writing.md`, `scripts/banned-words.txt`
- Design: `guides/design.md`, `templates/layouts/`, `templates/shapes.html`
- Automated checks: `scripts/check.mjs`

When an agent makes the same mistake twice, add one line to the guide for that step.
