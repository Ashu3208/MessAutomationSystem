const mongoose =require("mongoose")

const complaintSchema = new mongoose.Schema({
    rollNo:Number,
    issue:String,
    reply:String
})

module.exports = mongoose.model('Complaint',complaintSchema)

