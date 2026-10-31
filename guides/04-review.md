# Step 4: Find your own mistakes (10 minutes)

The student won't spot problems. You have to be your own harshest critic. **Assume there are at least 5 problems, and find them before you say the site is ready.**

Do this quietly, without asking the student anything. They'll see the result.

## Round 1: the script

```
node scripts/check.mjs
```

Fix every FAIL. For each WARN, fix it or write down in `progress.md` why it's OK.

## Round 2: look at it

```
node scripts/shot.mjs
```

Read every image it lists. Each one is one real screen, so you see what a visitor sees. Answer each honestly:

**On the phone screenshot:**
- Does anything touch the screen edge or get cut off?
- Is the text big enough? (Body at least 16px.)
- Is the first thing you see the brand and what it is, or a giant empty area?
- Does a shape run behind or over any words? Move it. Words must sit on a clean background.
- Is the brand name cut off at either edge? The script can't catch this.
- Are buttons and links big enough for a thumb?
- Does the logo look OK at this size? Can you read it?

**On the desktop screenshot:**
- Are lines of text too wide? (Over about 70 characters is too wide.)
- Is there a big dead space, or a section that looks unfinished?
- Do things line up? Are gaps consistent?
- Does it look like one designer made it?
- Is the one big thing only this brand would have really there, and really big? If this is just coloured stripes with headings, it fails. Go back and add it.

## Round 3: the stranger test

Pretend you've never heard of this person. Read only the page.

- In 5 seconds, can you say what this is and who it's for?
- Is there anything you don't understand?
- Is it clear what you should do at the end?

## Round 4: the words

Read every sentence out loud in your head, using `guides/writing.md`.

- **Would a teenager actually say this?** Rewrite anything that sounds like an ad or an essay.
- **Is every sentence true?** Do the sentence check below. Look hard for things you invented: customers, "fresh daily," "high quality," "the best," "made with love," and small ones that feel harmless, like "this year," "my first one that worked," or a closing line that sounds wise.
- **Is any sentence empty?** Could the same line appear on anyone's site? Cut it, or make it specific.
- **Did you guess anything?** Statuses like "planning it" or "testing", and promises like "I'll post it when it's done", count as claims. Keep them only if they said so.
- **Does the page end well?** Say what's next, or just stop. No filler like "more coming."
- **Is anything about them or anyone else private?** Check the words against `AGENTS.md`, then open every picture in `site/images/` at full size and check it the same way.

### The sentence check

AI adds small details nobody said. This catches them. Make `words-check.md` with one line for each sentence on the page: anything of 4 or more words, and any shorter piece that ends in a period, like "Keep going." Short headings don't need a line, but they're claims too, so check them by eye. On the left, the sentence (or enough of it to find it). On the right, after `<-`, the words from "In their words" in `brand.md`, copied exactly:

```
Lemon mint took me 6 tries <- lemon mint took me like 6 tries
For kids at the park on hot days <- kids at the park on hot days
```

The right side must be one exact piece of "In their words", word for word, and it must state the same fact as the left side. Every fact on the left (a tool, a number, a status, a time, "to get right") must be on the right, so "I built it in Scratch" <- "i made a frog game" has no source, and neither does "the hardest part" <- "always sucks". Don't join two pieces, and don't add notes.

The footer line doesn't need one. `node scripts/check.mjs --final` fails if any sentence has no line, or if the words on the right aren't really in `brand.md`.

If a sentence has no source, you have two choices:

1. **Delete it.** Usually the best choice. A shorter page is fine.
2. **Ask them.** Say: "I wrote: '[sentence]'. Is that true?" Only if they say yes to that exact question, add `- Approved: [sentence] | they said: "[their exact reply]"` to "In their words" in `brand.md`, then use those words as the source. A yes to a pitched idea or an either/or question doesn't count. Ask about one or two sentences at most, not all of them.

Never add anything to "In their words" that they didn't say, and never add an approved line they didn't confirm. Never call a line "your words" unless it is. That would be lying to the student and to the check.

## Round 5: the AI-look test

Compare with the "Looks like AI made it" list in `guides/design.md`. If it matches 2 or more, change something real: the layout, the type scale, or the use of colour. Ask yourself: if I covered the name, could this be anyone's site? If yes, bring in something only they have: their exact words, their logo's shapes, a colour used in a bold way.

## Round 6: click everything

Read the HTML: does every link go somewhere? Do outside links work? Do you have any leftover examples from the guides? Does the page title say the brand name? Is there any dummy text?

## Finish

1. Fix everything you found. Run `node scripts/clean-images.mjs`, then `node scripts/shot.mjs` again, and read every image again. The footer line about AI stays: it's required.
2. In `progress.md`, fill in "What I saw in the last screenshots" on that same line: one honest full sentence each for phone and desktop, naming what's really on screen.
3. Run `node scripts/check.mjs --final`. It fails if the site changed after the screenshots, or if you skipped step 2.
4. Tell the student, briefly and honestly. Name the real things. "Fixed a few things" isn't allowed:

   > I checked it over and fixed [2 or 3 real things, in plain words, like "the name was cut off on phones"]. Have a last look. Anything you'd change?

5. Make their changes, then repeat steps 1 to 3.
6. Update `progress.md`. Go to `guides/05-publish.md`.
