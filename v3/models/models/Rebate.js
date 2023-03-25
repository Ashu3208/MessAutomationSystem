const mongoose =require("mongoose")

const rebateSchema = new mongoose.Schema({
    rollNo:Number,
    startDate:String,
    endDate:String,
    days:Number,
    status:String
})

module.exports = mongoose.model('Rebate',rebateSchema)