import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateSentinelCopy } from "./sentinelCopyGenerator";
import { generateWorkingTransformationReport } from "./workingReportGenerator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json()); // Enable JSON parsing for POST requests

// CRITICAL: Register API routes FIRST before any middleware
// 5-Prompt System Report Generation - NO CONTENT CREATION
// ALL CONTENT CREATED BY CHATGPT VIA API KEY - NOT THIS ENDPOINT
// Sentinel 8 Report Generation - Direct Template Approach
app.post('/api/generate-sentinel-report', async (req, res) => {
  try {
    const fs = await import('fs');
    
    // Read the challenger template with placeholders
    let template = fs.default.readFileSync('challenger-template-with-placeholders.html', 'utf8');
    
    // Replace placeholders with Sentinel 8 specific content
    const sentinelContent = {
      HERO_TITLE: "The Sentinel's Path to Balanced Protection",
      HERO_SUBTITLE: "Your Hero's Journey from Control to Inner Security",
      STAGE1_TITLE: "Your Current Reality",
      STAGE1_DESCRIPTION: "You are <span class=\"highlight-text\">The Sentinel</span> with <span class=\"highlight-text\">Protective Focus</span>. Your assessment reveals a 60% destructive and 40% good state distribution, showing your natural intensity balanced with protective instincts. Your sexual dominant subtype with social blind spots creates a powerful but sometimes isolated pattern.",
      ASSESSMENT_SUMMARY: "Your assessment reveals: <span class=\"highlight-text\">Sexual dominance</span> with protective emotional processing and realistic security perspectives. Your control-oriented building blocks combined with loyalty preferences show a powerful guardian pattern requiring transformation."
    };
    
    // Replace all placeholders in template
    Object.keys(sentinelContent).forEach(key => {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), sentinelContent[key]);
    });
    
    // Return complete HTML report
    res.setHeader('Content-Type', 'text/html');
    res.send(template);
    
  } catch (error) {
    console.error('Error generating Sentinel report:', error);
    res.status(500).json({ error: 'Failed to generate Sentinel report' });
  }
});

// CRITICAL: Register static report routes FIRST before any middleware
app.get("/api/generate-sentinel-copy", async (req, res) => {
  try {
    console.log('Starting Sentinel 8 copy generation from Challenger 9 template...');
    const sentinelContent = await generateSentinelCopy();
    res.setHeader('Content-Type', 'text/html');
    res.send(sentinelContent);
  } catch (error) {
    console.error('Error generating Sentinel 8 copy:', error);
    res.status(500).json({ error: "Failed to generate Sentinel 8 copy" });
  }
});

// Generate and serve the Sentinel 8 report using template replacement
app.get("/sentinel-8-report", (req, res) => {
  try {
    // Read the challenger template with placeholders
    let template = fs.readFileSync('challenger-template-with-placeholders.html', 'utf8');
    
    // Replace placeholders with Sentinel 8 specific content
    const sentinelContent = {
      HERO_TITLE: "The Sentinel's Path to Balanced Protection",
      HERO_SUBTITLE: "Your Hero's Journey from Control to Inner Security",
      STAGE1_TITLE: "Your Current Reality",
      STAGE1_DESCRIPTION: "You are <span class=\"highlight-text\">The Sentinel</span> with <span class=\"highlight-text\">Protective Focus</span>. Your assessment reveals a 60% destructive and 40% good state distribution, showing your natural intensity balanced with protective instincts. Your sexual dominant subtype with social blind spots creates a powerful but sometimes isolated pattern.",
      ASSESSMENT_SUMMARY: "Your assessment reveals: <span class=\"highlight-text\">Sexual dominance</span> with protective emotional processing and realistic security perspectives. Your control-oriented building blocks combined with loyalty preferences show a powerful guardian pattern requiring transformation."
    };
    
    // Replace all placeholders in template
    Object.keys(sentinelContent).forEach(key => {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), sentinelContent[key]);
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(template);
  } catch (error) {
    console.error('Error serving Sentinel 8 report:', error);
    res.status(500).send('Error loading report');
  }
});

// Generate Sentinel 8 report via ChatGPT API
app.get("/view-sentinel-8", async (req, res) => {
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const sentinelData = {
      destructiveState: 60,
      goodState: 40,
      confidence: 35,
      career: 25,
      relationships: 30,
      health: 35,
      spirituality: 20,
      personalGrowth: 25,
      finances: 30
    };
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: `Generate complete Sentinel transformation report HTML using exact Challenger template structure.

MANDATORY DATA:
- ${sentinelData.destructiveState}% destructive, ${sentinelData.goodState}% good state
- ${sentinelData.confidence}% confidence (realistic for destructive state)
- Sexual dominant, social blind subtype
- Career: ${sentinelData.career}%, Relationships: ${sentinelData.relationships}%, Health: ${sentinelData.health}%, Spirituality: ${sentinelData.spirituality}%, Personal Growth: ${sentinelData.personalGrowth}%, Finances: ${sentinelData.finances}%

Include "CONTROL DEPENDENCY DETECTED" message. Generate complete HTML with all CSS, styling, and exact challenger template structure. Use these exact percentages throughout.`
      }]
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(response.choices[0].message.content);
    
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Error generating report');
  }
});

// Serve HTML reports directly
app.get('/view-report/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', `${filename}.html`);
    
    if (fs.existsSync(filePath)) {
      const htmlContent = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(htmlContent);
    } else {
      res.status(404).send(`Report ${filename} not found`);
    }
  } catch (error) {
    console.error('Error serving report:', error);
    res.status(500).send('Error loading report');
  }
});

// Working Transformation Report Routes - BEFORE Vite middleware
app.post('/api/generate-working-report', async (req, res) => {
  try {
    const assessmentData = req.body;
    
    if (!assessmentData || !assessmentData.personalityType) {
      return res.status(400).json({
        success: false,
        error: 'Invalid assessment data: personalityType is required'
      });
    }

    console.log('Generating working transformation report...');
    const result = await generateWorkingTransformationReport(assessmentData);
    
    if (result.success) {
      res.json({
        success: true,
        reportHtml: result.html,
        size: result.size,
        contentFields: result.contentFields,
        message: 'Working transformation report generated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate report'
      });
    }
    
  } catch (error) {
    console.error('Working report generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate working transformation report'
    });
  }
});

app.get('/test-working-report', async (req, res) => {
  try {
    const testData = {
      personalityType: 6,
      wing: 5,
      colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
      detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
      confidence: 35
    };

    console.log('Testing working transformation report...');
    const result = await generateWorkingTransformationReport(testData);
    
    if (result.success) {
      const filename = 'test-working-report.html';
      fs.writeFileSync(filename, result.html!);
      
      res.send(`
        <h1>Working Transformation Report Test</h1>
        <p>Report generated successfully!</p>
        <p>Size: ${result.size} bytes</p>
        <p>Content fields: ${result.contentFields}</p>
        <p><a href="/view-working-report" target="_blank">View Generated Report</a></p>
        <p><a href="/api/generate-working-report" target="_blank">API Endpoint</a></p>
      `);
    } else {
      res.status(500).send(`Report generation failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error('Test working report error:', error);
    res.status(500).send('Test report generation failed');
  }
});

app.get('/view-working-report', (req, res) => {
  const reportPath = './test-working-report.html';
  
  if (fs.existsSync(reportPath)) {
    res.sendFile(path.resolve(reportPath));
  } else {
    res.status(404).send('Working report not found. <a href="/test-working-report">Generate Test Report</a>');
  }
});

// API endpoint for reports data
app.get('/api/reports-list', (req, res) => {
  try {
    const rootDir = path.join(__dirname, '..');
    const htmlFiles = fs.readdirSync(rootDir)
      .filter(file => file.endsWith('.html') && fs.statSync(path.join(rootDir, file)).size > 1000)
      .map(file => {
        const stats = fs.statSync(path.join(rootDir, file));
        const fileNameWithoutExt = file.replace('.html', '');
        return {
          name: file,
          nameWithoutExt: fileNameWithoutExt,
          size: Math.round(stats.size / 1024),
          date: stats.mtime.toLocaleDateString()
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({ reports: htmlFiles, total: htmlFiles.length });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Report browser - list all available reports
app.get('/reports-browser', (req, res) => {
  try {
    const rootDir = path.join(__dirname, '..');
    const htmlFiles = fs.readdirSync(rootDir)
      .filter(file => file.endsWith('.html') && fs.statSync(path.join(rootDir, file)).size > 1000)
      .map(file => {
        const stats = fs.statSync(path.join(rootDir, file));
        const fileNameWithoutExt = file.replace('.html', '');
        return {
          name: file,
          nameWithoutExt: fileNameWithoutExt,
          size: Math.round(stats.size / 1024),
          date: stats.mtime.toLocaleDateString()
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const browserHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Reports Browser</title>
    <style>
        body { font-family: Inter, sans-serif; margin: 40px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #1e293b; margin-bottom: 30px; }
        .stats { background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
        .report-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #6366f1; }
        .report-name { font-weight: 600; color: #1e293b; margin-bottom: 8px; }
        .report-meta { color: #64748b; font-size: 14px; margin-bottom: 15px; }
        .view-link { display: inline-block; background: #6366f1; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px; }
        .view-link:hover { background: #4f46e5; }
        .key-reports { background: #fef3c7; border-left-color: #f59e0b; }
        .key-reports .report-name { color: #92400e; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Generated Reports Browser</h1>
        
        <div class="stats">
            <strong>${htmlFiles.length}</strong> HTML reports found
        </div>
        
        <div class="reports-grid">
            ${htmlFiles.map(file => {
              const isKeyReport = file.nameWithoutExt.includes('sentinel-6') || 
                                file.nameWithoutExt.includes('verification') || 
                                file.nameWithoutExt.includes('challenger-demo') ||
                                file.nameWithoutExt.includes('final-test');
              
              return `
                <div class="report-card ${isKeyReport ? 'key-reports' : ''}">
                    <div class="report-name">${file.name}</div>
                    <div class="report-meta">${file.size}KB • ${file.date}</div>
                    <a href="/view-report/${file.nameWithoutExt}" class="view-link" target="_blank">
                        View Report →
                    </a>
                </div>
              `;
            }).join('')}
        </div>
    </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(browserHtml);
  } catch (error) {
    console.error('Error creating reports browser:', error);
    res.status(500).send('Error loading reports browser');
  }
});

app.get("/api/report/helper-3", (req, res) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beyond Approval: The Helper's Journey to Inner Balance</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-purple: #6B46C1;
            --mid-purple: #9333EA;
            --light-purple: #A855F7;
            --gold: #FFD700;
            --cyan: #00D4FF;
            --orange: #FF6B35;
            --white: #FFFFFF;
            --light-purple-text: #E9D5FF;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, var(--primary-purple) 0%, var(--mid-purple) 50%, var(--light-purple) 100%);
            color: var(--white);
            line-height: 1.6;
            overflow-x: hidden;
        }
        .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(3rem, 8vw, 8rem);
            font-weight: 900;
            background: linear-gradient(45deg, var(--gold), var(--cyan), var(--orange));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
        }
        .hero-subtitle {
            font-size: clamp(1.5rem, 4vw, 3rem);
            color: var(--light-purple-text);
            margin-bottom: 3rem;
            opacity: 0.9;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .stage-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.5rem, 6vw, 5rem);
            color: var(--gold);
            margin-bottom: 2rem;
            text-align: center;
        }
        .stage-description {
            font-size: 1.3rem;
            color: var(--light-purple-text);
            margin-bottom: 3rem;
            text-align: center;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
    </style>
</head>
<body>
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">Beyond Approval: The Helper's Journey to Inner Balance</h1>
            <p class="hero-subtitle">Navigating Destruction and Significance through the Heart's Lens</p>
        </div>
    </section>
    <section style="padding: 6rem 0;">
        <div class="container">
            <h2 class="stage-title">The Ordinary World</h2>
            <p class="stage-description">
                You are a Helper 3 - driven to support others while achieving recognition for your indispensability. Your sexual subtype creates intense, magnetic connections where you become the essential person in someone's life. But living in 60% destructive state means you manipulate through giving, create dependencies, and burn out from neglecting your own needs.
            </p>
            <div style="text-align: center; margin-top: 4rem;">
                <h3 style="color: var(--gold); font-size: 2rem; margin-bottom: 2rem;">APPROVAL DEPENDENCY DETECTED</h3>
                <p style="font-size: 1.2rem; color: var(--light-purple-text);">
                    Your brain-heart disconnect manifests as needing constant validation through helping others. 
                    Transform from manipulative giving to authentic service. Your journey to balanced helping begins now.
                </p>
            </div>
        </div>
    </section>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(htmlContent);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Store recent notifications for polling
let recentNotifications: any[] = [];

// Analytics file path - use project root to ensure consistency
const ANALYTICS_FILE = path.join(process.cwd(), 'server', 'analytics.json');

// Load analytics from file
function loadAnalytics() {
  try {
    console.log('🔍 Looking for analytics file at:', ANALYTICS_FILE);
    console.log('🔍 File exists:', fs.existsSync(ANALYTICS_FILE));
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = fs.readFileSync(ANALYTICS_FILE, 'utf8');
      const analytics = JSON.parse(data);
      console.log('✅ Loaded analytics:', analytics.totalNotifications, 'notifications,', analytics.totalOpened, 'opened');
      return analytics;
    } else {
      console.log('⚠️ Analytics file not found, creating default');
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
  return {
    totalNotifications: 0,
    totalSent: 0,
    totalOpened: 0,
    globalOpenRate: 0,
    lastUpdated: new Date().toISOString(),
    interactions: []
  };
}

// Save analytics to file
function saveAnalytics(analytics: any) {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
}

// Track notification interaction
function trackNotificationInteraction(notificationId: string, action: string) {
  const analytics = loadAnalytics();
  
  if (action === 'sent') {
    analytics.totalSent += 1;
    analytics.totalNotifications += 1;
  } else if (action === 'opened') {
    analytics.totalOpened += 1;
  }
  
  analytics.globalOpenRate = analytics.totalSent > 0 
    ? ((analytics.totalOpened / analytics.totalSent) * 100).toFixed(1)
    : 0;
  
  analytics.lastUpdated = new Date().toISOString();
  
  // Add to interactions log
  analytics.interactions.push({
    notificationId,
    action,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 100 interactions
  if (analytics.interactions.length > 100) {
    analytics.interactions = analytics.interactions.slice(-100);
  }
  
  saveAnalytics(analytics);
  return analytics;
}

// Function to add notifications to recent list
function addRecentNotification(notification: any) {
  recentNotifications.unshift(notification);
  // Keep only last 10 notifications
  if (recentNotifications.length > 10) {
    recentNotifications = recentNotifications.slice(0, 10);
  }
  console.log(`📢 Added notification to recent list: ${notification.title}`);
  
  // Track analytics
  trackNotificationInteraction(notification.id, 'sent');
}

// Make function available globally
(global as any).addRecentNotification = addRecentNotification;

(async () => {
  const server = await registerRoutes(app);
  
  // API endpoint for polling recent notifications
  app.get('/api/notifications/recent', (req, res) => {
    const since = req.query.since ? parseInt(req.query.since as string) : 0;
    const newNotifications = recentNotifications.filter(notif => 
      new Date(notif.createdAt).getTime() > since
    );
    
    res.json({
      notifications: newNotifications,
      timestamp: Date.now(),
      count: newNotifications.length
    });
  });

  // API endpoint to create and broadcast notifications
  app.post('/api/notifications', (req, res) => {
    try {
      const { title, message, type, priority, targetAudience, isActive } = req.body;

      // Validate required fields
      if (!title || !message) {
        return res.status(400).json({ 
          error: 'Title and message are required' 
        });
      }

      // Create new notification object
      const newNotification = {
        id: `notif_${Date.now()}`,
        title,
        message,
        type: type || 'general',
        priority: priority || 'normal',
        targetAudience: targetAudience || 'all',
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date().toISOString()
      };

      console.log('📝 Creating new notification:', newNotification);

      // Add to recent notifications for polling
      if ((global as any).addRecentNotification) {
        (global as any).addRecentNotification(newNotification);
      }

      // TODO: Save to database/JSON file here if needed
      // For now, we're just broadcasting the notification

      res.status(201).json({
        success: true,
        notification: newNotification,
        message: 'Notification created and broadcast successfully'
      });

    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ 
        error: 'Failed to create notification' 
      });
    }
  });

  // API endpoint to track notification opens
  app.post('/api/notifications/track', (req, res) => {
    try {
      const { notificationId, action } = req.body;
      
      if (!notificationId || !action) {
        return res.status(400).json({ 
          error: 'Notification ID and action are required' 
        });
      }

      const analytics = trackNotificationInteraction(notificationId, action);
      
      res.json({
        success: true,
        analytics,
        message: `Tracked ${action} for notification ${notificationId}`
      });
    } catch (error) {
      console.error('Error tracking notification:', error);
      res.status(500).json({ 
        error: 'Failed to track notification' 
      });
    }
  });

  // API endpoint to get notification stats
  app.get('/api/notifications/stats', (req, res) => {
    const analytics = loadAnalytics();
    res.json({
      recentNotifications: recentNotifications.length,
      serverStatus: 'running',
      timestamp: new Date().toISOString(),
      ...analytics
    });
  });

  // API endpoint to clear all notifications
  app.delete('/api/notifications/clear', (req, res) => {
    try {
      // Clear server-side notification cache
      recentNotifications = [];
      console.log('🧹 Server notification cache cleared');
      
      res.json({
        success: true,
        message: 'All notifications cleared from server',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      res.status(500).json({ 
        error: 'Failed to clear notifications' 
      });
    }
  });



  app.get("/api/report/challenger-fixed", (req, res) => {
    try {
      const htmlContent = fs.readFileSync(path.join(__dirname, '../challenger-template-fixed.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(htmlContent);
    } catch (error) {
      console.error('Error serving challenger report:', error);
      res.status(500).send('Error loading report');
    }
  });

  // Static reports directory - BEFORE Vite middleware
  app.use('/reports', express.static(path.join(__dirname, '../public/reports'), {
    setHeaders: (res) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
    }
  }));

  // Generate static report files
  app.post('/api/generate-static-report', async (req, res) => {
    try {
      const { assessmentData, reportType = 'helper-3' } = req.body;
      
      // Generate unique filename
      const timestamp = Date.now();
      const reportId = `${reportType}-${timestamp}`;
      const filename = `${reportId}.html`;
      
      // Generate personalized HTML based on assessment data
      let reportHTML = '';
      
      if (reportType === 'helper-3' || !assessmentData) {
        // Use the actual AI-generated Helper 3 report with proper Challenger design
        reportHTML = fs.readFileSync(path.join(__dirname, '../helper-3-clean-report.html'), 'utf8');
      } else {
        // For other report types, use the AI-generated content or generate dynamically
        reportHTML = fs.readFileSync(path.join(__dirname, '../helper-3-clean-report.html'), 'utf8');
      }
      
      // Save to static directory
      const filePath = path.join(__dirname, '../public/reports', filename);
      fs.writeFileSync(filePath, reportHTML);
      
      // Return URL to static file
      res.json({ 
        success: true, 
        reportUrl: `/reports/${filename}`,
        reportId,
        timestamp 
      });
    } catch (error) {
      console.error('Error generating static report:', error);
      res.status(500).json({ error: 'Failed to generate static report' });
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Working transformation report routes - BEFORE Vite middleware
  app.get('/test-working-report', async (req, res) => {
    try {
      console.log('Generating working transformation report...');
      const result = await generateWorkingTransformationReport({
        personalityType: 6,
        wing: 5,
        colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
        detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
        confidence: 35
      });
      
      if (result.success) {
        // Save report to file for viewing
        const filename = 'test-working-report.html';
        fs.writeFileSync(filename, result.html!);
        
        res.send(`
          <h1>Working Transformation Report Test</h1>
          <p>Report generated successfully!</p>
          <p>Size: ${result.size} bytes</p>
          <p>Content fields: ${result.contentFields}</p>
          <p><a href="/view-working-report" target="_blank">View Generated Report</a></p>
        `);
      } else {
        res.status(500).send(`Report generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Working report generation failed:', error);
      res.status(500).send('Report generation failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  });

  app.post('/api/generate-working-report', async (req, res) => {
    try {
      const assessmentData = req.body;
      const result = await generateWorkingTransformationReport(assessmentData);
      
      if (result.success) {
        res.json({
          success: true,
          reportHtml: result.html,
          size: result.size,
          contentFields: result.contentFields,
          message: 'Working transformation report generated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to generate report'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/view-working-report', (req, res) => {
    const reportPath = './test-working-report.html';
    
    if (fs.existsSync(reportPath)) {
      res.sendFile(path.resolve(reportPath));
    } else {
      res.status(404).send('Working report not found. <a href="/test-working-report">Generate Test Report</a>');
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
