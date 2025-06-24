const express = require('express')
const Food = require('../models/foodModel')
const { adminAuth, userAuth } = require('../middlewares/authMiddleware')
const { createFoodController, getAllFoodController, getFoodById, placeOrder } = require('../controllers/foodController')

const foodRouter = express.Router()

foodRouter.post('/',userAuth, createFoodController)
foodRouter.get('/all',userAuth, getAllFoodController)
foodRouter.get('/:id',userAuth, getFoodById)

foodRouter.post('/placeOrder', userAuth, placeOrder)

module.exports = {foodRouter}