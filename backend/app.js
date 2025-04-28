"use strict";
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const restaurantRoutes = require('./routes/restaurants.route');
const menuItemRoutes = require('./routes/menuItems.route');
const maintenanceRoutes = require('./routes/maintenance.route');

const { db } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/maintenance', maintenanceRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

db.sync()
  .then(() => {
    console.log('Database connection established');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;