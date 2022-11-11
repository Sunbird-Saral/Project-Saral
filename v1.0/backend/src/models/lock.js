const mongoose = require('mongoose')
const lockSchema = new mongoose.Schema({
    lock: {
        type: Boolean,
        required: false
    },
    schoolId: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true
})


const Lock = mongoose.model('Lock', lockSchema)

module.exports = Lock