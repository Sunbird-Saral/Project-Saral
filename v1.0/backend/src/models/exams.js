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
        required: false,
        trim: true,
    },
    examLO: {
        type: String,
        required: true,
        trim: true,
    },
    examDate: {
        type: String,
        required: false
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
    set:{
        type: Array,
        required: false
    },
    totalMarks: {
        type: Number,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    questions: [{
        _id: false,
        questionId: { type: String },
        indicatorTitle: { type: String },
        tags: [{
            _id: false,
            tagName: { type: String },
            selected: { type: Boolean }
        }
        ],
        questionMarks: { type: String }
    }],
    state:{
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true
})

module.exports = examSchema