const mongoose = require('mongoose')

const restaurantSchema = mongoose.Schema({
    
},{timestamps:true})

restaurantSchema.statics.isExist = async function (email) {
    const user = await Restaurant.findOne({email:email})
    return user? user:false
}

const Restaurant = mongoose.model("Restaurant", restaurantSchema)
module.exports = {Restaurant}