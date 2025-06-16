const Joi = require('joi')
const { Restaurant } = require('../models/restaurantModel')
const {logger} = require('../logger/logger')

const validateRestaurant = (restaurant)=>{
    const restaurantSchema = Joi.object({
        title:Joi.string().required(),
        imageUrl:Joi.string(),
        foods:Joi.array(),
        time:Joi.string(),
        pickup:Joi.boolean(),
        delivery:Joi.boolean(),
        isOpen:Joi.boolean(),
        logoUrl:Joi.string(),
        rating:Joi.number(),
        ratingCount:Joi.number(),
        code:Joi.string(),
        coords:Joi.object()
    })
    const result = restaurantSchema.validate(restaurant)
    return result
}

const createRestaurantController = async (req,res,next)=>{
    try {
        const result = validateRestaurant(req.body)
        if(result.error){
            return res.status(400).send({"message":result.error.details[0].message})
        }
        const isExist = await Restaurant.isExist(req.body.title)
        if(isExist){
            logger.error(`Restaurant with title:${req.body.title} already exists`)
            return res.status(409).send({'message':`Restaurant with title:${req.body.title} already exists`})
        }
        const restaurant = new Restaurant(req.body)
        const newRestaurant = await restaurant.save()
        if(!newRestaurant){
            logger.error(newRestaurant)
            return next(newRestaurant)
        }
        logger.info({'message':'New Restaurant is Created',newRestaurant})
        return res.status(201).send({'message':'New Restaurant is Created',newRestaurant})
    } catch (error) {
        next(error)
    }
}

const getAllRestaurantsController = async (req,res,next)=>{
    try {
        const restaurants = await Restaurant.find()
        if(!restaurants){
            logger.error('No restaurants available')
            return res.status(404).send({'message':'No restaurants available'})
        }
        logger.info(restaurants)
        return res.status(200).send({'no of restaurants':restaurants.length,restaurants})
    } catch (error) {
        next(error)
    }
}

const getRestaurantById = async (req,res,next)=>{
    try {
        const id = req.params.id
        const restaurant = await Restaurant.findById({_id:id})
        if(!restaurant){
            logger.error(`No restaurant was found with the id:${id}`)
            return res.status(404).send({'message':`No restaurant was found with the id:${id}`})
        }
        logger.info(restaurant)
        return res.status(200).send({restaurant})
    } catch (error) {
        next(error)
    }
}

module.exports = {createRestaurantController, getAllRestaurantsController, getRestaurantById}