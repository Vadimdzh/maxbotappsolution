import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Event',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      date: { type: DataTypes.DATE, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      link: { type: DataTypes.STRING, allowNull: true },
    },
    { tableName: 'events' }
  );
