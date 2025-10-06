#!/bin/bash
# Render build script for Eye2Wear
echo "🚀 Starting build process..."

# CRITICAL: Unset problematic Puppeteer environment variables
# These prevent Puppeteer from downloading bundled Chromium
echo "🔧 Unsetting Puppeteer environment variables..."
unset PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
unset PUPPETEER_EXECUTABLE_PATH
unset PUPPETEER_CACHE_DIR
echo "✅ Environment variables cleared"

# Install dependencies
# Puppeteer will now download Chromium to node_modules/
echo "📦 Installing dependencies (Puppeteer will download Chromium)..."
npm install --legacy-peer-deps

# Verify Chromium was downloaded
echo "🔍 Verifying Chromium installation..."
if [ -d "node_modules/puppeteer/.local-chromium" ]; then
  echo "✅ Chromium downloaded successfully!"
  ls -la node_modules/puppeteer/.local-chromium/
else
  echo "⚠️  Warning: Chromium directory not found in expected location"
fi

# Set NODE_ENV and build frontend
echo "🏗️  Building frontend..."
export NODE_ENV=production
npm run build

echo "✅ Build completed successfully!"
