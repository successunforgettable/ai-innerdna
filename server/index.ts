import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { WebSocketServer } from "ws";
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

// Store connected WebSocket clients
const clients = new Set<any>();

// Function to broadcast notifications to all clients
function broadcastNotification(notification: any) {
  const message = JSON.stringify({
    type: 'new_notification',
    data: notification
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  console.log(`📢 Broadcasted notification to ${clients.size} clients`);
}

// Make broadcast function available globally
(global as any).broadcastNotification = broadcastNotification;

(async () => {
  const server = await registerRoutes(app);
  
  // Create separate WebSocket server to avoid Vite HMR conflicts
  const wsServer = createServer();
  const wss = new WebSocketServer({ server: wsServer });

  // WebSocket connection handling
  wss.on('connection', (ws: any) => {
    console.log('🔗 New WebSocket client connected');
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'WebSocket connected successfully'
    }));

    // Handle client disconnect
    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
      clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error: any) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Start WebSocket server on separate port
  const wsPort = 3001;
  wsServer.listen(wsPort, () => {
    console.log(`🔗 WebSocket server listening on port ${wsPort}`);
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

      // Broadcast to all connected WebSocket clients
      if ((global as any).broadcastNotification) {
        (global as any).broadcastNotification(newNotification);
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
      connectedClients: clients.size,
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
