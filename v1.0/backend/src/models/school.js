const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    schoolId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    state:{
        type: String,
        required: true,
        trim: true
    },
    storeTrainingData:{
        type: Boolean,
        default: false,
    },
    autoSync: { 
        type: Boolean,
        required: false
    },
    autoSyncFrequency: {
        type: Number,
        required: false,
        default: 600000
    },
    tags: { 
        type: Boolean,
        required: false
    },
    autoSyncBatchSize:{
        type: Number,
        required: false
    },
    
    isMinimalMode: { 
        type: Boolean,
        required: false
    },
    supportEmail:{
        type: String,
        required: false
    },
    offlineMode: { 
        type: Boolean,
        required: false
    },
    isAppForceUpdateEnabled: { 
        type: Boolean,
        required: false
    },
    district:{
        type: String,
        required: true
    }
}, {
    timestamps: false
})


// Hiding private data
schoolSchema.methods.toJSON = function () {
    const school = this
    const schoolObject = school.toObject()
    
    delete schoolObject.password
    delete schoolObject.tokens

    return schoolObject
}

const School = mongoose.model('School', schoolSchema)

module.exports = School