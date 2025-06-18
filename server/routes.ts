import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, type AssessmentData } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, generateResetToken } from "./auth";
import { sendPasswordRecoveryEmail } from "./emailService";
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
      const passwordHash = await hashPassword(password);
      
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
      const isValidPassword = await verifyPassword(password, user.passwordHash || '');
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

  // Get user reports by email (for login access)
  app.post("/api/auth/get-reports", async (req, res) => {
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
      const isValidPassword = await verifyPassword(password, user.passwordHash || '');
      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Return user with assessment data
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          completedAt: user.completedAt,
          assessmentData: user.assessmentData
        },
        message: "Reports retrieved successfully"
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to retrieve reports" });
    }
  });

  // Password recovery endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // For security, don't reveal if email exists or not
        return res.json({ message: "If this email is registered, you will receive a password recovery email shortly." });
      }

      // Since we're storing hashed passwords, we need to send the original password
      // In a real system, you'd generate a temporary reset token instead
      // For this implementation, we'll inform user to contact support since we can't recover hashed passwords
      const emailSent = await sendPasswordRecoveryEmail(email, "Please contact support for password assistance");
      
      if (emailSent) {
        res.json({ message: "Password recovery email sent successfully." });
      } else {
        res.status(500).json({ error: "Failed to send recovery email. Please try again later." });
      }
    } catch (error: any) {
      console.error("Password recovery error:", error);
      res.status(500).json({ error: "Failed to process password recovery request" });
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
      
      // Validate required fields for assessment completion
      if (updates.assessmentData && updates.completedAt) {
        const updateData = {
          assessmentData: updates.assessmentData,
          completedAt: new Date(updates.completedAt)
        };
        
        const user = await storage.updateUser(id, updateData);
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }
        
        res.json(user);
      } else {
        res.status(400).json({ error: "Missing assessment data or completion date" });
      }
    } catch (error) {
      console.error('Update user error:', error);
      res.status(400).json({ error: "Failed to update user assessment" });
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

  // Get all assessments for analytics dashboard
  app.get("/api/assessments/all", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Filter users who have completed assessments
      const completedAssessments = users
        .filter(user => user.completedAt && user.assessmentData)
        .map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          completedAt: user.completedAt,
          assessmentData: user.assessmentData
        }));
      
      res.json(completedAssessments);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
