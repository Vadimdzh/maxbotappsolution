import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Grade',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      studentId: { type: DataTypes.INTEGER, allowNull: false },
      subjectId: { type: DataTypes.INTEGER, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: 'grades', timestamps: true }
  );
