const jwt = require('jsonwebtoken')
const { User } = require('../models/userModel')
const {logger} = require('../logger/logger')
const bcrypt = require('bcrypt')

const getPayloadFromToken =  (req)=>{
    const token = req.headers["authorization"]
    const payload = jwt.verify(token,process.env.JWT_KEY)
    return payload
}

const getUserController = async (req,res,next)=>{
    try {
        const payload = getPayloadFromToken(req)
        const userId = payload.id
        const user = await User.findOne({_id:userId})
        logger.debug(`GET: Get User: 200: ${JSON.stringify(user, null, 2)}`)
        res.json({user})
    } catch (error) {
        next(error)
    }
}

const getUsersController = async (req,res,next)=>{
    try {
        const payload = getPayloadFromToken(req)
        const userId = payload.id
        const users = await User.find()
        logger.debug(`GET: Get Users: 200 ${JSON.stringify(users,null,2)}`)
        res.json({'Total No of Users':users.length,users})
    } catch (error) {
        next(new Error(error))
    }
}

const getUserByIdController = async (req,res,next)=>{
    try {
        const payload = getPayloadFromToken(req)
        const userId = req.params.id
        const user = await User.findOne({_id:userId},{password:0})
        if(!user){
            logger.error(`GET: Get User By Id: 404 User Not Found ${req.params.id}`)
            return res.status(404).send({"message":"User Not found"})
        }
        logger.info(`GET: Get User By Id:200 ${JSON.stringify(user, null, 2)}`)
        // user.password = undefined
        res.json({user})
    } catch (error) {
        next(error)
    }
}

const updateUserController= async (req,res,next) => {
    try {
        logger.debug(`PUT, UpdateUser Request:${req.session.user.id} \n ${JSON.stringify(req.body, null, 2)}`)
        const user = await User.findById({_id:req.session.user.id})
        if(!user){
            logger.error(`PUT: UpdateUser: 404 User Not Found ${req.session.user.id}`)
            return res.status(404).send({'message':'User Not Found'})
        }
        const {userName,address,phone} = req.body
        if(userName) user.UserName = userName
        if(address) user.address = address
        if(phone) user.phone = phone
        const result = await user.save()
        user.password = undefined
        logger.debug('PUT, UpdateUser Response 200:\n'+user)
        res.status(200).send({'message':'UserUpdatedSuccessfully',user})
        // res.json({})
    } catch (error) {
        next(new Error(error))
    }
}

const resetPasswordController = async (req,res,next)=>{
    try {
        const userId = req.session.user.id
        const newPass = req.body.newPassword
        const reNewPass = req.body.reEnterNewPassword
        const user = await User.findById({_id:userId})
        // const isMatch = await bcrypt.compare(oldPassword, user.password)
        const isMatch = req.body.answer == user.answer
        if(!isMatch){
            logger.error('Incorrect Answer')
            return res.status(400).send({'message':'Incorect Answer'})
        }
        if(!user){
            logger.error('User Not Found')
            return res.status(404).send({'message':'User Not Found'})
        }
        if(newPass != reNewPass){
            logger.error('Passwords dont match')
            return res.status(400).send({'message':'Passwords dont match'})
        }
        var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(newPass,salt)
        user.password = hashedPassword
        const result = await user.save()
        if(result){
            logger.info('Password Change Success')
            return res.status(201).send({'message':'Password Change Success'})
        }
        next()
    } catch (error) {
        next(error)
    }
}

const deleteUserController =async (req,res,next)=>{
    try {
        const id = req.params.id
        const user = await User.findByIdAndDelete({_id:id})
        console.log(user)
        if(!user){
            logger.error(`User Not found ${id}`)
            return res.status(404).send({'message':'User Not Found'})
        }
        logger.info(`User Deleted Successfully}`.bgRed)
        logger.debug(`Deleted User ${JSON.stringify(user, null, 2)}`)
        res.status(204).send({'message':'User Deleted Successfully'})
    } catch (error) {
        next(error)
    }
}

module.exports = {getUserController, getUsersController, getUserByIdController, updateUserController, resetPasswordController, deleteUserController}