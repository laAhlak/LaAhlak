# Automation script: Apply changes, build, and restart (PowerShell)
# Usage: .\scripts\rebuild-and-restart.ps1

Write-Host "🔄 Starting automated rebuild and restart process..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop any running npm processes
Write-Host "🛑 Step 1/3: Stopping running npm processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*npm*" -or $_.CommandLine -like "*next*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✅ Processes stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Build the project
Write-Host "🔨 Step 2/3: Building the project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    
    # Step 3: Start the production server
    Write-Host "🚀 Step 3/3: Starting production server..." -ForegroundColor Yellow
    npm start
} else {
    Write-Host ""
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
    Write-Host "Production server will NOT be started." -ForegroundColor Red
    exit 1
}

