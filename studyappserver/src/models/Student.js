import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Student',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      maxUserId: { type: DataTypes.STRING, allowNull: false, unique: true },
      studentCode: { type: DataTypes.STRING, allowNull: false, defaultValue: '11111' },
      firstName: { type: DataTypes.STRING, allowNull: true },
      lastName: { type: DataTypes.STRING, allowNull: true },
      avatarUrl: { type: DataTypes.STRING, allowNull: true },
      university: { type: DataTypes.STRING, allowNull: true },
      faculty: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
      level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      lastRatingPlace: { type: DataTypes.INTEGER, allowNull: true },
      groupId: { type: DataTypes.INTEGER, allowNull: true },
      registrationStep: { type: DataTypes.STRING, allowNull: true },
    },
    { tableName: 'students' }
  );
