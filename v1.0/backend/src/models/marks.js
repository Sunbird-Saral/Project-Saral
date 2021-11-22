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
    studentIdTrainingData:{
        type: Array,
        required: false
    },
    predictedStudentId: {
        type: String,
        required: false
    },
    predictionConfidence: {
        type: Array,
        required: false
    },
    studentAvailability: {
        type: Boolean,
        default: true,
        required: true
    },
    schoolId: {
        type: String,
        required: true,
        trim: true
    },
    marksInfo: [
        {
            _id: false,
            questionId: { type: String, required: true },
            predictedMarks: {type: String,required: false},
            predictionConfidence: {type: Array,required: false},
            obtainedMarks: { type: String, required: true  },
            trainingData: {type: Array,required: false}
          }
        ],
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

marksSchema.statics.StudentsMark = async (studentIds) => {   
    let marks = await Mark
    .find({
      studentId: { $in: studentIds }
    })
    .lean(); 
    return marks
}

const Mark = mongoose.model('Mark', marksSchema)

module.exports = Mark