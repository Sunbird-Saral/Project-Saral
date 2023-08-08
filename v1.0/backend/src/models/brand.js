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
    themeColor3:{
        type: String,
        trim: true
    },
    themeColor4:{
        type: String,
        trim: true
    },
    themeColor5:{
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
        trim: true
    },
    screenLabels: {
          loginComponent: [{
            _id: false,
            UserId: {
                type: String
            },
            Password: {
                type: String
            },
            RememberMeText: {
                type: String
            },
            LoginText: {
                type: String
            },
        }],
        homeScreen: [{
            _id: false,
            useCase1: {
                type: String
            },
            useCase2: {
                type: String
            },
            useCase3: {
                type: String
            },
            useCase4: {
                type: String
            },
            useCase5:{
                type: String
            },
            assessmentLogo:{
                type: String
            }
        }],
        selectDetails: [{
            _id: false,
            School: {
                type: String
            },
            SchoolId: {
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
           SchoolId: {
              type: String
        }
        }],
        scanHistory: [{
            _id: false,
            School: {
                type: String
            },
            SchoolId: {
                type: String
            }
        }],
        myScan: [{
            _id: false,
            School: {
                type: String
            },
            SchoolId: {
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
            SchoolId: {
                type: String
            }
        }],
        scanStatusLocal: [{
            _id: false,
            School: {
                type: String
            },
            SchoolId: {
                type:String
            },
            ReviewScanText: {
                type:String
            },
            SubmitAllScan: {
                type:String
            },
            SummaryPage: {
                type:String
            },
        }],
        scanHistoryCard: [{
            _id: false,
            School: {
                type: String
            },
            SchoolId: {
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
            },
            TotalStudent:{
                type: String
            },
            PresentStudents:{
                type: String
            },
            ScanNotSubmitedYet:{
                type: String
            },
            TotalScanSubmited:{
                type: String
            },
            ReviewScanText:{
                type: String
            },
            SubmitAllScan:{
                type: String
            },
            SummaryPage:{
                type: String
            },
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
            RecordNo:{
                type: String
            },
            Cancel:{
                type:Array
             },
             Save:{
                type:Array
             },
           ListTableHeading:{
               type:Array
            },
           
        }]
    }   
},{
    timestamps: true
})

BrandSchema.index({ state: -1 }, { unique: true });

const Brands = mongoose.model('Brand', BrandSchema)

module.exports = Brands