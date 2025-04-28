"use strict";
const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItems');

router.get('/', menuItemController.getAllMenuItems);

router.get('/:id', menuItemController.getMenuItemById);

router.get('/restaurant/:restaurantId', menuItemController.getMenuItemsByRestaurant);

router.post('/', menuItemController.createMenuItem);

router.put('/:id', menuItemController.updateMenuItem);

router.delete('/:id', menuItemController.deleteMenuItem);

module.exports = router;