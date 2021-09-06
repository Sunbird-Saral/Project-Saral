const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
    uniqueId: {
        type: String,
        required: true,
        unique: true
    },
    examName: {
        type: String,
        required: true,
        trim: true
    },
    examId: {
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
    }
}, {
    timestamps: true
})


const Exam = mongoose.model('Exam', examSchema)

module.exports = Exam