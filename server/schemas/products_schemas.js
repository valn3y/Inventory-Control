const mongoose = require('mongoose')
const schema = mongoose.Schema

const ProductsSchema = new schema({
    barCode: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0
    }
})

const Products = mongoose.model('product', ProductsSchema)
module.exports = Products