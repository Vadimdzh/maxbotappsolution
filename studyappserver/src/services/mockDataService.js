import { Op } from 'sequelize';
import {
  Flow,
  Group,
  Student,
  Subject,
  Lesson,
  Grade,
  Attendance,
  Event,
  Achievement,
  AchievementLevel,
  UserAchievement,
} from '../models/index.js';

const SUBJECT_NAMES = ['Управление рисками', 'Моделирование БП', 'Теория игр', 'Инвестиционный менеджмент', 'Архитектура КИС', 'Налоговый менеджмент'];
const LESSON_TEMPLATES = [
  { subject: 'Управление рисками', weekday: 1, startTime: '09:00', endTime: '10:40', room: 'Аудитория 101' },
  { subject: 'Моделирование БП', weekday: 2, startTime: '11:00', endTime: '12:40', room: 'Аудитория 203' },
  { subject: 'Теория игр', weekday: 3, startTime: '13:00', endTime: '14:40', room: 'Лаборатория 5' },
  { subject: 'Инвестиционный менеджмент', weekday: 3, startTime: '15:00', endTime: '16:20', room: 'Лаборатория 5' },
  { subject: 'Налоговый менеджмент', weekday: 3, startTime: '16:40', endTime: '18:00', room: 'Лаборатория 5' },
  { subject: 'Управление рисками', weekday: 3, startTime: '18:00', endTime: '19:20', room: 'Лаборатория 5' },
];
const EVENT_TEMPLATES = [
  { offsetDays: 2, title: 'Хакатон факультета', link: 'https://events.local/hack' },
  { offsetDays: 5, title: 'День открытых дверей', link: 'https://events.local/open-day' },
  { offsetDays: 9, title: 'Научный семинар', link: null },
];
const ACHIEVEMENT_DATA = [
  {
    code: 'A_PLUS',
    title: 'Легенда СЕССИИ',
    description: 'Получи средний балл 5.0',
    imageUrl: 'assets/Misc items/Icons/Zachetka_dia.png',
    levels: [
      { level: 1, requiredPoints: 50 },
      { level: 2, requiredPoints: 100 },
      { level: 3, requiredPoints: 200 },
    ],
  },
  {
    code: 'HARD_WORKER',
    title: 'Турбо ДВИЖОК',
    description: 'Сдай 10 заданий досрочно',
    imageUrl: 'assets/Misc items/Icons/Speedrun_ruby.png',
    levels: [
      { level: 1, requiredPoints: 30 },
      { level: 2, requiredPoints: 80 },
      { level: 3, requiredPoints: 160 },
    ],
  },
  {
    code: 'DEADLINE_MAG',
    title: 'Магистр ДЕДЛАЙНОВ',
    description: 'Сдай 30 заданий без опозданий',
    imageUrl: 'assets/Misc items/Icons/Deadline_gold.png',
    levels: [
      { level: 1, requiredPoints: 30 },
      { level: 2, requiredPoints: 80 },
      { level: 3, requiredPoints: 160 },
    ],
  },
  {
    code: 'CULTURE_CODE',
    title: 'Культурный КОД',
    description: 'Посетил 5 внеучебных занятий',
    imageUrl: 'assets/Misc items/Icons/Student_silver.png',
    levels: [
      { level: 1, requiredPoints: 30 },
      { level: 2, requiredPoints: 80 },
      { level: 3, requiredPoints: 160 },
    ],
  },
  {
    code: 'ZACHET_MASTER',
    title: 'Мастер ЗАЧЁТКИ',
    description: 'Закрой все предметы за семестр',
    imageUrl: 'assets/Misc items/Icons/Earlybird_bronze.png',
    levels: [
      { level: 1, requiredPoints: 30 },
      { level: 2, requiredPoints: 80 },
      { level: 3, requiredPoints: 160 },
    ],
  },
  {
    code: 'VOICE_OF_FACULTY',
    title: 'Голос ФАКУЛЬТЕТА',
    description: 'Выступи или стань ведущим мероприятия',
    imageUrl: 'assets/Misc items/Icons/Gentleman_locked.png',
    levels: [
      { level: 1, requiredPoints: 30 },
      { level: 2, requiredPoints: 80 },
      { level: 3, requiredPoints: 160 },
    ],
  },
];
const PEER_NAMES = ['Андрей Смирнов', 'Мария Иванова', 'Дмитрий Кузнецов', 'Алёна Сергеева'];

async function ensureFlowAndGroup() {
  let flow = await Flow.findOne();
  if (!flow) {
    flow = await Flow.create({ name: 'Основной поток', code: 'FLOW-1' });
  }
  let group = await Group.findOne({ where: { flowId: flow.id } });
  if (!group) {
    group = await Group.create({ name: 'Группа А', flowId: flow.id });
  }
  return { flow, group };
}

async function ensureSubjects() {
  const items = new Map();
  for (const name of SUBJECT_NAMES) {
    const [subject] = await Subject.findOrCreate({ where: { name }, defaults: { name } });
    items.set(name, subject);
  }
  return items;
}

async function ensureLessons(group, subjectsMap) {
  for (const template of LESSON_TEMPLATES) {
    const subject = subjectsMap.get(template.subject);
    if (!subject) continue;
    await Lesson.findOrCreate({
      where: {
        groupId: group.id,
        subjectId: subject.id,
        weekday: template.weekday,
        startTime: template.startTime,
      },
      defaults: {
        groupId: group.id,
        subjectId: subject.id,
        weekday: template.weekday,
        startTime: template.startTime,
        endTime: template.endTime,
        room: template.room,
      },
    });
  }
}

async function ensureEvents() {
  for (const template of EVENT_TEMPLATES) {
    const date = new Date();
    date.setDate(date.getDate() + template.offsetDays);
    await Event.findOrCreate({
      where: { title: template.title },
      defaults: { title: template.title, date, link: template.link },
    });
  }
}

async function ensureAchievements() {
  const achievements = [];
  for (const item of ACHIEVEMENT_DATA) {
    const [achievement] = await Achievement.findOrCreate({
      where: { code: item.code },
      defaults: {
        code: item.code,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
      },
    });
    for (const level of item.levels) {
      await AchievementLevel.findOrCreate({
        where: { achievementId: achievement.id, level: level.level },
        defaults: {
          achievementId: achievement.id,
          level: level.level,
          requiredPoints: level.requiredPoints,
        },
      });
    }
    achievements.push(achievement);
  }
  return achievements;
}

async function ensureLeaderboardPeers(flowId, groupId, excludeStudentId) {
  const peers = await Student.findAll({
    where: { groupId, id: { [Op.ne]: excludeStudentId } },
  });
  if (peers.length >= PEER_NAMES.length) {
    return;
  }
  for (const name of PEER_NAMES) {
    const [firstName, lastName] = name.split(' ');
    const maxUserId = `mock_${flowId}_${name.replace(/\s+/g, '_')}`;
    const [student, created] = await Student.findOrCreate({
      where: { maxUserId },
      defaults: {
        studentCode: '11111',
        firstName,
        lastName,
        groupId,
        points: Math.floor(Math.random() * 200) + 50,
      },
    });
    if (!created && student.groupId !== groupId) {
      await student.update({ groupId });
    }
  }
}

async function seedGrades(student, subjects) {
  const count = await Grade.count({ where: { studentId: student.id } });
  if (count > 0) return;
  const now = new Date();
  const grades = [];
  for (let i = 0; i < subjects.length; i += 1) {
    const when = new Date(now);
    when.setDate(when.getDate() - i);
    grades.push({
      studentId: student.id,
      subjectId: subjects[i].id,
      value: ['5', '4', 'A'][i % 3],
      createdAt: when,
      updatedAt: when,
    });
  }
  await Grade.bulkCreate(grades);
}

async function seedAttendance(student) {
  const count = await Attendance.count({ where: { studentId: student.id } });
  if (count > 0) return;
  const today = new Date();
  const entries = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    entries.push({
      studentId: student.id,
      date: date.toISOString().slice(0, 10),
      present: i < 6,
    });
  }
  await Attendance.bulkCreate(entries);
}

async function seedUserAchievements(student, achievements) {
  for (const achievement of achievements) {
    await UserAchievement.findOrCreate({
      where: { studentId: student.id, achievementId: achievement.id },
      defaults: { studentId: student.id, achievementId: achievement.id, level: 1, points: 50 },
    });
  }
}

export async function createMockDataForStudent(student) {
  const { flow, group } = await ensureFlowAndGroup();
  await student.update({ groupId: group.id, points: Math.max(student.points, 120) });
  const subjectsMap = await ensureSubjects();
  await ensureLessons(group, subjectsMap);
  await ensureEvents();
  const achievements = await ensureAchievements();
  await ensureLeaderboardPeers(flow.id, group.id, student.id);
  await seedGrades(student, Array.from(subjectsMap.values()));
  await seedAttendance(student);
  await seedUserAchievements(student, achievements);
}
