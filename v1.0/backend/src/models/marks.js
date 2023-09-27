const mongoose = require('mongoose')

// const defaultTimeStamp = new Date(2021, 02, 25, 10, 00, 00, 0).getTime()
const rawSchemaJson = {
    schoolId: {
        type: String,
        required: true,
        trim: true
    },
    classId: {
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
    examDate: {
        type: String,
        default: null
    },
    subject: {
        type: String,
        required: true,
        trim: true
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
    roiId: {
        type: String,
        required: false,
        trim: true
    },
    marksInfo: [
        {
            questionId: { type: String, required: true },
            predictedMarks: {type: String,required: false},
            predictionConfidence: {type: Array,required: false},
            tags: {type: Array,required: false},
            obtainedMarks: { type: String, required: false  },
            trainingData: {type: Array,required: false}
          }
        ],
    totalMarks: {
        type: Number,
        required: true
    },
    maxMarksTrainingData:{
        type: Array,
        required: false
    },
    maxMarksPredicted:{
        type: String,
        required: false
    },
    maxMarksConfidence:{
        type: Array,
        required: false
    },
    securedMarks: {
        type: Number,
        required: true
    },
    obtainedMarksTrainingData:{
        type: Array,
        required: false
    },
    obtainedMarksPredicted:{
        type: String,
        required: false
    },
    obtainedMarksConfidence:{
        type: Array,
        required: false
    },
    createdOn: { 
        type: String, 
        default: Date.now
    },
    examId: {
        type: Number,
        required: false,
        trim: true,
    },
    set:{
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    shardedKey: {
        type: String,
        required: true,
        trim: true,
    }
}
const marksSchema = new mongoose.Schema(rawSchemaJson)

marksSchema.statics.StudentsMark = async (studentIds) => {   
    let marks = await Mark
    .find({
      studentId: { $in: studentIds }
    })
    .lean(); 
    return marks
}

//uncomment the below line when using mongodb as standalone
//marksSchema.index({schoolId: -1, classId: -1, section: -1, examDate: -1, subject: -1})


// const Marks = mongoose.model('Mark', marksSchema)

module.exports = { marksSchema, rawSchemaJson }