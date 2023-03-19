const mongoose =require("mongoose")

const orderSchema = new mongoose.Schema({
    rollNumber:Number,
    itemName:Array,
    quantity: Array,
    price: Array
})

module.exports = mongoose.model('Order',orderSchema)