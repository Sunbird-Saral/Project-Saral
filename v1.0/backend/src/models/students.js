const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    identifier: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    studentClass: {
        type: Array,
        default: {
            category1: "2",
            categoryName: 'Class-2'
        }
    },
    category2: {
        type: String,
        trim: true,
        uppercase: true,
        default: "A"
    },
    orgId: {
        type: String,
        required: true,
        ref: 'School'
    }
}, {
    timestamps: true
})

//model method created
studentSchema.statics.getStudentsCountByClassAndSection = async (orgId, category1, category2) => {
    const match = { orgId }
    if(category1) {
        let studentClassObj = {
            category1: category1, 
            categoryName: `Class-${category1}`
        }    
        let studentClass = [studentClassObj]
        match.studentClass = studentClass
    }

    if(category2) {
        match.category2 = category2
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