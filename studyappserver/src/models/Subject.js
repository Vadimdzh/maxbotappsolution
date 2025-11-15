import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Subject',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: 'subjects' }
  );
