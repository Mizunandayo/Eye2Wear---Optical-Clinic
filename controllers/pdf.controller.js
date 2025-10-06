import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Helper function to find Chrome executable with multiple strategies
const findChrome = () => {
  console.log('🔍 Searching for Chrome executable...');
  
  // Strategy 1: Try Puppeteer CLI
  try {
    const result = execSync('npx puppeteer browsers show chrome', { 
      encoding: 'utf8',
      timeout: 5000 
    });
    const match = result.match(/path:\s*(.+)/);
    if (match && match[1]) {
      const chromePath = match[1].trim();
      if (existsSync(chromePath)) {
        console.log('✅ Found Chrome via Puppeteer CLI:', chromePath);
        return chromePath;
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not find Chrome via Puppeteer CLI:', error.message);
  }

  // Strategy 2: Check known Render.com paths
  const renderPaths = [
    '/opt/render/.cache/puppeteer/chrome',
    join(process.env.HOME || '', '.cache', 'puppeteer', 'chrome'),
    join(process.cwd(), '.cache', 'puppeteer', 'chrome')
  ];

  for (const basePath of renderPaths) {
    if (!existsSync(basePath)) continue;
    
    try {
      // Look for Chrome directories (format: linux-{version})
      const versions = readdirSync(basePath).filter(dir => dir.startsWith('linux-'));
      
      if (versions.length > 0) {
        // Sort to get the latest version
        versions.sort().reverse();
        const latestVersion = versions[0];
        const chromePath = join(basePath, latestVersion, 'chrome-linux64', 'chrome');
        
        if (existsSync(chromePath)) {
          console.log('✅ Found Chrome at:', chromePath);
          return chromePath;
        }
      }
    } catch (error) {
      console.warn(`⚠️  Error checking path ${basePath}:`, error.message);
    }
  }

  // Strategy 3: Try common Linux Chrome locations
  const linuxPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ];

  for (const path of linuxPaths) {
    if (existsSync(path)) {
      console.log('✅ Found system Chrome at:', path);
      return path;
    }
  }

  console.warn('⚠️  No Chrome executable found');
  return null;
};

// Generate PDF from HTML content using Puppeteer
export const generatePDF = async (req, res) => {
  let browser = null;
  
  try {
    const { htmlContent, fileName } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ 
        success: false, 
        message: 'HTML content is required' 
      });
    }

    // Launch headless browser with production-ready configuration
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    };

    // Determine Chrome executable path
    // Priority: ENV VAR > findChrome() > default
    let chromePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    
    if (!chromePath || !existsSync(chromePath)) {
      chromePath = findChrome();
    }
    
    if (chromePath) {
      console.log('Using Chrome at:', chromePath);
      launchOptions.executablePath = chromePath;
    } else {
      console.log('Using default Puppeteer Chrome');
      // Let Puppeteer try to use its bundled Chromium
      // This will likely fail on Render, but worth trying
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2
    });

    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    // Wait for any images to load
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => {
            img.onload = img.onerror = resolve;
          }))
      );
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      scale: 1
      // pageRanges removed to allow multiple pages
    });

    await browser.close();
    browser = null;

    // Set response headers for PDF download
    const pdfFileName = fileName || `Medical_Record_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Send PDF buffer as binary data
    res.end(pdfBuffer, 'binary');

  } catch (error) {
    console.error('PDF Generation Error:', error);
    
    // Ensure browser is closed even on error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF', 
      error: error.message 
    });
  }
};
