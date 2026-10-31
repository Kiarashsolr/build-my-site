#!/usr/bin/env node
// Takes real screen-sized pictures of a page, phone and desktop, top to bottom, so the agent can LOOK at it. No dependencies.
//   node scripts/shot.mjs                   screenshots site/index.html
//   node scripts/shot.mjs mockups/a.html    screenshots any page in this folder
//   node scripts/shot.mjs mockups/a.html --top   only the first screen of each size
// Writes .shots/<name>-phone-1.png, -2.png... and .shots/<name>-desktop-1.png..., one per screenful, and reports sideways scrolling.
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { tmpdir, platform } from "node:os";
import { startServer } from "./serve.mjs";

const CANDIDATES = {
  win32: [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    join(process.env.LOCALAPPDATA || "", "Google/Chrome/Application/chrome.exe"),
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  ],
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ],
  linux: ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge"],
};
const browser = (CANDIDATES[platform()] || CANDIDATES.linux).find((p) => existsSync(p));
if (!browser) {
  console.error("NO BROWSER FOUND: install Google Chrome, then run this again.");
  process.exit(2);
}

const args = process.argv.slice(2);
const topOnly = args.includes("--top");
const given = args.find((a) => !a.startsWith("--")) || "site/index.html";
const target = relative(process.cwd(), resolve(given)).replace(/\\/g, "/");
if (target.startsWith("..") || !existsSync(target)) {
  console.error(`NOT FOUND: ${target}`);
  process.exit(2);
}
const name = (basename(target).replace(/\.html?$/i, "") === "index" ? target.split("/").slice(-2, -1)[0] || "page" : basename(target).replace(/\.html?$/i, "")) + (topOnly ? "-top" : "");
const port = 4400 + Math.floor(Math.random() * 400);
const server = await startServer(".", port, { overlay: false });
mkdirSync(".shots", { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "shot-"));

function run(args) {
  return new Promise((ok) => {
    execFile(browser, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
      "--force-device-scale-factor=1", `--user-data-dir=${profile}`, ...args,
    ], { encoding: "utf8", timeout: 60000, maxBuffer: 20 * 1024 * 1024 }, (_e, stdout) => ok(stdout));
  });
}

// [label, width, height of one screen, most screens to capture]
const sizes = [["phone", 390, 844, 6], ["desktop", 1440, 900, 4]];
const OVERLAP = 60;
let failed = false;
const images = [];
const measures = {};
// How much of the first screen the biggest shape or picture must fill.
const NEED_BIG = { phone: 0.12, desktop: 0.08 };
for (const [label, w, h, cap] of sizes) {
  const frame = (y) => `http://127.0.0.1:${port}/__frame?w=${w}&h=${h}&y=${y}&p=${encodeURIComponent("/" + target)}`;
  const dom = await run(["--virtual-time-budget=4000", `--window-size=${w},${h}`, "--dump-dom", frame(0)]);
  const m = /scrollWidth=(\d+) scrollHeight=(\d+)/.exec(dom || "");
  const sw = m ? Number(m[1]) : null;
  const sh = m ? Number(m[2]) : h;
  const step = h - OVERLAP;
  const need = Math.max(1, Math.ceil((sh - OVERLAP) / step));
  const count = topOnly ? 1 : Math.min(cap, need);
  const extra = /big=([\d.]+) low=([^<\s]+) over=([^<\s]+)/.exec(dom || "");
  // The starter is only used to test that screenshots work, so it isn't judged as a design.
  if (extra && !target.startsWith("templates/")) {
    const big = Number(extra[1]);
    const low = JSON.parse(decodeURIComponent(extra[2]));
    const over = JSON.parse(decodeURIComponent(extra[3]));
    measures[label] = { big, over, low };
    for (const t of low) { failed = true; console.log(`FAIL ${label}: this text is hard to read: ${t}. Small text needs 4.5:1, big text 3:1. Pick a darker or lighter colour`); }
    if (big < NEED_BIG[label]) { failed = true; console.log(`FAIL ${label}: the big thing fills only ${Math.round(big * 100)}% of the first screen. Make it fill at least ${Math.round(NEED_BIG[label] * 100)}%: set --size, make it solid, and put it high on the page`); }
    for (const t of over) { failed = true; console.log(`FAIL ${label}: a shape runs over these words: "${t}". Move it so the words sit on a clean background`); }
  }
  for (const f of readdirSync(".shots")) if (f.startsWith(`${name}-${label}-`)) rmSync(join(".shots", f));
  for (let i = 0; i < count; i++) {
    const out = resolve(".shots", `${name}-${label}-${i + 1}.png`);
    await run(["--virtual-time-budget=4000", `--window-size=${w},${h}`, `--screenshot=${out}`, frame(i * step)]);
    if (existsSync(out)) images.push(`.shots/${name}-${label}-${i + 1}.png`);
    else { failed = true; console.log(`FAIL ${label}: no picture was made for screen ${i + 1}`); }
  }
  const over = sw !== null && sw > w;
  if (over || !m) failed = true;
  console.log(`${over || !m ? "FAIL" : "ok  "} ${label}: ${count} screen(s) of a page ${sw ?? "?"}px wide and ${sh}px tall, on a ${w}x${h} screen${over ? "  SIDEWAYS SCROLL: something is too wide" : ""}`);
  if (!topOnly && need > cap) console.log(`     note: only the first ${cap} screens were captured. This page is very long; is all of it needed?`);
}
server.close();
server.closeAllConnections?.();
try { rmSync(profile, { recursive: true, force: true, maxRetries: 3 }); } catch {}
const blanks = readFileSync(target, "utf8").replace(/<!--[\s\S]*?-->/g, "").match(/\[\[.*?\]\]/g);
if (blanks) { failed = true; console.log(`FAIL unfilled blanks are still in this page: ${blanks.slice(0, 3).join(" ")}`); }
writeFileSync(join(".shots", `${name}-measure.json`), JSON.stringify(measures));
console.log("\nRead every one of these images with your file-reading tool:");
for (const i of images) console.log("  " + i);
console.log("Each one is exactly what a person sees on one screen. Running this script is not the same as looking.");
process.exit(failed ? 1 : 0);
