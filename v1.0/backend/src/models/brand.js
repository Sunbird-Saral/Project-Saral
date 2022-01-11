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
    screenLabels: {
        selectDetails: [{
            School: String,
            SchoolId: String,
            Class: String,
            Section: String,
            Subject: String
        }],
        studentList: [{
            School: String,
            SchoolId: String,
            Class: String,
            Section: String,
            Subject: String
        }],
        scanHistory: [{
            School: String,
            SchoolId: String,
            Class: String,
            Section: String,
            Subject: String
        }],
        myScan: [{
            School: String,
            SchoolId: String,
            Class: String,
            Section: String,
            Subject: String
        }],
        scanStatus: [{
            School: String,
            SchoolId: String,
            Class: String,
            Section: String,
            Subject: String
        }],
        scanStatusLocal: [{
            School: String,
            SchoolId: String,
        }],
        scanHistoryCard: [{
            School: String,
            SchoolId: String,
            Class: String,
            Section: String,
            Subject: String,
            ExamDate: String,
            ExamType: String,
            ExamId: String,
            ExamDetail: String,
            Details: String
        }],
        examDetailsPopup: [
           String
        ],
        scannedDetailComponent: [{
           StudentId: String,
           Exam: String,
           Subject: String,
           EmployeDetail: String,
           CorrectId: String,
           ListTableHeading:[
               String
           ]
        }]
    }   
},{
    timestamps: true
})


const Brand = mongoose.model('Brand', BrandSchema)

module.exports = Brand