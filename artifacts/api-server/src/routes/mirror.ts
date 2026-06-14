import { Router } from "express";
import { db } from "@workspace/db";
import { mirrorResultsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { GetMirrorResultsParams, SaveMirrorResultParams, SaveMirrorResultBody } from "@workspace/api-zod";

const router = Router();

router.get("/mirror/:coupleId", async (req, res) => {
  const { coupleId } = GetMirrorResultsParams.parse(req.params);
  const results = await db.select().from(mirrorResultsTable)
    .where(eq(mirrorResultsTable.coupleId, coupleId))
    .orderBy(desc(mirrorResultsTable.completedAt));
  res.json(results.map(r => ({
    id: r.id,
    coupleId: r.coupleId,
    quizType: r.quizType,
    partner1Result: r.partner1Result,
    partner2Result: r.partner2Result,
    completedAt: r.completedAt.toISOString(),
  })));
});

router.post("/mirror/:coupleId", async (req, res) => {
  const { coupleId } = SaveMirrorResultParams.parse(req.params);
  const body = SaveMirrorResultBody.parse(req.body);
  const [result] = await db.insert(mirrorResultsTable).values({
    coupleId,
    quizType: body.quizType,
    partner1Result: body.partner1Result,
    partner2Result: body.partner2Result,
  }).returning();
  res.status(201).json({
    id: result.id,
    coupleId: result.coupleId,
    quizType: result.quizType,
    partner1Result: result.partner1Result,
    partner2Result: result.partner2Result,
    completedAt: result.completedAt.toISOString(),
  });
});

export default router;
