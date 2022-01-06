const mongoose = require('mongoose')

const BrandSchema = new mongoose.Schema({
    logoImage:{
        type: String,
        required: true
    },
    themeColor1:{
        type: String,
        trim: true
    },
    themeColor2:{
        type: String,
        trim: true
    },
    appName:{
        type: String,
        required: true,
        trim: true
    },
    state:{
        type: String,
        // required: true,
        trim: true
    },
    navigationLabels: {
        selectDetails: {
            School: String,
            SchoolId: String,
            Class: String,
            Section: String
        }
    }   
},{
    timestamps: true
})


const Brand = mongoose.model('Brand', BrandSchema)

module.exports = Brand