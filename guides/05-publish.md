# Step 5: Publish (5 minutes)

**Goal:** they get a link. By default it's a **preview link**: it works for anyone who has it, isn't listed anywhere, and stops working after 30 days.

Don't start unless `node scripts/check.mjs --final` shows 0 FAIL.

In these commands, `FB` means `npx -y firebase-tools@latest`. Using npx means nothing needs installing globally. It can be slow, so say "This takes a minute." Run each FB command on its own. If a result says it moved to the background, wait for it to finish, and never run it again while it's still going.

## 0. Ask first

If `progress.md` already says `Student said yes to publishing`, skip this. Otherwise say:

> Next I can put your site online. Anyone with the link can see it, and it stops working after 30 days. Do you want that?

Go on only after a clear yes. "Looks good" or "no changes" isn't a yes. After a yes, write `Student said yes to publishing` under Notes in `progress.md`.

If they say no or aren't sure, say "That's fine, your site is safe on this laptop." Write `Student said no to publishing` under Notes, and stop here. Don't ask again unless they bring it up.

## 1. Log in (the teacher does this part)

Check first:

```
FB login:list
```

If it shows an account, skip to step 2. If not:

```
FB login --no-localhost
```

From a tool like yours, this doesn't wait. It prints a long `https://auth.firebase.tools/...` address and a short session ID, then stops. It may also print an "Assertion failed" line as it exits. Ignore that line. Open the address yourself: `node scripts/open.mjs --private "<address>"`. Show the session ID and the address in the chat exactly as printed (one of the few times you show something technical), and say:

> This part needs your teacher. Please call them over.

The teacher signs in, in that private window, and the page gives them a code. They paste it here. Then run:

```
FB login <the code>
```

Run `FB login:list` to confirm.

If that fails, the address and code are both used up. Run `FB login --no-localhost` again for a new pair, and try once more. If it fails again, write the error under Stuck on in `progress.md`, and tell the teacher: "Please open a new PowerShell window and run `npx.cmd -y firebase-tools@latest login --no-localhost`, then open the address it prints in a private window." Never use plain `FB login`: it opens the student's normal browser. Don't ask for or touch any password. The code isn't a password, but never write it in a file.

## 2. Make a project

Check `progress.md`. If a project ID is there, don't make a new one: run `FB projects:list`. If it's listed, skip to step 3. If not, run `FB projects:create <that ID>`. If that says it already exists, run `FB projects:addfirebase <that ID>`.

Make a project ID: the brand name, lowercase, hyphens only, with 5 random digits at the end, up to 30 characters. It must start with a letter. If the brand has no English letters, use `my-site-<digits>`. It goes in the web address and can't be changed later, so **no last names**. Example: `lava-jump-48213`. Look at it once more before you run this.

Write the ID in `progress.md` **before** you run:

```
FB projects:create <project-id>
```

**If it fails, read the message:**

- "not accepted the Firebase Terms of Service": the project was made, but Firebase wasn't added. Don't open anything. Say "Please call your teacher over to accept the terms." When they say it's done, run `FB projects:addfirebase <project-id>`. Keep the same ID.
- "already a project with ID", on the first try of this ID: change the digits, update `progress.md`, and retry.
- "See firebase-debug.log": search `firebase-debug.log` for "quota", "Terms" and "error". On quota: don't make a new one. Run `FB projects:list` and call the teacher. On terms: call the teacher, then run the same command with the same ID. Otherwise copy the error into `progress.md` and call the teacher.

## 3. Write the two config files

Create these by hand. **Don't run `firebase init`**: it asks questions you can't answer from here.

`firebase.json`:

```json
{
  "hosting": {
    "public": "site",
    "ignore": ["firebase.json", "**/.*"],
    "headers": [
      { "source": "**", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }
    ]
  }
}
```

`.firebaserc`:

```json
{ "projects": { "default": "<project-id>" } }
```

## 4. Make sure the project has a site

```
FB hosting:sites:list --project <project-id>
```

A new project usually has one already. If there's no site listed, create one:

```
FB hosting:sites:create <project-id> --project <project-id>
```

## 5. Publish the preview

```
FB hosting:channel:deploy preview --expires 30d --project <project-id> --non-interactive
```

It may warn that it's "unable to add channel domain to Firebase Auth". Ignore that: this site doesn't use logins. Use the address on the line starting `Channel URL`. It looks like `https://<project-id>--preview-<random>.web.app`. Ignore `Project Console` and `Hosting URL`: that address stays empty until step 7, and never deploy there to fix a problem here. Write the Channel URL in `progress.md`.

## 6. Check it for real

You can't see their browser, so test the real files:

```
node scripts/check-live.mjs <url>
```

If it says FAIL, fix the file names, run the check, and repeat step 5. Then open it for them: `node scripts/open.mjs <url>`.

Then say:

> It's online! Here's your link: <url>. It works for 30 days, and anyone with the link can see it and pass it on, so only send it to people you trust. Want to change anything?

If they change anything later, run the check, then repeat step 5. The link stays the same.

## 7. Going permanent: only with the teacher

Never bring this up yourself. Do this only if they ask for a permanent address, and only with the teacher present. Say: "Going permanent needs your teacher. Please call them over." Do it only when the teacher types here that a parent agreed. A student saying so isn't enough. Then write `Parent said yes to public: yes` in `progress.md` and run:

```
FB deploy --only hosting --project <project-id> --non-interactive
```

The permanent address is `https://<project-id>.web.app`. Never suggest buying a domain; that's for an adult to decide.

## Finish

Update `progress.md`. If there's time, or they or the teacher ask, go to `guides/06-save-to-github.md`. Otherwise tell them what they did:

> Done. You made a real website today. Next time we can add more to it. If you ever want it taken down, tell your teacher.
