#!/usr/bin/env node
// The gate. The agent may not say the site is done until this passes. No dependencies.
//   node scripts/check.mjs            checks ./site
//   node scripts/check.mjs some/dir   checks another folder
//   node scripts/check.mjs --final    also requires fresh screenshots and a written note of what you saw in them
// Exit code 0 = no FAIL lines. WARN lines must be looked at, and the student told about them.
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, dirname, extname, resolve, relative, isAbsolute, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { cleanImage } from "./clean-images.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const final = args.includes("--final");
const dir = resolve(args.find((a) => !a.startsWith("--")) || "site");
const results = [];
const fail = (m) => results.push(["FAIL", m]);
const warn = (m) => results.push(["WARN", m]);
const ok = (m) => results.push(["ok  ", m]);

if (!existsSync(join(dir, "index.html"))) {
  console.error(`FAIL  ${dir} has no index.html`);
  process.exit(1);
}

function walk(d) {
  return readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith(".")) return [];
    const p = join(d, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const files = walk(dir);
const htmlFiles = files.filter((f) => /\.html?$/i.test(f));
const cssFiles = files.filter((f) => /\.css$/i.test(f));
const css = cssFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const allHtml = htmlFiles.map((f) => [f, readFileSync(f, "utf8")]);
const inlineCss = allHtml.map(([, h]) => [...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n")).join("\n");
const fullCss = css + "\n" + inlineCss;

const visible = (h) =>
  h.replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#0*39;|&#x0*27;|&rsquo;|&apos;|&#0*8217;|&#x0*2019;|[’ʼ]/gi, "'").replace(/&mdash;|&#0*8212;|&#x0*2014;/gi, "—").replace(/\s+/g, " ").trim();
const words = allHtml.map(([, h]) => visible(h)).join(" \n ");
const attrs = allHtml.map(([, h]) => [...h.matchAll(/(?:alt|title|content|aria-label)="([^"]*)"/gi)].map((m) => m[1]).join(" ")).join(" ");
const copy = (words + " " + attrs).replace(/&#0*39;|&#x0*27;|&rsquo;|&apos;|&#0*8217;|&#x0*2019;|[‘’ʼ]/gi, "'");
const progressTxt = existsSync("progress.md") ? readFileSync("progress.md", "utf8") : "";
const allSource = allHtml.map(([, h]) => h).join("\n") + fullCss;

// Exact match, capitals included: Windows forgives a wrong capital, the web host doesn't.
const existsExact = (base, rel) => {
  let cur = base;
  for (const part of rel.split(sep).filter(Boolean)) {
    if (!existsSync(cur) || !statSync(cur).isDirectory() || !readdirSync(cur).includes(part)) return false;
    cur = join(cur, part);
  }
  return true;
};
const checkLocal = (n, u, base) => {
  let clean = join(base, u.split(/[?#]/)[0]);
  try { clean = decodeURI(clean); } catch {}
  const rel = relative(dir, clean);
  if (rel.startsWith("..") || isAbsolute(rel)) fail(`${n}: ${u} is outside site/, so it won't go online. Copy it to site/images/ and link to that`);
  else if (!existsExact(dir, rel)) fail(`${n}: broken link or missing file (capitals must match exactly): ${u}`);
};

// ---------- page basics
for (const [f, h] of allHtml) {
  const n = f.slice(dir.length + 1);
  if (!/<html[^>]*\slang=/i.test(h)) fail(`${n}: <html> needs lang="en"`);
  if (!/<meta[^>]*name=["']viewport["']/i.test(h)) fail(`${n}: missing the viewport meta tag, so it will look tiny on phones`);
  const t = /<title>([^<]*)<\/title>/i.exec(h);
  if (!t || t[1].trim().length < 3) fail(`${n}: needs a real <title>`);
  else if (/^(portfolio|home|untitled|my website|document)$/i.test(t[1].trim())) fail(`${n}: <title> "${t[1].trim()}" is generic; use the brand name`);
  if (!/<meta[^>]*name=["']description["']/i.test(h)) warn(`${n}: no meta description`);
  const h1 = (h.match(/<h1[\s>]/gi) || []).length;
  if (h1 !== 1) fail(`${n}: has ${h1} <h1> tags; it needs exactly 1`);
  for (const m of h.matchAll(/<img\b[^>]*>/gi)) if (!/\salt="[^"]+/i.test(m[0]) && !/\salt=""/i.test(m[0])) fail(`${n}: image without alt text: ${m[0].slice(0, 80)}`);
  for (const m of h.matchAll(/\s(?:href|src)="([^"#]+)(?:#[^"]*)?"/gi)) {
    const u = m[1];
    if (/^(https?:|mailto:|data:|tel:)/i.test(u) || u.startsWith("//")) continue;
    checkLocal(n, u, u.startsWith("/") ? dir : dirname(f));
  }
  for (const m of h.matchAll(/\shref="#([^"]+)"/gi)) if (!h.includes(`id="${m[1]}"`) && !h.includes(`id='${m[1]}'`)) fail(`${n}: link to #${m[1]} goes nowhere`);
  if (/\shref="#"/i.test(h)) fail(`${n}: a link goes to "#" (nowhere)`);
  if (/\btel:/i.test(h)) fail(`${n}: a phone link. Phone numbers never go on this site`);
  if (/<script[^>]+src=["']https?:/i.test(h) && /(googletagmanager|google-analytics|gtag|facebook\.net|hotjar|clarity\.ms)/i.test(h)) fail(`${n}: has tracking or analytics. Remove it`);
  if (/<!--/.test(h)) fail(`${n}: has an HTML comment. Anyone can read those with View Source. Delete it`);
  if (/<form\b/i.test(h)) fail(`${n}: has a form. Strangers could write to a minor through it. Remove it`);
  if (/<iframe\b/i.test(h)) fail(`${n}: has an embed. Remove it`);
  if (/<script[^>]+src\s*=\s*["']?(?:https?:)?\/\//i.test(h)) fail(`${n}: loads a script from another site. Remove it`);
  for (const m of h.matchAll(/(?:href|src)\s*=\s*["']([^"']+)/gi)) if (/instagram|tiktok|snapchat|facebook|discord|youtube|youtu\.be|twitch|twitter|threads\.net|soundcloud|spotify|bandcamp|roblox|reddit|pinterest|linktr\.ee|wa\.me|\/\/t\.me|\/\/(?:www\.)?x\.com/i.test(m[1]) && !/Parent OK'd links on the site:[ \t]*yes/i.test(progressTxt)) fail(`PRIVACY: link to a personal account: ${m[1]}. Remove it, unless they say a parent OK'd it. Then write "Parent OK'd links on the site: yes" in progress.md`);
  for (const m of h.matchAll(/<a\b[^>]*href="https?:[^"]*"[^>]*>/gi)) warn(`${n}: outside link, open it and confirm it works: ${(/href="([^"]+)"/.exec(m[0]) || [])[1]}`);
}

for (const m of fullCss.matchAll(/url\(\s*['"]?(?!data:|https?:|\/\/|#)([^'")]+)['"]?\s*\)/gi)) checkLocal("CSS", m[1], dir);

// ---------- leftovers
for (const m of copy.matchAll(/\b(lorem ipsum|dolor sit|placeholder|your name here|your brand|coming soon|todo|tbd|xxx+|example\.com|lava jump|check back soon|stay tuned|more coming|more to come)\b/gi)) fail(`leftover template text: "${m[0]}"`);
if (/\[\[.*?\]\]|\[[A-Z][A-Z _-]{2,}\]|\{\{.*?\}\}/.test(copy)) fail("an unfilled [BLANK] or {{blank}} is still in the page");

// ---------- privacy (the students are minors)
const PII = [
  [/\b(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/, "looks like a phone number"],
  [/\b[A-CEGHJ-NPRSTVXY]\d[A-CEGHJ-NPRSTV-Z][ -]?\d[A-CEGHJ-NPRSTV-Z]\d\b/i, "looks like a Canadian postal code"],
  [/\b\d{1,5}\s+[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\s+(?:Street|St|Avenue|Ave|Rd|Dr|Boulevard|Blvd|Crescent|Cres|Ct|Ln)\b\.?|\b\d{1,5}\s+[A-Za-z]+(?:\s[A-Z][a-z]+)?\s+(?:street|avenue|ave|boulevard|blvd|crescent|cres|st|rd)\b\.?/, "looks like a street address"],
  [/\b(?:high school|secondary school|middle school|elementary school|collegiate|public school|catholic school)\b/i, "names a school"],
  [/\bgrade\s?(?:[1-9]|1[0-2]|nine|ten|eleven|twelve)\b|\b(?:[6-9]|1[0-2])th grade\b/i, "says what grade the student is in"],
  [/\b(?:i am|i'm|im)\s+(?:\d{1,2}|thirteen|fourteen|fifteen|sixteen|seventeen)\b(?!\s*(?:%|percent))/i, "says how old the student is"],
  [/\b(?:\d{1,2}|thirteen|fourteen|fifteen|sixteen|seventeen)[\s-]*(?:years?[\s-]*old|yrs?[\s-]*old|y\/?o)\b/i, "says how old someone is"],
  [/(?:^|\s)@[a-z0-9._]{3,}|\b(?:dm me|add me on|my (?:insta|snap|snapchat|tiktok|discord))\b/i, "points to a personal account"],
  [/\b(?:i live in|i'm from|i am from|we live in|located in|based in)\b/i, "says where the student lives"],
  [/\b(?:instagram\.com|tiktok\.com|snapchat\.com|facebook\.com|discord\.gg)\/\S+/i, "links a personal social account: only with a parent's OK"],
];
if (/\bschool\b/i.test(copy)) warn('the word "school" is on the page. Say "a fair" instead of "the school fair": don\'t show where they go');
if (/\b\d{1,5}\s+[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\s+(?:Road|Drive|Court|Lane|Way|Trail)\b/.test(copy)) warn("this might be a street address (a number, a name, then Road, Drive, Lane...). If it's a real place, take it out. If it's a title, leave it");
let piiHit = false;
for (const [re, why] of PII) {
  const m = re.exec(copy);
  if (m) { piiHit = true; fail(`PRIVACY: "${m[0]}" ${why}. Take it out`); }
}
const emails = [...copy.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g), ...allHtml.flatMap(([, h]) => [...h.matchAll(/mailto:([^"?]+)/gi)])].map((m) => m[1] || m[0]);
if (emails.length && !/Parent OK'd email on the site:[ \t]*yes/i.test(progressTxt)) fail(`PRIVACY: an email is on the page (${[...new Set(emails)].join(", ")}). Remove it, unless they say a parent OK'd it. Then write "Parent OK'd email on the site: yes" in progress.md`);
const place = /\b(?:toronto|mississauga|brampton|markham|vaughan|richmond hill|thornhill|oakville|burlington|hamilton|ottawa|north york|scarborough|etobicoke|aurora|newmarket|pickering|ajax|whitby|oshawa|milton|kitchener|waterloo|guelph|barrie|niagara|ontario)\b/i.exec(copy);
if (place) warn(`"${place[0]}" is a place name. If it's where they live or go to school, take it out. If it's something else (a brand, a song), write that in progress.md`);
const when = /\bevery (?:mon|tues|wednes|thurs|fri|satur|sun)day\b|\bon (?:mon|tues|wednes|thurs|fri|satur|sun)days\b|\bat \d{1,2}(?::\d\d)?\s*(?:am|pm)\b/i.exec(copy);
if (when) warn(`"${when[0]}" could show their schedule. Take it out if it says where they'll be`);
if (!/\bAI\b/.test(words)) fail("the page must say it was made with AI help. Put the footer line back");
if (!piiHit) ok("no phone number, address, school, grade or age found");

// ---------- words that make it sound like AI
const banned = readFileSync(join(here, "banned-words.txt"), "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
let wordHits = 0;
for (const b of banned) {
  const re = new RegExp(`(^|[^a-z])${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`, "i");
  if (re.test(copy)) { wordHits++; fail(`AI-sounding phrase: "${b}". Rewrite it the way the student would say it`); }
}
const dashes = (copy.match(/—/g) || []).length;
if (dashes) { wordHits++; fail(`${dashes} em dash(es) in the text. Use a period or a comma`); }
const notJust = words.match(/\b(?:not just|not only|isn't just|is not just|it's not about|more than just)\b/gi);
if (notJust) { wordHits++; fail(`"${notJust[0]}" pattern. Say the positive thing directly`); }
const threes = words.match(/\b\w+, \w+,? and \w+\b/g) || [];
if (threes.length > 2) warn(`${threes.length} lists of three ("${threes[0]}"). Too many reads as AI; cut some`);
const slogan = /\b([A-Za-z]+) ([a-z]+)[,.] \1 ([a-z]+)[.!?,]/i.exec(words);
if (slogan) warn(`"${slogan[0]}" is a two-part slogan, which reads as AI. Say one plain thing instead`);
const excl = (words.match(/!/g) || []).length;
if (excl > 2) warn(`${excl} exclamation marks. Keep 2 at most, unless the student's voice truly is that loud`);
const emoji = words.match(/\p{Extended_Pictographic}/gu) || [];
if (emoji.length > 3) warn(`${emoji.length} emoji in the text. Use them only if the brand truly talks that way`);
if (!wordHits) ok("no AI-sounding phrases found");
const wc = words.split(/\s+/).length;
if (wc < 40) warn(`only ${wc} words on the site. Is something missing?`);
else ok(`${wc} words of text`);

// ---------- colours
const cssVar = (name) => {
  const m = new RegExp(`--${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})`).exec(fullCss);
  return m ? m[1] : null;
};
const rgb = (hex) => {
  let h = hex.slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const lum = (c) => {
  const [r, g, b] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const onMain = cssVar("on-main");
const need = { bg: "page background", text: "body text", main: "main colour", accent: "accent colour", "on-accent": "text on top of the accent colour" };
const vars = Object.fromEntries(Object.keys(need).map((k) => [k, cssVar(k)]));
const missing = Object.keys(need).filter((k) => !vars[k]);
if (missing.length) fail(`CSS must define these hex colours in :root so they can be checked: ${missing.map((k) => "--" + k).join(", ")}`);
else {
  const grey = (hex) => { const c = rgb(hex); return Math.max(...c) - Math.min(...c) < 12; };
  if (grey(vars.main) && grey(vars.accent)) warn("the main and accent colours are both grey. Those are the template's colours: choose real ones, unless the student truly wants black and white");
  const pairs = [
    ["text", "bg", 4.5, "body text on the background"],
    ["main", "bg", 3, "main colour on the background (big text and shapes)"],
    ["on-accent", "accent", 4.5, "text on top of the accent colour"],
  ];
  for (const [a, b, min, what] of pairs) {
    // With --on-main set, the main colour is used as a block with text on top, so it can be bright.
    if (a === "main" && onMain) continue;
    const r = ratio(vars[a], vars[b]);
    const line = `${what}: ${vars[a]} on ${vars[b]} = ${r.toFixed(1)}:1 (needs ${min})`;
    if (r < min) fail(`HARD TO READ. ${line}. Pick the closest colour that passes and tell the student why`);
    else ok(line);
  }
  const dim = cssVar("dim"), third = cssVar("third");
  if (dim && ratio(dim, vars.bg) < 4.5) fail(`HARD TO READ. --dim ${dim} on ${vars.bg} = ${ratio(dim, vars.bg).toFixed(1)}:1 (needs 4.5)`);
  if (third && ratio(vars.text, third) < 4.5) fail(`HARD TO READ. text ${vars.text} on --third ${third} = ${ratio(vars.text, third).toFixed(1)}:1 (needs 4.5)`);
  if (onMain) {
    const r = ratio(onMain, vars.main);
    const line = `text on top of the main colour: ${onMain} on ${vars.main} = ${r.toFixed(1)}:1 (needs 4.5)`;
    if (r < 4.5) fail(`HARD TO READ. ${line}. Pick the closest colour that passes and tell the student why`);
    else ok(line);
  }
}

// ---------- fonts and design habits
const fams = new Set(
  [...fullCss.matchAll(/font-family\s*:\s*([^;}]+)/gi)]
    .map((m) => m[1].split(",")[0].trim().replace(/['"]/g, ""))
    .filter((f) => !/^(var\(|inherit|initial|unset|system-ui|sans-serif|serif|monospace)/i.test(f)),
);
if (fams.size > 2) fail(`${fams.size} fonts in use (${[...fams].join(", ")}). Two at most`);
const looksDefault = /\b(?:Inter|Roboto|Arial)\b/.test([...fams].join(" "));
if (looksDefault) warn(`font "${[...fams].join(", ")}" is the default look of AI-made sites. Use it only if the student chose it`);
if (/linear-gradient\([^)]*(?:#6366f1|#8b5cf6|#7c3aed|#667eea|#764ba2|#a855f7)/i.test(fullCss)) fail("the purple gradient: the most recognizable AI-site look. Remove it");
if (!/@media[^{]*(?:max|min)-width/i.test(fullCss) && !/\bclamp\(|\bminmax\(|\bflex-wrap\b/i.test(fullCss)) warn("nothing in the CSS adapts to phone width");

if (/(?:min-)?height\s*:\s*\d+[sdl]?vh/i.test(fullCss.replace(/(?:^|[}\s])(?:html|body)\s*\{[^}]*\}/gi, " "))) warn("a height in plain vh makes a huge empty area on tall screens. Use min(90vh, 640px) instead");

// ---------- file sizes
for (const f of files) {
  const base = f.split(/[\\/]/).pop();
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(base) && !allSource.includes(base)) fail(`${f.slice(dir.length + 1)} isn't used on the page, but it would still go public. Delete it from site/`);
  if (/\.(png|jpe?g|webp|svg)$/i.test(base)) { const b = readFileSync(f); let same = false; try { same = cleanImage(b, extname(base)).equals(b); } catch {} if (!same) fail(`PRIVACY: ${f.slice(dir.length + 1)} may hold hidden data (where a photo was taken, a name, a date). Run node scripts/clean-images.mjs`); }
  const kb = statSync(f).size / 1024;
  if (/\.(png|jpe?g|webp|gif)$/i.test(extname(f)) && kb > 1500) warn(`${f.slice(dir.length + 1)} is ${Math.round(kb)} KB. Shrink it: it will load slowly on a phone`);
}

// ---------- is every sentence backed by something the student said?
function checkSources() {
  const norm = (s) => s.toLowerCase().replace(/&#39;|&rsquo;|[\u2018\u2019'`]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  if (!existsSync("words-check.md")) return fail("words-check.md is missing. Make it: see guides/04-review.md");
  if (!existsSync("brand.md")) return fail("brand.md is missing");
  // Only what they really said counts: the "In their words" section, not the notes the agent wrote above it.
  const brandText = readFileSync("brand.md", "utf8");
  const section = (/^##\s*In their words[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/mi.exec(brandText) || [, ""])[1];
  const brand = norm(section);
  for (const l of section.split(/\r?\n/)) if (/approved\s*:/i.test(l) && !/they said:/i.test(l)) fail(`brand.md: "${l.trim().slice(0, 70)}" needs their reply: - Approved: [sentence] | they said: "[their exact reply]"`);
  const ledger = readFileSync("words-check.md", "utf8").split(/\r?\n/).filter((l) => l.includes("<-"));
  const rows = ledger.map((l) => { const [a, b] = l.split("<-"); return [norm(a), b.trim(), norm(b)]; });
  const bodies = allHtml.map(([, h]) => (/<body[\s\S]*<\/body>/i.exec(h) || [h])[0]).join(" ");
  const pieces = bodies.replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/gi, "<x>").split(/<[^>]+>/).map((t) => visible(t));
  const sentences = pieces.flatMap((t) => t.replace(/made with help from ai\.?( i made the choices\.?)?/gi, " ").split(/(?<=[.!?])\s+/)).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 4 || (s.split(/\s+/).length >= 2 && /[.!?]$/.test(s)));
  let bad = 0;
  for (const s of sentences) {
    const n = norm(s);
    // A piece may be part of a longer line ("I build <mark>tiny games</mark> here"). Short left sides can't vouch for anything.
    if (!rows.some(([a]) => a === n || (a.split(" ").length >= 3 && (n.includes(a) || a.includes(n))))) { bad++; fail(`no source for: "${s.slice(0, 90)}". Add it to words-check.md, or delete it`); }
  }
  for (const [a, raw, b] of rows) {
    if (!a) continue;
    if (!b || !brand.includes(b)) { bad++; fail(`words-check.md: "${raw.slice(0, 70)}" isn't in "In their words" in brand.md. Use their exact words, or show them the sentence and ask if it's true`); }
  }
  if (!bad) ok(`all ${sentences.length} sentences trace back to what the student said`);
}

// ---------- did the agent really look?
if (final) {
  checkSources();
  const shots = existsSync(".shots") ? readdirSync(".shots").filter((f) => /^site-(phone|desktop)-\d+\.png$/.test(f)) : [];
  const newest = Math.max(...files.map((f) => statSync(f).mtimeMs));
  if (!shots.some((f) => f.includes("phone")) || !shots.some((f) => f.includes("desktop"))) fail("no screenshots of the site. Run node scripts/shot.mjs and read every image");
  else if (Math.min(...shots.map((f) => statSync(join(".shots", f)).mtimeMs)) < newest) fail("the site changed after the last screenshots. Run node scripts/shot.mjs again and read every image");
  else ok("screenshots are newer than the site");
  const progress = existsSync("progress.md") ? readFileSync("progress.md", "utf8") : "";
  const saw = /What I saw in the last screenshots:[ \t]*(.*)/i.exec(progress);
  if (!saw || saw[1].trim().length < 40) fail('progress.md: fill in "What I saw in the last screenshots", on that same line, with what is really on screen, phone and desktop');
  else if (shots.length && statSync("progress.md").mtimeMs < Math.max(...shots.map((f) => statSync(join(".shots", f)).mtimeMs))) fail('progress.md: you took new screenshots after writing "What I saw". Read the new ones and write it again');
  else ok("progress.md says what the screenshots show");
  const mp = join(".shots", "site-measure.json");
  if (existsSync(mp)) {
    const ms = JSON.parse(readFileSync(mp, "utf8"));
    const needBig = { phone: 0.12, desktop: 0.08 };
    for (const [label, r] of Object.entries(ms)) {
      if (r.big < needBig[label]) fail(`${label}: the big thing fills only ${Math.round(r.big * 100)}% of the first screen (needs ${Math.round(needBig[label] * 100)}%)`);
      for (const t of r.over) fail(`${label}: a shape runs over these words: "${t}"`);
      for (const t of r.low || []) fail(`${label}: this text is hard to read: ${t}`);
    }
  }
}

// ---------- report
const order = { FAIL: 0, WARN: 1, "ok  ": 2 };
results.sort((a, b) => order[a[0]] - order[b[0]]);
for (const [k, m] of results) console.log(`${k}  ${m}`);
const fails = results.filter((r) => r[0] === "FAIL").length;
const warns = results.filter((r) => r[0] === "WARN").length;
console.log(`\n${fails} FAIL, ${warns} WARN. ${fails ? "NOT done: fix every FAIL and run this again." : (final ? "Passed the final check." : "Passed the script. You still have to look at the screenshots and do the review in guides/04-review.md.")}`);
process.exit(fails ? 1 : 0);
