#!/bin/bash
# Render build script for Eye2Wear
echo "Starting build process..."

# Install dependencies
npm install --legacy-peer-deps

# Let Puppeteer download its own Chromium during npm install
echo "Puppeteer will download Chromium automatically..."

# Set NODE_ENV and build
export NODE_ENV=production
npm run build

echo "Build completed successfully!"
