# How to design it

Without guidance, AI makes every website look the same. Your job is to make one that could only belong to this student's brand, built from what they gave you.

## Start from their brand, not from a template

Before designing, write one line to yourself: *what's one thing that's only theirs?* A logo shape. A colour. A phrase. A thing they make. Build the page around that.

## Looks like AI made it (avoid)

If your page has two or more of these, change it:

- A purple or blue gradient on white, or purple-to-pink anything
- Inter, Roboto or Arial as the only font, unless they chose it
- A centered hero: big headline, grey sub-line, two buttons, nothing else
- Three equal cards in a row, each with an icon and a short title
- Every box with the same rounded corners and soft shadow
- Emoji as section icons
- Rainbow or "glass" effects, floating blobs, glowing borders
- A row of stats: "100+ customers, 5 stars"
- Fake testimonials
- Every section the same height, one after another, centered
- Coloured bars on the left edge of rounded cards
- Light grey text on white

## Layouts to choose from

Each one has a ready file in `templates/layouts/` that you copy and change. Choose by what fits, and don't always use the first one.

1. **Giant name** (`giant-name.html`). The brand name fills the screen width in the display font. Everything else is small under it. For loud brands with a strong font.
2. **Colour blocks** (`colour-blocks.html`). A wall of uneven blocks in the brand colours, each with one idea. Big type on solid colour. Fun and bold, and needs no photos. Never stack same-size stripes instead.
3. **The poster** (`poster.html`). The first screen looks like a poster: logo huge and off-centre, one line of text, an angle or big shape. For brands with a strong logo.
4. **The notebook** (`notebook.html`). Left-aligned, one narrow column of writing, like a personal page. Lots of white space and the student's voice up front. For a quiet person, or someone with good words and few images.
5. **The shop window** (`shop-window.html`). Their things are huge, one at a time, with a short line each. For someone with real work to show: drawings, products, cover art.
6. **The tracklist** (`tracklist.html`). Things in a numbered list, like an album's song list. Hover or tap for detail. For music, or anything made in a series.
7. **The menu** (`menu.html`). Laid out like a café menu or price board, with big categories and a list under each. For food, drinks, services. Don't show prices unless they're real.
8. **The logbook** (`logbook.html`). A list of what they've done and what's next, newest first, labelled First, Then, Now and Next. Never make up dates. For a project still in progress, or when there's little to show but a story.

**Which three to make?** Quick guide:

| The brand | Good three |
|---|---|
| Food, drinks, a service | Menu, Giant name, Logbook |
| Music, or a series of anything | Tracklist, Giant name, Notebook |
| Drawings, products, cover art | Shop window, Notebook, Giant name |
| A project or idea, little to show | Logbook, Notebook, Giant name |
| A strong logo | Poster, Shop window, Menu or Tracklist |
| Fun and loud, nothing real to show yet | Colour blocks, Giant name, Notebook |
| Don't know | Giant name, Notebook, Logbook |

These are starting points. Take a template apart if the brand wants something else.

## Colour

- Use `--bg`, `--text`, `--main`, `--accent`, `--on-accent` in `:root`. `--on-accent` is the colour of text on top of the accent. Add other named variables if you need them, such as `--on-main` or `--third`.
- **Rough split:** background 60%, main 30%, accent 10%. Use the accent only for what you want noticed.
- Don't be timid. A whole section in the main colour looks more designed than white with small colour touches.
- **No colours yet?** Never keep a template's colours. Look at the thing itself. What colours does it really have? Old cars: a paint colour, tyre black, chrome grey. Rap in a bedroom: whatever they said they like, or a marker colour on black. Bakery: crust brown and icing pink. Choose from there, and say why in one line.
- **Their colours must stay recognizable, but readable wins.** If their mint can't hold text, keep it for shapes and backgrounds, and darken it for text. Tell them. `scripts/check.mjs` will fail below these contrast levels: text on background 4.5, main on background 3, text on accent 4.5, text on main 4.5. If you set `--on-main`, the main colour counts as a block colour and can be as bright as they like, so don't also use it for small text on the background: use `--text` or a darker shade for that.
- A light brand colour often means text should be near-black with a hint of that colour, not pure black.

## The big thing

Every page needs one thing that belongs to this brand and nobody else, shown big. Copy a shape from `templates/shapes.html`, draw your own with CSS, or use their logo or real work. A plain circle or blob means nothing, so don't use one. Decide it before the layout: *for this brand, what would a person recognize from across the room?*

## Fonts

If they picked fonts, use them. If not, choose by how the brand should feel:

| Feeling | Title font | Text font |
|---|---|---|
| Loud, sporty | Anton | Work Sans |
| Friendly, fun | Fredoka | Nunito |
| Bold, poster | Archivo Black | Archivo |
| Fancy, tasty | Abril Fatface | Lato |
| Classy, calm | DM Serif Display | DM Sans |
| Personal, handmade | Caveat | Karla |
| Techy, music | Bebas Neue | IBM Plex Mono |
| Gamer, retro | Rubik Mono One | Rubik |

- **Two at most,** one for titles and one for text. Using one font with different weights is fine, and often better.
- Load them from Google Fonts:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  ```
  Check the font name is spelled exactly as Google Fonts spells it. Always give a fallback: `font-family: "Bungee", Impact, sans-serif;`
- **Size contrast does most of the design work.** Titles can be huge, using `clamp()` so they shrink on phones: `font-size: clamp(3rem, 12vw, 9rem);` Body text at least 16px; 18px is friendlier.
- Line length under about 70 characters: `max-width: 65ch`. Headings: `text-wrap: balance`.

## Layout and detail

- **Start with the phone.** Most people will open the link on a phone. No side-by-side on small screens unless it fits.
- **Never set a height in plain `vh`.** Use `min(90vh, 640px)`, or you get a huge empty area on tall screens.
- **Long names:** giant type must fit. Test the longest word on the phone screenshot, and lower the size until nothing is cut off.
- Use flexbox or grid with `gap`, and `flex-wrap`, `minmax()` so things wrap instead of overflowing.
- Images: `max-width: 100%; height: auto;`.
- Consistent spacing: choose 3 or 4 sizes and stick to them.
- Not everything needs a box. Use a border, background, or shadow only when it means something.
- Don't make everything centered. Left-aligned text usually looks more designed and reads better.
- Links must look like links. Buttons need to be at least 44px tall.
- Show visible focus states. Wrap motion in `@media (prefers-reduced-motion: no-preference)`.

## Using an AI-made logo

AI logos are often detailed, with a background box and small text.
- A logo with a false claim stays off the site until it's fixed. See `AGENTS.md`.
- No usable logo? Use the name in the title font as the logo, with one small CSS shape beside it if that helps.
- Show it big enough to read, once. Don't shrink it into a tiny header.
- For the small header spot, use the brand name in the title font instead.
- Pull the page's colours from the logo so the two match.
- If it's on a white or photo background, put it on a matching panel. Don't use it on a clashing colour.

## Using websites they liked

If `my-stuff/` has screenshots, look at them. Name what you're borrowing: the big type, the layout, the way images overlap. Take one idea. Never copy a site's text, images, or logo.
