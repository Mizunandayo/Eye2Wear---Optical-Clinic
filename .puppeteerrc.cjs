const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Download Chrome instead of Chromium
  chrome: {
    skipDownload: false,
  },
  
  // Cache directory for Chrome
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
