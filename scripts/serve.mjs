#!/usr/bin/env node
// Local preview server with click-to-comment. No dependencies.
//   node scripts/serve.mjs            serves the repo folder at http://localhost:4321
//   node scripts/serve.mjs site 4322  serves ./site on port 4322
//
// Every HTML page gets a small "Comment" button. The student clicks it, clicks anything on the
// page and types what they think. Comments land in .feedback/comments.json for the agent to read.
// The button is added by this server, so pages don't need it in their own code, and it never goes online.
import { createServer } from "node:http";
import { readFile, mkdir, writeFile, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, resolve, normalize, sep } from "node:path";
import { pathToFileURL } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".pdf": "application/pdf", ".md": "text/plain; charset=utf-8",
};

const OVERLAY = `<script>(function(){
if(window.top!==window.self)return;
var on=false,b=document.createElement('button');
b.textContent='💬 Comment';b.setAttribute('data-feedback','1');
b.style.cssText='position:fixed;right:16px;bottom:16px;z-index:2147483647;padding:12px 16px;border-radius:24px;border:0;background:#111;color:#fff;font:600 15px system-ui;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)';
function name(el){var s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;var t=(el.innerText||el.alt||'').trim().slice(0,60);return t?s+' "'+t+'"':s}
b.onclick=function(e){e.stopPropagation();on=!on;b.textContent=on?'Click the thing you mean':'💬 Comment';document.body.style.cursor=on?'crosshair':''};
document.addEventListener('click',function(e){if(!on||e.target===b)return;e.preventDefault();e.stopPropagation();
var t=prompt('What do you think about this part?');on=false;b.textContent='💬 Comment';document.body.style.cursor='';if(!t)return;
fetch('/__feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({page:location.pathname,element:name(e.target),comment:t})}).then(function(){b.textContent='Saved ✓';setTimeout(function(){b.textContent='💬 Comment'},1500)}).catch(function(){alert('That comment did not save. Tell me in the chat instead.')})},true);
document.addEventListener('DOMContentLoaded',function(){document.body.appendChild(b)});
if(document.body)document.body.appendChild(b);
})();</script>`;

// On mockup pages, a small switcher so the student can flip between the looks without editing the address.
const switcher = (names, current) => `<script>(function(){
if(window.top!==window.self)return;
function add(){var n=document.createElement('nav');n.setAttribute('data-feedback','1');n.style.cssText='position:fixed;left:16px;bottom:16px;z-index:2147483647;display:flex;gap:6px;align-items:center;padding:8px 10px;border-radius:24px;background:#111;color:#fff;font:600 15px system-ui;box-shadow:0 2px 10px rgba(0,0,0,.35)';
n.innerHTML='Look '+${JSON.stringify(names)}.map(function(x){var on=x===${JSON.stringify(current)};return '<a href="'+x+'.html" style="display:inline-block;min-width:32px;padding:6px 8px;text-align:center;border-radius:16px;text-decoration:none;text-transform:uppercase;color:'+(on?'#111':'#fff')+';background:'+(on?'#fff':'transparent')+'">'+x+'</a>'}).join('');
document.body.appendChild(n)}
if(document.body)add();else document.addEventListener('DOMContentLoaded',add);
})();</script>`;

export function startServer(rootArg = ".", port = 4321, { overlay = true } = {}) {
  const root = resolve(rootArg);
  const handle = async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "POST" && url.pathname === "/__feedback") {
      let body = "";
      for await (const c of req) body += c;
      const dir = join(process.cwd(), ".feedback");
      await mkdir(dir, { recursive: true });
      const file = join(dir, "comments.json");
      let list = [];
      try { const old = JSON.parse((await readFile(file, "utf8")).replace(/^\uFEFF/, "")); if (Array.isArray(old)) list = old; } catch {}
      list.push({ ...JSON.parse(body), at: new Date().toISOString() });
      await writeFile(file, JSON.stringify(list, null, 2));
      res.writeHead(204).end();
      return;
    }
    if (url.pathname === "/__frame") {
      // Used by shot.mjs: shows a page in an iframe of an exact width, and reports sideways overflow.
      const w = Number(url.searchParams.get("w")) || 390;
      const h = Number(url.searchParams.get("h")) || 844;
      const y = Number(url.searchParams.get("y")) || 0;
      const p = url.searchParams.get("p") || "/";
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(`<!doctype html><body style="margin:0;background:#888"><iframe id=f src="${p}" style="width:${w}px;height:${h}px;border:0;display:block;background:#fff"></iframe><pre id=r></pre><script>
f.onload=function(){var D=f.contentDocument,d=D.documentElement;f.contentWindow.scrollTo({top:${y},behavior:'instant'});setTimeout(function(){
var vw=f.clientWidth,vh=f.clientHeight,big=0,over=[];
var cross=function(a,b){return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top))};
var screen={left:0,top:0,right:vw,bottom:vh};
var shapes=[].slice.call(D.querySelectorAll('[aria-hidden="true"],img'));
shapes.forEach(function(s){big=Math.max(big,cross(s.getBoundingClientRect(),screen))});
[].slice.call(D.querySelectorAll('h1,h2,h3,p,li,summary')).forEach(function(t){var g=D.createRange();g.selectNodeContents(t);[].slice.call(g.getClientRects()).forEach(function(line){shapes.forEach(function(s){if(s.contains(t)||line.width*line.height<1)return;var r=s.getBoundingClientRect();var inset={left:r.left+r.width*.12,right:r.right-r.width*.12,top:r.top+r.height*.12,bottom:r.bottom-r.height*.12};if(cross(line,inset)/(line.width*line.height)>.1&&over.indexOf(t.innerText.slice(0,40))<0)over.push(t.innerText.slice(0,40))})})});
var W=f.contentWindow,low=[];
var parse=function(c){var m=/rgba?\\(([\\d.]+)[, ]+([\\d.]+)[, ]+([\\d.]+)(?:[,/ ]+([\\d.]+))?/.exec(c);return m?{r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]}:null};
var lum=function(c){return [c.r,c.g,c.b].map(function(v,i){v/=255;v=v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);return v*[.2126,.7152,.0722][i]}).reduce(function(a,b){return a+b})};
[].slice.call(D.querySelectorAll('h1,h2,h3,p,li,summary,a,span,em,strong,small,footer,blockquote')).forEach(function(t){
if(![].some.call(t.childNodes,function(n){return n.nodeType===3&&n.textContent.trim()}))return;
var s=W.getComputedStyle(t),c=parse(s.color);if(!c||s.visibility==='hidden'||+s.opacity===0)return;
var e=t,bg=null,skip=false;while(e&&e.nodeType===1){var es=W.getComputedStyle(e);if(es.backgroundImage!=='none'&&es.backgroundImage.indexOf('repeating-linear')<0){skip=true;break}var b=parse(es.backgroundColor);if(b&&b.a>=.95){bg=b;break}e=e.parentElement}
if(skip)return;if(!bg)bg={r:255,g:255,b:255,a:1};
var A=lum(c),B=lum(bg),ratio=(Math.max(A,B)+.05)/(Math.min(A,B)+.05),px=parseFloat(s.fontSize),large=px>=24||(px>=18.6&&+s.fontWeight>=700);
if(ratio<(large?3:4.5)&&low.length<6)low.push(t.innerText.trim().slice(0,30)+' ('+ratio.toFixed(1)+':1)')});
document.getElementById('r').textContent='scrollWidth='+d.scrollWidth+' scrollHeight='+d.scrollHeight+' big='+(big/(vw*vh)).toFixed(3)+' low='+encodeURIComponent(JSON.stringify(low))+' over='+encodeURIComponent(JSON.stringify(over));
},1500)};</script>`);
      return;
    }
    let path;
    try { path = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end("Bad address"); return; }
    let full = normalize(join(root, path));
    if (full !== root && !full.startsWith(root + sep)) { res.writeHead(403).end("Forbidden"); return; }
    try {
      let s = await stat(full);
      if (s.isDirectory()) {
        if (!url.pathname.endsWith("/")) { res.writeHead(301, { location: url.pathname + "/" + url.search }).end(); return; }
        const index = join(full, "index.html");
        if (existsSync(index)) { full = index; s = await stat(full); }
        else {
          const names = (await readdir(full)).filter((n) => !n.startsWith("."));
          res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          res.end(`<!doctype html><meta charset=utf-8><title>Files</title><body style="font:18px system-ui;padding:32px"><h1>Pick one</h1><ul>${names.map((n) => `<li><a href="${path.replace(/\/$/, "")}/${encodeURIComponent(n)}">${n}</a></li>`).join("")}</ul>`);
          return;
        }
      }
      const ext = extname(full).toLowerCase();
      let data = await readFile(full);
      if (ext === ".html" && overlay) {
        const html = data.toString("utf8");
        let extra = OVERLAY;
        const mock = /^\/mockups\/([^/]+)\.html$/.exec(path);
        if (mock) {
          const names = (await readdir(join(root, "mockups"))).filter((n) => n.endsWith(".html")).map((n) => n.slice(0, -5)).sort();
          if (names.length > 1) extra += switcher(names, mock[1]);
        }
        data = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, extra + "</head>") : extra + html;
      }
      res.writeHead(200, { "content-type": TYPES[ext] || "application/octet-stream", "cache-control": "no-store" });
      res.end(data);
    } catch {
      res.writeHead(404, { "content-type": "text/plain" }).end("Not found: " + path);
    }
  };
  const server = createServer((req, res) => {
    handle(req, res).catch(() => { if (!res.headersSent) res.writeHead(400); res.end(); });
  });
  return new Promise((ok, fail) => {
    server.once("error", fail);
    server.listen(port, "127.0.0.1", () => ok(server));
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const root = process.argv[2] || ".";
  const port = Number(process.argv[3]) || 4321;
  startServer(root, port).then(
    () => console.log(`Open http://localhost:${port}  (serving ${resolve(root)}). Press Ctrl+C to stop.`),
    (e) => {
      if (e.code === "EADDRINUSE") console.log(`Port ${port} is already in use, so the preview is probably already running: http://localhost:${port}`);
      else { console.error(e.message); process.exit(1); }
    },
  );
}
