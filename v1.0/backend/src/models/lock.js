const mongoose = require('mongoose')
const lockSchema = new mongoose.Schema({
    lockType : {
        type: String,
        required: true,
        trim: true
    },
    lockId:{
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})


const Lock = mongoose.model('Lock', lockSchema)

module.exports = Lock