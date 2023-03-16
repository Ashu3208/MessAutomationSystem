//require mongoose, passport-local-mongoose
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

// Create User Schema
const userSchema = new mongoose.Schema({
    name:String,
    username:String,
    password:String
})

//hash password using passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose)


//export User Model
module.exports = mongoose.model('User' , userSchema)
