const mongoose = require('mongoose')

const ROIV2Schema = new mongoose.Schema({
    roiId:{
        type: String,
        required: true,
        unique: true
    },
    schemaName:{
        type: String,
        required: true,
    },
    roi:{
        type: Object,
        required: true
    },
    schoolId:{
        type: String,
        required: true,
        trim: true
    },
    state:{
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps: true
})

ROIV2Schema.index({orgId: -1, state: -1})

module.exports = ROIV2Schema