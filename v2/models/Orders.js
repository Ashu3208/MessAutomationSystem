const mongoose =require("mongoose")

const orderSchema = new mongoose.Schema({
    itemName:String,
    quantity: Number,
    price: Number
})

module.exports = mongoose.model('Order',orderSchema)