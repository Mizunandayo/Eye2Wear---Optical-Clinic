#!/bin/bash
# Render build script for Eye2Wear
echo "Starting build process..."

# Install dependencies
npm install --legacy-peer-deps

# Install Chrome/Chromium for Puppeteer
echo "Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome --path /opt/render/.cache/puppeteer

# Verify Chrome installation
echo "Verifying Chrome installation..."
CHROME_PATH="/opt/render/.cache/puppeteer/chrome/linux-141.0.7390.54/chrome-linux64/chrome"
if [ -f "$CHROME_PATH" ]; then
  echo "✅ Chrome successfully installed at: $CHROME_PATH"
  ls -lh "$CHROME_PATH"
else
  echo "❌ Chrome NOT found at expected path: $CHROME_PATH"
  echo "📂 Listing /opt/render/.cache/puppeteer contents:"
  ls -lR /opt/render/.cache/puppeteer || echo "Directory not found"
fi

# Set NODE_ENV and build
export NODE_ENV=production
npm run build

echo "Build completed successfully!"
