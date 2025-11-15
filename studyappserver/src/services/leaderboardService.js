import { Student, Group } from '../models/index.js';

function combineName(student) {
  return [student.firstName, student.lastName].filter(Boolean).join(' ').trim() || 'Студент';
}

export async function getLeaderboard(flowId, limit = 7) {
  if (!flowId) return [];
  const students = await Student.findAll({
    include: { model: Group, attributes: [], where: { flowId } },
    order: [
      ['points', 'DESC'],
      ['id', 'ASC'],
    ],
    limit,
  });
  return students.map((student) => ({
    id: student.id,
    avatarUrl: student.avatarUrl,
    fullName: combineName(student),
    points: student.points,
  }));
}
