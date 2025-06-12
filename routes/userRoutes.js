const express = require('express')
const { getUserController, getUsersController, getUserByIdController, updateUserController, resetPasswordController, deleteUserController } = require('../controllers/userController')
const { userAuth,adminAuth } = require('../middlewares/authMiddleware')


const userRouter = express.Router()

userRouter.get('/getUser',userAuth, getUserController)
userRouter.get('/users',adminAuth, getUsersController)
userRouter.get('/:id', adminAuth, getUserByIdController)
userRouter.put('/updateUser',userAuth, updateUserController)
userRouter.post('/resetPassword',userAuth,resetPasswordController)
userRouter.delete('/deleteUser/:id', userAuth, deleteUserController)

module.exports = {userRouter}