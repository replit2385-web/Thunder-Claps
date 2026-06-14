import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const roomsTable = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  joinCode: text("join_code").notNull().unique(),
  coupleId: uuid("couple_id").references(() => couplesTable.id),
  phase: text("phase").notNull().default("waiting"),
  currentCardId: text("current_card_id"),
  stateJson: jsonb("state_json"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true });
export const selectRoomSchema = createSelectSchema(roomsTable);
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;
