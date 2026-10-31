#!/usr/bin/env node
// Removes hidden data (GPS, camera, owner name, comments) from every image in site/. Keeps how the picture looks.
//   node scripts/clean-images.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import { pathToFileURL } from "node:url";

function jpegOrientation(seg) {           // seg = APP1 body starting "Exif\0\0"
  if (seg.toString("latin1", 0, 6) !== "Exif\0\0") return 0;
  const t = seg.subarray(6), le = t.toString("latin1", 0, 2) === "II";
  const u16 = (o) => (le ? t.readUInt16LE(o) : t.readUInt16BE(o));
  const u32 = (o) => (le ? t.readUInt32LE(o) : t.readUInt32BE(o));
  const ifd = u32(4), n = u16(ifd);
  for (let i = 0; i < n; i++) if (u16(ifd + 2 + i * 12) === 0x0112) return u16(ifd + 2 + i * 12 + 8);
  return 0;
}
function cleanJpeg(b) {
  const out = [b.subarray(0, 2)];
  let p = 2, orient = 0;
  while (p < b.length) {
    const m = b[p + 1];
    if (m === 0xda) { const eoi = b.indexOf(Buffer.from([0xff, 0xd9]), p); out.push(b.subarray(p, eoi < 0 ? b.length : eoi + 2)); break; } // image data: keep it, drop anything after it (motion-photo video, second image)
    const len = b.readUInt16BE(p + 2), seg = b.subarray(p, p + 2 + len);
    if (m === 0xe1) { try { orient = jpegOrientation(seg.subarray(4)) || orient; } catch {} }
    const keep = !((m >= 0xe1 && m <= 0xef && m !== 0xe2 && m !== 0xee) || m === 0xfe); // keep colour profile (APP2), Adobe (APP14)
    if (keep) out.push(seg);
    p += 2 + len;
  }
  if (orient > 1) {  // phones store "sideways" here: keep only that one fact
    const e = Buffer.from("ffe100224578696600004d4d002a0000000800010112000300000001000000000000000000", "hex").subarray(0, 36);
    e.writeUInt16BE(orient, 28);
    out.splice(1, 0, e);
  }
  return Buffer.concat(out);
}
const PNG_KEEP = new Set(["IHDR","PLTE","IDAT","IEND","tRNS","gAMA","cHRM","sRGB","iCCP","pHYs","bKGD","sBIT","acTL","fcTL","fdAT"]);
function cleanPng(b) {
  const out = [b.subarray(0, 8)];
  for (let p = 8; p < b.length; ) {
    const len = b.readUInt32BE(p), type = b.toString("latin1", p + 4, p + 8), end = p + 12 + len;
    if (PNG_KEEP.has(type)) out.push(b.subarray(p, end));
    p = end;
  }
  return Buffer.concat(out);
}
function cleanWebp(b) {
  const out = [];
  for (let p = 12; p < b.length; ) {
    const type = b.toString("latin1", p, p + 4), len = b.readUInt32LE(p + 4), end = p + 8 + len + (len & 1);
    if (type !== "EXIF" && type !== "XMP ") {
      const c = Buffer.from(b.subarray(p, end));
      if (type === "VP8X") c[8] &= ~0x0c;                     // say there's no EXIF or XMP
      out.push(c);
    }
    p = end;
  }
  const body = Buffer.concat(out), head = Buffer.from(b.subarray(0, 12));
  head.writeUInt32LE(body.length + 4, 4);
  return Buffer.concat([head, body]);
}
function cleanSvg(b) {
  return Buffer.from(b.toString("utf8")
    .replace(/<!--[\s\S]*?-->/g, "").replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<(sodipodi|inkscape):[^>]*?\/>/gi, "").replace(/\s(?:sodipodi|inkscape):[\w-]+="[^"]*"/gi, ""));
}
export function cleanImage(buf, ext) {
  // Go by what the file really is: AI tools and downloads often save a PNG with a .jpg name.
  if (buf[0] === 0xff && buf[1] === 0xd8) return cleanJpeg(buf);
  if (buf.toString("latin1", 0, 4) === "\x89PNG") return cleanPng(buf);
  if (buf.toString("latin1", 0, 4) === "RIFF" && buf.toString("latin1", 8, 12) === "WEBP") return cleanWebp(buf);
  if (ext.toLowerCase() === ".svg") return cleanSvg(buf);
  return buf;
}
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  for (const f of walk("site")) {
    const ext = extname(f);
    if (!/\.(jpe?g|png|webp|svg)$/i.test(ext)) continue;
    const a = readFileSync(f), c = cleanImage(a, ext);
    if (!a.equals(c)) { writeFileSync(f, c); console.log(`cleaned ${f}`); }
  }
  console.log("Images are clean.");
}
