const Joi = require('joi')
const { Category } = require('../models/categoryModel')
const {logger} = require('../logger/logger')

const validateCategory = (category)=>{
    const categorySchema = Joi.object({
        title:Joi.string().required(),
        imageUrl:Joi.string()
    })
    const result = categorySchema.validate(category)
    return result
}
const createCategoryController =  async (req,res,next)=>{
    try {
        
        const result = validateCategory(req.body)
        if(result.error){
            logger.error({'message':result.error.details[0].message})
            return res.status(400).send({'message':result.error.details[0].message})
        }
        const isExist = await Category.isExist(req.body.title)
        if(isExist){
                    logger.error(`Category with title:${req.body.title} already exists`)
                    return res.status(409).send({'message':`Category with title:${req.body.title} already exists`})
                }
        const category = new Category(req.body)
        const newCat = await category.save()
        logger.info('Created Successfully')
        logger.debug(newCat)
        return res.status(201).send({'message':'Created Successfully',category})
    } catch (error) {
        next(error)
    }
}

const getAllCategoriesContorller = async(req,res,next)=>{
    try {
        const categories = await Category.find()
        if(!categories){
            return res.status(404).send({'message':'Categories not found'})
        }
        return res.status(200).send({categories})
    } catch (error) {
        next(error)
    }
}

const updateCategory= async(req,res,next)=>{
    try {
        const id = req.params.id
        const {title, imageUrl} = req.body
        const updatedCategory = await Category.findByIdAndUpdate(id, {title, imageUrl}, {new:true})
        if(!updatedCategory){
            logger.error({'message':'no category found'})
            return res.status(400).send({'message':'no category found'})
        }
        logger.info({'message':'Updated Successfully', updatedCategory})
        res.status(201).send({'message':'Updated Successfully', updatedCategory})

    } catch (error) {
        next(error)
    }
}

const deleteCategory = async (req,res,next)=>{
    try {
        const id = req.params.id
        const deletedCategory = await Category.findByIdAndDelete(id)
        if(!deletedCategory){
            logger.error({'message':'no category found'})
            return res.status(404).send({'message':'no category found'})
        }
        logger.info('Deleted Successfully')
        logger.debug(deletedCategory)
        res.status(204).send({'message':'Deleted Successfully',deletedCategory})
    } catch (error) {
        next(error)
    }
}

module.exports = {createCategoryController, getAllCategoriesContorller, updateCategory, deleteCategory}