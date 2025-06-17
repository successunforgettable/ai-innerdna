import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'inner-dna-secret-key';
const JWT_EXPIRES_IN = '7d';

// Email configuration
const transporter = nodemailer.createTransport({
  // Configure with your email service
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  emailVerified?: Date | null;
}

export class AuthService {
  
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(user: AuthUser): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        verified: !!user.emailVerified 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async sendVerificationEmail(email: string, code: string, name?: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Inner DNA Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to Inner DNA${name ? `, ${name}` : ''}!</h2>
          <p>Thank you for registering for the Inner DNA personality assessment.</p>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">${code}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string, name?: string): Promise<void> {
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Inner DNA Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Password Reset Request${name ? ` for ${name}` : ''}</h2>
          <p>You requested to reset your password for your Inner DNA account.</p>
          <p>Click the link below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async register(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
  }): Promise<{ user: AuthUser; requiresVerification: boolean }> {
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password and generate verification code
    const passwordHash = await this.hashPassword(userData.password);
    const verificationCode = this.generateVerificationCode();

    // Create user
    const user = await storage.createUser({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      passwordHash,
      verificationCode,
      startedAt: new Date(),
    });

    // Send verification email
    await this.sendVerificationEmail(
      userData.email, 
      verificationCode, 
      userData.firstName
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        phoneNumber: user.phoneNumber || undefined,
        emailVerified: user.emailVerified,
      },
      requiresVerification: true
    };
  }

  async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    
    const user = await storage.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await this.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      phoneNumber: user.phoneNumber || undefined,
      emailVerified: user.emailVerified,
    };

    const token = this.generateToken(authUser);

    return { user: authUser, token };
  }

  async verifyEmail(email: string, code: string): Promise<boolean> {
    const user = await storage.getUserByEmail(email);
    if (!user || user.verificationCode !== code) {
      return false;
    }

    // Mark email as verified and clear verification code
    await storage.updateUser(user.id, {
      emailVerified: new Date(),
      verificationCode: null,
    });

    return true;
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return false; // Don't reveal if email exists
    }

    const resetToken = this.generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await storage.updateUser(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    await this.sendPasswordResetEmail(
      email, 
      resetToken, 
      user.firstName || undefined
    );

    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await storage.getUserByResetToken(token);
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return false;
    }

    const passwordHash = await this.hashPassword(newPassword);

    await storage.updateUser(user.id, {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return true;
  }
}

export const authService = new AuthService();