# Run by the teacher on each Windows laptop, in PowerShell:
#   irm https://raw.githubusercontent.com/Kiarashsolr/build-my-site/HEAD/teacher/setup-windows.ps1 | iex
# Installs the tools, presets the agent for this class, makes an empty work folder, then opens the agent there.
$ProgressPreference = "SilentlyContinue"
$base = "https://raw.githubusercontent.com/Kiarashsolr/build-my-site/HEAD/teacher"

function Install-IfMissing($command, $id) {
  if (Get-Command $command -ErrorAction SilentlyContinue) { Write-Host "ok    $command is already here"; return }
  Write-Host "...   installing $id"
  winget install -e --id $id --silent --accept-source-agreements --accept-package-agreements
}

function Refresh-Path { $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User") + ";$HOME\.local\bin" }

function Add-UserPath($folder) {
  $user = [Environment]::GetEnvironmentVariable("Path", "User")
  if ($user -notlike "*$folder*") { [Environment]::SetEnvironmentVariable("Path", "$user;$folder", "User") }
  $env:Path += ";$folder"
}

# Fallbacks for a laptop where installing needs a password nobody has: these need no admin rights.
function Install-NodeNoAdmin($root = "$HOME\.local\node") {
  Write-Host "...   installing Node without admin rights"
  # The inner parentheses matter: Windows PowerShell 5.1 passes a JSON array down a pipe as one object.
  $v = ((Invoke-RestMethod https://nodejs.org/dist/index.json) | Where-Object { $_.lts } | Select-Object -First 1).version
  $zip = Join-Path $env:TEMP "node-$v.zip"
  Invoke-WebRequest "https://nodejs.org/dist/$v/node-$v-win-x64.zip" -OutFile $zip -UseBasicParsing
  New-Item -ItemType Directory -Force $root | Out-Null
  Expand-Archive $zip $root -Force
  Remove-Item $zip
  Add-UserPath (Join-Path $root "node-$v-win-x64")
}

function Install-GitNoAdmin($root = "$HOME\.local\git") {
  Write-Host "...   installing Git without admin rights"
  $asset = (Invoke-RestMethod https://api.github.com/repos/git-for-windows/git/releases/latest).assets | Where-Object { $_.name -match '^MinGit-.*-64-bit\.zip$' } | Select-Object -First 1
  $zip = Join-Path $env:TEMP "mingit.zip"
  Invoke-WebRequest $asset.browser_download_url -OutFile $zip -UseBasicParsing
  New-Item -ItemType Directory -Force $root | Out-Null
  Expand-Archive $zip $root -Force
  Remove-Item $zip
  Add-UserPath (Join-Path $root "cmd")
}

if (Get-Command winget -ErrorAction SilentlyContinue) {
  Install-IfMissing node "OpenJS.NodeJS.LTS"
  Install-IfMissing git "Git.Git"
  Install-IfMissing gh "GitHub.cli"
  Refresh-Path
} else { Write-Host "NOTE  no winget on this laptop" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Install-NodeNoAdmin }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Install-GitNoAdmin }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { Write-Host "NOTE  no GitHub CLI. Everything works without it, except saving to GitHub at the end." }
if ([int]((node --version) -replace '^v(\d+).*', '$1') -lt 20) { Write-Host "STOP  Node is older than 20. Install Node LTS from nodejs.org, then run this again."; return }

if (Get-Command claude -ErrorAction SilentlyContinue) { Write-Host "ok    claude is already here" }
else {
  Write-Host "...   installing Claude Code"
  # In its own process, because the installer's strict settings would otherwise stay on in this window.
  powershell.exe -NoProfile -Command "irm https://claude.ai/install.ps1 | iex"
  if ($LASTEXITCODE -ne 0) { Write-Host "STOP  Claude Code did not install. Check the network and run this again."; return }
  Add-UserPath "$HOME\.local\bin"
}

# Download the publishing tool now, in the background, not at the end of class.
Write-Host "...   downloading Firebase tools in the background"
Start-Process npx.cmd -ArgumentList "-y", "firebase-tools@latest", "--version" -WindowStyle Hidden

# Preset the agent. Anything already there is kept and put back by end-of-class.ps1.
$dir = Join-Path $HOME ".claude"
New-Item -ItemType Directory -Force $dir | Out-Null
$file = Join-Path $dir "settings.json"
$saved = Join-Path $dir "settings.before-class.json"
if ((Test-Path $file) -and -not (Test-Path $saved)) { Copy-Item $file $saved }
try { Invoke-WebRequest "$base/settings.json" -OutFile $file -UseBasicParsing -ErrorAction Stop }
catch { Write-Host "STOP  Could not download the agent preset, so the agent was NOT opened: $_"; return }

# Chrome or Edge is needed for the agent's screenshots.
$browsers = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe")
if ($browsers | Where-Object { Test-Path $_ }) { Write-Host "ok    browser found" } else { Write-Host "NOTE  no Chrome or Edge found. Install Chrome." }

# In the home folder, not Documents, which OneDrive may sync.
$work = Join-Path $HOME "my-site"
New-Item -ItemType Directory -Force $work | Out-Null
Set-Location $work
Write-Host ""
Write-Host "Ready. A browser tab will open for login. Don't sign in there: close it, press c here to copy the address, and paste it into a private window (Ctrl+Shift+N). Then say yes to trusting this folder."
Write-Host "Then hand the laptop back."
claude
