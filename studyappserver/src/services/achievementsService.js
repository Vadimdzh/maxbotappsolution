import { Achievement, AchievementLevel, UserAchievement } from '../models/index.js';

export async function getStudentAchievements(studentId) {
  const userAchievements = await UserAchievement.findAll({
    where: { studentId },
    include: [{ model: Achievement }],
  });

  const results = [];
  for (const item of userAchievements) {
    const nextLevel = await AchievementLevel.findOne({
      where: { achievementId: item.achievementId, level: item.level + 1 },
      order: [['level', 'ASC']],
    });
    results.push({
      id: item.achievementId,
      title: item.Achievement?.title || 'Достижение',
      description: item.Achievement?.description || '',
      imageUrl: item.Achievement?.imageUrl || '',
      level: item.level,
      points: item.points,
      nextLevelRequiredPoints: nextLevel ? nextLevel.requiredPoints : null,
    });
  }
  return results;
}
