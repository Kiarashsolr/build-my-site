# Run by the teacher on each Windows laptop before the student leaves, in PowerShell:
#   irm https://raw.githubusercontent.com/Kiarashsolr/build-my-site/HEAD/teacher/end-of-class.ps1 | iex
# Logs everything out and puts the agent's settings back. The student's site and files stay.
$ErrorActionPreference = "Continue"; Set-StrictMode -Off
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User") + ";$HOME\.local\bin"

# Stop the agent and the preview, if they're still running.
Get-Process claude -ErrorAction SilentlyContinue | Stop-Process -Force
Get-NetTCPConnection -LocalPort 4321 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

# npx.cmd, because plain npx is blocked in a default PowerShell. The file is removed too, so the token leaves even with no network.
$fb = Join-Path $HOME ".config\configstore\firebase-tools.json"
Write-Host "...   Firebase"; npx.cmd -y firebase-tools@latest logout
Remove-Item $fb -Force -ErrorAction SilentlyContinue
$hasGh = [bool](Get-Command gh -ErrorAction SilentlyContinue)
if ($hasGh) { Write-Host "...   GitHub"; gh auth logout --hostname github.com }
Write-Host "...   Claude"; claude auth logout

$dir = Join-Path $HOME ".claude"
$file = Join-Path $dir "settings.json"
$saved = Join-Path $dir "settings.before-class.json"
if (Test-Path $saved) { Move-Item -Force $saved $file } elseif (Test-Path $file) { Remove-Item $file }

Write-Host ""
Write-Host "Check now:"
claude auth status *> $null
if ($LASTEXITCODE -eq 0) { Write-Host "STILL LOGGED IN to Claude. Open claude and type /logout." } else { Write-Host "ok    logged out of Claude" }
if (Test-Path $fb) { Write-Host "STILL LOGGED IN to Firebase. Delete $fb" } else { Write-Host "ok    logged out of Firebase" }
if ($hasGh) { gh auth status *> $null; if ($LASTEXITCODE -eq 0) { Write-Host "STILL LOGGED IN to GitHub. Run: gh auth logout" } else { Write-Host "ok    logged out of GitHub" } }
Write-Host "If you signed in anywhere outside a private window, sign out there now. Closing the window isn't enough."
