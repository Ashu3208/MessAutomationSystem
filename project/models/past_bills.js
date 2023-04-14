const mongoose = require("mongoose");

const pastSchema = new mongoose.Schema({
    startDate:{
        type:String,
        required:true
    },
    endDate:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model('Pastbill',pastSchema);