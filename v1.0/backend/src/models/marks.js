const mongoose = require('mongoose')

const defaultTimeStamp = new Date(2021, 02, 25, 10, 00, 00, 0).getTime()
const marksSchema = new mongoose.Schema({
    classId: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    examDate: {
        type: String,
        required: true,
        trim: true
    },
    section: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    studentId: {
        type: String,
        required: true,
        trim: true
    },
    schoolId: {
        type: String,
        required: true,
        trim: true
    },
    marksInfo: {
        type: Array,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    securedMarks: {
        type: Number,
        required: true
    },
    createdOn: { 
        type: String, 
        default: defaultTimeStamp
    }
})


const Mark = mongoose.model('Mark', marksSchema)

module.exports = Mark