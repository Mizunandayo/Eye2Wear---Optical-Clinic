#!/bin/bash
# Render build script for Eye2Wear
echo "🚀 Starting build process..."

# CRITICAL: Override Puppeteer's default cache directory
# Puppeteer v24 defaults to ~/.cache/puppeteer which is ephemeral on Render
# We MUST set PUPPETEER_CACHE_DIR to a persistent location (node_modules)
echo "🔧 Configuring Puppeteer cache directory..."
export PUPPETEER_CACHE_DIR="$(pwd)/node_modules/.cache/puppeteer"
echo "✅ Puppeteer will download to: $PUPPETEER_CACHE_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# FORCE Puppeteer to download Chromium using npx
echo "� Downloading Chromium for Puppeteer..."
npx puppeteer browsers install chrome

# Verify Chromium was downloaded
echo "🔍 Verifying Chromium installation..."
if [ -d "$PUPPETEER_CACHE_DIR/chrome" ]; then
  echo "✅ Chromium downloaded successfully to: $PUPPETEER_CACHE_DIR/chrome"
  ls -la "$PUPPETEER_CACHE_DIR/chrome"
else
  echo "⚠️  Warning: Chromium not found at $PUPPETEER_CACHE_DIR/chrome"
  echo "🔍 Checking alternative locations..."
  find node_modules -type d -name "chrome" 2>/dev/null | head -5
fi

# Set NODE_ENV and build frontend
echo "🏗️  Building frontend..."
export NODE_ENV=production
npm run build

echo "✅ Build completed successfully!"
