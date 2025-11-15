import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getStudentAchievements } from '../services/achievementsService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const achievements = await getStudentAchievements(req.student.id);
    return res.json(achievements);
  } catch (error) {
    return next(error);
  }
});

export default router;
