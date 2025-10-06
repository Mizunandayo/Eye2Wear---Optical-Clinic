import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

// Helper function to find Chrome executable
const findChrome = () => {
  try {
    // Try to get Chrome path from Puppeteer
    const result = execSync('npx puppeteer browsers show chrome', { encoding: 'utf8' });
    const match = result.match(/path: (.+)/);
    if (match && existsSync(match[1])) {
      return match[1];
    }
  } catch (error) {
    console.warn('Could not find Chrome via Puppeteer CLI:', error.message);
  }

  // Default Render.com path
  const renderPath = '/opt/render/.cache/puppeteer/chrome/linux-141.0.7390.54/chrome-linux64/chrome';
  if (existsSync(renderPath)) {
    return renderPath;
  }

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

    // In production (Render or other deployment), try to find Chrome
    const chromePath = findChrome();
    if (chromePath) {
      console.log('Using Chrome at:', chromePath);
      launchOptions.executablePath = chromePath;
    } else {
      console.log('Using default Puppeteer Chrome');
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
