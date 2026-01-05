# Windows

xcsh can be run on Windows using npm or Windows Subsystem for Linux (WSL).

## Option 1: npm (Recommended)

Install xcsh globally using npm:

```powershell
npm install -g @robinmordasiewicz/f5xc-xcsh
```

Then run:

```powershell
xcsh version
```

## Option 2: WSL

For the best experience on Windows, use Windows Subsystem for Linux (WSL):

1. Install WSL with Ubuntu:

   ```powershell
   wsl --install
   ```

2. Open Ubuntu and follow the [Script](script.md) installation method:

   ```bash
   curl -fsSL https://robinmordasiewicz.github.io/f5xc-xcsh/install.sh | sh
   ```

## PowerShell Completions

Enable tab completion in PowerShell:

```powershell
xcsh completion powershell | Out-String | Invoke-Expression
```

To make completions permanent, add the above command to your PowerShell profile:

```powershell
# Open your profile for editing
notepad $PROFILE

# Add this line:
xcsh completion powershell | Out-String | Invoke-Expression
```

## Troubleshooting

### Command Not Found

Ensure npm's global bin directory is in your PATH:

```powershell
npm config get prefix
```

Add the `\bin` subdirectory of that path to your system PATH.

### Execution Policy

If PowerShell blocks scripts, adjust the execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
