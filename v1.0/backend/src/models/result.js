const mongoose = require('mongoose')

const defaultTimeStamp = new Date(2021, 02, 25, 10, 00, 00, 0).getTime()

const resultSchema = new mongoose.Schema({
    category1: {
        type: String,
        required: true,
        trim: true
    },
    category2: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    category3: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        default: null
    },
    identifier: {
        type: String,
        required: true,
        trim: true
    },
    identifierTrainingData:{
        type: Array,
        required: false
    },
    predictedIdentifier: {
        type: String,
        required: false
    },
    predictionConfidence: {
        type: Array,
        required: false
    },
    availability: {
        type: Boolean,
        default: true,
        required: true
    },
    orgId: {
        type: String,
        required: true,
        trim: true
    },
    roiId: {
        type: String,
        required: false,
        trim: true
    },
    resultInfo: [
        {
            _id: false,
            questionId: { type: String, required: true },
            predictedResult: {type: String,required: false},
            predictionConfidence: {type: Array,required: false},
            tags: {type: Array,required: false},
            obtainedResult: { type: String, required: true  },
            trainingData: {type: Array,required: false}
          }
        ],
    totalResult: {
        type: Number,
        required: true
    },
    maxResultTrainingData:{
        type: Array,
        required: false
    },
    maxResultPredicted:{
        type: String,
        required: false
    },
    maxResultConfidence:{
        type: Array,
        required: false
    },
    securedResult: {
        type: Number,
        required: true
    },
    obtainedResultTrainingData:{
        type: Array,
        required: false
    },
    obtainedResultPredicted:{
        type: String,
        required: false
    },
    obtainedResultConfidence:{
        type: Array,
        required: false
    },
    createdOn: { 
        type: String, 
        default: defaultTimeStamp
    }
})



const Result = mongoose.model('Result', resultSchema)

module.exports = Result