"use strict";

module.exports = (sequelize, DataTypes) => {
  const MaintenanceHistory = sequelize.define('MaintenanceHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    impactLevel: {
      type: DataTypes.ENUM('complete', 'partial', 'normal'),
      allowNull: false
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    comments: {
      type: DataTypes.TEXT
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id'
      }
    }
  }, {
    tableName: 'maintenance_history',
    timestamps: true
  });

  return MaintenanceHistory;
};