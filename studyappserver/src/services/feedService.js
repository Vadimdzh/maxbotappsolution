import { Op } from 'sequelize';
import { Grade, Subject, Attendance, Event } from '../models/index.js';
import { getRatingSummary } from './ratingService.js';

const LAST_GRADES_LIMIT = 5;
const EVENTS_LIMIT = 5;

function calculateAttendanceStreak(records) {
  if (!records.length) return 0;
  const map = new Map(records.map((record) => [record.date, record.present]));
  let streak = 0;
  const current = new Date();
  while (true) {
    const iso = current.toISOString().slice(0, 10);
    if (map.get(iso)) {
      streak += 1;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export async function getFeedForStudent(student) {
  const rating = await getRatingSummary(student);
  const delta = typeof student.lastRatingPlace === 'number' ? student.lastRatingPlace - rating.place : 0;
  if (student.lastRatingPlace !== rating.place) {
    student.lastRatingPlace = rating.place;
    await student.save();
  }

  const grades = await Grade.findAll({
    where: { studentId: student.id },
    include: [{ model: Subject }],
    order: [['createdAt', 'DESC']],
    limit: LAST_GRADES_LIMIT,
  });

  const attendanceRecords = await Attendance.findAll({
    where: { studentId: student.id },
    order: [['date', 'DESC']],
  });

  const upcomingEvents = await Event.findAll({
    where: { date: { [Op.gte]: new Date() } },
    order: [['date', 'ASC']],
    limit: EVENTS_LIMIT,
  });

  return {
    ratingPlace: rating.place,
    ratingDelta: delta,
    lastGrades: grades.map((grade) => ({
      subjectName: grade.Subject?.name || 'Предмет',
      value: grade.value,
      date: grade.createdAt,
    })),
    attendanceStreakDays: calculateAttendanceStreak(attendanceRecords),
    upcomingEvents: upcomingEvents.map((event) => ({
      date: event.date,
      title: event.title,
      link: event.link,
    })),
  };
}
