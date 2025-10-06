const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Download Chrome (not Chromium)
  chrome: {
    skipDownload: false,
  },
  
  // Use Chromium as fallback if Chrome fails
  skipDownload: false,
  
  // Cache directory for Chrome - use Render's persistent cache
  cacheDirectory: process.env.PUPPETEER_CACHE_DIR || join(__dirname, '.cache', 'puppeteer'),
};
