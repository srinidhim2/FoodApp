const { required } = require('joi')
const mongoose = require('mongoose')

const restaurantSchema = mongoose.Schema({
    title:{
        type:String,
        required:[true,'Restaraunt type is requried']
    },
    iamgeUrl:{
        type:String,
    },
    foods:{
        type:Array
    },
    time:{
        type:String
    },
    pickup:{
        type:Boolean,
        default:true
    },
    delivery:{
        type:Boolean,
        default:true
    },
    isOpen:{
        type:Boolean,
        default:true
    },
    logoUrl:{
        type:String
    },
    rating:{
        type:Number,
        default:1,
        min:1,
        max:5
    },
    ratingCount:{
        type:Number,
        default:0
    },
    code:{
        type:String
    },
    coords:{
        id:{type:String},
        lattitude:{type:Number},
        lattitudeDelta:{type:Number},
        longitude:{type:Number},
        longitudeDelta:{type:Number},
        address:{type:String},
        title:{type:String}
    }
},{timestamps:true})

restaurantSchema.statics.isExist = async function (title) {
    const restaurant = await Restaurant.findOne({title:title})
    return restaurant? restaurant:false
}

const Restaurant = mongoose.model("Restaurant", restaurantSchema)
module.exports = {Restaurant}