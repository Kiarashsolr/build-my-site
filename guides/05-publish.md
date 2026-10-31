# Step 5: Put it online, together (15 minutes)

**Goal:** the site is live at `https://<name>.web.app`, a name they chose.

**This step is done together, on purpose.** They click in the Firebase console, and you tell them where. They should feel what it's like to work with an agent: you can do a lot, but some things only the owner can do. Don't try to do these parts for them.

How to guide them:

- **One step per message.** Say what to click, in plain words. End with "Tell me when that's done."
- **Say why, once, in one short line,** before each new part.
- **Firebase's pages change.** If what they see doesn't match, ask "What do you see on the screen?" or have them drag a screenshot into `my-stuff/`, then look at it. Go by their screen, not by this guide.
- **Never ask for a password.** They sign in on the Google page, not here.
- Stuck on the same thing twice: "Please call your teacher over."

Don't start unless `node scripts/check.mjs --final` shows 0 FAIL.

## 0. Ask first

If `progress.md` already says `Student said yes to publishing`, skip this. Otherwise say:

> Next we put your site on the real internet, at a web address you choose. Anyone can see it. Do you want that?

Go on only after a clear yes. "Looks good" or "no changes" isn't a yes. After a yes, write `Student said yes to publishing` under Notes in `progress.md`.

If they say no, aren't sure, or say their family doesn't want it online, say "That's fine, your site is safe on this laptop, and it counts just the same." Write `Student said no to publishing` under Notes, and stop here. Don't ask again unless they bring it up.

## 1. Choose the name

Do this in the chat first. Say:

> Your address will be name.web.app, and you can't change it later. Let's pick the name. How about [3 options from their brand]? Or say your own.

Rules: lowercase letters, numbers and hyphens, 6 to 30 characters, starting with a letter. **No last name, school, age or city.** Keep what they choose in `progress.md` under Notes.

## 2. Make the project (they click)

Run `node scripts/open.mjs https://console.firebase.google.com`. Then, one message at a time:

1. "A Firebase page opened. Sign in with your Google account. If you don't have one you can use, call your teacher over."
2. "Click **Create a project**. It might say Get started or Add project."
3. "Type your name: [name]. Look just under the box: it shows the real address name. If Firebase added extra letters or numbers, someone already has that name. Tell me exactly what it shows." If it changed, offer to try another name, or use the pencil beside it to edit it. Write the final project ID in `progress.md`.
4. "Tick the boxes to accept the terms, and click Continue."
5. "If it asks about Gemini or Google Analytics, turn them off, and keep clicking Continue, then **Create project**. It takes about a minute." We don't want tracking on the site.
6. "Tell me when it says your project is ready, and click Continue."

## 3. Get the key (they click)

Say:

> To publish from here, I need a key to your project. It's like a password for it. It goes in a secret folder, never on your site, and I never open it.

1. "Click the gear next to **Project Overview**, at the top left, then **Project settings**."
2. "Click the **Service accounts** tab."
3. "Click **Generate new private key**, then **Generate key**. A file downloads. Don't send it to anyone."

Run `node scripts/open.mjs secrets`, then:

> I opened a folder called secrets. Drag that file into it from your Downloads. Tell me when you're done.

Then run `node scripts/deploy.mjs --check`. It must print the project ID you wrote down. **Never open, read, print or copy the key file.** It stays out of git on purpose.

## 4. Try to publish

```
node scripts/deploy.mjs
```

The first run usually stops with NEEDS PERMISSION. It can be slow, so say "This takes a minute." If a result says it moved to the background, wait for it to finish, and never run it again while it's still going.

If it needs permission, tell them what happened, because this is the lesson:

> The key works, but it isn't allowed to publish yet. This happens all the time in the cloud. It's your project, so only you can give it permission. It's a few clicks.

## 5. Give the key permission (they click)

Run `node scripts/open.mjs "https://console.cloud.google.com/iam-admin/iam?project=<project-id>"`. If the page asks them to accept terms, they accept. Then, one message at a time:

1. "Find the row that starts with **firebase-adminsdk**. Click the pencil at the end of that row."
2. "Click **Add another role**. Type **Firebase Hosting Admin** and pick it."
3. "Click **Add another role** again. Type **Service Usage Consumer** and pick it."
4. "Click **Save**."

Say "It takes a minute to kick in," wait a minute, then run `node scripts/deploy.mjs` again. If it still says NEEDS PERMISSION, wait another minute and try again. After three tries, ask them to show you the row they changed, then call the teacher.

## 6. Check it for real

The script ends with `LIVE:` and the address. You can't see their browser, so test the real files:

```
node scripts/check-live.mjs https://<project-id>.web.app
```

If it says FAIL, fix the file names, run the check, and publish again. Then open it for them: `node scripts/open.mjs https://<project-id>.web.app`. Write the address in `progress.md`.

> You're live: https://<project-id>.web.app. That's real, and anyone with the address can see it. Try it on your phone. Want to change anything?

If they change anything, run `node scripts/check.mjs --final`, then `node scripts/deploy.mjs`. The address stays the same. Never suggest buying a domain; that's for an adult to decide.

## Finish

Update `progress.md`. If there's time, or they or the teacher ask, go to `guides/06-save-to-github.md`. Otherwise tell them what they did:

> Done. You made a real website, and you did the Firebase part yourself. Next time we can add more to it. If you ever want it taken down, tell your teacher.
