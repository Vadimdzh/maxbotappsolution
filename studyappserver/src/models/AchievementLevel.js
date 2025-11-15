import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'AchievementLevel',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      achievementId: { type: DataTypes.INTEGER, allowNull: false },
      level: { type: DataTypes.INTEGER, allowNull: false },
      requiredPoints: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'achievement_levels' }
  );
