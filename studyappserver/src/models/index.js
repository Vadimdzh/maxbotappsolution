import sequelize from '../config/database.js';
import FlowModel from './Flow.js';
import GroupModel from './Group.js';
import StudentModel from './Student.js';
import SubjectModel from './Subject.js';
import LessonModel from './Lesson.js';
import GradeModel from './Grade.js';
import AttendanceModel from './Attendance.js';
import EventModel from './Event.js';
import AchievementModel from './Achievement.js';
import AchievementLevelModel from './AchievementLevel.js';
import UserAchievementModel from './UserAchievement.js';

const Flow = FlowModel(sequelize);
const Group = GroupModel(sequelize);
const Student = StudentModel(sequelize);
const Subject = SubjectModel(sequelize);
const Lesson = LessonModel(sequelize);
const Grade = GradeModel(sequelize);
const Attendance = AttendanceModel(sequelize);
const Event = EventModel(sequelize);
const Achievement = AchievementModel(sequelize);
const AchievementLevel = AchievementLevelModel(sequelize);
const UserAchievement = UserAchievementModel(sequelize);

Flow.hasMany(Group, { foreignKey: 'flowId' });
Group.belongsTo(Flow, { foreignKey: 'flowId' });

Group.hasMany(Student, { foreignKey: 'groupId' });
Student.belongsTo(Group, { foreignKey: 'groupId' });

Group.hasMany(Lesson, { foreignKey: 'groupId' });
Lesson.belongsTo(Group, { foreignKey: 'groupId' });

Subject.hasMany(Lesson, { foreignKey: 'subjectId' });
Lesson.belongsTo(Subject, { foreignKey: 'subjectId' });

Student.hasMany(Grade, { foreignKey: 'studentId' });
Grade.belongsTo(Student, { foreignKey: 'studentId' });
Subject.hasMany(Grade, { foreignKey: 'subjectId' });
Grade.belongsTo(Subject, { foreignKey: 'subjectId' });

Student.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(UserAchievement, { foreignKey: 'studentId' });
UserAchievement.belongsTo(Student, { foreignKey: 'studentId' });

Achievement.hasMany(AchievementLevel, { foreignKey: 'achievementId' });
AchievementLevel.belongsTo(Achievement, { foreignKey: 'achievementId' });

Achievement.hasMany(UserAchievement, { foreignKey: 'achievementId' });
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievementId' });

export {
  sequelize,
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
};

export default {
  sequelize,
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
};
