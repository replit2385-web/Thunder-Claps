import { Router } from "express";
import { db } from "@workspace/db";
import { sessionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateSessionBody, GetSessionsParams } from "@workspace/api-zod";

const router = Router();

router.post("/sessions", async (req, res) => {
  const body = CreateSessionBody.parse(req.body);
  const [session] = await db.insert(sessionsTable).values({
    coupleId: body.coupleId,
    season: body.season ?? null,
    cardsPlayed: body.cardsPlayed,
    cardsDrifted: body.cardsDrifted ?? 0,
    durationSeconds: body.durationSeconds ?? 0,
    thisOrThatMatches: body.thisOrThatMatches ?? 0,
    thisOrThatTotal: body.thisOrThatTotal ?? 0,
    scoreEarned: body.scoreEarned,
    moodEmoji: body.moodEmoji ?? null,
    momentTag: body.momentTag ?? null,
    cardTypes: body.cardTypes ?? [],
  }).returning();

  res.status(201).json({
    id: session.id,
    coupleId: session.coupleId,
    date: session.date.toISOString(),
    season: session.season,
    cardsPlayed: session.cardsPlayed,
    cardsDrifted: session.cardsDrifted,
    durationSeconds: session.durationSeconds,
    thisOrThatMatches: session.thisOrThatMatches,
    thisOrThatTotal: session.thisOrThatTotal,
    scoreEarned: session.scoreEarned,
    moodEmoji: session.moodEmoji,
    momentTag: session.momentTag,
    cardTypes: session.cardTypes ?? [],
  });
});

router.get("/sessions/:coupleId", async (req, res) => {
  const { coupleId } = GetSessionsParams.parse(req.params);
  const sessions = await db.select().from(sessionsTable).where(eq(sessionsTable.coupleId, coupleId)).orderBy(desc(sessionsTable.date));
  res.json(sessions.map(s => ({
    id: s.id,
    coupleId: s.coupleId,
    date: s.date.toISOString(),
    season: s.season,
    cardsPlayed: s.cardsPlayed,
    cardsDrifted: s.cardsDrifted,
    durationSeconds: s.durationSeconds,
    thisOrThatMatches: s.thisOrThatMatches,
    thisOrThatTotal: s.thisOrThatTotal,
    scoreEarned: s.scoreEarned,
    moodEmoji: s.moodEmoji,
    momentTag: s.momentTag,
    cardTypes: s.cardTypes ?? [],
  })));
});

export default router;
