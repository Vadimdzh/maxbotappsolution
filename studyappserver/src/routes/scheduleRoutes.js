import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getScheduleForDate } from '../services/scheduleService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'date query parameter is required' });
    }
    const lessons = await getScheduleForDate(req.student, date);
    return res.json(lessons);
  } catch (error) {
    return next(error);
  }
});

export default router;
