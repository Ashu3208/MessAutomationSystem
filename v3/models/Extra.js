const mongoose = require('mongoose')

const extraSchema = new mongoose.Schema({
    
    name:String
    
})

module.exports = mongoose.model('Extra',extraSchema)