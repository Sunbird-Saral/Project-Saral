const mongoose = require('mongoose')
const examSchema = new mongoose.Schema({
    examId: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    orgId: {
        type: String,
        required: true,
        trim: true,
    },
    examLO: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: false
    },
    category1: {
        type: String,
        required: true
    },
    category3: {
        type: String,
        required: true,
        trim: true
    },
    totalResults: {
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
        questionResults: { type: String }
    }]
}, {
    timestamps: true
})

const Exam = mongoose.model('Exam', examSchema)

module.exports = Exam