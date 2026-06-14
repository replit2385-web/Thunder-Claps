import { Router, type IRouter } from "express";
import healthRouter from "./health";
import couplesRouter from "./couples";
import sessionsRouter from "./sessions";
import growthRouter from "./growth";
import mirrorRouter from "./mirror";
import bondsRouter from "./bonds";
import roomsRouter from "./rooms";
import journeyRouter from "./journey";
import blendRouter from "./blend";
import leaderboardRouter from "./leaderboard";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(couplesRouter);
router.use(sessionsRouter);
router.use(growthRouter);
router.use(mirrorRouter);
router.use(bondsRouter);
router.use(roomsRouter);
router.use(journeyRouter);
router.use(blendRouter);
router.use(leaderboardRouter);
router.use(adminRouter);

export default router;
