const Joi = require('joi')
const { Food } = require('../models/foodModel')
const {logger} = require('../logger/logger')
const {Order} = require('../models/orderModel')

const validateFood = (food) => {
    const foodSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        foodTags: Joi.string(),
        category: Joi.string(),
        code: Joi.string(),
        isAvailabel: Joi.boolean(),
        restaurant: Joi.string().hex().length(24), // ObjectId
        rating: Joi.number().min(1).max(5),
        ratingCount: Joi.number(),
        imageUrl: Joi.string().uri()
    })

    return foodSchema.validate(food)
}

const createFoodController = async (req,res,next) => {
    try {
        
        const result = validateFood(req.body)
        if(!result){
            logger.error(result.error.details[0].message)
            return res.status(400).send({'message':result.error.details[0].message})
        }
        const food = new Food(req.body)
        const newFood = await food.save()
        logger.info('Food created')
        return res.status(201).send({'message':'foodCreated',food:newFood})

    } catch (error) {
        next(error)
    }
}

const getAllFoodController = async (req,res,next)=>{
    try {
        const foods = await Food.find()
        res.status(200).send({foods})
    } catch (error) {
        next(error)
    }
}
const getFoodById = async(req,res,next)=>{
    try {
        const id = req.params.id
        const food = await Food.findOne({_id:id}).populate('restaurant', 'title')
        res.status(200).send({food})
    } catch (error) {
        
    }
}

const placeOrder = async(req,res,next)=>{
    try {
        const order = req.body
        //calculatePrice
        const foods = order.foods
        let totPrice = 0
        foods.map((food)=>{
            totPrice += food.price
        })
        const order1 = new Order({
            foods:foods,
            price:totPrice,
            buyer:req.session.user.id,

        })
        const newOrder = await order1.save()
        return res.status(201).send({'message':'Order Created',newOrder})
    } catch (error) {
        next(error)
    }
}
module.exports = {createFoodController, getAllFoodController, getFoodById, placeOrder}