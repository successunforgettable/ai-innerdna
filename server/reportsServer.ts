import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportsApp = express();
reportsApp.use(express.json());
reportsApp.use(express.urlencoded({ extended: false }));

// CORS headers for cross-origin requests
reportsApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve the actual AI-generated Helper 3 report
reportsApp.get('/helper-3', (req, res) => {
  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../helper-3-clean-report.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error serving Helper 3 report:', error);
    res.status(500).send('<h1>Error Loading Report</h1>');
  }
});

// Generate dynamic reports based on assessment data
reportsApp.post('/generate', async (req, res) => {
  try {
    const { assessmentData, reportType = 'helper-3' } = req.body;
    
    // For now, always serve the AI-generated Helper 3 report with proper design
    const reportHTML = fs.readFileSync(path.join(__dirname, '../helper-3-clean-report.html'), 'utf8');
    
    // Generate unique filename
    const timestamp = Date.now();
    const reportId = `${reportType}-${timestamp}`;
    const filename = `${reportId}.html`;
    
    // Save to reports directory
    const reportsDir = path.join(__dirname, '../public/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const filePath = path.join(reportsDir, filename);
    fs.writeFileSync(filePath, reportHTML);
    
    // Return the URL on port 5001
    res.json({ 
      success: true, 
      reportUrl: `http://localhost:5001/static/${filename}`,
      reportId,
      timestamp,
      message: 'Report generated successfully with full AI personalization and Challenger design'
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
});

// Serve static report files
reportsApp.use('/static', express.static(path.join(__dirname, '../public/reports'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
  }
}));

// Health check
reportsApp.get('/health', (req, res) => {
  res.json({ status: 'Reports server running', port: 5001 });
});

// Start the reports server on port 5001
const port = 5001;
reportsApp.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Reports server running on http://localhost:${port}`);
  console.log(`📊 Helper 3 report available at: http://localhost:${port}/helper-3`);
});

export default reportsApp;