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
        unique: true,
        required: true,
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

userSchema.index({userId: -1})

// userSchema.statics.findByCredentials = async (userId, password) => {
//     const user = await User.findOne({ userId },{__v: 0})
    
//     if(!user) {
//         throw new Error('School Id or Password is not correct.')
//     }

//     const isMatch = await bcrypt.compare(password, user.password)
    
//     if(!isMatch) {
//         throw new Error('School Id or Password is not correct.')
//     }
    
//     return user
// }

userSchema.statics.generateAuthToken = async function (user) {
    // const user = this
    const token = jwt.sign({ userId: user.userId.toString() ,schoolId: user.schoolId}, process.env.JWT_SECRET)

    // await user.save()
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

const User = mongoose.model('User', userSchema)

module.exports = User