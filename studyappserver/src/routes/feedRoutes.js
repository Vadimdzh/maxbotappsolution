import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getFeedForStudent } from '../services/feedService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const data = await getFeedForStudent(req.student);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

export default router;
