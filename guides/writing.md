# How to write the words

The site has to sound like this one teenager. AI text is usually easy to spot: polished, vague, and true of anybody. A slightly rough sentence they'd really say beats a smooth one they wouldn't.

## The method

1. **Start from their words.** Open "In their words" in `brand.md`. Use their phrases, their word choices, how long their sentences are.
2. **Write short.** Most sentences under 12 words. Use plain words a 14-year-old uses.
3. **Be specific.** Every sentence needs a detail that wouldn't fit anyone else. If you don't have the detail, ask them for it or delete the sentence.
4. **First person.** "I make..." not "Sam offers..." or "We provide...". Use "we" only if there's truly a team.
5. **Only true things.** If it didn't come from `brand.md`, don't write it.
6. **Show them.** Ask, "Does that sound like you?" Their version wins.

## The test for every sentence

- Would they say this out loud to a friend?
- Could this sentence go on a stranger's site? If yes, cut it.
- Is it true, and did they tell you so?

## Before and after

These are from made-up students.

**Hero line**
- ❌ "Crafting refreshing flavour experiences that elevate your everyday."
- ✅ "I'm trying to make the perfect lemon-mint drink. I'm on version 6."

**About**
- ❌ "Passionate about music from an early age, Sam is an emerging artist dedicated to creating authentic sounds that resonate with listeners."
- ✅ "I started making beats on my phone because my brother wouldn't let me touch his keyboard. Now I have 11 songs. Two are good."

**A business that's only an idea**
- ❌ "We deliver premium bike repair services to satisfied customers across the community."
- ✅ "I fix bikes. So far: mine and my cousin's. I want to fix 10 more by summer."

**When they gave you almost nothing.** They said only: "i like drawing cars."
- ❌ "A lifelong love of automotive design drives my artistic vision."
- ✅ "I draw cars." Then ask one easy question ("What kind?"). Only if they say old ones can you write "Mostly old ones."

**A closing line**
- ❌ "Join me on this journey and let's create something amazing together!"
- ✅ "Next up: a drawing of my dad's truck." (only because they said so)

**Short and plain words are the goal.** The "I draw cars" version is better than a paragraph, because it's true and sounds like a real person. Short words don't mean a dull page: the design carries the rest. See `guides/design.md`.

## Things AI does that you must not do

- **"It's not just X, it's Y."** Also "more than just," "not only... but also." Just say the positive thing.
- **Lists of three, over and over.** "Fresh, bold, and delicious." One is fine; more than that reads like a machine. Often one adjective is better.
- **Puffed-up importance.** "A testament to," "plays a vital role," "stands as." A teenager's lemonade doesn't stand as anything.
- **Vague big claims.** "High quality," "the best," "unique," "premium," "like no other."
- **Words nobody says.** Every phrase in `scripts/banned-words.txt`. Read that file. Delve, journey, passionate, crafted, elevate, seamless, vibrant, curated.
- **Em dashes.** Use a period or a comma.
- **Ending every section with an uplifting line.** Stop when you've said it.
- **Slogans made of two parallel fragments.** "Real flavour. Real people." "Real beats, real words." Don't write them. Use one if the student says it first.
- **Clever rhymes and puns,** unless they came up with it.
- **Exclamation marks everywhere.** Two at most on the page, unless they really talk like that.
- **Filler endings.** "Check back soon," "stay tuned," "more to come." Say what's next or stop.
- **Corporate headings.** "About Me," "My Mission," "Our Values," "Why Choose Us." Better: "Why drinks?", "What I've made so far," "What's next."

## Keeping them sounding real

- Keep a bit of roughness. Don't turn "it's kind of hard to get the sugar right" into "balancing sweetness presents a challenge."
- Fix spelling mistakes on the page, because visitors will read them as careless. Keep everything else.
- Humour is great if it's theirs. Don't add jokes they didn't make.
- If they copy a sentence from somewhere, or the words seem far above how they talk, ask once with curiosity: "Is this how you'd say it to a friend?"

## When a student's own sentence breaks a rule

Their sentence wins over the style rules, with two exceptions: anything false, and anything private. `scripts/check.mjs` also blocks the banned phrases. If their own words trigger it, tell them: "That word makes sites sound AI-written. Want to say it another way?" Offer an option. If it's really how they talk and they insist, call the teacher to decide. If the teacher says keep it, delete that one line from `scripts/banned-words.txt` in this folder and write what you removed in `progress.md`. Only the teacher can decide this. If a PRIVACY line fires on a thing and not on the student ("40 year old truck", "I'm 3 songs in"), reword it: "40-year-old truck", "3 songs in".
