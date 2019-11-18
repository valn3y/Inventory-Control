const mongoose = require('mongoose')
const schema = mongoose.Schema

const UpdateSchema = new schema({
    update: {
        type: String
    },
    rfid: {
        type: String
    },
    description: {
        type: String
    },
    stock: {
        type: Number
    }
})

const Update = mongoose.model('update', UpdateSchema)
module.exports = Update