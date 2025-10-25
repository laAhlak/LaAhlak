# 🔄 Rebuild & Restart Automation Scripts

This document explains how to use the automated rebuild and restart scripts after making code changes.

## 📋 Overview

The automation scripts will:
1. **Stop** any running npm processes (dev/start)
2. **Build** the project (`npm run build`)
3. **Start** the production server (`npm start`) - only if build succeeds

## 🚀 Usage

### Option 1: NPM Script (Recommended - Cross-Platform)

```bash
npm run rebuild
```

This runs the Node.js version which works on all platforms (Windows, macOS, Linux).

### Option 2: Bash Script (Linux/macOS/WSL)

```bash
./scripts/rebuild-and-restart.sh
```

Or:

```bash
bash scripts/rebuild-and-restart.sh
```

### Option 3: PowerShell Script (Windows)

```powershell
.\scripts\rebuild-and-restart.ps1
```

Or:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\rebuild-and-restart.ps1
```

## 📝 What Each Script Does

### Step 1: Stop Processes 🛑
- Kills any running `npm run dev` or `npm start` processes
- Waits 2 seconds to ensure clean shutdown

### Step 2: Build Project 🔨
- Runs `npm run build`
- Checks for build errors
- If build fails, script stops here (no server start)

### Step 3: Start Production Server 🚀
- Only runs if build was successful
- Starts production server with `npm start`
- Server runs on port 3000 (or your configured port)

## ✅ Success Output

```
🔄 Starting automated rebuild and restart process...

🛑 Step 1/3: Stopping running npm processes...
✅ Processes stopped

🔨 Step 2/3: Building the project...
[Build output...]
✅ Build successful!

🚀 Step 3/3: Starting production server...
[Server starts...]
```

## ❌ Error Handling

If the build fails:
```
🔄 Starting automated rebuild and restart process...

🛑 Step 1/3: Stopping running npm processes...
✅ Processes stopped

🔨 Step 2/3: Building the project...
[Build errors...]

❌ Build failed! Please check the errors above.
Production server will NOT be started.
```

## 🔧 Troubleshooting

### Script Won't Run (Permission Denied)

**Bash:**
```bash
chmod +x scripts/rebuild-and-restart.sh
```

**PowerShell (Execution Policy Error):**
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Processes Won't Stop

**Manually kill Node processes:**

**Linux/macOS:**
```bash
pkill -f node
```

**Windows (CMD):**
```cmd
taskkill /F /IM node.exe /T
```

**Windows (PowerShell):**
```powershell
Get-Process node | Stop-Process -Force
```

### Port Already in Use

If you get "port already in use" errors:

**Find what's using port 3000:**

**Linux/macOS:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 🎯 Best Practices

1. **Always use this script after code changes** to ensure clean rebuilds
2. **Check build output** for any warnings or errors
3. **Test your changes** in production mode before deploying
4. **Use `npm run rebuild`** as the default - it's cross-platform

## 📦 Files

- `scripts/rebuild-and-restart.sh` - Bash version (Linux/macOS/WSL)
- `scripts/rebuild-and-restart.ps1` - PowerShell version (Windows)
- `scripts/rebuild-and-restart.js` - Node.js version (Cross-platform)
- `package.json` - Contains `npm run rebuild` script

## 🔗 Related Commands

```bash
# Development server (with hot reload)
npm run dev

# Build only (no restart)
npm run build

# Start production server only
npm start

# Stop and rebuild (automated)
npm run rebuild
```

## ⚡ Quick Reference

| Platform | Recommended Command |
|----------|---------------------|
| **All** | `npm run rebuild` |
| **Linux/macOS/WSL** | `./scripts/rebuild-and-restart.sh` |
| **Windows** | `.\scripts\rebuild-and-restart.ps1` |

---

**Pro Tip:** Add a keyboard shortcut in your IDE to run `npm run rebuild` for even faster workflow! 🚀

