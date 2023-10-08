const mongoose = require('mongoose')

const optionsSchema = new mongoose.Schema({
    roi_id: {
        type: String,
        required: true
    },
    layout_name: { 
        type: String,
        required: true
    }

})

module.exports = optionsSchema