#!/usr/bin/env node
// Reads a PowerPoint style guide: prints its text, colours and fonts, and saves its pictures. No dependencies.
//   node scripts/read-pptx.mjs "my-stuff/My Style Guide.pptx"
// Pictures land in my-stuff/from-pptx/. Look at each one with your file-reading tool.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { inflateRawSync } from "node:zlib";

const file = process.argv[2];
if (!file) { console.error('Say which file: node scripts/read-pptx.mjs "my-stuff/name.pptx"'); process.exit(2); }

// A .pptx is a zip. Find its table of contents, then pull out each file.
function unzip(buf) {
  let end = buf.length - 22;
  while (end >= 0 && buf.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error("This isn't a real .pptx file. Ask them for a screenshot of it instead.");
  const count = buf.readUInt16LE(end + 10);
  let p = buf.readUInt32LE(end + 16);
  const out = new Map();
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const body = buf.subarray(start, start + size);
    out.set(name, method === 8 ? inflateRawSync(body) : body);
    p += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

let zip;
try { zip = unzip(readFileSync(file)); }
catch (e) { console.error(e.code === "ENOENT" ? `NOT FOUND: ${file}` : e.message); process.exit(2); }

const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const slides = [...zip.keys()]
  .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
const colours = new Map();
const fonts = new Set();
slides.forEach((name, i) => {
  const xml = zip.get(name).toString("utf8");
  const paragraphs = [...xml.matchAll(/<a:p>([\s\S]*?)<\/a:p>/g)]
    .map((m) => [...m[1].matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((t) => decode(t[1])).join("").trim())
    .filter(Boolean);
  console.log(`\n--- Slide ${i + 1}`);
  console.log(paragraphs.join("\n") || "(no text)");
  for (const m of xml.matchAll(/<a:srgbClr val="([0-9a-fA-F]{6})"/g)) colours.set("#" + m[1].toUpperCase(), (colours.get("#" + m[1].toUpperCase()) || 0) + 1);
  for (const m of xml.matchAll(/<a:latin typeface="([^"]+)"/g)) if (!m[1].startsWith("+")) fonts.add(m[1]);
});

console.log("\n--- Colours used on the slides (a template's own colours may be here too, so compare with what the text says)");
console.log([...colours].sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} (${n}x)`).join(", ") || "none");
console.log("\n--- Fonts used on the slides (a template's own fonts may be here too, so use the ones the text names, or ask)");
console.log([...fonts].join(", ") || "none named");

const pictures = [...zip.keys()].filter((n) => /^ppt\/media\/.+\.(png|jpe?g|gif|webp)$/i.test(n));
if (pictures.length) {
  const dir = join("my-stuff", "from-pptx");
  mkdirSync(dir, { recursive: true });
  console.log(`\n--- Pictures saved to ${dir}/. Look at each one.`);
  for (const n of pictures) {
    writeFileSync(join(dir, basename(n)), zip.get(n));
    console.log(`  ${dir}/${basename(n)}`);
  }
} else console.log("\n--- No PNG, JPG, GIF or WebP pictures inside. If they say a logo is in this file, ask them for a screenshot of it.");
