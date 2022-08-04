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
    orgId: {
        type: String,
        unique: true,
        // required: true,
        trim: true,
    },
    screenLabels: {
        selectDetails: [{
            _id: false,
            School: {
                type: String
            },
            orgId: {
                type: String
            },
            Class: {
                type: String
            },
            Section: {
                type: String
            },
            Subject:{
                type: String
            }
        }],
        studentList: [{
           _id: false,
           School: {
              type: String
        },
           orgId: {
              type: String
        }
        }],
        scanHistory: [{
            _id: false,
            School: {
                type: String
            },
            orgId: {
                type: String
            }
        }],
        myScan: [{
            _id: false,
            School: {
                type: String
            },
            orgId: {
                type: String
            },
            SelectRoi: {
                type: String
            },
            SaveCount: {
                type: String
            },
            ScanCount: {
                type: String
            }
        }],
        scanStatus: [{
            _id: false,
            School: {
                type: String
            },
            orgId: {
                type: String
            }
        }],
        scanStatusLocal: [{
            _id: false,
            School: {
                type: String
            },
            orgId: {
                type:String
            }
        }],
        scanHistoryCard: [{
            _id: false,
            School: {
                type: String
            },
            orgId: {
                type: String
            },
            Class: {
                type: String
            },
            Section: {
                type: String
            },
            Subject:{
                type: String
            },
            ExamDate:{
                type: String
            },
            ExamType:{
                type: String
            },
            ExamId:{
                type: String
            },
            ExamDetail:{
                type: String
            },
            Details:{
                type: String
            }
        }],
        examDetailsPopup: {
            type:Array
        },
        scannedDetailComponent: [{
           _id: false,
           StudentId:{
               type: String
            },
           Exam:{
               type: String
            },
           Subject:{
               type: String
            },
           StudentDetail:{
               type: String
            },
           CorrectId:{
               type: String
            },
           ListTableHeading:{
               type:Array
            }
        }]
    }   
},{
    timestamps: true
})


const Brand = mongoose.model('Brand', BrandSchema)

module.exports = Brand