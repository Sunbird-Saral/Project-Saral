const mongoose = require('mongoose')

const ROISchema = new mongoose.Schema({
    roiId:{
        type: String,
        required: true,
        unique: true
    },
    roi:{
        type: Object,
        required: true
    },
    // roi: [
    //     {
    //         _id: false,
    //         name: {type: String},
    //         method: {type: String},
    //         question: {type: String},
    //         index: {type: String},
    //         row: {type: String},
    //         col: {type: String},
    //         top: { type: String },
    //         left: { type: String },
    //         bottom: {type: String},
    //         right: {type: String},

    //     }
    // ],
    // extractionMethod: {
    //     type: String,
    //     enum: ["NUMERIC_CLASSIFICATION","CELL_OMR"]
    // },
    classId:{
        type: String,
        required: true,
        trim: true
    },
    subject:{
        type: String,
        required: true,
        trim: true
    },
    set:{
        type: String,
        required: false
    },
    state:{
        type: String,
        required: true,
        trim: true
    },
    type:{
        type: String
        // enum: ["SAT","PAT"]
    }
},{
    timestamps: true
})

ROISchema.index({classId: -1, subject: -1, state: -1, type: -1})

const Rois = mongoose.model('ROI', ROISchema)

module.exports = Rois