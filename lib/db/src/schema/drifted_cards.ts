import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const driftedCardsTable = pgTable("drifted_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }),
  cardId: text("card_id").notNull(),
  cardType: text("card_type").notNull(),
  count: integer("count").notNull().default(1),
  lastDriftedAt: timestamp("last_drifted_at").notNull().defaultNow(),
});

export const insertDriftedCardSchema = createInsertSchema(driftedCardsTable).omit({ id: true, lastDriftedAt: true });
export const selectDriftedCardSchema = createSelectSchema(driftedCardsTable);
export type InsertDriftedCard = z.infer<typeof insertDriftedCardSchema>;
export type DriftedCard = typeof driftedCardsTable.$inferSelect;
