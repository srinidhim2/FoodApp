const express = require('express')
const app = express()
const {testRouter} = require('./testRouter')
const { authRouter } = require('./authRouter')
const { userRouter } = require('./userRoutes')
const {logger} = require('../logger/logger')
const api = express.Router()

//routes
api.use((req, res, next) => {
    logger.info(`START ${req.method} ${req.originalUrl}`);
    next();
});
api.use('/test',testRouter)
api.use('/auth',authRouter)
api.use('/user',userRouter)
api.get('/',(req,res)=>{
    res.json({"message":"Welcome to API page"})
})



module.exports = {api}