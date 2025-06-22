import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { insertUserSchema, type AssessmentData } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, generateResetToken } from "./auth";

import { sendPasswordRecoveryEmail } from "./emailService";
import { generatePersonalizedReport, generateQuickInsight } from "./aiReportService";
import { generateCustomReport, generateCustomReportHTML } from "./customReportGenerator_clean";
import { generateSentinelCopy } from "./sentinelCopyGenerator";
import { generateSentinel8Content } from "./sentinelReportGenerator";
import { generateWorkingReport } from "./workingReportGenerator";
import { z } from "zod";
import fs from "fs";

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

      // Generate a new temporary password automatically
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + "!";
      
      // Hash the new password using existing auth function
      const newPasswordHash = await hashPassword(tempPassword);
      
      // Use the current Replit domain directly
      const loginUrl = `https://6dd548b7-3d3e-4c18-8bb5-95e660a6693d-00-2gtlnmuy5su03.riker.replit.dev/login`;
      
      // Update user's password in database
      const updatedUser = await storage.updateUserPassword(user.id, newPasswordHash);
      
      console.log(`Temporary password generated for ${email}: ${tempPassword}`);
      console.log(`Login URL generated: ${loginUrl}`);
      console.log(`Password hash updated for user ID ${user.id}:`, updatedUser ? 'Success' : 'Failed');

      const resetPasswordUrl = `https://6dd548b7-3d3e-4c18-8bb5-95e660a6693d-00-2gtlnmuy5su03.riker.replit.dev/reset-password?email=${encodeURIComponent(email)}`;
      
      const recoveryMessage = `Password Reset - Inner DNA Assessment

Your password has been automatically reset for security.

New Temporary Password: ${tempPassword}

Choose one of these options:

OPTION 1 - Set Permanent Password (Recommended):
${resetPasswordUrl}

OPTION 2 - Login with Temporary Password:
${loginUrl}

This temporary password will work for 7 days. For security, set a permanent password as soon as possible.

If you didn't request this reset, contact support@innerdna.com immediately.`;
      
      // Send email with new password
      await sendPasswordRecoveryEmail(email, recoveryMessage);
      
      res.json({ 
        message: `New temporary password sent to your email. Please check your inbox and log in with the new password.`,
        tempPassword: tempPassword, // Also provide in response for immediate use
        loginUrl: "/login"
      });
    } catch (error: any) {
      console.error("Password recovery error:", error);
      res.status(500).json({ error: "Failed to process password recovery request" });
    }
  });

  // Reset password endpoint (change temporary to permanent)
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;
      
      console.log('Reset password request received:', {
        email,
        hasCurrentPassword: !!currentPassword,
        hasNewPassword: !!newPassword,
        currentPasswordLength: currentPassword?.length
      });
      
      if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: "Email, current password, and new password are required" });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('User not found for email:', email);
        return res.status(400).json({ error: "Invalid email or password" });
      }

      console.log('User found:', {
        userId: user.id,
        email: user.email,
        hasPasswordHash: !!user.passwordHash,
        passwordHashLength: user.passwordHash?.length
      });

      // Verify current password
      console.log('Verifying password for user:', email);
      const isValidPassword = await verifyPassword(currentPassword, user.passwordHash || '');
      console.log('Password verification result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('Password verification failed for user:', email);
        return res.status(400).json({ error: "Invalid current password" });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long" });
      }

      if (newPassword === currentPassword) {
        return res.status(400).json({ error: "New password must be different from current password" });
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);
      
      // Update user's password in database
      const updatedUser = await storage.updateUserPassword(user.id, newPasswordHash);
      
      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update password" });
      }

      console.log(`Password successfully updated for user: ${email}`);
      
      res.json({
        message: "Password updated successfully. You can now log in with your new password."
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      res.status(500).json({ error: "Failed to reset password" });
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

  // AI Report Generation Routes
  app.post("/api/generate-ai-report", async (req, res) => {
    try {
      const { assessmentData } = req.body;
      
      if (!assessmentData || !assessmentData.primaryType) {
        return res.status(400).json({ error: "Assessment data with primary type is required" });
      }

      const aiReport = await generatePersonalizedReport(assessmentData);
      res.json(aiReport);
    } catch (error) {
      console.error('Error generating AI report:', error);
      res.status(500).json({ error: "Failed to generate AI report" });
    }
  });

  app.post("/api/generate-quick-insight", async (req, res) => {
    try {
      const { assessmentData } = req.body;
      
      if (!assessmentData || !assessmentData.primaryType) {
        return res.status(400).json({ error: "Assessment data with primary type is required" });
      }

      const insight = await generateQuickInsight(assessmentData);
      res.json({ insight });
    } catch (error) {
      console.error('Error generating quick insight:', error);
      res.status(500).json({ error: "Failed to generate insight" });
    }
  });

  // Custom Hero's Journey Report endpoints
  app.post("/api/generate-custom-report", async (req, res) => {
    try {
      const { assessmentData } = req.body;
      
      if (!assessmentData || !assessmentData.primaryType) {
        return res.status(400).json({ error: "Assessment data with primary type is required" });
      }

      // Use clean custom report generator
      const reportData = await generateCustomReport(assessmentData);
      const htmlReport = generateCustomReportHTML(reportData);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlReport);
    } catch (error) {
      console.error('Error generating custom report:', error);
      res.status(500).json({ error: "Failed to generate custom report" });
    }
  });

  // Preview route for the Reformer test report with exact challenger design
  app.get("/preview-reformer", async (req, res) => {
    try {
      const reformerAssessmentData = {
        primaryType: "1",
        confidence: 88,
        wing: "9",
        foundationStones: [
          {
            setIndex: 0,
            stoneIndex: 2,
            context: "When making decisions,",
            statements: ["I consider what is right", "I focus on improvement", "I aim for perfection"]
          }
        ],
        buildingBlocks: [
          {
            name: "Principled Reformer",
            wing: "9"
          }
        ],
        colorStates: [
          {
            state: "Order",
            percentage: 70
          },
          {
            state: "Peace", 
            percentage: 30
          }
        ],
        detailTokens: {
          social: 4,
          selfPreservation: 4,
          sexual: 2
        }
      };

      // Generate AI-powered content for The Reformer
      const reportData = await generateCustomReport(reformerAssessmentData);
      
      // Use the exact challenger template structure with AI content
      const htmlReport = generateCustomReportHTML(reportData);
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlReport);
    } catch (error) {
      console.error('Error generating preview report:', error);
      res.status(500).send('Error generating preview report');
    }
  });

  // Fixed challenger template route
  app.get("/challenger-fixed", (req, res) => {
    res.sendFile(path.join(__dirname, '../challenger-template-fixed.html'));
  });

  // Serve the Helper 3 personalized report as static file
  app.get("/helper-3-report", (req, res) => {
    res.sendFile(path.join(__dirname, '../helper-3-clean-report.html'));
  });

  // Serve the 100% coverage Sentinel 6 report
  app.get("/view-sentinel-6", (req, res) => {
    const reportPath = path.join(process.cwd(), 'sentinel-6-working.html');
    if (fs.existsSync(reportPath)) {
      res.sendFile(reportPath);
    } else {
      res.status(404).send('Report not found');
    }
  });

  // ChatGPT content injection endpoint
  app.post("/api/inject-report-content", async (req, res) => {
    try {
      const { contentData } = req.body;
      
      if (!contentData) {
        return res.status(400).json({ error: "Content data is required" });
      }

      // Read the placeholder template
      const fs = require('fs');
      const templatePath = path.join(__dirname, '../challenger-template-with-placeholders.html');
      let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

      // Replace all placeholders with content from ChatGPT
      for (const [placeholder, content] of Object.entries(contentData)) {
        const placeholderPattern = new RegExp(`{{${placeholder}}}`, 'g');
        htmlTemplate = htmlTemplate.replace(placeholderPattern, content);
      }

      res.setHeader('Content-Type', 'text/html');
      res.send(htmlTemplate);
    } catch (error) {
      console.error('Error injecting content:', error);
      res.status(500).json({ error: "Failed to inject content into template" });
    }
  });

  // Generate Sentinel 8 report automatically
  app.get("/sentinel-8-report", async (req, res) => {
    try {
      // Generate content using OpenAI for your specific profile
      const profile = {
        destructivePercentage: 60,
        goodPercentage: 40,
        dominantSubtype: 'sexual' as const,
        blindSubtype: 'social' as const
      };

      const contentData = await generateSentinel8Content(profile);
      
      // Read the placeholder template
      const fs = require('fs');
      const templatePath = path.join(__dirname, '../challenger-template-with-placeholders.html');
      let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

      // Replace all placeholders with generated content
      for (const [placeholder, content] of Object.entries(contentData)) {
        const placeholderPattern = new RegExp(`{{${placeholder}}}`, 'g');
        htmlTemplate = htmlTemplate.replace(placeholderPattern, content);
      }

      res.setHeader('Content-Type', 'text/html');
      res.send(htmlTemplate);
    } catch (error) {
      console.error('Error generating Sentinel 8 report:', error);
      res.status(500).send('Error generating Sentinel 8 report');
    }
  });



  // AI-generated personalized report route - Perfectionist 9 example
  app.get("/ai-reformer-report", async (req, res) => {
    try {
      const reformerAssessmentData = {
        primaryType: "1",
        confidence: 88,
        wing: "9",
        foundationStones: [
          {
            setIndex: 0,
            stoneIndex: 2,
            context: "When making decisions,",
            statements: ["I consider what is right", "I focus on improvement", "I aim for perfection"]
          }
        ],
        buildingBlocks: [
          {
            name: "Principled Reformer",
            wing: "9"
          }
        ],
        colorStates: [
          {
            state: "Order",
            percentage: 70
          },
          {
            state: "Peace", 
            percentage: 30
          }
        ],
        detailTokens: {
          social: 4,
          selfPreservation: 4,
          sexual: 2
        }
      };

      console.log('Generating AI-powered personalized report for Perfectionist 9...');
      const reportData = await generateCustomReport(reformerAssessmentData);
      const htmlReport = generateCustomReportHTML(reportData);
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlReport);
    } catch (error) {
      console.error('Error generating AI report:', error);
      res.status(500).send('Error generating AI-powered report');
    }
  });

  // AI-generated personalized report route - Helper 3 example (40% good, 60% destructive, sexual dominant)
  app.get("/ai-helper-report", async (req, res) => {
    try {
      const helperAssessmentData = {
        primaryType: "2",
        confidence: 85,
        wing: "3",
        foundationStones: [
          {
            setIndex: 1,
            stoneIndex: 0,
            context: "When helping others,",
            statements: ["I give my all", "I anticipate their needs", "I make myself indispensable"]
          }
        ],
        buildingBlocks: [
          {
            name: "Ambitious Helper",
            wing: "3"
          }
        ],
        colorStates: [
          {
            state: "Destructive",
            percentage: 60
          },
          {
            state: "Good", 
            percentage: 40
          }
        ],
        detailTokens: {
          social: 2,
          selfPreservation: 1,  // Blind spot
          sexual: 7  // Dominant
        }
      };

      console.log('Generating AI-powered personalized report for Helper 3 (60% destructive, sexual dominant)...');
      const reportData = await generateCustomReport(helperAssessmentData);
      const htmlReport = generateCustomReportHTML(reportData);
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlReport);
    } catch (error) {
      console.error('Error generating AI helper report:', error);
      res.status(500).send('Error generating AI-powered helper report');
    }
  });

  // AI-generated personalized report route - Achiever 2 example  
  app.get("/ai-achiever-report", async (req, res) => {
    try {
      const achieverAssessmentData = {
        primaryType: "3",
        confidence: 92,
        wing: "2",
        foundationStones: [
          {
            setIndex: 2,
            stoneIndex: 1,
            context: "When pursuing goals,",
            statements: ["I focus on success", "I adapt to win", "I project confidence"]
          }
        ],
        buildingBlocks: [
          {
            name: "Adaptive Achiever",
            wing: "2"
          }
        ],
        colorStates: [
          {
            state: "Focused",
            percentage: 60
          },
          {
            state: "Intense", 
            percentage: 40
          }
        ],
        detailTokens: {
          social: 5,
          selfPreservation: 2,
          sexual: 3
        }
      };

      console.log('Generating AI-powered personalized report for Achiever 2...');
      const reportData = await generateCustomReport(achieverAssessmentData);
      const htmlReport = generateCustomReportHTML(reportData);
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlReport);
    } catch (error) {
      console.error('Error generating AI achiever report:', error);
      res.status(500).send('Error generating AI-powered achiever report');
    }
  });

  // Generate Sentinel 8 copy from Challenger 9 template
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

  app.post("/api/generate-custom-report-data", async (req, res) => {
    try {
      const { assessmentData } = req.body;
      
      if (!assessmentData || !assessmentData.primaryType) {
        return res.status(400).json({ error: "Assessment data with primary type is required" });
      }

      const reportData = await generateCustomReport(assessmentData);
      res.json(reportData);
    } catch (error) {
      console.error('Error generating custom report data:', error);
      res.status(500).json({ error: "Failed to generate custom report data" });
    }
  });

  // Demo report endpoint
  app.get("/demo-report", async (req, res) => {
    try {
      const sampleData = {
        primaryType: '8',
        confidence: 85,
        wing: '9',
        foundationStones: [
          {
            setIndex: 0,
            stoneIndex: 2,
            context: "When making decisions,",
            statements: ["I trust my gut", "I go with what feels right", "I act on my instincts"]
          }
        ],
        buildingBlocks: [{ name: "Leadership", wing: "9" }],
        colorStates: [
          { state: "Achievement", percentage: 45 },
          { state: "Security", percentage: 55 }
        ],
        detailTokens: [
          { category: "Self-Preservation", token: "4 tokens" }
        ]
      };

      const reportData = await generateCustomReport(sampleData);
      const htmlReport = generateCustomReportHTML(reportData);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlReport);
    } catch (error) {
      console.error('Error generating demo report:', error);
      res.status(500).send('Error generating demo report');
    }
  });

  // Report Generation Endpoint - NO CONTENT CREATION
  // ALL CONTENT CREATED BY CHATGPT VIA API KEY - NOT THIS ENDPOINT
  app.post('/api/generate-report', async (req, res) => {
    try {
      // Import report generation orchestrator
      const { generatePersonalizedReport } = require('../reportGenerator');
      
      // Receive assessment data from request
      const assessmentData = req.body;
      
      console.log('Starting report generation with ChatGPT API...');
      
      // Call orchestrator - ChatGPT creates all content during this process
      const htmlReport = await generatePersonalizedReport(assessmentData);
      
      // Return HTML report (content created by ChatGPT, not this endpoint)
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlReport);
      
    } catch (error) {
      console.error('Error in report generation API:', error);
      res.status(500).json({ error: 'Failed to generate report via ChatGPT API' });
    }
  });

  // Sentinel 8 Report Generation Endpoint
  app.post('/api/generate-sentinel-8', async (req, res) => {
    try {
      const { generateSentinel8Report } = await import('./sentinelReportGenerator');
      
      const assessmentData = {
        personalityType: "Sentinel 8",
        wing: "8",
        stateDistribution: { destructive: 60, good: 40 },
        subtype: { dominant: "self-preservation", blind: "sexual" },
        confidence: 85
      };

      console.log('Starting Sentinel 8 report generation...');
      const reportContent = await generateSentinel8Report(assessmentData);
      
      res.json({
        success: true,
        content: reportContent,
        message: "Sentinel 8 report generated successfully by OpenAI"
      });

    } catch (error) {
      console.error('Error generating Sentinel 8 report:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate Sentinel 8 report",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Three Challenger Report Viewing Routes
  app.get('/view-challenger-7-destructive', (req, res) => {
    try {
      const reportContent = fs.readFileSync('./challenger-7-destructive-sexual.html', 'utf8');
      res.send(reportContent);
    } catch (error) {
      res.status(404).send('Challenger 7 Destructive Sexual report not found');
    }
  });

  app.get('/view-challenger-9-destructive', (req, res) => {
    try {
      const reportContent = fs.readFileSync('./challenger-9-destructive-social.html', 'utf8');
      res.send(reportContent);
    } catch (error) {
      res.status(404).send('Challenger 9 Destructive Social report not found');
    }
  });

  app.get('/view-challenger-7-good', (req, res) => {
    try {
      const reportContent = fs.readFileSync('./challenger-7-good-sexual.html', 'utf8');
      res.send(reportContent);
    } catch (error) {
      res.status(404).send('Challenger 7 Good Sexual report not found');
    }
  });

  // Working Transformation Report Routes
  app.post('/api/generate-working-report', async (req, res) => {
    try {
      const assessmentData = req.body;
      
      // Validate basic assessment data structure
      if (!assessmentData || !assessmentData.personalityType) {
        return res.status(400).json({
          success: false,
          error: 'Invalid assessment data: personalityType is required'
        });
      }

      console.log('Generating working transformation report...');
      const result = await generateWorkingReport(assessmentData);
      
      if (result && fs.existsSync(result)) {
        const html = fs.readFileSync(result, 'utf8');
        res.json({
          success: true,
          reportHtml: html,
          size: html.length,
          contentFields: Object.keys(html.match(/\{\{.*?\}\}/g) || []).length,
          message: 'Working transformation report generated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to generate report'
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

  // Test route for working report generation
  app.get('/test-working-report', async (req, res) => {
    try {
      const testData = {
        personalityType: 6,
        wing: 5,
        colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
        detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
        confidence: 35
      };

      console.log('=== ASSESSMENT DATA INVESTIGATION TEST ===');
      console.log('Test data structure:', JSON.stringify(testData, null, 2));
      console.log('Testing working transformation report...');
      const result = await generateWorkingReport(testData);
      
      if (result && fs.existsSync(result)) {
        const html = fs.readFileSync(result, 'utf8');
        // Save report to file for viewing
        const filename = 'test-working-report.html';
        fs.writeFileSync(filename, html);
        
        res.send(`
          <h1>Working Transformation Report Test</h1>
          <p>Report generated successfully!</p>
          <p>Size: ${html.length} bytes</p>
          <p>File: ${result}</p>
          <p><a href="/view-working-report" target="_blank">View Generated Report</a></p>
          <p><a href="/api/generate-working-report" target="_blank">API Endpoint</a></p>
        `);
      } else {
        res.status(500).send(`Report generation failed: Unable to generate file`);
      }
      
    } catch (error) {
      console.error('Test working report error:', error);
      res.status(500).send('Test report generation failed');
    }
  });

  // View generated working report
  app.get('/view-working-report', (req, res) => {
    const reportPath = './test-working-report.html';
    
    if (fs.existsSync(reportPath)) {
      res.sendFile(path.resolve(reportPath));
    } else {
      res.status(404).send('Working report not found. <a href="/test-working-report">Generate Test Report</a>');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
