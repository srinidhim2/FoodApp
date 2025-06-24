const { required } = require('joi')
const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    foods:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Food'
        }
    ],
    price:{},
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
        enum:['Pending','Preparing','On the way','Delivered'],
        default:'Preparing'
    }
},{timestamps:true})


const Order = mongoose.model("Order", orderSchema)
module.exports = {Order}