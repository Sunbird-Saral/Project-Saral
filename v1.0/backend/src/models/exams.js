const mongoose = require('mongoose')
const examSchema = new mongoose.Schema({
    examId: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    schoolId: {
        type: String,
        required: true,
        trim: true,
    },
    examLO: {
        type: String,
        required: true,
        trim: true,
    },
    examDate: {
        type: String,
        required: true,
        trim: true
    },
    classId: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    totalMarks: {
        type: Number,
        required: true,
        trim: true
    },
    questions: [{
        _id: false,
        questionId: {type: String},
        indicatorTitle: {type: String},
        questionMarks: {type: String}
    }]
}, {
    timestamps: true
})

const Exam = mongoose.model('Exam', examSchema)

module.exports = Exam