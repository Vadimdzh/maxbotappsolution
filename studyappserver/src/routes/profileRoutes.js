import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { serializeProfile, updateStudentProfile } from '../services/profileService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  return res.json(serializeProfile(req.student));
});

router.put('/', async (req, res, next) => {
  try {
    const profile = await updateStudentProfile(req.student, req.body || {});
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
});

export default router;
