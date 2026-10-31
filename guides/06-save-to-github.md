# Step 6: Save their work to GitHub (3 minutes)

Only if they ask, the teacher asks, or there's time. It gives them their own copy of the site.

## 1. Check GitHub

```
gh auth status
```

- If `gh` isn't found: on Windows run `winget install -e --id GitHub.cli`. Otherwise call the teacher. It may need a new terminal afterwards.
- If not logged in: run `gh auth login --web --git-protocol https` in the background and read its output. It prints a one-time code and an address. Open the address with `node scripts/open.mjs`, tell them the code, and say "Type this code on the page that opened. If it asks for a password, type that on the page, not here." No GitHub account yet? Skip this whole step. Their site is safe on this laptop and online. Tell the teacher.

## 2. Point this folder at their own copy

This folder still points to the shared template, and they can't push there. Make a **private** repo of their own. Don't use a first or last name in the repo name; use the brand name. If the brand is their first name, use `my-site`:

```
git remote remove origin
git add site brand.md progress.md firebase.json .firebaserc
git commit -m "My website"
gh repo create <brand-name>-site --private --source=. --remote=origin --push
```

Before committing, read `brand.md` and `progress.md` once more for anything private. `my-stuff/`, `.feedback/` and `.shots/` are ignored on purpose, because `my-stuff/` can contain pictures that belong to other people.

**Keep it private.** Don't make it public unless the teacher says so.

If `git commit` asks who they are, set it for this folder only, with the brand name and GitHub's no-reply address:

```
git config user.name "<brand name>"
git config user.email "<github-username>@users.noreply.github.com"
```

## 3. Finish

> Your site is saved on your GitHub now. It's private, so only you can see it.

Update `progress.md`.
