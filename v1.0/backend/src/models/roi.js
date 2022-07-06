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
    category1:{
        type: String,
        required: true,
        trim: true
    },
    category3:{
        type: String,
        required: true,
        trim: true
    },
    type:{
        type: String
        // enum: ["SAT","PAT"]
    },
    state:{
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps: true
})


const ROI = mongoose.model('ROI', ROISchema)

module.exports = ROI