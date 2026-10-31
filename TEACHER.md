# Teacher notes

## Once, before class

If the class Claude account is a Free, Pro or Max plan, turn off model training at claude.ai/settings/data-privacy-controls. Many students on one Claude account share its usage limit: if one hits the limit, all of them do.

## How the setup goes

The students do it themselves in CMD, on purpose. It's part of the lesson. The steps are on the class slides:

```
winget install -e --id Git.Git
winget install -e --id OpenJS.NodeJS.LTS
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

Then close CMD, open a new one, and run:

```
mkdir my-site
cd my-site
claude --model sonnet --effort medium
```

If `claude` isn't recognized: `%USERPROFILE%\.local\bin\claude --model sonnet --effort medium`

**You do the Claude login.** The login tab opens in their normal browser: close it without signing in, press `c` in the agent to copy the address, paste it into a private window (Ctrl+Shift+N), sign in, and close the window. Then they say yes to trusting the folder.

After that they copy the prompt from the repo's page and paste it in. Right after cloning, the agent asks them to restart it (`/exit`, then `claude --continue --model sonnet --effort medium`, then `go`). **Make sure everyone does this.** That's when the repo's settings switch on: Artifacts and account connectors are blocked, web search and subagents are off, the agent can't read their key, and normal commands stop asking yes or no. Before that, the clone asks yes or no once. That's fine: let them read it and answer.

**Backup, for a laptop that can't install:** if winget is missing, or Windows wants an admin password nobody has, click No and run this in PowerShell. It installs what it can without admin rights, sets the same limits, makes the folder and opens the agent.

```
irm https://raw.githubusercontent.com/Kiarashsolr/build-my-site/HEAD/teacher/setup-windows.ps1 | iex
```

On a Mac: install Node LTS from nodejs.org, run `xcode-select --install` for Git, `curl -fsSL https://claude.ai/install.sh | bash` for Claude Code, then use the same `mkdir`, `cd` and `claude` lines.

## In class

1. Tell them: "Don't press Ctrl+C or Esc while it's working. If a box asks yes or no, read it. If you're not sure, put your hand up." Keep laptops plugged in, with lids open.
2. Walk around. The agent calls you when something fails twice.
3. Publishing takes place on **the student's own Google account**, in the Firebase console, with the agent telling them what to click. You don't log in to anything there.

## Where you'll be called

| Moment | What to do |
|---|---|
| A student has no Google account they can use | Sign in to a class Google account for them, in a private window, for the console steps. Never your account that holds other projects: they'd see all of it |
| The Firebase page doesn't match what the agent says | Help them describe it, or drag a screenshot into `my-stuff/` |
| The agent says the key still needs permission after three tries | Check the `firebase-adminsdk` row has both Firebase Hosting Admin and Service Usage Consumer. Wait a minute, then tell the agent to try again |
| `check.mjs` fails on a student's own word | Decide with the student. To keep it, tell the agent to delete that one line from `scripts/banned-words.txt` on this laptop. Never do this for a PRIVACY line |
| A family doesn't want the site online | The student tells the agent no. The site stays on the laptop, and it counts the same |
| The agent stopped and asked the student to talk to you, or `progress.md` says "Paused: waiting for teacher" | Talk with the student privately and follow your institute's safeguarding procedure. Scroll the chat only if you need to. Tell the agent when to continue |
| A yes/no box they aren't sure about | Read it. Say yes only if it's a normal command for this project |
| Agent says "Interrupted" | Type "keep going" |
| Back at a prompt, or the window was closed | Use the restart command below |
| Laptop slept or Wi-Fi dropped | Wake it and wait a minute. If the agent shows an error, type "keep going" |
| Window title starts with "Select" and nothing moves | Press Esc once. A click paused the window |

## Before they leave

In the agent, type `/logout`. Then in CMD, check it worked:

```
claude auth logout
claude auth status
```

Also log out of GitHub if they used it: `gh auth logout --hostname github.com`. Their Google account and their key are theirs, so those stay. If you signed in anywhere outside a private window, sign out there. Closing the window isn't enough.

## Things worth knowing

- **Sites are really public,** at `https://<project-id>.web.app`, under the student's own Google account, after they say yes to the agent's question.
- **To restart a session:** in a new CMD window run `cd %USERPROFILE%\my-site`, then `claude --continue`, then type "read AGENTS.md and continue". It picks up from `progress.md`. Don't run `claude` from any other folder. You'll need to log in again next class.
- **To look over a student's shoulder,** read `progress.md` and `brand.md`.
- **To take a site down:** the student signs in at console.firebase.google.com, opens the project, then Hosting, and chooses Disable site from the menu on their site's row. A family can do the same. Or, logged in with that account in your own terminal: `npx -y firebase-tools@latest hosting:disable --project <project-id> --force`.
- **Their key is a password to their project.** It's in `secrets/` and git ignores it. If it ever leaks, they delete it in Project settings, Service accounts.

## Changing the rules

- Writing style: `guides/writing.md`, `scripts/banned-words.txt`
- Design: `guides/design.md`, `templates/layouts/`, `templates/shapes.html`
- Automated checks: `scripts/check.mjs`

When an agent makes the same mistake twice, add one line to the guide for that step.
