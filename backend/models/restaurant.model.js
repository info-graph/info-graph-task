"use strict";

module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    streetName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    openingTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    closingTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    landmarks: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true
    }
  }, {
    tableName: 'restaurants',
    timestamps: true
  });

  return Restaurant;
};