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

classSchema.index({schoolId: -1})
//model method created
// classSchema.statics.findClassesBySchools = async (schoolId) => {    
//     const classes = await Classes.find({ schoolId })
    
//     if(!classes) {
//         throw new Error('No Classes')
//     }
    
//     return classes
// }

module.exports = classSchema