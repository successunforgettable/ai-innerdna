import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CRITICAL: Register static report routes FIRST before any middleware
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

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
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
