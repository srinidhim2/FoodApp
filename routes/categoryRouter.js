const express = require('express')
const Category = require('../models/categoryModel')
const { adminAuth, userAuth } = require('../middlewares/authMiddleware')
const { createCategoryController, getAllCategoriesContorller, updateCategory, deleteCategory } = require('../controllers/categoryController')

const categoryRouter = express.Router()

categoryRouter.post('/',adminAuth, createCategoryController)
categoryRouter.get('/',userAuth,getAllCategoriesContorller)
categoryRouter.put('/:id',adminAuth,updateCategory)
categoryRouter.delete('/:id',adminAuth,deleteCategory)

module.exports = {categoryRouter}