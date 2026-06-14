import { Router } from "express";
import { db } from "@workspace/db";
import { growthScoresTable, couplesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router = Router();

const SEEDED_PEERS = [
  { coupleName: "Alex & Jordan", totalScore: 4820, streak: 14, momentum: "rising" },
  { coupleName: "Sam & Riley", totalScore: 3650, streak: 7, momentum: "steady" },
  { coupleName: "Morgan & Taylor", totalScore: 2940, streak: 3, momentum: "cooling" },
  { coupleName: "Casey & Drew", totalScore: 1980, streak: 5, momentum: "steady" },
  { coupleName: "Jamie & Quinn", totalScore: 1250, streak: 2, momentum: "rising" },
];

router.get("/leaderboard", async (_req, res) => {
  const realEntries = await db.select({
    coupleId: growthScoresTable.coupleId,
    coupleName: couplesTable.name,
    totalScore: growthScoresTable.total,
    streak: growthScoresTable.streak,
    momentum: growthScoresTable.momentum,
  })
    .from(growthScoresTable)
    .leftJoin(couplesTable, eq(growthScoresTable.coupleId, couplesTable.id))
    .orderBy(desc(growthScoresTable.total))
    .limit(20);

  const combined = [
    ...realEntries.map(e => ({
      coupleId: e.coupleId,
      coupleName: e.coupleName ?? "Unknown",
      totalScore: e.totalScore,
      streak: e.streak,
      momentum: e.momentum,
    })),
    ...SEEDED_PEERS.map(p => ({ coupleId: null, ...p })),
  ].sort((a, b) => b.totalScore - a.totalScore).map((e, i) => ({ rank: i + 1, ...e }));

  res.json(combined);
});

export default router;
