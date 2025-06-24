const { required } = require('joi')
const mongoose = require('mongoose')

const foodSchema = mongoose.Schema({
    title:{
        type:String,
        required:[true,'Food type is requried']
    },
    description:{
        type:String,
        required:[true,'Food description is required']
    },
    price:{
        type:Number,
        required:[true,'Price is required']
    },
    foodTags:{
        type:String
    },
    category:{
        type:String
    },
    code:{
        type:String
    },
    isAvailabel:{
        type:Boolean,
        default:true
    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Restaurant'
    },
    rating:{
        type:Number,
        default:5,
        min:1,
        max:5
    },
    ratingCount:{
        type:Number
    },
    imageUrl:{
        type:String,
        default:'abcd'
    }
},{timestamps:true})

foodSchema.statics.isExist = async function (title) {
    const food = await Food.findOne({title:title})
    return food? food:false
}

const Food = mongoose.model("Food", foodSchema)
module.exports = {Food}