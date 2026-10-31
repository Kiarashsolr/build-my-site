#!/usr/bin/env node
// Windows: makes a JPEG or PNG at most 1400 pixels wide, keeps its type and its rotation, and drops hidden data. No dependencies.
//   node scripts/shrink.mjs site/images/photo.jpg
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const file = resolve(process.argv[2]);
const ps = `Add-Type -AssemblyName System.Drawing
$p = $env:SHRINK_FILE
$bytes = [IO.File]::ReadAllBytes($p)
$ms = New-Object IO.MemoryStream(,$bytes)
$i = [Drawing.Image]::FromStream($ms)
$fmt = $i.RawFormat
$r = 0; if ($i.PropertyIdList -contains 274) { $r = $i.GetPropertyItem(274).Value[0] }
if ($r -eq 6) { $i.RotateFlip('Rotate90FlipNone') } elseif ($r -eq 3) { $i.RotateFlip('Rotate180FlipNone') } elseif ($r -eq 8) { $i.RotateFlip('Rotate270FlipNone') }
$s = [Math]::Min(1.0, 1400.0 / $i.Width); $w = [int]($i.Width * $s); $h = [int]($i.Height * $s)
$b = New-Object Drawing.Bitmap($w, $h)
$g = [Drawing.Graphics]::FromImage($b); $g.InterpolationMode = 'HighQualityBicubic'; $g.DrawImage($i, 0, 0, $w, $h); $g.Dispose()
$i.Dispose(); $b.Save($p, $fmt); $b.Dispose()`;
execFileSync("powershell", ["-NoProfile", "-NonInteractive", "-Command", ps], { env: { ...process.env, SHRINK_FILE: file }, stdio: "inherit" });
console.log("ok   shrunk " + process.argv[2]);
