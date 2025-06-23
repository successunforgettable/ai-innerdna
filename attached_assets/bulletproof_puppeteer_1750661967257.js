// BULLETPROOF PUPPETEER SETUP FOR REPLIT

// Step 1: Install Puppeteer
// Run in Replit console: npm install puppeteer

// Step 2: Add to your server file (index.js)
import puppeteer from 'puppeteer';
import { generateCompleteStyledReport } from './emergency-report-generator.js';

// Global browser instance (more efficient)
let browser = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows'
      ],
      timeout: 30000
    });
  }
  return browser;
}

// Production-ready PDF generation route
app.get('/api/download-report/:typeId', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const typeId = parseInt(req.params.typeId);
    
    if (typeId < 1 || typeId > 9) {
      return res.status(400).json({ error: 'Invalid type ID. Must be 1-9.' });
    }

    console.log(`Starting PDF generation for Type ${typeId}`);

    // Generate HTML content
    const htmlContent = await generateCompleteStyledReport(typeId);
    
    // Get browser instance
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    try {
      // Optimize page settings
      await page.setViewport({ 
        width: 1200, 
        height: 800,
        deviceScaleFactor: 2
      });
      
      // Block unnecessary resources for faster loading
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (resourceType === 'image' && !req.url().includes('unsplash')) {
          // Block non-essential images but allow profile photos
          req.abort();
        } else {
          req.continue();
        }
      });
      
      // Load content with timeout
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for critical elements to load
      await page.waitForSelector('canvas', { timeout: 10000 }).catch(() => {
        console.log('Charts may not have loaded completely');
      });
      
      // Wait for animations and charts to settle
      await page.waitForTimeout(5000);
      
      // Execute any pending JavaScript
      await page.evaluate(() => {
        return new Promise((resolve) => {
          if (window.Chart) {
            // Wait for Chart.js if present
            setTimeout(resolve, 2000);
          } else {
            resolve();
          }
        });
      });
      
      console.log(`Page loaded in ${Date.now() - startTime}ms`);
      
      // Generate PDF with optimal settings
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>', // Empty header
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; color: #666; margin-top: 10px;">
            <span style="margin-right: 20px;">Inner DNA Assessment Report</span>
            <span style="margin-right: 20px;">Type ${typeId}</span>
            <span style="margin-right: 20px;">Generated: ${new Date().toLocaleDateString()}</span>
            <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          </div>
        `,
        margin: {
          top: '0.75in',
          right: '0.5in',
          bottom: '0.75in',
          left: '0.5in'
        },
        timeout: 30000
      });
      
      console.log(`PDF generated in ${Date.now() - startTime}ms`);
      
      // Set response headers
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Inner-DNA-Type${typeId}-Report-${timestamp}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdf.length);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Send PDF
      res.send(pdf);
      
      console.log(`PDF delivered in ${Date.now() - startTime}ms`);
      
    } finally {
      // Always close the page
      await page.close();
    }
    
  } catch (error) {
    console.error('PDF generation error:', error);
    
    res.status(500).json({ 
      error: 'Failed to generate PDF report',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// PDF preview route (view in browser)
app.get('/api/preview-report/:typeId', async (req, res) => {
  try {
    const typeId = parseInt(req.params.typeId);
    
    if (typeId < 1 || typeId > 9) {
      return res.status(400).json({ error: 'Invalid type ID' });
    }

    const htmlContent = await generateCompleteStyledReport(typeId);
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    try {
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(3000);
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
      });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline'); // View in browser
      res.send(pdf);
      
    } finally {
      await page.close();
    }
    
  } catch (error) {
    console.error('PDF preview error:', error);
    res.status(500).json({ error: 'Failed to generate PDF preview' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

// Health check for PDF service
app.get('/api/pdf-health', async (req, res) => {
  try {
    const browser = await getBrowser();
    const isHealthy = browser && browser.isConnected();
    
    res.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      browserConnected: isHealthy
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Add download button to your HTML template
export const addPDFDownloadButton = (typeId) => `
<div class="text-center mt-12 mb-8">
  <div class="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
    <h3 class="text-2xl font-bold mb-4 text-yellow-400">Save Your Report</h3>
    <p class="text-lg mb-6">Download your complete assessment report as a professional PDF</p>
    
    <div class="space-y-4">
      <button onclick="downloadPDF(${typeId})" 
              class="btn-primary text-black font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-all duration-300 w-full">
        <i class="fas fa-download mr-2"></i>
        Download PDF Report
        <i class="fas fa-file-pdf ml-2"></i>
      </button>
      
      <button onclick="previewPDF(${typeId})" 
              class="btn-secondary text-white font-bold py-3 px-6 rounded-full text-lg hover:scale-105 transition-all duration-300">
        <i class="fas fa-eye mr-2"></i>
        Preview PDF
      </button>
    </div>
  </div>
</div>

<script>
function downloadPDF(typeId) {
  const button = event.target;
  const originalHTML = button.innerHTML;
  
  button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating PDF...';
  button.disabled = true;
  
  // Open download in new window
  const downloadWindow = window.open('/api/download-report/' + typeId, '_blank');
  
  // Reset button after delay
  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.disabled = false;
  }, 3000);
}

function previewPDF(typeId) {
  window.open('/api/preview-report/' + typeId, '_blank');
}
</script>
`;
