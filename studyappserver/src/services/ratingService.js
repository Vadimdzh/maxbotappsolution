import { Student, Group } from '../models/index.js';

async function getStudentFlowId(student) {
  if (student.groupId) {
    const group = await Group.findByPk(student.groupId);
    return group ? group.flowId : null;
  }
  const withGroup = await Student.findByPk(student.id, { include: { model: Group } });
  return withGroup?.Group?.flowId ?? null;
}

export async function getRatingSummary(student) {
  const flowId = await getStudentFlowId(student);
  if (!flowId) {
    return { place: 1, total: 1, points: student.points || 0 };
  }
  const students = await Student.findAll({
    include: {
      model: Group,
      attributes: [],
      where: { flowId },
    },
    order: [
      ['points', 'DESC'],
      ['id', 'ASC'],
    ],
  });
  const index = students.findIndex((s) => s.id === student.id);
  return {
    place: index >= 0 ? index + 1 : students.length + 1,
    total: students.length,
    points: student.points || 0,
  };
}

export { getStudentFlowId };
