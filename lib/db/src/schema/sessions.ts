import { pgTable, text, uuid, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const sessionsTable = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull().defaultNow(),
  season: text("season"),
  cardsPlayed: integer("cards_played").notNull().default(0),
  cardsDrifted: integer("cards_drifted").notNull().default(0),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  thisOrThatMatches: integer("this_or_that_matches").notNull().default(0),
  thisOrThatTotal: integer("this_or_that_total").notNull().default(0),
  scoreEarned: integer("score_earned").notNull().default(0),
  moodEmoji: text("mood_emoji"),
  momentTag: text("moment_tag"),
  cardTypes: jsonb("card_types").$type<string[]>(),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ id: true, date: true });
export const selectSessionSchema = createSelectSchema(sessionsTable);
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
