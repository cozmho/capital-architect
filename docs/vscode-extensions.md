# VS Code Extension Automation

Scripts for exporting, updating, and re-installing VS Code extensions on Windows.  
Located in [`scripts/vscode/`](../scripts/vscode/).

---

## Prerequisites

| Requirement | Notes |
|---|---|
| **PowerShell 5.1+** or **PowerShell 7+** | Ships with Windows 10/11; PS 7 recommended |
| **`code` CLI on PATH** | Required for Stable; see [Add to PATH](#add-code-to-path) |
| **`code-insiders` CLI on PATH** | Required only if you use VS Code Insiders |
| **winget** (optional) | Only needed for VS Code self-upgrade; ships with Windows 11+ |

### Add `code` to PATH

Open VS Code → **Help → Shell Command → Install 'code' command in PATH**, then restart
your terminal.  Verify with:

```powershell
code --version
```

---

## Scripts

### `update-extensions.ps1`

Exports the current extension list and updates every extension to its latest version.

```powershell
# Basic usage (Stable only, winget upgrade included)
.\scripts\vscode\update-extensions.ps1

# Save the export to a specific folder
.\scripts\vscode\update-extensions.ps1 -ExportDir C:\vscode-backups

# Include VS Code Insiders
.\scripts\vscode\update-extensions.ps1 -IncludeInsiders

# Skip the winget VS Code self-upgrade
.\scripts\vscode\update-extensions.ps1 -SkipWinget
```

**What it does:**

1. Detects `code` (and optionally `code-insiders`) on PATH.
2. Exports the current extension list to a timestamped `.txt` file
   (`extensions-stable-YYYYMMDD-HHmmss.txt`) in the export directory.
3. Loops through every installed extension and runs
   `code --install-extension <id> --force` — this reinstalls each extension,
   which forces the marketplace to deliver the latest published version
   (VS Code's built-in update command is not available via the CLI).
4. Optionally runs `winget upgrade --id Microsoft.VisualStudioCode` (best-effort;
   non-zero exit codes from winget are treated as warnings, not failures).
5. Exits `0` on full success, `1` if any step was skipped with a warning.

---

### `install-extensions.ps1`

Installs extensions from a plain-text list — useful for onboarding or restoring a
fresh VS Code install.

```powershell
# Install from an exported list
.\scripts\vscode\install-extensions.ps1 -ExtensionFile .\extensions-stable-20240101-120000.txt

# Install into VS Code Insiders
.\scripts\vscode\install-extensions.ps1 -ExtensionFile .\extensions.txt -Insiders

# Force re-install even if already present
.\scripts\vscode\install-extensions.ps1 -ExtensionFile .\extensions.txt -Force
```

**Extension file format** — one extension ID per line; blank lines and `#` comments
are ignored:

```
# --- formatters ---
esbenp.prettier-vscode
dbaeumer.vscode-eslint

# --- git ---
eamodio.gitlens
```

---

## Enable Auto-Update in VS Code

To avoid running the script manually in the future:

1. Open **File → Preferences → Settings** (or `Ctrl+,`).
2. Search **`extensions.autoUpdate`** → set to **`true`** (or `"onlyEnabledExtensions"`).
3. Search **`extensions.autoCheckUpdates`** → set to **`true`**.
4. *(Optional)* Search **`update.mode`** → set to **`"default"`** to keep VS Code
   itself up-to-date automatically.

These settings are also configurable in `.vscode/settings.json`:

```jsonc
{
  "extensions.autoUpdate": true,
  "extensions.autoCheckUpdates": true,
  "update.mode": "default"
}
```

---

## Running via PowerShell Execution Policy

If you see _"running scripts is disabled on this system"_, run this once in an
elevated PowerShell terminal:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Or run a single script without changing the policy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\vscode\update-extensions.ps1
```

---

## Troubleshooting

### Where to find extension update logs

- **VS Code Output panel** → `View → Output` → select **Extensions** from the
  dropdown.
- **Extension Host log** → `View → Output` → select **Log (Extension Host)**.
- **Developer Tools console** → `Help → Toggle Developer Tools` → Console tab.

### An extension keeps failing to update

1. Disable the extension, reload VS Code, then re-enable and try again.
2. Uninstall then reinstall: `code --uninstall-extension <id> && code --install-extension <id>`.
3. Check the [VS Code marketplace](https://marketplace.visualstudio.com) to confirm
   the extension is still published and compatible with your VS Code version.

### `winget` says "No applicable update found"

VS Code is already on the latest version — this is normal and safe to ignore.

### `code --install-extension` hangs

Your corporate proxy may be blocking the marketplace. Set the `http_proxy` /
`https_proxy` environment variables or configure the proxy in VS Code Settings
(`http.proxy`).

---

## CI Lint

A GitHub Actions workflow (`.github/workflows/lint-powershell.yml`) runs
**PSScriptAnalyzer** against these scripts on every push and pull request to catch
common PowerShell issues automatically.
