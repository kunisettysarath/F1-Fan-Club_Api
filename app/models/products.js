let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    title: String,
    price: Number,
    size: [{
        small: {
            type: Boolean,
        },
        medium: {
            type: Boolean
        },
        large: {
            type: Boolean
        },
        xlarge: {
            type: Boolean
        }
    }],
    category: String,
    thumbnail: String,
    description: String,
})

let Products = mongoose.model('Products', productSchema, 'Products');
module.exports = Products;