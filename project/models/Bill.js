const mongoose =require("mongoose")

const billSchema = new mongoose.Schema({
    rollNo:Number,
    month:String,
    year:Number,
    workingDays:Number,
    dailyCost:Number,
    rebateDays:Number,
    extrasCost:Number,
    total:Number
})

module.exports = mongoose.model('Bill',billSchema)