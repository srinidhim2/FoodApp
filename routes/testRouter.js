const express = require('express')
const app = express()
const testRouter = express.Router()
const {testControllerGet} = require('../controllers/testController')

testRouter.get('/test-get',testControllerGet)

module.exports = {testRouter}