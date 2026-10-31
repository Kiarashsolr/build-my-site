# Step 1: Get to know their brand (10 minutes)

**Goal:** fill in `brand.md` (copy it from `templates/brand.md`) with real material, in their own words, without it feeling like a form.

## 1. Get their homework first

Ask for their stuff before you ask any questions:

> Did you bring your homework, like your style guide, your logo, your pictures and the websites you liked? It's fine if you didn't.

If yes, open the folder for them (`node scripts/open.mjs my-stuff`) and say:

> I opened a folder called my-stuff. Drag your files in (just the ones for your brand), then tell me when you're done.

They may have: a style guide (PowerPoint or PDF), logo images, 3 pictures, screenshots of websites, a list of words, a typed answer about themselves. Files on WhatsApp or Google Drive: ask them to download and drag them in. If it's hard, they can paste text into this chat.

**Read everything in `my-stuff/`.** Look at every image. For a `.pptx`, run `node scripts/read-pptx.mjs "my-stuff/<file name>.pptx"`. It prints the text, colours and fonts, and saves the pictures, including any logo. Look at those too. If it can't read the file, ask them for a screenshot. Write what you found into `brand.md` before you ask anything.

**Then ask for their websites:**

> Which websites did you like? Please paste the addresses here, and tell me what you liked about each one.

Run `node scripts/look.mjs <address>` for each one, up to 5. It opens the site, saves its real code in `my-stuff/websites/`, and tells you its fonts, colours and effects. If the address is a page on One Page Love, Awwwards or SiteInspire, that's only a gallery, so also look at the real site it shows. Search the code for the thing they liked, so you know how it's done. Write in `brand.md` what you found and what they liked, and use it in Step 2. Then tell them one specific thing you found: "The big letters on that second site use one huge font size, and I can do the same thing with your name."

**Teach them Inspect, once.** This is how anyone can see how a website is built, and it also works when a site blocks the script. If you are past minute 10, skip it unless the script was blocked. Ask them which part of a site they like the most, then guide them one step per message:

1. First make the file: `node -e "require('fs').mkdirSync('my-stuff/websites',{recursive:true});require('fs').writeFileSync('my-stuff/websites/from-inspect.txt','')"`, then run `node scripts/open.mjs my-stuff/websites/from-inspect.txt`. Say: "I opened a blank file for you. Leave it open, and go back to the website."
2. "Right-click the part you like, and click **Inspect**. A panel will open with the code of that part, and one line will be highlighted."
3. "Right-click the highlighted line, then click **Copy**, then **Copy element**."
4. "Click in the blank file, press Ctrl+V to paste, and press Ctrl+S to save. Tell me when you have done that."

Read `my-stuff/websites/from-inspect.txt` and tell them what it shows in one or two plain sentences: "This part is a big box with a slow fade, and that is why it feels smooth." If you also need the styling, ask them to look at the **Styles** part of the same panel, select the rules there, and paste those too. They can see a whole page's code with Ctrl+U.

Nothing brought? No problem, and no comment on it. Everything below works from zero, and you make the logo decision later.

## 2. Ask only what's missing

One question per message, in this order. **Skip anything you already know.** Stop as soon as you have enough, and don't go past 10 minutes.

| Fill in | Ask something like | If they're stuck, or say "idk" |
|---|---|---|
| Brand | "Is this site about you, or about something you make or want to make?" | Offer: your first name, a channel, music, a game, a small business. |
| What it is | "In a few words, what is it?" | Offer two guesses from what you've seen. |
| Real yet? | "Is it real already, or still an idea?" | Offer: "I've made it", "I've tried it a bit", "just an idea". |
| Who it's for | "Who's it for? Pick one kind of person." Ask this even if their style guide has an answer, when that answer is "everyone". | **"Everyone" is not allowed.** Offer 3 specific ones. For drinks: "kids at the park on hot days," "parents buying for a party," "people who want something healthier." |
| Feeling | "When someone sees it, what 3 words should they feel?" | Offer 6 words, they pick 3. |
| Colours | "Do you have colours picked?" | Get codes from their style guide. None? You'll propose them in Step 2. |
| Fonts | "Picked any fonts?" | None? You'll propose them in Step 2. |
| Goal | "When someone's on your site, what should they do or think at the end?" | Offer: know your idea, see what you've made, remember your name. |
| Things to show | "What's something you've made or done that could go on the site?" | Anything counts: a drawing, a song, a video, a logo, a plan, a screenshot of a game level, a list of flavours. Fewer than three is fine. For each thing, note whether it's made, being tried, or an idea, in their words. See "Nothing to show?" below. |

If the brand sounds like a person's full name, ask once: "Is that your real name?" If yes, use only the first name or another brand name, and write that in `brand.md`. Don't write the last name anywhere. Don't make up a brand name for them, like "Sam Draws": offer it as a question, and use it only if they say yes.

## 3. Get their real voice: the most important part

The site must sound like them, so you need their words. Ask **two or three** of these, one at a time. Take whatever you get, however short.

- "Why this? What made you want to do it?"
- "What's the best part of it, for you?"
- "Tell me something about it that most people wouldn't know."
- "If a friend asked 'what's your thing?', what would you say?"
- "What's something you're bad at or still figuring out with it?"

If they have a thing, get its real name once: "What's the first song called?" Real names beat "Song 1". If a one-word answer comes back, ask one easy follow-up ("Why that one?"), then move on. Don't push a quiet student. If typing is hard, they can use voice-to-text, or just pick from your options.

**Copy every answer they give, one line each, exactly into the "In their words" part of `brand.md`,** typos and all, leaving out only private details and anything worrying (see `AGENTS.md`). These are your raw material in Step 3, and the only source the sentence check accepts. Never rewrite this section. An "idk" means unknown: never record a guess as their answer. A line goes here only if they said it in this chat, or it's in a file they brought. If you skipped a question, ask it or leave it out. Your own notes go in the other sections.

**Nothing to show?** Don't leave them with an empty site. Help them make one small real thing right now, in two minutes. Pick the easiest:

- **A top 3.** "What are your top 3 [cars, songs, flavours, games]? One line on why for each." This is the best one. It's quick, and it shows who they are.
- **A photo of something they've made,** taken now with the laptop or a phone. No faces. If it comes as a `.heic` file, ask them to send or save it as JPG.
- **A plan with three steps:** "What are the next 3 things you'd do?" Label it as a plan.

A top 3 or a plan gives the layout real material, and it's all true. Label it as what it is. If they said "cars I want to draw", write that, not "planning it" or "first on my list" unless they said so. Fewer than three is fine; never write "still deciding" to fill a slot.

## 4. Check what they brought

Tell them in one sentence each, and suggest a fix. They decide. Check for:

- **"Everyone" as the audience:** already handled above.
- **Colours they can't read:** calculate it if you can; if text and background are similar brightness, it fails. Example: "Your mint on white would be hard to read, so I'd use it for shapes and use dark green for text." Keep their colour big on the page, as a block with dark text on it, so it's still their brand.
- **Same font twice:** fine if it's on purpose, and sometimes better.
- **An AI logo:** look at it closely. Common problems: spelling mistakes in the letters (a missing apostrophe, garbled words), too much detail to see when small, or a fake-looking tagline, or a real name or place in it (that one stays off the site until it's fixed, like a false claim). If there's a problem, say it plainly: "Your logo's missing an apostrophe. Want to keep it, or fix it?" A spelling problem is their call. A false claim ("since 1998" on a new idea) is not: that logo stays off the site until it's fixed. To fix a logo, offer to write them a better prompt for the AI tool they used. Include the exact spelling, and ask for flat colours and no tagline.
- **No logo:** that's fine. Tell them that the name in a strong font is a real kind of logo, called a wordmark, and that they can use it today. Then offer to write them a prompt for an AI logo tool: "Would you like me to write what to type into Gemini or another AI tool, so you can try making one now?" Include the six things from class: the name, what it is, who it's for, their 3 words, their colour codes, and the kind of logo. If they make one, they drag it into `my-stuff/`, and you check it like any other logo. If it takes more than about 5 minutes, use the wordmark and move on.
- **Pictures from Google:** these may belong to someone else. Say: "These are good for ideas, but they might belong to other people, so on the site we'll use yours or make our own shapes and colours instead." Never put a picture they found online on the site.
- **Where each picture came from:** for each logo or picture you might use, ask once: "Did you make this, did an AI tool make it for you, or did you find it?" Treat the 3 pictures from the homework as found unless they say otherwise. Found means ideas only, never on the site. No exceptions for "free" pictures. An AI logo showing a real brand or a known character counts as found too.

## 5. Finish

Save `brand.md`. Update `progress.md`. Then say what you've got in one line, and go to `guides/02-three-looks.md`.
