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
# Puppeteer will now download Chromium to node_modules/.cache/puppeteer/
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
