const express = require('express')
const colors = require('colors')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const handleErrors = require('./middlewares/error-handler');
const {logger} = require('./logger/logger');
// dotenv config
dotenv.config()
//dotenv.config({path:''})

//dbConn
const {dbConn} = require('./config/db')
dbConn()
//Variables
const PORT = process.env.PORT || 5000

//imports
const {api} = require('./routes/app')

//create rest object
const app = express()

//create server
app.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT}`.bgBlue)
    console.log(`Server is running on port ${PORT}`.bgBlue)
})
 
//middlewares
app.use(morgan('dev', { stream: logger.stream }));
app.use(cors())
app.use(express.json())
app.use('/api',api)

//routes
app.get('/',(req,res)=>{
    res.json({
        "messgae":"welcome to the app"
    })
    // return res.status(200).send("<h1>Welcome to the app</h1>")
})

app.use(handleErrors)