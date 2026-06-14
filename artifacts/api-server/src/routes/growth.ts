import { Router } from "express";
import { db } from "@workspace/db";
import { growthScoresTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetGrowthScoreParams, UpdateGrowthScoreParams, UpdateGrowthScoreBody } from "@workspace/api-zod";

const router = Router();

function calcMomentum(history: { date: string; score: number }[]): "rising" | "steady" | "cooling" {
  if (history.length < 2) return "steady";
  const recent = history.slice(-3);
  const avg = recent.reduce((a, b) => a + b.score, 0) / recent.length;
  const prev = history.slice(-6, -3);
  if (prev.length === 0) return "steady";
  const prevAvg = prev.reduce((a, b) => a + b.score, 0) / prev.length;
  if (avg > prevAvg * 1.1) return "rising";
  if (avg < prevAvg * 0.9) return "cooling";
  return "steady";
}

router.get("/growth/:coupleId", async (req, res) => {
  const { coupleId } = GetGrowthScoreParams.parse(req.params);
  let [score] = await db.select().from(growthScoresTable).where(eq(growthScoresTable.coupleId, coupleId));
  if (!score) {
    const [created] = await db.insert(growthScoresTable).values({
      coupleId,
      total: 0,
      streak: 0,
      momentum: "steady",
      historyJson: [],
    }).returning();
    score = created;
  }
  res.json({
    id: score.id,
    coupleId: score.coupleId,
    total: score.total,
    streak: score.streak,
    lastPlayed: score.lastPlayed?.toISOString() ?? null,
    historyJson: score.historyJson ?? [],
    momentum: score.momentum,
  });
});

router.patch("/growth/:coupleId", async (req, res) => {
  const { coupleId } = UpdateGrowthScoreParams.parse(req.params);
  const body = UpdateGrowthScoreBody.parse(req.body);

  let [score] = await db.select().from(growthScoresTable).where(eq(growthScoresTable.coupleId, coupleId));
  const history: { date: string; score: number }[] = (score?.historyJson as { date: string; score: number }[]) ?? [];

  if (body.historyPoint) {
    history.push(body.historyPoint);
  }

  const newTotal = (score?.total ?? 0) + body.scoreEarned;
  const now = new Date();
  const lastPlayed = score?.lastPlayed;
  let streak = score?.streak ?? 0;

  if (lastPlayed) {
    const daysDiff = Math.floor((now.getTime() - lastPlayed.getTime()) / 86400000);
    if (daysDiff <= 1) streak += 1;
    else if (daysDiff > 2) streak = 1;
  } else {
    streak = 1;
  }

  const momentum = calcMomentum(history);

  if (!score) {
    const [created] = await db.insert(growthScoresTable).values({
      coupleId,
      total: body.scoreEarned,
      streak: 1,
      lastPlayed: now,
      historyJson: history,
      momentum,
    }).returning();
    score = created;
  } else {
    const [updated] = await db.update(growthScoresTable)
      .set({ total: newTotal, streak, lastPlayed: now, historyJson: history, momentum })
      .where(eq(growthScoresTable.coupleId, coupleId))
      .returning();
    score = updated;
  }

  res.json({
    id: score.id,
    coupleId: score.coupleId,
    total: score.total,
    streak: score.streak,
    lastPlayed: score.lastPlayed?.toISOString() ?? null,
    historyJson: score.historyJson ?? [],
    momentum: score.momentum,
  });
});

export default router;
