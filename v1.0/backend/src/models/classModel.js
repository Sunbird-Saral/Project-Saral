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
    classId: {
        type: String,
        required: true,
        trim: true,
    },
    sections: {
        type: Array,
        default: defaultSection
    },
    schoolId: {
        type: String,
        // unique: true,
        required: true,
        ref: 'School'
    }
}, {
    timestamps: true
})

//model method created
classSchema.statics.findClassesBySchools = async (schoolId) => {    
    const classes = await ClassModel.find({ schoolId })
    
    if(!classes) {
        throw new Error('No Classes')
    }
    
    return classes
}


const ClassModel = mongoose.model('Class', classSchema)

module.exports = ClassModel