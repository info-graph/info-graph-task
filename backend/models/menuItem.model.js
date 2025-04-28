"use strict";

module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serving_start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    serving_end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
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
    tableName: 'menu_items',
    timestamps: true
  });

  return MenuItem;
};