# 🌐 Update ngrok URL in .env.local (PowerShell)
# Usage: .\scripts\update-ngrok-url.ps1 <your-ngrok-url>

param(
    [Parameter(Mandatory=$true)]
    [string]$NgrokUrl
)

Write-Host "`n🌐 ngrok URL Updater`n" -ForegroundColor Green

# Remove trailing slash if present
$NgrokUrl = $NgrokUrl.TrimEnd('/')

# Validate URL format
if ($NgrokUrl -notmatch '^https://.*\.ngrok-free\.dev$') {
    Write-Host "⚠️  Warning: URL doesn't match ngrok format (https://xxx.ngrok-free.dev)" -ForegroundColor Yellow
    Write-Host "   Continuing anyway...`n" -ForegroundColor Yellow
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found. Creating from template..." -ForegroundColor Yellow
    
    if (Test-Path "env.template") {
        Copy-Item "env.template" ".env.local"
        Write-Host "✅ Created .env.local from env.template`n" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Error: env.template not found!" -ForegroundColor Red
        exit 1
    }
}

# Backup existing .env.local
Copy-Item ".env.local" ".env.local.backup" -Force
Write-Host "✅ Backed up .env.local to .env.local.backup" -ForegroundColor Green

# Read .env.local content
$content = Get-Content ".env.local" -Raw

# Update NEXT_PUBLIC_APP_URL
if ($content -match 'NEXT_PUBLIC_APP_URL=.*') {
    $content = $content -replace 'NEXT_PUBLIC_APP_URL=.*', "NEXT_PUBLIC_APP_URL=$NgrokUrl"
    Write-Host "✅ Updated NEXT_PUBLIC_APP_URL to: $NgrokUrl" -ForegroundColor Green
}
else {
    $content += "`nNEXT_PUBLIC_APP_URL=$NgrokUrl"
    Write-Host "✅ Added NEXT_PUBLIC_APP_URL: $NgrokUrl" -ForegroundColor Green
}

# Write updated content
Set-Content ".env.local" $content -NoNewline

Write-Host "`n🎉 Configuration updated successfully!`n" -ForegroundColor Green
Write-Host "📋 Next Steps:`n" -ForegroundColor Yellow
Write-Host "1. Configure Stripe Webhook:"
Write-Host "   - Go to: https://dashboard.stripe.com/test/webhooks"
Write-Host "   - Add endpoint: $NgrokUrl/api/stripe/webhook"
Write-Host "   - Select events: checkout.session.completed, checkout.session.expired"
Write-Host "   - Copy webhook secret to .env.local"
Write-Host ""
Write-Host "2. Restart your dev server:"
Write-Host "   - Stop current server (Ctrl+C)"
Write-Host "   - Run: npm run dev"
Write-Host ""
Write-Host "✅ Your app will now use: $NgrokUrl`n" -ForegroundColor Green

