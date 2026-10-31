#!/usr/bin/env node
// Puts site/ online with the student's Firebase key. Never prints the key. No dependencies.
//   node scripts/deploy.mjs --check   finds the key and says which project it's for
//   node scripts/deploy.mjs           writes the config files and publishes to https://<project-id>.web.app
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

mkdirSync("secrets", { recursive: true });
const found = readdirSync("secrets").filter((f) => f.toLowerCase().endsWith(".json")).flatMap((f) => {
  try {
    const k = JSON.parse(readFileSync(join("secrets", f), "utf8"));
    return k.type === "service_account" && k.project_id ? [{ file: join("secrets", f), project: k.project_id }] : [];
  } catch { return []; }
});
if (!found.length) {
  console.log("NO KEY: there's no Firebase key in the secrets folder yet.");
  process.exit(2);
}
const ids = [...new Set(found.map((k) => k.project))];
if (ids.length > 1) {
  console.log(`TWO PROJECTS: the secrets folder has keys for ${ids.join(" and ")}. Keep only the one for this site.`);
  process.exit(2);
}
const { file, project } = found[found.length - 1];
console.log(`ok   key found for project ${project}. The address will be https://${project}.web.app`);
if (process.argv.includes("--check")) process.exit(0);

if (!existsSync("site/index.html")) { console.log("NO SITE: site/index.html is missing."); process.exit(2); }
writeFileSync("firebase.json", JSON.stringify({ hosting: { public: "site", ignore: ["firebase.json", "**/.*"], headers: [{ source: "**", headers: [{ key: "Cache-Control", value: "no-cache" }] }] } }, null, 2) + "\n");
writeFileSync(".firebaserc", JSON.stringify({ projects: { default: project } }, null, 2) + "\n");

let out = "";
const run = spawn("npx -y firebase-tools@latest deploy --only hosting --non-interactive --project " + project, {
  shell: true,
  env: { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: resolve(file) },
});
const take = (d) => { const t = d.toString(); out += t; process.stdout.write(t.replace(/\x1b\[[0-9;]*m/g, "")); };
run.stdout.on("data", take);
run.stderr.on("data", take);
run.on("close", (code) => {
  if (code === 0) { console.log(`\nLIVE: https://${project}.web.app`); process.exitCode = 0; return; }
  // The usual first failure: the key is real but hasn't been given permission yet.
  if (/\b403\b|permission|denied/i.test(out)) console.log("\nNEEDS PERMISSION: the key was refused. Do the permissions part of guides/05-publish.md with the student. New permissions can take a minute or two to work, so wait a minute before trying again.");
  else console.log("\nFAILED: read the error above.");
  process.exitCode = 1;
});
