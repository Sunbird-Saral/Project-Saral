const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    schoolId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    udiseCode: {
        type: String,
        required: true,
        trim: true,
    },
    state:{
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    block: {
        type: String,
        required: true,
        trim: true
    },
    hmName: {
        type: String,
        required: true,
        trim: true
    },
    hmMobileNo: {
        type: String,
        required: true,
        trim: true
    },
    noOfStudents: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

//instance method
schoolSchema.methods.generateAuthToken = async function () {
    const school = this
    const token = jwt.sign({ _id: school._id.toString() }, process.env.JWT_SECRET)

    await school.save()
    return token
}

// Hiding private data
schoolSchema.methods.toJSON = function () {
    const school = this
    const schoolObject = school.toObject()
    
    delete schoolObject.password
    delete schoolObject.tokens

    return schoolObject
}

//model method created
schoolSchema.statics.findByCredentials = async (schoolId, password) => {
    
    const school = await School.findOne({ schoolId })
    
    if(!school) {
        throw new Error('School Id or Password is not correct.')
    }

    const isMatch = await bcrypt.compare(password, school.password)

    if(!isMatch) {
        throw new Error('School Id or Password is not correct.')
    }
    
    return school
}

// hash the plain text password before saving
// using normal function because we need access to this keyword
schoolSchema.pre('save', async function (next) {
    // to get user
    const school = this

    if (school.isModified('password')) {
        school.password = await bcrypt.hash(school.password, 8)
    }

    next()
})

const School = mongoose.model('School', schoolSchema)

module.exports = School