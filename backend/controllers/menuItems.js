"use strict";
const { models } = require('../models');
const { MenuItem, Restaurant } = models;

exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll();
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error("Error in getAllMenuItems:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items.",
      error: error.message
    });
  }
};

exports.getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const menuItems = await MenuItem.findAll({
      where: { restaurant_id: restaurantId }
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error("Error in getMenuItemsByRestaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items by restaurant.",
      error: error.message
    });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [{ model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }]
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error("Error in getMenuItemById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu item.",
      error: error.message
    });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const menuItem = await MenuItem.create(req.body);
    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error("Error in createMenuItem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create menu item.",
      error: error.message
    });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    if (req.body.restaurant_id && req.body.restaurant_id !== menuItem.restaurant_id) {
      const restaurant = await Restaurant.findByPk(req.body.restaurant_id);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: 'New restaurant not found'
        });
      }
    }

    await menuItem.update(req.body);

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error("Error in updateMenuItem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update menu item.",
      error: error.message
    });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await menuItem.destroy();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error("Error in deleteMenuItem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete menu item.",
      error: error.message
    });
  }
};
