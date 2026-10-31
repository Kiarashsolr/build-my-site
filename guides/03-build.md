# Step 3: Build the real site (20 minutes)

**Goal:** a finished one-page site in `site/`, using their chosen look and their words.

## 1. Start from the starter

First say: "I'm building your real site now. It takes a few minutes. Leave this window open."

Copy the mockup they picked to `site/index.html`, and move its `<style>` into `site/styles.css` with a `<link>` to it. Delete any comments in the HTML: comments are public. Copy only the pictures this page uses to `site/images/`, with simple lowercase file names and no spaces (`logo.png`). Then run `node scripts/clean-images.mjs`, and run it again whenever you add a picture. Then finish the design: this is the real page now. Make sure these are all there (`templates/starter/` shows them if you need an example):

- `<html lang="en">`, the viewport tag, a real `<title>` and description
- the `:root` colour variables, exactly these names, because `scripts/check.mjs` reads them: `--bg`, `--text`, `--main`, `--accent`, `--on-accent`
- exactly one `<h1>`
- the footer line that says it was made with AI help

Use variables for every colour in the CSS. Add more named ones if the brand needs them, such as `--on-main` (text on the main colour; the check tests this one too) or `--third`. Don't hard-code colours elsewhere.

## 2. What goes on the page

Only these. Leave out any section you've got nothing real for. A short site that's true beats a long one that's padded.

1. **Top:** logo or name, and one line saying what this is.
2. **What it is:** two or three sentences.
3. **The things:** what they make, did, or are planning, up to three. If something isn't real yet, say so in the words they used.
4. **Why:** a few sentences in their voice, from "In their words."
5. **The end:** what you want visitors to do. If there's no contact (the default), end on what they told you is next, or just stop.

A label is a claim too, whatever its length. "Now," "Next," "done" and "first on my list" go on the page only if they told you. Keep their own status words exactly ("finished, kind of," "not made yet"), and never list something unmade among finished work. Never put their sentence under a heading it wasn't about. Don't repeat a label beside the same words. Whatever line they approve as the top line must be visible on the first screen.

No "Testimonials," "Our Team," "Services," "Pricing," or "Contact" sections unless they're real. No "stats" bars.

## 3. Write the words

1. Start from "In their words" in `brand.md`. Keep their phrases whenever you can.
2. Draft the text by following `guides/writing.md`.
3. **Show them the words before moving on**, in the chat, not as code. Read-out style, short:

   > Here's what your site says at the top: "[line]". Does that sound like you? Say yes, or tell me how you'd say it.

4. If they give you a new way to say it, use **their version**, even if it's less polished. Fix only spelling, and only if it won't change how it sounds.
5. Do this for the top line, and for the "why" part if you changed their words at all. One at a time. Don't make them approve every word.

## 4. Pictures

- Use their logo and work.
- No stock photos. No images found online.
- No picture? Use colour, big type, and one big shape. That usually looks better than a bad photo. Never put a made-up graphic where their work would go, and never repeat the same shape once per item. If they have no pictures of their work, ask once for a phone photo. Otherwise let their words in big type be the page.
- Every image gets real `alt` text describing it.
- If an image is over about 1500 KB, shrink it yourself. On Windows: `node scripts/shrink.mjs site/images/photo.jpg`. On Mac: `sips -Z 1400 file.png`. Don't ask the student to do it.
- If their logo has a background box that clashes with your page, put it on a section with a matching colour or a neat white panel. Don't try to edit it.

## 5. One nice touch

Add **one** small thing they'll enjoy, ideally taken from a website they liked: a gentle hover effect, a section fading in, a colour shift. CSS only if you can. Wrap motion in `@media (prefers-reduced-motion: no-preference)`. One. Not five.

## 6. Check as you go

After the first full version:

```
node scripts/check.mjs
node scripts/shot.mjs
```

Fix every FAIL. Read every screenshot. Then open it for them: `node scripts/open.mjs http://localhost:4321/site/`.

> Your site is now open in your browser. Please scroll down it, and tell me anything you would like to change. You can also use the Comment button.

Pitch one idea now that would make it more theirs, based on something they told you: "You said your little brother dances when the beat drops. Want that as the first line?"

Take their changes one round at a time. Read `.feedback/comments.json` each round. Update `progress.md`. When it's basically there, go to `guides/04-review.md`. Don't wait for perfect.
