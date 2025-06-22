import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  passwordHash: text("password_hash"),
  emailVerified: timestamp("email_verified"),
  phoneVerified: timestamp("phone_verified"),
  verificationCode: text("verification_code"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  assessmentData: jsonb("assessment_data"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  reportType: text("report_type").notNull(), // 'emergency' or 'ai'
  personalityType: text("personality_type").notNull(),
  reportUrl: text("report_url").notNull(),
  reportData: jsonb("report_data"), // Store the assessment data used to generate report
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  generatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

// Assessment data types
export type FoundationStoneSelection = {
  setIndex: number;
  stoneIndex: number;
  context: string;
  statements: string[];
  gradient: string;
};

export type BuildingBlockSelection = {
  type: number;
  name: string;
  description: string;
  wing?: string;
};

export type ColorStateSelection = {
  state: string;
  title: string;
};

export type DetailTokenSelection = {
  category: string;
  token: string;
};

export type PersonalityResult = {
  primaryType: string;
  confidence: number;
  allScores: Record<string, number>;
  rawScores: Record<string, number>;
};

export type AssessmentData = {
  foundationStones: FoundationStoneSelection[];
  buildingBlocks: BuildingBlockSelection[];
  colorStates: ColorStateSelection[];
  detailTokens: DetailTokenSelection[];
  result?: PersonalityResult;
};
