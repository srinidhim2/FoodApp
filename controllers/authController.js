const Joi = require('joi')
const { User } = require('../models/userModel')
const bcrypt = require('bcrypt')
const JWT_KEY = process.env.JWT_KEY
const jwt = require('jsonwebtoken')
const {logger} = require('../logger/logger')
const validateUser = (user)=>{
    const schema = Joi.object({
        userName:Joi.string().min(4).max(40).required(),
        email:Joi.string().email().required(),
        password: Joi.string().min(5).max(30).required(),
        phone: Joi.string().min(10).max(12).required(),
        address: Joi.string().required(),
        userType: Joi.string().required(),
        answer: Joi.string().required()
    })
    const result = schema.validate(user)
    return result
}

const validateLoginCredientials = (user)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(30).required()
    })
    const result = schema.validate(user);
    return result;
}
const registerController = async (req,res,next)=>{
    try {
        // const {userName,email,address, phone,password} = req.body
        //validation
        const result = validateUser(req.body)
        // console.log(result.error.details[0].message);
        if(result.error){
            logger.error(`POST: Create User: 400 Bad Request ${result.error.details[0].message}`)
            return res.status(400).send({
                message:result.error.details[0].message
            })
        }
        const isExist = await User.isExist(req.body.email);
        if(isExist){
            logger.error(`POST: Create User: User Already Exists with mail id ${isExist.email} \n ${JSON.stringify(req.body, null, 2)}`)
            return res.status(409).send({"message":`User Already Exists with mail id ${isExist.email}`,})
        }
        //hashing
        var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashedPassword
        
        const user = await User.create(req.body)
        logger.info(`POST: User Created: ${JSON.stringify(user, null, 2)}`)
        res.status(201).send({
            'message':'succesfully created user',
            user
        })
    } catch (error) {
        console.log(error);
        // res.status(500).send({
        //     success:false,
        //     messge:'error in register api',
        //     error
        // })
        next(error)
    }
}

const loginController = async function(req,res) {
    const result = validateLoginCredientials(req.body)
    if(result.error){
        res.status(400).send({
                message:result.error.details[0].message
        })
    }
    const {email,password} = result.value
    const user = await User.isExist(email)
    if(!user){
        logger.error(`User with email is not registered ${email}`)
        return res.status(401).send({"message":"You are not registered with this email"})
    }
    // console.log(user)
    const isMatch = await bcrypt.compare(password, user.password)
    const token = generateToken(user)
    if(isMatch){
        logger.info(`POST: LoginSuccess: ${email} \n ${token}`)
        logger.debug(`POST: LoginSuccess: ${JSON.stringify(req.body, null, 2)}`)
        return res.status(201).send({"message":"LoginSuccess",token})
    }
    logger.error(`Invalid credentials ${JSON.stringify(req.body, null, 2)}`)
    return res.status(401).send({"message":"Incorrect credentials"})
}

const generateToken = (user)=>{
    const payload = {
        id:user._id,
        email:user.email,
        userType:user.userType
    }
    console.log(JWT_KEY)
    return jwt.sign(payload,JWT_KEY,{expiresIn:"1h"})
}

module.exports = {registerController, loginController}