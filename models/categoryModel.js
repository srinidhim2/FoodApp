const { required } = require('joi')
const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    title:{
        type:String,
        required:[true,'Category type is requried']
    },
    imageUrl:{
        type:String,
    }
},{timestamps:true})

categorySchema.statics.isExist = async function (title) {
    const category = await Category.findOne({title:title})
    return category? category:false
}

const Category = mongoose.model("Category", categorySchema)
module.exports = {Category}