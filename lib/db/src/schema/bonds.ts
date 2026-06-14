import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const bondsTable = pgTable("bonds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  createdBy: uuid("created_by").references(() => couplesTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bondMembershipsTable = pgTable("bond_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  bondId: uuid("bond_id").notNull().references(() => bondsTable.id, { onDelete: "cascade" }),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }),
  currentScore: integer("current_score").notNull().default(0),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const insertBondSchema = createInsertSchema(bondsTable).omit({ id: true, createdAt: true });
export const selectBondSchema = createSelectSchema(bondsTable);
export const insertBondMembershipSchema = createInsertSchema(bondMembershipsTable).omit({ id: true, joinedAt: true });
export const selectBondMembershipSchema = createSelectSchema(bondMembershipsTable);
export type InsertBond = z.infer<typeof insertBondSchema>;
export type Bond = typeof bondsTable.$inferSelect;
export type InsertBondMembership = z.infer<typeof insertBondMembershipSchema>;
export type BondMembership = typeof bondMembershipsTable.$inferSelect;
