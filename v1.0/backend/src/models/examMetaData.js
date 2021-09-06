const mongoose = require('mongoose')

const examMetaSchema = new mongoose.Schema({
    questions: {
        type: Array,
        required: true
    },
    classId: {
        type: String,
        required: true
    },
    examDate: {
        type: String,
        required: true,
        trim: true
    },
    totalMarks: {
        type: Number,
        required: true,
        trim: true
    },
    examId: {
        type: String,
        unique: true,
        required: true,
        ref: 'Exam'
    }
})


const ExamMeta = mongoose.model('ExamMeta', examMetaSchema)

module.exports = ExamMeta