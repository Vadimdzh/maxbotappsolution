import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'UserAchievement',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      studentId: { type: DataTypes.INTEGER, allowNull: false },
      achievementId: { type: DataTypes.INTEGER, allowNull: false },
      level: { type: DataTypes.INTEGER, allowNull: false },
      points: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'user_achievements' }
  );
