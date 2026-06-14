import { Router } from "express";
import { db } from "@workspace/db";
import { roomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateRoomBody, GetRoomParams } from "@workspace/api-zod";

function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const router = Router();

router.post("/rooms", async (req, res) => {
  const body = CreateRoomBody.parse(req.body);
  const joinCode = generateJoinCode();
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

  const [room] = await db.insert(roomsTable).values({
    joinCode,
    coupleId: body.coupleId,
    phase: "waiting",
    expiresAt,
    stateJson: { players: [body.coupleId], cardIndex: 0, scores: {} },
  }).returning();

  res.status(201).json({
    id: room.id,
    joinCode: room.joinCode,
    coupleId: room.coupleId,
    phase: room.phase,
    currentCardId: room.currentCardId,
    stateJson: room.stateJson,
    createdAt: room.createdAt.toISOString(),
    expiresAt: room.expiresAt.toISOString(),
  });
});

router.get("/rooms/:joinCode", async (req, res) => {
  const { joinCode } = GetRoomParams.parse(req.params);
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.joinCode, joinCode));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  res.json({
    id: room.id,
    joinCode: room.joinCode,
    coupleId: room.coupleId,
    phase: room.phase,
    currentCardId: room.currentCardId,
    stateJson: room.stateJson,
    createdAt: room.createdAt.toISOString(),
    expiresAt: room.expiresAt.toISOString(),
  });
});

export default router;
