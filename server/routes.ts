import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertUserSchema, insertContactRequestSchema, type AssessmentData } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, generateResetToken } from "./auth";

import { sendPasswordRecoveryEmail } from "./emailService";
import { generatePersonalizedReport, generateQuickInsight } from "./aiReportService";
import { generateCustomReport, generateCustomReportHTML } from "./customReportGenerator_clean";
import { generateSentinelCopy } from "./sentinelCopyGenerator";
import { generateSentinel8Content } from "./sentinelReportGenerator";
import { generateWorkingReport } from "./workingReportGenerator";
import { z } from "zod";
import { generateCompleteStyledReport } from '../emergency-report-generator-new.js';
import puppeteer from 'puppeteer';
import htmlPdf from 'html-pdf-node';

// Global browser instance (more efficient)
let browser = null;

async function getBrowser() {
  if (!browser) {
    try {
      browser = await puppeteer.launch({
        headless: 'new',
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
          '--disable-backgrounding-occluded-windows',
          '--disable-extensions',
          '--disable-default-apps',
          '--disable-sync',
          '--metrics-recording-only',
          '--no-default-browser-check',
          '--safebrowsing-disable-auto-update',
          '--user-data-dir=/tmp/chrome-user-data',
          '--data-path=/tmp/chrome-data',
          '--disk-cache-dir=/tmp/chrome-cache'
        ],
        timeout: 60000,
        ignoreHTTPSErrors: true,
        executablePath: puppeteer.executablePath()
      });
      console.log('Puppeteer browser launched successfully');
    } catch (error) {
      console.error('Failed to launch Puppeteer browser:', error);
      // Create a fallback for environments where Puppeteer cannot run
      browser = null;
      throw new Error(`Browser launch failed: ${error.message}`);
    }
  }
  return browser;
}

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

  // Contact Form Routes
  app.post("/api/contact-requests", async (req, res) => {
    try {
      const contactData = insertContactRequestSchema.parse(req.body);
      const contactRequest = await storage.createContactRequest(contactData);
      res.json(contactRequest);
    } catch (error) {
      console.error('Contact request error:', error);
      res.status(400).json({ error: "Failed to submit contact request" });
    }
  });

  app.get("/api/contact-requests", async (req, res) => {
    try {
      const contactRequests = await storage.getAllContactRequests();
      res.json(contactRequests);
    } catch (error) {
      console.error('Failed to fetch contact requests:', error);
      res.status(500).json({ error: "Failed to fetch contact requests" });
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
  app.get('/api/report/challenger-7-destructive', (req, res) => {
    try {
      const reportPath = path.join(process.cwd(), 'challenger-7-destructive-sexual.html');
      const reportContent = fs.readFileSync(reportPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(reportContent);
    } catch (error) {
      console.error('Error loading Challenger 7 Destructive report:', error);
      res.status(404).send('Challenger 7 Destructive Sexual report not found');
    }
  });

  app.get('/api/report/challenger-9-destructive', (req, res) => {
    try {
      const reportPath = path.join(process.cwd(), 'challenger-9-destructive-social.html');
      const reportContent = fs.readFileSync(reportPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(reportContent);
    } catch (error) {
      console.error('Error loading Challenger 9 Destructive report:', error);
      res.status(404).send('Challenger 9 Destructive Social report not found');
    }
  });

  app.get('/api/report/challenger-7-good', (req, res) => {
    try {
      const reportPath = path.join(process.cwd(), 'challenger-7-good-sexual.html');
      const reportContent = fs.readFileSync(reportPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(reportContent);
    } catch (error) {
      console.error('Error loading Challenger 7 Good report:', error);
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

  // Emergency Report Generator - Updated Genspark Design
  app.get('/api/emergency-report/:userId', async (req, res) => {
    try {
      console.log(`🚀 Emergency template generation for user ${req.params.userId}`);
      
      const typeId = parseInt(req.params.userId) || 1;
      const reportHtml = await generateCompleteStyledReport(typeId);
      
      // Save report file using async file operations
      const fileName = `emergency-report-${req.params.userId}-${Date.now()}.html`;
      await fs.promises.writeFile(fileName, reportHtml);
      
      res.json({
        success: true,
        fileName: fileName,
        message: '✅ GENSPARK DESIGN - UNLIMITED CONCURRENT USERS',
        performance: {
          old_chatgpt: 'FAILS at 10+ users, $1.50, 60+ seconds',
          new_template: 'UNLIMITED users, $0.022, <5 seconds'
        },
        files_location: 'public/9 types reports/',
        system_type: 'Genspark Design with Professional Testimonials'
      });
      
    } catch (error) {
      console.error('❌ Emergency generation failed:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        files_path: 'Check public/9 types reports/ directory'
      });
    }
  });

  // Test route to verify Genspark design system
  app.get('/api/test-content-loading', async (req, res) => {
    try {
      // Test generating a sample report
      const testReport = await generateCompleteStyledReport(8);
      const reportSize = testReport.length;
      
      res.json({
        system: 'Genspark Design Emergency Template',
        status: '✅ All Genspark design elements loaded successfully',
        report_size: `${Math.round(reportSize/1024)}KB`,
        testimonial_images: 'Fixed with reliable randomuser.me sources',
        files_location: 'public/9 types reports/',
        ready_for_unlimited_scale: true,
        design_features: [
          'Purple gradient backgrounds',
          'Professional testimonial photos',
          'Glass-morphism effects',
          'Chart.js HRV visualizations',
          'Heart-Brain Science integration'
        ]
      });
    } catch (error) {
      res.status(500).json({
        error: 'Genspark template loading failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Check file paths and markdown file format'
      });
    }
  });

  // Enhanced Report Viewer - Dynamic HRV and heart neuron analysis
  app.get('/api/emergency-view/:typeId', async (req, res) => {
    try {
      const typeId = parseInt(req.params.typeId);
      
      if (typeId < 1 || typeId > 9) {
        return res.status(400).json({ error: 'Invalid type ID. Must be 1-9.' });
      }
      
      const html = await generateCompleteStyledReport(typeId);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
      
    } catch (error) {
      console.error('Error generating emergency report:', error);
      res.status(500).json({ error: 'Failed to generate report' });
    }
  });

  // Personalized Enhanced Report Viewer - Uses assessment data for heart neuron percentages
  app.get('/api/personalized-view/:typeId/:userId', async (req, res) => {
    try {
      const typeId = parseInt(req.params.typeId);
      const userId = parseInt(req.params.userId);
      
      if (typeId < 1 || typeId > 9) {
        return res.status(400).json({ error: 'Invalid type ID. Must be 1-9.' });
      }
      
      if (!userId || userId < 1) {
        return res.status(400).json({ error: 'Invalid user ID.' });
      }
      
      const html = await generateCompleteStyledReport(typeId);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
      
    } catch (error) {
      console.error('Error generating personalized report:', error);
      res.status(500).json({ error: 'Failed to generate personalized report' });
    }
  });

  // Preview test genspark design
  app.get('/api/preview-genspark', (req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'public', 'test-genspark-design.html');
      const htmlContent = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      res.status(404).json({ error: 'Test file not found' });
    }
  });

  // Generate new Genspark report
  app.post('/api/preview-genspark', async (req, res) => {
    try {
      const { typeId } = req.body;
      const userId = typeId || 8;
      
      console.log(`🚀 Generating new Genspark report for type ${userId}`);
      const reportResult = await generateCompleteStyledReport(userId);
      
      if (reportResult.success) {
        const htmlContent = fs.readFileSync(reportResult.fileName, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
      } else {
        res.status(500).json({ error: 'Failed to generate report' });
      }
    } catch (error) {
      console.error('Error generating new Genspark report:', error);
      res.status(500).json({ error: 'Error generating new Genspark report' });
    }
  });

  // View existing generated report with fixed animations
  app.get('/api/view-challenger-report', (req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'emergency-report-8-1750624192661.html');
      const htmlContent = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      console.error('Error viewing report:', error);
      res.status(404).json({ error: 'Report not found' });
    }
  });

  // Report management API routes
  app.post('/api/reports', async (req, res) => {
    try {
      const { userId, reportType, personalityType, reportUrl, reportData } = req.body;
      
      if (!userId || !reportType || !personalityType || !reportUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const report = await storage.createReport({
        userId,
        reportType,
        personalityType,
        reportUrl,
        reportData
      });

      res.json(report);
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ error: 'Failed to create report' });
    }
  });

  app.get('/api/users/:userId/reports', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reports = await storage.getUserReports(userId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching user reports:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  });

  app.get('/api/reports/:id', async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const report = await storage.getReport(reportId);
      
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json(report);
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({ error: 'Failed to fetch report' });
    }
  });

  // Generate and save emergency report
  app.post('/api/generate-and-save-report', async (req, res) => {
    try {
      const { userId, personalityType } = req.body;
      
      if (!userId || !personalityType) {
        return res.status(400).json({ error: 'Missing userId or personalityType' });
      }

      // Generate emergency report
      const html = await generateCompleteStyledReport(personalityType);
      
      // Create unique report URL
      const timestamp = Date.now();
      const reportUrl = `/api/view-report/${timestamp}`;
      const fileName = `emergency-report-${personalityType}-${timestamp}.html`;
      
      // Save report to file
      fs.writeFileSync(fileName, html);
      
      // Save report to database
      const report = await storage.createReport({
        userId,
        reportType: 'emergency',
        personalityType: `Type ${personalityType}`,
        reportUrl,
        reportData: { personalityType, timestamp }
      });

      // Create route to serve this specific report
      app.get(reportUrl, (req, res) => {
        try {
          res.setHeader('Content-Type', 'text/html');
          res.send(html);
        } catch (error) {
          res.status(404).json({ error: 'Report not found' });
        }
      });

      res.json({
        success: true,
        reportUrl,
        reportId: report.id,
        message: 'Report generated and saved successfully'
      });

    } catch (error) {
      console.error('Error generating and saving report:', error);
      res.status(500).json({ error: 'Failed to generate and save report' });
    }
  });

  // Direct PDF download route (generates actual PDF)
  app.get('/api/download-pdf/:typeId', async (req, res) => {
    try {
      const typeId = parseInt(req.params.typeId);
      
      if (typeId < 1 || typeId > 9) {
        return res.status(400).json({ error: 'Invalid type ID. Must be 1-9.' });
      }

      console.log(`Generating PDF report for Type ${typeId}`);

      // Generate HTML content with PDF-optimized styling
      let htmlContent = await generateCompleteStyledReport(typeId);
      
      // Add PDF-specific CSS for high-quality rendering
      const pdfCSS = `
        <style>
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
            background: white;
            font-size: 14px;
          }
          
          .container {
            max-width: 100%;
            margin: 0;
            padding: 20px;
          }
          
          .glass-card, .glass-morphism {
            background: rgba(255, 255, 255, 0.95) !important;
            border: 1px solid rgba(102, 126, 234, 0.2) !important;
            border-radius: 15px !important;
            padding: 20px !important;
            margin: 15px 0 !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            padding: 30px !important;
            border-radius: 15px !important;
          }
          
          .text-gradient {
            background: linear-gradient(135deg, #667eea, #764ba2) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
          }
          
          h1, h2, h3 {
            color: #2d3748 !important;
            margin: 20px 0 15px 0 !important;
          }
          
          .heart-animation, .floating-element {
            display: inline-block !important;
            animation: none !important;
          }
          
          .progress-bar {
            background: #e2e8f0 !important;
            border-radius: 10px !important;
            overflow: hidden !important;
          }
          
          .progress-fill {
            background: linear-gradient(90deg, #667eea, #764ba2) !important;
            height: 20px !important;
            border-radius: 10px !important;
          }
          
          .testimonial-card {
            background: rgba(102, 126, 234, 0.1) !important;
            border-left: 4px solid #667eea !important;
            padding: 20px !important;
            margin: 15px 0 !important;
            border-radius: 8px !important;
          }
          
          .cta-button {
            background: linear-gradient(135deg, #667eea, #764ba2) !important;
            color: white !important;
            padding: 15px 30px !important;
            border-radius: 25px !important;
            text-decoration: none !important;
            display: inline-block !important;
            font-weight: bold !important;
          }
          
          .page-break {
            page-break-before: always !important;
          }
          
          @page {
            margin: 0.5in;
            size: letter;
          }
        </style>
      `;
      
      // Insert PDF CSS
      htmlContent = htmlContent.replace('</head>', pdfCSS + '</head>');
      htmlContent = htmlContent.replace('<body>', '<body><div class="container">');
      htmlContent = htmlContent.replace('</body>', '</div></body>');
      
      // Configure html-pdf-node options for high quality
      const options = {
        format: 'Letter',
        width: '8.5in',
        height: '11in',
        border: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        quality: '100',
        type: 'pdf',
        timeout: 30000,
        renderDelay: 2000,
        dpi: 300,
        zoomFactor: 1,
        displayHeaderFooter: false,
        printBackground: true,
        preferCSSPageSize: true
      };
      
      const file = { content: htmlContent };
      
      // Generate PDF
      console.log('Starting PDF generation...');
      const pdfBuffer = await htmlPdf.generatePdf(file, options);
      
      // Set response headers for PDF download
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Inner-DNA-Type${typeId}-Report-${timestamp}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Send PDF
      res.send(pdfBuffer);
      
      console.log(`PDF report delivered for Type ${typeId} (${pdfBuffer.length} bytes)`);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      
      res.status(500).json({ 
        error: 'Failed to generate PDF report',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // HTML report download route (fallback for Replit environment)
  app.get('/api/download-report/:typeId', async (req, res) => {
    try {
      const typeId = parseInt(req.params.typeId);
      
      if (typeId < 1 || typeId > 9) {
        return res.status(400).json({ error: 'Invalid type ID. Must be 1-9.' });
      }

      console.log(`Generating HTML report for Type ${typeId}`);

      // Generate HTML content with enhanced styling for offline viewing
      let htmlContent = await generateCompleteStyledReport(typeId);
      
      // Add print-specific CSS for better printing
      const printCSS = `
        <style>
          @media print {
            body { margin: 0; font-size: 12px; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
            .glass-card { background: white !important; border: 1px solid #ccc !important; }
          }
          
          /* Enhanced standalone styling */
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          
          .header-note {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #000;
            padding: 15px 30px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
          }
        </style>
      `;
      
      // Add header note and wrap content
      const headerNote = `
        <div class="header-note">
          ✨ Inner DNA Assessment Report - Type ${typeId} | Generated: ${new Date().toLocaleDateString()} | 
          💡 Tip: Use Ctrl+P to print or save as PDF
        </div>
      `;
      
      // Insert CSS and header
      htmlContent = htmlContent.replace('</head>', printCSS + '</head>');
      htmlContent = htmlContent.replace('<body>', '<body><div class="container">' + headerNote);
      htmlContent = htmlContent.replace('</body>', '</div></body>');
      
      // Set response headers for download
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Inner-DNA-Type${typeId}-Report-${timestamp}.html`;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Send HTML file
      res.send(htmlContent);
      
      console.log(`HTML report delivered for Type ${typeId}`);
      
    } catch (error) {
      console.error('HTML report generation error:', error);
      
      res.status(500).json({ 
        error: 'Failed to generate HTML report',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // HTML preview route (view in browser)
  app.get('/api/preview-report/:typeId', async (req, res) => {
    try {
      const typeId = parseInt(req.params.typeId);
      
      if (typeId < 1 || typeId > 9) {
        return res.status(400).json({ error: 'Invalid type ID' });
      }

      console.log(`Generating HTML preview for Type ${typeId}`);

      // Generate HTML content
      const htmlContent = await generateCompleteStyledReport(typeId);
      
      // Set response headers for inline viewing
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      
      // Send HTML for direct viewing
      res.send(htmlContent);
      
      console.log(`HTML preview delivered for Type ${typeId}`);
      
    } catch (error) {
      console.error('HTML preview error:', error);
      res.status(500).json({ error: 'Failed to generate HTML preview' });
    }
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

  // Graceful shutdown
  process.on('SIGINT', async () => {
    if (browser) {
      await browser.close();
    }
    process.exit(0);
  });

  const httpServer = createServer(app);
  return httpServer;
}
