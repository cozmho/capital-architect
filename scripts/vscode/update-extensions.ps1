<#
.SYNOPSIS
    Exports the current VS Code extension list and updates all installed extensions.

.DESCRIPTION
    This script:
      1. Detects VS Code Stable and/or Insiders installations.
      2. Exports the current extension list to a timestamped file.
      3. Updates every installed extension via the `code --install-extension` flag.
      4. Optionally upgrades VS Code itself through winget (best-effort, requires winget).

.PARAMETER ExportDir
    Directory where the extension list export is saved.
    Defaults to the directory containing this script.

.PARAMETER SkipWinget
    Skip the best-effort winget upgrade of VS Code.

.PARAMETER IncludeInsiders
    Also process VS Code Insiders if it is installed.

.EXAMPLE
    .\update-extensions.ps1
    .\update-extensions.ps1 -ExportDir C:\exports -IncludeInsiders
    .\update-extensions.ps1 -SkipWinget

.NOTES
    Requirements:
      - PowerShell 5.1+ or PowerShell 7+
      - `code` (VS Code Stable) and/or `code-insiders` on PATH
      - winget (optional, for VS Code self-upgrade)
    No administrator rights are needed unless winget requires elevation for your machine.
#>

[CmdletBinding(SupportsShouldProcess)]
param (
    [string]$ExportDir = $PSScriptRoot,
    [switch]$SkipWinget,
    [switch]$IncludeInsiders
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

function Get-CLIPath {
    param([string]$Command)
    $found = Get-Command $Command -ErrorAction SilentlyContinue
    return $found ? $found.Source : $null
}

function Export-Extension {
    param(
        [string]$CLI,
        [string]$Label,
        [string]$ExportPath
    )

    Write-Step "Exporting $Label extensions -> $ExportPath"
    $extensions = & $CLI --list-extensions 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Could not list extensions from $CLI -- skipping export."
        return $false
    }
    $extensions | Set-Content -Path $ExportPath -Encoding UTF8
    $count = ($extensions | Measure-Object -Line).Lines
    Write-Success "Exported $count extensions."
    return $true
}

function Update-Extension {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [string]$CLI,
        [string]$Label
    )

    Write-Step "Updating all $Label extensions"
    $extensions = & $CLI --list-extensions 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Could not list extensions from $CLI -- skipping update."
        return
    }

    $list = $extensions | Where-Object { $_ -match '\S' }
    $total = $list.Count
    $i = 0

    foreach ($ext in $list) {
        $i++
        Write-Host "  [$i/$total] $ext" -ForegroundColor DarkGray
        & $CLI --install-extension $ext --force 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Warn "Failed to update: $ext"
        }
    }

    Write-Success "Finished updating $total $Label extensions."
}

function Update-VSCodeViaWinget {
    [CmdletBinding(SupportsShouldProcess)]
    param([string]$PackageId, [string]$Label)

    Write-Step "Upgrading $Label via winget (best-effort)"
    $winget = Get-CLIPath 'winget'
    if (-not $winget) {
        Write-Warn "winget not found -- skipping VS Code self-upgrade."
        return
    }

    & winget upgrade --id $PackageId --silent --accept-package-agreements --accept-source-agreements 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "$Label upgraded (or already up-to-date)."
    }
    else {
        Write-Warn "$Label winget upgrade returned a non-zero exit code ($LASTEXITCODE) -- this is usually benign (already current)."
    }
}

# -- main -----------------------------------------------------------------------

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$exitCode = 0

# Ensure export directory exists
if (-not (Test-Path $ExportDir)) {
    New-Item -ItemType Directory -Path $ExportDir | Out-Null
}

# -- VS Code Stable -------------------------------------------------------------
$codeCLI = Get-CLIPath 'code'
if ($codeCLI) {
    $exportFile = Join-Path $ExportDir "extensions-stable-$timestamp.txt"
    Export-Extension -CLI $codeCLI -Label 'VS Code Stable' -ExportPath $exportFile
    Update-Extension -CLI $codeCLI -Label 'VS Code Stable'

    if (-not $SkipWinget) {
        Update-VSCodeViaWinget -PackageId 'Microsoft.VisualStudioCode' -Label 'VS Code Stable'
    }
}
else {
    Write-Warn "'code' CLI not found on PATH -- VS Code Stable skipped."
    Write-Warn "Add VS Code to PATH: Code > Help > Shell Command > Install 'code' command."
    $exitCode = 1
}

# -- VS Code Insiders (optional) ------------------------------------------------
if ($IncludeInsiders) {
    $insidersCLI = Get-CLIPath 'code-insiders'
    if ($insidersCLI) {
        $exportFile = Join-Path $ExportDir "extensions-insiders-$timestamp.txt"
        Export-Extension -CLI $insidersCLI -Label 'VS Code Insiders' -ExportPath $exportFile
        Update-Extension -CLI $insidersCLI -Label 'VS Code Insiders'

        if (-not $SkipWinget) {
            Update-VSCodeViaWinget -PackageId 'Microsoft.VisualStudioCode.Insiders' -Label 'VS Code Insiders'
        }
    }
    else {
        Write-Warn "'code-insiders' CLI not found on PATH -- Insiders skipped."
    }
}

# -- summary --------------------------------------------------------------------
Write-Host ''
Write-Host '-----------------------------------------' -ForegroundColor DarkGray
if ($exitCode -eq 0) {
    Write-Host 'Done. Restart VS Code to activate updated extensions.' -ForegroundColor Green
}
else {
    Write-Host 'Completed with warnings. See messages above.' -ForegroundColor Yellow
}
Write-Host "Export saved to: $ExportDir" -ForegroundColor DarkGray
Write-Host '-----------------------------------------' -ForegroundColor DarkGray

exit $exitCode
