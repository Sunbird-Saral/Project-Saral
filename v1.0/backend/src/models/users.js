const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    schoolId: {
        type: String,
        required: true,
        ref: 'School'
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
}, {
    timestamps: true
})



userSchema.statics.generateAuthToken = async function (user) {

    const token = jwt.sign({ userId: user.userId.toString() ,schoolId: user.schoolId, $comment: "Token generation"}, process.env.JWT_SECRET)

    return token
    
}

// hash the plain text password before saving
// using normal function because we need access to this keyword
userSchema.pre('save', async function (next) {
    // to get user
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

module.exports = userSchema