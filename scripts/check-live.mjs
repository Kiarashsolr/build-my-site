#!/usr/bin/env node
// Tests the real published files, because the agent can't see the student's browser. No dependencies.
//   node scripts/check-live.mjs <link>
const base = process.argv[2];
const page = await fetch(base);
let bad = page.ok ? 0 : 1;
console.log(page.status, "the page");
const html = await page.text();
const urls = [...html.matchAll(/\s(?:src|href)=["'](?!https?:|\/\/|#|mailto:|data:)([^"']+)["']/gi)].map((m) => new URL(m[1], base).href);
for (const m of html.matchAll(/<link[^>]+href=["'](?!https?:|\/\/)([^"']+\.css)["']/gi)) {
  const cssUrl = new URL(m[1], base);
  const css = await (await fetch(cssUrl)).text();
  for (const c of css.matchAll(/url\(["']?(?!data:|https?:|#)([^)"']+)/g)) urls.push(new URL(c[1], cssUrl).href);
}
for (const u of new Set(urls)) {
  const r = await fetch(u);
  if (!r.ok) bad++;
  console.log(r.status, u.replace(new URL(base).origin, ""));
}
console.log(bad ? `FAIL ${bad} file(s) missing online. Fix the file names, then publish again.` : "ok   every file is really there");
process.exitCode = bad ? 1 : 0;
