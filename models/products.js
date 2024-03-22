const mongoose = require('mongoose');
const Scheme = mongoose.Schema;
const Products = new Scheme({
    id_product: {type: Scheme.Types.ObjectId, ref: 'product'},
    name: {type: String},
    quantity: {type: Number},
    price: {type: Number},
    image: {type: String}
}, {timestamps: true});

module.exports = mongoose.model('product', Products);