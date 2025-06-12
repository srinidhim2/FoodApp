const mongoose = require('mongoose')
// const dotenv = require('dotenv')
const colors = require('colors')
const {logger} = require('../logger/logger')

const dbConn = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        logger.info(`Connected to DB ${mongoose.connection.host}`.bgGreen)
        console.log(`Connected to DB ${mongoose.connection.host}`.bgGreen);
    } catch (error) {
        console.log(`Could not connect to DB ${error}`.bgRed)
        logger.error(error)
    }
}
    
module.exports = {dbConn}