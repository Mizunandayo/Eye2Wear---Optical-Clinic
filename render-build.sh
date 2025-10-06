#!/bin/bash
# Render build script for Eye2Wear
echo "Starting build process..."

# Install dependencies
npm install --legacy-peer-deps

# Install Chrome/Chromium for Puppeteer
echo "Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome

# Set NODE_ENV and build
export NODE_ENV=production
npm run build

echo "Build completed successfully!"
