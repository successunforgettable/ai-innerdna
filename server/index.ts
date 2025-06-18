import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();
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

// Function to add notifications to recent list
function addRecentNotification(notification: any) {
  recentNotifications.unshift(notification);
  // Keep only last 10 notifications
  if (recentNotifications.length > 10) {
    recentNotifications = recentNotifications.slice(0, 10);
  }
  console.log(`📢 Added notification to recent list: ${notification.title}`);
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

  // API endpoint to get notification stats
  app.get('/api/notifications/stats', (req, res) => {
    res.json({
      recentNotifications: recentNotifications.length,
      serverStatus: 'running',
      timestamp: new Date().toISOString()
    });
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
