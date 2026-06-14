import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const couplesTable = pgTable("couples", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  partner1: text("partner1").notNull(),
  partner2: text("partner2").notNull(),
  avatarJson: jsonb("avatar_json"),
  anniversaryDate: text("anniversary_date"),
  blendImageUrl: text("blend_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCoupleSchema = createInsertSchema(couplesTable).omit({ id: true, createdAt: true });
export const selectCoupleSchema = createSelectSchema(couplesTable);
export type InsertCouple = z.infer<typeof insertCoupleSchema>;
export type Couple = typeof couplesTable.$inferSelect;
