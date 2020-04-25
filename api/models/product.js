const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        maxlength: 50,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: [],
        // required: true
    },
    sold: {
        type: String,
        maxlength: 100,
        default: 0
    },
    delivery: {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product
