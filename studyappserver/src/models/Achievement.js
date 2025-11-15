import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Achievement',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      imageUrl: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: 'achievements' }
  );
