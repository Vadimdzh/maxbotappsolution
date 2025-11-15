import express from 'express';
import jwt from 'jsonwebtoken';
import { Student } from '../models/index.js';
import { validateAndParseInitData } from '../services/maxWebAppValidation.js';
import { createMockDataForStudent } from '../services/mockDataService.js';

const router = express.Router();

router.post('/max', async (req, res, next) => {
  try {
    const { initData } = req.body;
    if (!initData) {
      return res.status(400).json({ error: 'initData is required' });
    }
    console.log('y2');
    const validation = validateAndParseInitData(initData, process.env.BOT_TOKEN);
    if (!validation.valid) {
      return res.status(401).json({ error: 'Invalid init data' });
    }
    console.log('y3');
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret is not configured');
    }
    console.log('y4');
    const userData = validation.user || {};
    if (!userData.id) {
      return res.status(400).json({ error: 'User payload is missing id' });
    }
  
    const maxUserId = String(userData.id);
    const defaults = {
      maxUserId,
      studentCode: '11111',
      firstName: userData.first_name || userData.firstName || '',
      lastName: userData.last_name || userData.lastName || '',
      avatarUrl: userData.photo_url || null,
    };
    const [student, created] = await Student.findOrCreate({
      where: { maxUserId },
      defaults,
    });


    if (!created) {
      await student.update({
        firstName: defaults.firstName || student.firstName,
        lastName: defaults.lastName || student.lastName,
        avatarUrl: defaults.avatarUrl || student.avatarUrl,
      });
    }

    if (!student.groupId) {
      await createMockDataForStudent(student);
    }

    const token = jwt.sign({ studentId: student.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        avatarUrl: student.avatarUrl,
        university: student.university,
        faculty: student.faculty,
        phone: student.phone,
        email: student.email,
        level: student.level,
        points: student.points,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
