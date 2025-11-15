import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getLeaderboard } from '../services/leaderboardService.js';
import { getStudentFlowId } from '../services/ratingService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 7;
    const flowId = req.query.flowId ? Number(req.query.flowId) : await getStudentFlowId(req.student);
    const leaderboard = await getLeaderboard(flowId, limit);
    return res.json(leaderboard);
  } catch (error) {
    return next(error);
  }
});

export default router;
