const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    studentId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    fatherName: {
        type: String,
        required: false,
        trim: true,
    },
    classId: {
        type: String,
        required: true,
        trim: true
    },
    className:{
        type: String,
        required: true,
        trim: true
    },
    schoolId: {
        type: String,
        required: true,
        ref: 'School'
    },
    section: {
        type: String,
        trim: true,
        uppercase: true,
        default: "A"
    }
}, {
    timestamps: true
})

studentSchema.index({classId: -1, className: -1, schoolId: -1, section: -1})

//model method created
studentSchema.statics.getStudentsCountByClassAndSection = async (schoolId, classId, section) => {
    const match = { schoolId }
    if(classId) {
        let studentClassObj = {
            classId: classId, 
            className: `Class-${classId}`
        }    
        let studentClass = [studentClassObj]
        match.studentClass = studentClass
    }

    if(section) {
        match.section = section
    }
    
    try {
        const students = await Student.find(match)
        
        let count = students.length
        return count
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }    
}


const Students = mongoose.model('Student', studentSchema)

module.exports = Students