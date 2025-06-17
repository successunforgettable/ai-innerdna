import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, type AssessmentData } from "@shared/schema";
import { authService } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, firstName, lastName, phoneNumber, password } = req.body;
      
      if (!email || !firstName || !lastName || !phoneNumber || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const result = await authService.register({
        email,
        firstName,
        lastName,
        phoneNumber,
        password
      });

      res.json({
        user: result.user,
        requiresVerification: result.requiresVerification,
        message: "Registration successful. Please check your email for verification code."
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const result = await authService.login(email, password);
      
      res.json({
        user: result.user,
        token: result.token,
        message: "Login successful"
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Login failed" });
    }
  });

  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ error: "Email and verification code are required" });
      }

      const verified = await authService.verifyEmail(email, code);
      
      if (verified) {
        res.json({ message: "Email verified successfully" });
      } else {
        res.status(400).json({ error: "Invalid verification code" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Verification failed" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      await authService.requestPasswordReset(email);
      res.json({ message: "If the email exists, a reset link has been sent" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Password reset request failed" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }

      const reset = await authService.resetPassword(token, newPassword);
      
      if (reset) {
        res.json({ message: "Password reset successful" });
      } else {
        res.status(400).json({ error: "Invalid or expired reset token" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Password reset failed" });
    }
  });

  // Create user endpoint (legacy - for assessment without authentication)
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        ...req.body,
        startedAt: new Date()
      });
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Update user assessment data
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  // Get all users (for data analysis)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
