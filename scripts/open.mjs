#!/usr/bin/env node
// Opens a web address in the browser, or a folder in the file window. No dependencies.
//   node scripts/open.mjs http://localhost:4321/mockups/a.html
//   node scripts/open.mjs my-stuff
//   node scripts/open.mjs --private "<address>"   a private window, for a teacher's login
import { execFile, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { platform } from "node:os";

const argv = process.argv.slice(2);
const target = argv.find((a) => !a.startsWith("--"));
if (!target) { console.error("Say what to open: a web address or a folder."); process.exit(2); }
const isUrl = /^https?:\/\//i.test(target);
const what = isUrl ? target : resolve(target);
const os = platform();
if (argv.includes("--private") && os === "win32") {
  const dirs = ["C:/Program Files", "C:/Program Files (x86)", process.env.LOCALAPPDATA || ""];
  const find = (p) => dirs.map((d) => join(d, p)).find((f) => existsSync(f));
  const chrome = find("Google/Chrome/Application/chrome.exe");
  const edge = find("Microsoft/Edge/Application/msedge.exe");
  if (chrome || edge) { spawn(chrome || edge, [chrome ? "--incognito" : "--inprivate", what], { detached: true, stdio: "ignore" }).unref(); console.log("Opened a private window."); }
  else console.log("No Chrome or Edge found. Show the address in the chat, and the teacher will copy it into a private window.");
  process.exit(0);
}
const [cmd, args] =
  os === "win32" ? (isUrl ? ["rundll32", ["url.dll,FileProtocolHandler", what]] : ["explorer", [what]])
  : os === "darwin" ? ["open", [what]]
  : ["xdg-open", [what]];
execFile(cmd, args, () => {});
console.log(`Opened ${what}`);
