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

// Check if Chrome executable is already installed
const cacheDir = process.env.PUPPETEER_CACHE_DIR || join(process.cwd(), '.cache', 'puppeteer');
const chromeDirs = [
  join(cacheDir, 'chrome'),
  '/opt/render/.cache/puppeteer/chrome',
  join(process.env.HOME || '', '.cache', 'puppeteer', 'chrome')
];

let chromeExecutableFound = false;

for (const chromeDir of chromeDirs) {
  if (!existsSync(chromeDir)) continue;
  
  try {
    // Check if there are version directories (linux-*)
    const { readdirSync } = await import('fs');
    const versions = readdirSync(chromeDir).filter(dir => dir.startsWith('linux-'));
    
    if (versions.length > 0) {
      // Check if chrome executable exists in the latest version
      versions.sort().reverse();
      const chromePath = join(chromeDir, versions[0], 'chrome-linux64', 'chrome');
      
      if (existsSync(chromePath)) {
        console.log(`✅ Chrome executable found at: ${chromePath}`);
        chromeExecutableFound = true;
        break;
      } else {
        console.log(`⚠️  Chrome directory exists but executable not found: ${chromePath}`);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Error checking Chrome in ${chromeDir}:`, error.message);
  }
}

if (chromeExecutableFound) {
  console.log('✅ Chrome is already installed, skipping...');
  process.exit(0);
} else {
  console.log('📦 Chrome executable not found, proceeding with installation...');
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
