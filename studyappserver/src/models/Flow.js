import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Flow',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: true },
    },
    { tableName: 'flows' }
  );
