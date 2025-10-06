# PowerShell Deployment Script for PDF Fix

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Step 1: Check git status
Write-Host "`n📋 Checking git status..." -ForegroundColor Yellow
git status

# Step 2: Add all changes
Write-Host "`n➕ Adding all changes..." -ForegroundColor Yellow
git add .

# Step 3: Commit
Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Fix PDF generation: proper Chrome executable detection and installation"

# Step 4: Push to main
Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Code pushed successfully!" -ForegroundColor Green

Write-Host "`n" -NoNewline
Write-Host "⚠️  IMPORTANT: Add these environment variables to Render:" -ForegroundColor Red
Write-Host "`nPUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer"
Write-Host "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true"

Write-Host "`n" -NoNewline
Write-Host "📖 Instructions:" -ForegroundColor Cyan
Write-Host "1. Go to https://dashboard.render.com"
Write-Host "2. Select your 'eye2wear' service"
Write-Host "3. Click 'Environment' in the left sidebar"
Write-Host "4. Add the two variables above"
Write-Host "5. Click 'Save Changes'"
Write-Host "6. Render will automatically redeploy"

Write-Host "`n" -NoNewline
Write-Host "🔍 What to look for in Render logs:" -ForegroundColor Cyan
Write-Host "✅ '📦 Chrome executable not found, proceeding with installation...'"
Write-Host "✅ '📦 Installing Chrome for Puppeteer...'"
Write-Host "✅ '✅ Chrome installed successfully!'"
Write-Host "✅ '🔍 Searching for Chrome executable...'"
Write-Host "✅ '✅ Found Chrome at: /opt/render/.cache/puppeteer/chrome/...'"

Write-Host "`n✨ Deployment script complete!" -ForegroundColor Green
