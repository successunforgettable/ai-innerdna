import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  assessmentData: jsonb("assessment_data"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Assessment data types
export type FoundationStoneSelection = {
  setIndex: number;
  stoneIndex: number;
  content: string[];
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
