import { Router } from "express";
import { db } from "@workspace/db";
import { bondsTable, bondMembershipsTable, couplesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateBondBody, JoinBondBody, GetBondLeaderboardParams } from "@workspace/api-zod";
import { sql } from "drizzle-orm";

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const router = Router();

router.get("/bonds", async (_req, res) => {
  const bonds = await db.select().from(bondsTable).orderBy(desc(bondsTable.createdAt));
  const result = await Promise.all(bonds.map(async (b) => {
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
      .from(bondMembershipsTable)
      .where(eq(bondMembershipsTable.bondId, b.id));
    return {
      id: b.id,
      name: b.name,
      code: b.code,
      createdBy: b.createdBy,
      memberCount: count,
      createdAt: b.createdAt.toISOString(),
    };
  }));
  res.json(result);
});

router.post("/bonds", async (req, res) => {
  const body = CreateBondBody.parse(req.body);
  const code = generateCode();
  const [bond] = await db.insert(bondsTable).values({
    name: body.name,
    code,
    createdBy: body.coupleId,
  }).returning();

  await db.insert(bondMembershipsTable).values({
    bondId: bond.id,
    coupleId: body.coupleId,
    currentScore: 0,
  });

  res.status(201).json({
    id: bond.id,
    name: bond.name,
    code: bond.code,
    createdBy: bond.createdBy,
    memberCount: 1,
    createdAt: bond.createdAt.toISOString(),
  });
});

router.post("/bonds/join", async (req, res) => {
  const body = JoinBondBody.parse(req.body);
  const [bond] = await db.select().from(bondsTable).where(eq(bondsTable.code, body.code));
  if (!bond) {
    res.status(404).json({ error: "Bond not found" });
    return;
  }
  const [membership] = await db.insert(bondMembershipsTable).values({
    bondId: bond.id,
    coupleId: body.coupleId,
    currentScore: body.currentScore ?? 0,
  }).onConflictDoNothing().returning();

  res.json({
    id: membership?.id ?? "",
    bondId: bond.id,
    coupleId: body.coupleId,
    currentScore: body.currentScore ?? 0,
    joinedAt: (membership?.joinedAt ?? new Date()).toISOString(),
  });
});

router.get("/bonds/:bondId/leaderboard", async (req, res) => {
  const { bondId } = GetBondLeaderboardParams.parse(req.params);
  const members = await db.select({
    id: bondMembershipsTable.id,
    bondId: bondMembershipsTable.bondId,
    coupleId: bondMembershipsTable.coupleId,
    currentScore: bondMembershipsTable.currentScore,
    joinedAt: bondMembershipsTable.joinedAt,
    coupleName: couplesTable.name,
  })
    .from(bondMembershipsTable)
    .leftJoin(couplesTable, eq(bondMembershipsTable.coupleId, couplesTable.id))
    .where(eq(bondMembershipsTable.bondId, bondId))
    .orderBy(desc(bondMembershipsTable.currentScore));

  res.json(members.map((m, i) => ({
    rank: i + 1,
    coupleId: m.coupleId,
    coupleName: m.coupleName ?? "Unknown",
    currentScore: m.currentScore,
    joinedAt: m.joinedAt.toISOString(),
  })));
});

export default router;
