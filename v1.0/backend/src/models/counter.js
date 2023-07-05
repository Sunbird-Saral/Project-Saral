const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    counter_value: { 
        type: Number
    }

})

module.exports = counterSchema
