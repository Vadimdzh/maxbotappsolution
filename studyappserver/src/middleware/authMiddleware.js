import jwt from 'jsonwebtoken';
import { Student } from '../models/index.js';

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret is not configured');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findByPk(payload.studentId);
    if (!student) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.student = student;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
