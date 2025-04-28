"use strict";
require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

let sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: true,
    native: true
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected to postgres');
  }).catch((err) => {
    console.log('Unable to connect to the database', err);
  });

const Restaurant = require('./restaurant.model')(sequelize, DataTypes);
const MenuItem = require('./menuItem.model')(sequelize, DataTypes);
const MaintenanceHistory = require('./maintenanceHistory.model')(sequelize, DataTypes);

Restaurant.hasMany(MenuItem, {
  foreignKey: 'restaurant_id',
  as: 'menuItems',
  onDelete: 'CASCADE'
});

MenuItem.belongsTo(Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant'
});

Restaurant.hasMany(MaintenanceHistory, {
  foreignKey: 'restaurant_id',
  as: 'maintenanceRecords',
  onDelete: 'CASCADE'
});

MaintenanceHistory.belongsTo(Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant'
});


module.exports = {
  db: sequelize,
  models: {
    Restaurant,
    MenuItem,
    MaintenanceHistory
  }
};