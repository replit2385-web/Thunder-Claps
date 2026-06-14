import { Router } from "express";
import { db } from "@workspace/db";
import { couplesTable, growthScoresTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateCoupleBody, GetCoupleParams, UpdateCoupleBody, UpdateCoupleParams } from "@workspace/api-zod";

const router = Router();

router.post("/couples", async (req, res) => {
  const body = CreateCoupleBody.parse(req.body);
  const [couple] = await db.insert(couplesTable).values({
    name: body.name,
    partner1: body.partner1,
    partner2: body.partner2,
    avatarJson: body.avatarJson ?? null,
    anniversaryDate: body.anniversaryDate ?? null,
  }).returning();

  await db.insert(growthScoresTable).values({
    coupleId: couple.id,
    total: 0,
    streak: 0,
    momentum: "steady",
    historyJson: [],
  }).onConflictDoNothing();

  res.status(201).json({
    id: couple.id,
    name: couple.name,
    partner1: couple.partner1,
    partner2: couple.partner2,
    avatarJson: couple.avatarJson,
    anniversaryDate: couple.anniversaryDate,
    blendImageUrl: couple.blendImageUrl,
    createdAt: couple.createdAt.toISOString(),
  });
});

router.get("/couples/:coupleId", async (req, res) => {
  const { coupleId } = GetCoupleParams.parse(req.params);
  const [couple] = await db.select().from(couplesTable).where(eq(couplesTable.id, coupleId));
  if (!couple) {
    res.status(404).json({ error: "Couple not found" });
    return;
  }
  res.json({
    id: couple.id,
    name: couple.name,
    partner1: couple.partner1,
    partner2: couple.partner2,
    avatarJson: couple.avatarJson,
    anniversaryDate: couple.anniversaryDate,
    blendImageUrl: couple.blendImageUrl,
    createdAt: couple.createdAt.toISOString(),
  });
});

router.patch("/couples/:coupleId", async (req, res) => {
  const { coupleId } = UpdateCoupleParams.parse(req.params);
  const body = UpdateCoupleBody.parse(req.body);

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.partner1 !== undefined) updates.partner1 = body.partner1;
  if (body.partner2 !== undefined) updates.partner2 = body.partner2;
  if (body.avatarJson !== undefined) updates.avatarJson = body.avatarJson;
  if (body.anniversaryDate !== undefined) updates.anniversaryDate = body.anniversaryDate;
  if (body.blendImageUrl !== undefined) updates.blendImageUrl = body.blendImageUrl;

  const [couple] = await db.update(couplesTable).set(updates).where(eq(couplesTable.id, coupleId)).returning();
  if (!couple) {
    res.status(404).json({ error: "Couple not found" });
    return;
  }
  res.json({
    id: couple.id,
    name: couple.name,
    partner1: couple.partner1,
    partner2: couple.partner2,
    avatarJson: couple.avatarJson,
    anniversaryDate: couple.anniversaryDate,
    blendImageUrl: couple.blendImageUrl,
    createdAt: couple.createdAt.toISOString(),
  });
});

export default router;
