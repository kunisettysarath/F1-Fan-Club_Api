let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ordersSchema = new Schema({
    userId: String,
    productId: String,
    quantitly: Number,
    sellingPrice: Number,
    deliveryAddress: String,
    productName: String
})

let Orders = mongoose.model('Orders', ordersSchema, 'Orders');
module.exports = Orders;