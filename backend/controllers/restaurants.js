"use strict";
const { models } = require('../models');
const { Restaurant, MenuItem, MaintenanceHistory } = models;

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    console.error("Error in getAllRestaurants:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants.",
      error: error.message
    });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error("Error in getRestaurantById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant.",
      error: error.message
    });
  }
};

exports.getRestaurantWithRelations = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        { model: MenuItem, as: 'menuItems' },
        { model: MaintenanceHistory, as: 'maintenanceRecords' }
      ]
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error("Error in getRestaurantWithRelations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant with relations.",
      error: error.message
    });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error("Error in createRestaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create restaurant.",
      error: error.message
    });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    await restaurant.update(req.body);

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error("Error in updateRestaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update restaurant.",
      error: error.message
    });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    await restaurant.destroy();

    res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error("Error in deleteRestaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete restaurant.",
      error: error.message
    });
  }
};
