const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const { logger } = require('../logger/logger');
const userAuth = async (req,res,next)=>{
    try {
        const token = req.headers["authorization"]
        const payload = jwt.verify(token,process.env.JWT_KEY)
        const user = User.findOne({_id:payload.id})
        if(!user)
            mext('Unautorizedd')
        const session = req.session;
        req.session = {
            user: payload
        };
        next()
    } catch (error) {
        console.log('401 unauthourized')
        console.log(error)
        logger.error(error)
        res.status(401).send({
            success:false,
            message:'Unauthorized',
            error
        })
    }
}

const adminAuth = async (req,res,next)=>{
    try {
        const token = req.headers["authorization"]
        
        const payload = jwt.verify(token,process.env.JWT_KEY)
        const session = req.session;
        req.session = {
            user: payload.payload
        };
        const user = await User.findOne({_id:payload.id})
        if(user.userType != 'admin')
            throw new Error('Unauthorized')
        next()
    } catch (error) {
        logger.error(error)
        console.log('401 unauthourized')
        console.log(error)
        res.status(401).send({
            success:false,
            message:'Unauthorized',
            error
        })
    }
}

module.exports = {userAuth, adminAuth}