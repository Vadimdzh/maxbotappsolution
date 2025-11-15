import { Lesson, Subject, Group } from '../models/index.js';

function normalizeDate(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  return date;
}

function getWeekdayNumber(date) {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

export async function getScheduleForDate(student, dateStr) {
  if (!student.groupId) {
    return [];
  }
  const group = await Group.findByPk(student.groupId);
  if (!group) {
    return [];
  }
  const date = normalizeDate(dateStr);
  const weekday = getWeekdayNumber(date);
  const lessons = await Lesson.findAll({
    where: { groupId: group.id, weekday },
    include: [{ model: Subject }],
    order: [['startTime', 'ASC']],
  });
  return lessons.map((lesson) => ({
    subjectName: lesson.Subject?.name || 'Предмет',
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    room: lesson.room,
  }));
}

export function formatScheduleForText(lessons) {
  if (!lessons.length) {
    return 'На выбранный день занятий нет.';
  }
  return lessons
    .map(
      (lesson) =>
        `${lesson.startTime} — ${lesson.endTime} • ${lesson.subjectName}${lesson.room ? ` (${lesson.room})` : ''}`
    )
    .join('\n');
}
