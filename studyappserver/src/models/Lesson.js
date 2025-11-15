import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Lesson',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      groupId: { type: DataTypes.INTEGER, allowNull: false },
      subjectId: { type: DataTypes.INTEGER, allowNull: false },
      weekday: { type: DataTypes.INTEGER, allowNull: false, comment: '1 = Monday, 7 = Sunday' },
      startTime: { type: DataTypes.STRING, allowNull: false },
      endTime: { type: DataTypes.STRING, allowNull: false },
      room: { type: DataTypes.STRING, allowNull: true },
    },
    { tableName: 'lessons' }
  );
