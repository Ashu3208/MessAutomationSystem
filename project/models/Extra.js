const mongoose = require('mongoose')

const extraSchema = new mongoose.Schema({
    
    name:String,
    price:Number
})

module.exports = mongoose.model('Extra',extraSchema)

