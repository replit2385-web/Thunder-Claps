import { Router } from "express";
import { db } from "@workspace/db";
import { journeysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetJourneyParams, UpdateJourneyParams, UpdateJourneyBody } from "@workspace/api-zod";

const router = Router();

router.get("/journey/:coupleId", async (req, res) => {
  const { coupleId } = GetJourneyParams.parse(req.params);
  let [journey] = await db.select().from(journeysTable).where(eq(journeysTable.coupleId, coupleId));
  if (!journey) {
    const [created] = await db.insert(journeysTable).values({
      coupleId,
      currentSeason: "Foundations",
      completedDays: 0,
    }).returning();
    journey = created;
  }
  res.json({
    id: journey.id,
    coupleId: journey.coupleId,
    currentSeason: journey.currentSeason,
    startedAt: journey.startedAt.toISOString(),
    completedDays: journey.completedDays,
  });
});

router.patch("/journey/:coupleId", async (req, res) => {
  const { coupleId } = UpdateJourneyParams.parse(req.params);
  const body = UpdateJourneyBody.parse(req.body);

  const updates: Record<string, unknown> = {};
  if (body.completedDays !== undefined) updates.completedDays = body.completedDays;
  if (body.currentSeason !== undefined) updates.currentSeason = body.currentSeason;

  let [journey] = await db.select().from(journeysTable).where(eq(journeysTable.coupleId, coupleId));
  if (!journey) {
    const [created] = await db.insert(journeysTable).values({
      coupleId,
      currentSeason: body.currentSeason ?? "Foundations",
      completedDays: body.completedDays ?? 0,
    }).returning();
    journey = created;
  } else {
    const [updated] = await db.update(journeysTable).set(updates)
      .where(eq(journeysTable.coupleId, coupleId)).returning();
    journey = updated;
  }

  res.json({
    id: journey.id,
    coupleId: journey.coupleId,
    currentSeason: journey.currentSeason,
    startedAt: journey.startedAt.toISOString(),
    completedDays: journey.completedDays,
  });
});

export default router;
