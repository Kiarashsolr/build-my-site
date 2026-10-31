# Step 0: Setup (3 minutes)

Do all of this without bothering the student unless a step fails.

## 1. Check the tools

Run:

```
node --version
git --version
```

- They installed these themselves in CMD before starting you. Node must be version 20 or newer. If it's missing or older, say: "Node is missing. Please call your teacher over." The teacher has a backup in `TEACHER.md`.

## 2. Make the folders

Run this exactly. It works in any shell and won't raise a yes/no box:

```
node -e "for (const d of ['my-stuff','mockups','site/images']) require('fs').mkdirSync(d,{recursive:true})"
```

## 3. Start the preview

Run this **in the background** so it keeps running. Use your shell tool's run-in-background option. If you don't have one, add ` > .serve.log 2>&1 &` to the end.

```
node scripts/serve.mjs . 4321
```

Check it: `node -e "fetch('http://127.0.0.1:4321/').then(r=>console.log(r.status))"` should print 200. If it says the port is in use, that's fine: it's already running.

## 4. Test the screenshots

Run `node scripts/shot.mjs templates/starter/index.html`. It should print two lines starting with `ok`. If it says NO BROWSER FOUND, say "Please call your teacher over, I need Chrome on this laptop."

## 5. Say hello

Update `progress.md` (step 1 next). Then send exactly this kind of message, in your own words:

> Hi! I'm going to help you build your own website today. You decide, I do the techy stuff. What's your first name, or the name of your brand?

Wait for their answer. Then go to `guides/01-get-to-know.md`. It starts with the homework question, so don't ask their name again.
