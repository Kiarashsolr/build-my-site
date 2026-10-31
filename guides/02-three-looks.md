# Step 2: Three looks (10 minutes)

**Goal:** they see three real, different versions of their site in the browser, click around, and pick. Picking is much easier than describing.

First read `guides/design.md` and `guides/writing.md`.

## 1. Make three mockups

Create `mockups/a.html`, `mockups/b.html`, `mockups/c.html`. Each is a single self-contained file with its CSS inside, and is the **whole page**, with everything they've told you in it.

**Start each one by copying a file from `templates/layouts/`.** These are already designed and work on phones. Your job:

1. Replace every `[[...]]` with their real words from `brand.md`. Never lorem ipsum. Delete anything you have nothing true for. A status word like done, testing, idea or next comes only from what they told you. If they didn't say, delete it.
2. The templates are grey on purpose. Put in their colours, or choose some from their world (see "No colours yet?" in `guides/design.md`). Each mockup gets its own palette if they haven't picked any. Change the two fonts to ones that fit (the table is in `guides/design.md`).
3. **Add one big thing only this brand would have.** A record for music, a wheel for cars, bubbles and a bottle for drinks. `templates/shapes.html` has ready ones you can copy and change, or you can invent one. Their real things can also be the big thing: flavours on a real menu, a top 3 as a podium. Put it in the template's `.big` slot and set `--size`. It must be solid, at full strength, and big: `node scripts/shot.mjs` fails if it fills too little of the first screen, or if a shape runs over any words. A plain circle or a faint outline isn't a big thing. Each mockup needs a different one, and if they have real work or a usable logo, use that first. If their logo has to stay off the site, its shapes and colours are still theirs, so build the big thing from those. Don't use the Shop window unless they have real work to show, and don't use the Logbook unless they've told you the order of things and what's next. Never turn the order of a list into a history. If it could be anyone's page, you're not finished.

Rules for the three:

- **Choose three different layouts** using the table in `guides/design.md`. Don't choose three that differ only in colour.
- **Recommend the one that shows their real stuff best,** not the flashiest. Flavours go on a menu. Songs go on a tracklist. The poster has room for almost nothing, so recommend it only for a strong logo.
- **Use their real logo** in at least one, if they have one and it's allowed on the site (see `guides/design.md`).
- **Colour:** if they have colours, all three use them. If they don't, each mockup can try a different palette.
- **Fonts:** if they picked fonts, use those in all three. If not, try a different pair in each.
- **Make one a surprise:** one safe, one that fits best, one bolder than they'd have thought of.

Make all three in one go. Before you start, say: "I'm making your three looks now. It takes a few minutes, and your browser will show them when they're ready. Leave this window open." Don't ask anything while you're doing it.

## 2. Look before you show

For each one, run `node scripts/shot.mjs mockups/a.html --top` (then b, c) and read the phone and desktop images. Fix anything broken: overflow, unreadable text, overlapping things, a name cut off at the edge, empty space. If two look too alike, change one. If one looks plain, it isn't ready: make the big thing bigger.

## 3. Show them

Run `node scripts/open.mjs http://localhost:4321/mockups/a.html`. It has a switcher at the bottom left, added by the preview. Then:

> I made three looks, and they're open in your browser. You can switch between them with the A, B and C buttons at the bottom. I'd pick [one], because [one reason]. Which one do you like, or would you like something else?

In your next message, once only:

> You can also click the Comment button, click any part of the page, and tell me what you think. Or you can just tell me here.

## 4. Use what they say

- Read `.feedback/comments.json` for comments.
- "I like A but the colours from B" is the best possible answer. Do exactly that.
- A vague change like "brighter" or "cooler": make it, look at it again, and say what you changed in one line. If you changed a colour, update `brand.md`. Don't ask them to pick hex codes.
- If they say "idk" or "they're all good," ask one thing: "Which one would you show a friend first?"
- If they hate all three, ask "What's the worst thing about them?" and make one new one. Show websites from their screenshots in `my-stuff/` as a guide if they have any.
- Don't do more than 2 rounds. After that, recommend one and move on: "Let's go with this and improve it as we go."

Go back to the code of the websites they liked, in `my-stuff/websites/`. Pick one specific thing they liked (a layout, a font, a moving effect), find how it's done in the code, and write your own version of it in a mockup. Never copy their words, pictures or logo. Tell them which thing you took: "I used the big-letter header from the site you liked."

## 5. Finish

Write in `brand.md`: the look they chose, the final colours as codes, and the two fonts. Update `progress.md`. Go to `guides/03-build.md`.
