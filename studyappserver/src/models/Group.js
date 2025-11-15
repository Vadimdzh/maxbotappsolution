import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Group',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      flowId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'groups' }
  );
