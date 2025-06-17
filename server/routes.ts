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

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      // Hash password
      const passwordHash = await authService.hashPassword(password);
      
      // Create user directly without email verification for development
      const newUser = await storage.createUser({
        email,
        firstName,
        lastName,
        phoneNumber,
        passwordHash,
        emailVerified: new Date(), // Skip verification for development
        phoneVerified: null,
        verificationCode: null,
        resetToken: null,
        resetTokenExpiry: null,
        startedAt: new Date(),
        completedAt: null,
        assessmentData: null
      });

      res.json({
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phoneNumber: newUser.phoneNumber,
          emailVerified: newUser.emailVerified
        },
        requiresVerification: false,
        message: "Registration successful!"
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await authService.verifyPassword(password, user.passwordHash || '');
      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          emailVerified: user.emailVerified
        },
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
