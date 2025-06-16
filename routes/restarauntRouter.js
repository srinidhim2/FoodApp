const express = require('express')
const Restaurant = require('../models/restaurantModel')
const { adminAuth, userAuth } = require('../middlewares/authMiddleware')
const { createRestaurantController, getAllRestaurantsController, getRestaurantById } = require('../controllers/restaurantController')

const restaurantRouter = express.Router()

restaurantRouter.post('/createRestaurant',adminAuth,createRestaurantController)
restaurantRouter.get('/',userAuth,getAllRestaurantsController)
restaurantRouter.get('/:id',userAuth,getRestaurantById)

module.exports = {restaurantRouter}