import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { insertUserSchema, type AssessmentData } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, generateResetToken } from "./auth";

import { sendPasswordRecoveryEmail } from "./emailService";
import { generatePersonalizedReport, generateQuickInsight } from "./aiReportService";
import { generateCustomReport, generateCustomReportHTML } from "./customReportGenerator_clean";
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

  // Preview route for the Reformer test report
  app.get("/preview-reformer", (req, res) => {
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

    generateCustomReport(reformerAssessmentData)
      .then(reportData => {
        // Create a simplified preview version
        const previewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.heroTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #6B46C1 0%, #9333EA 50%, #A855F7 100%);
            color: white;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
        }
        .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: 4rem;
            text-align: center;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #FFD700, #00D4FF, #FF6B35);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
            font-size: 1.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: #E9D5FF;
        }
        .section {
            margin: 3rem 0;
            padding: 2rem;
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
        }
        .section-title {
            font-size: 2rem;
            color: #FFD700;
            margin-bottom: 1rem;
        }
        .challenge-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .challenge-card {
            background: rgba(255,255,255,0.1);
            padding: 1.5rem;
            border-radius: 10px;
            border-left: 4px solid #00D4FF;
        }
        .challenge-title {
            color: #FFD700;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        .life-areas {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        .life-area {
            background: rgba(255,255,255,0.05);
            padding: 1.5rem;
            border-radius: 10px;
            border-left: 4px solid #00D4FF;
        }
        .progress-bar {
            background: rgba(255,255,255,0.2);
            height: 8px;
            border-radius: 4px;
            margin-top: 1rem;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #FFD700, #00D4FF);
            border-radius: 4px;
        }
        .before-after {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem 0;
        }
        .transformation-column {
            background: rgba(255,255,255,0.05);
            padding: 1.5rem;
            border-radius: 10px;
        }
        .transformation-title {
            color: #FFD700;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .transformation-list {
            list-style: none;
            padding: 0;
        }
        .transformation-list li {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
        }
        .transformation-list li:before {
            content: "•";
            color: #00D4FF;
            position: absolute;
            left: 0;
        }
        .cta-section {
            text-align: center;
            margin: 3rem 0;
            padding: 3rem;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
        }
        .cta-text {
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        @media (max-width: 768px) {
            .hero-title { font-size: 2.5rem; }
            .before-after { grid-template-columns: 1fr; }
            .container { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="hero-title">${reportData.heroTitle}</h1>
        <p class="hero-subtitle">${reportData.heroSubtitle}</p>
        
        <div class="section">
            <h2 class="section-title">Your Current State</h2>
            <p>${reportData.currentStateDescription}</p>
        </div>

        <div class="section">
            <h2 class="section-title">Core Challenges to Transform</h2>
            <div class="challenge-grid">
                ${reportData.challengeCards.map(card => `
                    <div class="challenge-card">
                        <div class="challenge-title">${card.title}</div>
                        <div>${card.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Life Areas Assessment</h2>
            <div class="life-areas">
                ${reportData.lifeAreas.map(area => `
                    <div class="life-area">
                        <h4 style="color: #FFD700; margin-bottom: 0.5rem;">
                            <i class="${area.icon}" style="margin-right: 0.5rem;"></i>
                            ${area.area}
                        </h4>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">${area.description}</p>
                        <div style="font-weight: 600;">${area.percentage}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${area.percentage}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Your Transformation Journey</h2>
            <div class="before-after">
                <div class="transformation-column">
                    <div class="transformation-title">Current Challenges</div>
                    <ul class="transformation-list">
                        ${reportData.beforeAfter.before.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="transformation-column">
                    <div class="transformation-title">Your Potential</div>
                    <ul class="transformation-list">
                        ${reportData.beforeAfter.after.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <div class="cta-section">
            <h2 style="color: #FFD700; margin-bottom: 1rem;">Your Hero's Journey Awaits</h2>
            <p class="cta-text">${reportData.callToAction}</p>
        </div>
    </div>
</body>
</html>`;
        
        res.setHeader('Content-Type', 'text/html');
        res.send(previewHTML);
      })
      .catch(error => {
        console.error('Error generating preview report:', error);
        res.status(500).send('Error generating preview report');
      });
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

  const httpServer = createServer(app);
  return httpServer;
}
