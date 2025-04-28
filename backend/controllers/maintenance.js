"use strict";
const { models } = require('../models');
const { MaintenanceHistory, Restaurant } = models;

exports.getAllMaintenanceRecords = async (req, res, next) => {
  try {
    const maintenanceRecords = await MaintenanceHistory.findAll();
    res.status(200).json({
      success: true,
      count: maintenanceRecords.length,
      data: maintenanceRecords
    });
  } catch (error) {
    next(error);
  }
};

exports.getMaintenanceByRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    const maintenanceRecords = await MaintenanceHistory.findAll({
      where: { restaurant_id: restaurantId }
    });
    
    res.status(200).json({
      success: true,
      count: maintenanceRecords.length,
      data: maintenanceRecords
    });
  } catch (error) {
    next(error);
  }
};

exports.getMaintenanceById = async (req, res, next) => {
  try {
    const maintenanceRecord = await MaintenanceHistory.findByPk(req.params.id, {
      include: [{ model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }]
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: maintenanceRecord
    });
  } catch (error) {
    next(error);
  }
};

exports.createMaintenance = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    const maintenanceRecord = await MaintenanceHistory.create(req.body);
    res.status(201).json({
      success: true,
      data: maintenanceRecord
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMaintenance = async (req, res, next) => {
  try {
    const maintenanceRecord = await MaintenanceHistory.findByPk(req.params.id);
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }
    
    if (req.body.restaurant_id && req.body.restaurant_id !== maintenanceRecord.restaurant_id) {
      const restaurant = await Restaurant.findByPk(req.body.restaurant_id);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: 'New restaurant not found'
        });
      }
    }
    
    await maintenanceRecord.update(req.body);
    
    res.status(200).json({
      success: true,
      data: maintenanceRecord
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMaintenance = async (req, res, next) => {
  try {
    const maintenanceRecord = await MaintenanceHistory.findByPk(req.params.id);
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }
    
    await maintenanceRecord.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Maintenance record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};