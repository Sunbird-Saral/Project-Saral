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
    studentClass: {
        type: Array,
        default: {
            classId: "2",
            className: 'Class-2'
        }
    },
    section: {
        type: String,
        trim: true,
        uppercase: true,
        default: "A"
    },
    schoolId: {
        type: String,
        required: true,
        ref: 'School'
    }
}, {
    timestamps: true
})

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


const Student = mongoose.model('Student', studentSchema)

module.exports = Student