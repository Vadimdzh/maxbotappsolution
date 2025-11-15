import express from 'express';
import authRoutes from './routes/authRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import achievementsRoutes from './routes/achievementsRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors())

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/profile', profileRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

export default app;
