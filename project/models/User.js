//require mongoose, passport-local-mongoose
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


// Create User Schema
const userSchema = new mongoose.Schema({
    name: String,
    rollNumber: Number ,
    username: String,
    password: String,
    extrasCost: Number,
    rebateDays: Number,
    dues: Number
})

//hash password using passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose)


//export User Model
module.exports = mongoose.model('User', userSchema)
