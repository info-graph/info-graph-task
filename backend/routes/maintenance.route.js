"use strict";
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance');

router.get('/', maintenanceController.getAllMaintenanceRecords);

router.get('/:id', maintenanceController.getMaintenanceById);

router.get('/restaurant/:restaurantId', maintenanceController.getMaintenanceByRestaurant);

router.post('/', maintenanceController.createMaintenance);

router.put('/:id', maintenanceController.updateMaintenance);

router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;