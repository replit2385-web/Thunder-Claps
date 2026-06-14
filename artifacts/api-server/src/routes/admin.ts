import { Router } from "express";
import { db } from "@workspace/db";
import { couplesTable, sessionsTable, bondsTable, growthScoresTable } from "@workspace/db";
import { sql, desc, eq } from "drizzle-orm";

const router = Router();

router.get("/admin/stats", async (_req, res) => {
  const [couplesCount] = await db.select({ count: sql<number>`count(*)::int` }).from(couplesTable);
  const [sessionsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(sessionsTable);
  const [bondsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(bondsTable);
  const [avgRow] = await db.select({ avg: sql<number>`coalesce(avg(total)::int, 0)` }).from(growthScoresTable);
  const topEntry = await db.select({ name: couplesTable.name })
    .from(growthScoresTable)
    .leftJoin(couplesTable, eq(growthScoresTable.coupleId, couplesTable.id))
    .orderBy(desc(growthScoresTable.total))
    .limit(1);

  res.json({
    totalCouples: couplesCount.count,
    totalSessions: sessionsCount.count,
    totalBonds: bondsCount.count,
    avgScore: avgRow.avg ?? 0,
    topCouple: topEntry[0]?.name ?? null,
  });
});

export default router;
