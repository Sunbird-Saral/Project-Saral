const mongoose = require('mongoose')

const defaultSection = {
    "section": "A",
}
const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        trim: true
    },
    category1: {
        type: String,
        required: true,
        trim: true,
    },
    category2: {
        type: Array,
        default: defaultSection
    },
    orgId: {
        type: String,
        // unique: true,
        required: true,
        ref: 'School'
    }
}, {
    timestamps: true
})

//model method created
classSchema.statics.findClassesBySchools = async (orgId) => {   
    
    const classes = await ClassModel.find({ orgId })
    if(!classes) {
        throw new Error('No Classes')
    }
    
    return classes
}


const ClassModel = mongoose.model('Class', classSchema)

module.exports = ClassModel