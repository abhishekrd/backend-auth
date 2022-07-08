const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please enter email"],
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:[true,"Please enter password"]
    }
})

module.exports = mongoose.model("Users",userSchema);