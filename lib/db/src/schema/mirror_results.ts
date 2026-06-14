import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const mirrorResultsTable = pgTable("mirror_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }),
  quizType: text("quiz_type").notNull(),
  partner1Result: text("partner1_result").notNull(),
  partner2Result: text("partner2_result").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertMirrorResultSchema = createInsertSchema(mirrorResultsTable).omit({ id: true, completedAt: true });
export const selectMirrorResultSchema = createSelectSchema(mirrorResultsTable);
export type InsertMirrorResult = z.infer<typeof insertMirrorResultSchema>;
export type MirrorResult = typeof mirrorResultsTable.$inferSelect;
