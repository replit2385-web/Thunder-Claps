import { pgTable, text, uuid, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const growthScoresTable = pgTable("growth_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }).unique(),
  total: integer("total").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastPlayed: timestamp("last_played"),
  historyJson: jsonb("history_json").$type<{ date: string; score: number }[]>(),
  momentum: text("momentum").notNull().default("steady"),
});

export const insertGrowthScoreSchema = createInsertSchema(growthScoresTable).omit({ id: true });
export const selectGrowthScoreSchema = createSelectSchema(growthScoresTable);
export type InsertGrowthScore = z.infer<typeof insertGrowthScoreSchema>;
export type GrowthScore = typeof growthScoresTable.$inferSelect;
