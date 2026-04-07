<#
.SYNOPSIS
    Installs VS Code extensions from an exported extension list file.

.DESCRIPTION
    Reads a plain-text extension list (one extension ID per line, e.g. produced by
    `code --list-extensions` or by update-extensions.ps1) and installs every extension
    into VS Code Stable or Insiders.

    Useful for:
      - Onboarding a new developer machine.
      - Restoring extensions after a clean VS Code install.
      - Synchronising a team's recommended extension set.

.PARAMETER ExtensionFile
    Path to the plain-text file containing extension IDs (one per line).
    Required.

.PARAMETER Insiders
    Install into VS Code Insiders (`code-insiders`) instead of Stable (`code`).

.PARAMETER Force
    Pass --force to the install command even if the extension is already installed.
    Useful to ensure the latest version is fetched.

.EXAMPLE
    .\install-extensions.ps1 -ExtensionFile .\extensions-stable-20240101-120000.txt
    .\install-extensions.ps1 -ExtensionFile .\extensions.txt -Insiders -Force

.NOTES
    Requirements:
      - PowerShell 5.1+ or PowerShell 7+
      - `code` (or `code-insiders`) on PATH
    No administrator rights required.
#>

[CmdletBinding(SupportsShouldProcess)]
param (
    [Parameter(Mandatory)]
    [string]$ExtensionFile,

    [switch]$Insiders,

    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# -- helpers --------------------------------------------------------------------

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "  [!!] $Message" -ForegroundColor Yellow
}

# -- validate inputs -------------------------------------------------------------

if (-not (Test-Path $ExtensionFile)) {
    Write-Host "ERROR: Extension file not found: $ExtensionFile" -ForegroundColor Red
    exit 1
}

$cliCommand = $Insiders ? 'code-insiders' : 'code'
$cliPath = Get-Command $cliCommand -ErrorAction SilentlyContinue
if (-not $cliPath) {
    Write-Host "ERROR: '$cliCommand' CLI not found on PATH." -ForegroundColor Red
    if (-not $Insiders) {
        Write-Host "  -> In VS Code: Help > Shell Command > Install 'code' command in PATH" -ForegroundColor Yellow
    }
    exit 1
}

$label = $Insiders ? 'VS Code Insiders' : 'VS Code Stable'

# -- read extension list ---------------------------------------------------------

$extensions = Get-Content -Path $ExtensionFile |
    Where-Object { $_ -match '\S' } |   # remove blank lines
    Where-Object { $_ -notmatch '^\s*#' }  # remove comment lines

if ($extensions.Count -eq 0) {
    Write-Warn "No extensions found in $ExtensionFile -- nothing to do."
    exit 0
}

Write-Step "Installing $($extensions.Count) extensions into $label"

# -- install loop ---------------------------------------------------------------

$failed = [System.Collections.Generic.List[string]]::new()
$i = 0

foreach ($ext in $extensions) {
    $i++
    $ext = $ext.Trim()
    Write-Host "  [$i/$($extensions.Count)] $ext" -ForegroundColor DarkGray

    $installArgs = @('--install-extension', $ext)
    if ($Force) { $installArgs += '--force' }

    & $cliCommand @installArgs 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Failed: $ext"
        $failed.Add($ext)
    }
}

# -- summary --------------------------------------------------------------------

Write-Host ''
Write-Host '-----------------------------------------' -ForegroundColor DarkGray
$succeeded = $extensions.Count - $failed.Count
Write-Host "$succeeded / $($extensions.Count) extensions installed successfully." -ForegroundColor Green

if ($failed.Count -gt 0) {
    Write-Host ''
    Write-Host "Failed extensions ($($failed.Count)):" -ForegroundColor Yellow
    $failed | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host ''
    Write-Host 'Tip: Check View > Output > Extensions in VS Code for details.' -ForegroundColor DarkGray
    Write-Host '-----------------------------------------' -ForegroundColor DarkGray
    exit 1
}

Write-Host 'All done. Restart VS Code to activate the installed extensions.' -ForegroundColor Green
Write-Host '-----------------------------------------' -ForegroundColor DarkGray
exit 0
