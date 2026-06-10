import { ScoresController } from "../controllers/scoresController.js";
import express from 'express';

const router = express.Router();
const controller = new ScoresController();

router.get("/scores", controller.getAllScores);
router.get("/scores/distribution", controller.getScoreDistribution);
router.get("/scores/top10/groupA", controller.getTop10GroupA);
router.get("/scores/:sbd", controller.getScoreByRegistrationNumber);

export default router;