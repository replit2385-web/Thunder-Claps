import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const journeysTable = pgTable("journeys", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }).unique(),
  currentSeason: text("current_season").notNull().default("Foundations"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedDays: integer("completed_days").notNull().default(0),
});

export const insertJourneySchema = createInsertSchema(journeysTable).omit({ id: true, startedAt: true });
export const selectJourneySchema = createSelectSchema(journeysTable);
export type InsertJourney = z.infer<typeof insertJourneySchema>;
export type Journey = typeof journeysTable.$inferSelect;
