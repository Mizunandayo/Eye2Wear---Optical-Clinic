#!/usr/bin/env node

/**
 * Script to install Chrome for Puppeteer
 * Runs automatically after npm install (postinstall hook)
 * Only installs in production environment (Render, etc.)
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const isCI = process.env.CI === 'true';

console.log('🔍 Chrome Installation Check:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  RENDER: ${process.env.RENDER}`);
console.log(`  CI: ${process.env.CI}`);
console.log(`  Platform: ${process.platform}`);

// Skip installation in development on Windows/Mac
if (!isProduction && !isCI) {
  console.log('⏭️  Skipping Chrome installation (development environment)');
  process.exit(0);
}

// Check if Chrome is already installed
const cacheDir = process.env.PUPPETEER_CACHE_DIR || join(process.cwd(), '.cache', 'puppeteer');
const possibleChromePaths = [
  join(cacheDir, 'chrome'),
  '/opt/render/.cache/puppeteer/chrome',
  join(process.env.HOME || '', '.cache', 'puppeteer', 'chrome')
];

const chromeExists = possibleChromePaths.some(path => {
  const exists = existsSync(path);
  if (exists) {
    console.log(`✅ Chrome found at: ${path}`);
  }
  return exists;
});

if (chromeExists) {
  console.log('✅ Chrome is already installed, skipping...');
  process.exit(0);
}

// Install Chrome
try {
  console.log('📦 Installing Chrome for Puppeteer...');
  console.log('   This may take a few minutes...');
  
  // Use npx to install Chrome
  execSync('npx puppeteer browsers install chrome', {
    stdio: 'inherit',
    env: {
      ...process.env,
      PUPPETEER_CACHE_DIR: cacheDir
    }
  });
  
  console.log('✅ Chrome installed successfully!');
  console.log(`   Cache directory: ${cacheDir}`);
  
} catch (error) {
  console.error('❌ Failed to install Chrome:', error.message);
  
  // Don't fail the build, just warn
  console.warn('⚠️  Continuing without Chrome installation');
  console.warn('   PDF generation may not work until Chrome is manually installed');
  process.exit(0); // Exit with success to not block deployment
}
