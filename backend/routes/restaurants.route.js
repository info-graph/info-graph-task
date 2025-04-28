"use strict";
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurants');

router.get('/', restaurantController.getAllRestaurants);

router.get('/:id', restaurantController.getRestaurantById);

router.get('/:id/with-relations', restaurantController.getRestaurantWithRelations);

router.post('/', restaurantController.createRestaurant);

router.put('/:id', restaurantController.updateRestaurant);

router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;