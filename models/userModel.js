const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:[true,'user name is required']
    },
    email:{
        type:String,
        required:[true,'email name is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    address:{
        type:String
    },
    phone:{
        type:String,
        required:[true,'phone no is required']
    },
    userType:{
        type:String,
        required:[true,'user type is required'],
        default: 'client',
        enum: ['client','admin','vendor','driver']
    },
    profile:{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyTGZPBgb1rrNuzDZbUT5jFmP18ICdqLaf2g&s'
    },
    answer:{
        type:String,
        require:[true,'Answer is required']
    }
},{timestamps:true})

userSchema.statics.isExist = async function (email) {
    const user = await User.findOne({email:email})
    return user? user:false
}

const User = mongoose.model("User", userSchema)
module.exports = {User}