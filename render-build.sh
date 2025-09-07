#!/bin/bash
# Render build script for Eye2Wear
echo "Starting build process..."

# Install dependencies
npm install --legacy-peer-deps

# Set NODE_ENV and build
export NODE_ENV=production
npm run build

echo "Build completed successfully!"
