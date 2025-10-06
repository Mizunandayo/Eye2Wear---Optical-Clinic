#!/bin/bash
# Render build script for Eye2Wear
echo "Starting build process..."

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

# Let Puppeteer download its own Chromium during npm install
echo "Puppeteer will download Chromium automatically..."

# Set NODE_ENV and build
export NODE_ENV=production
npm run build

echo "Build completed successfully!"
