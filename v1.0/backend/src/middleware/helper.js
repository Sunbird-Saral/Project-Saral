const { stringObject } = require('../utils/commonUtils')
const locksSchema = require('../models/lock')
const usersSchema = require("../models/users")
const countersSchema = require("../models/counter")
const bcrypt = require('bcryptjs')


const commonHelperFunctions = {
    lockScreenValidator: async function (connection, schoolData) {
        try {
            const Locks = connection.model('Locks', locksSchema)

            const locks = await Locks.find({ $comment: "Find lock Details." }).lean()
            for (let lockData of locks) {
                let lockType = lockData.lockType;
                switch (lockType) {
                    case "state":
                        if (schoolData["state"] == lockData.lockId) {
                            throw new Error(stringObject().lockScreen);
                        }
                        break;
                    case "district":
                        if (schoolData["district"] == lockData.lockId) {
                            throw new Error(stringObject().lockScreen);
                        }
                        break;
                    case "schoolId":
                        if (schoolData["schoolId"] == lockData.lockId) {
                            throw new Error(stringObject().lockScreen);
                        }
                        break;
                    default:

                }

            }
        } catch (error) {
            throw error;
        } 
    },

    findByCredentials: async function (connection , userId, password) {
        try {
            const Users = connection.model('Users', usersSchema)
            const user = await Users.findOne(
                {
                    userId: userId,
                    $comment: "Login School API For Find User Data."
                }
            )

            if (!user) {
                throw new Error('School Id or Password is not correct.')
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                throw new Error('School Id or Password is not correct.')
            }

            return user

        } catch (error) {
            throw error
        } 
    },
    getValueForNextSequence: async function (connection , counterOfName) {
        try {
            const Counters = connection.model('Counters', countersSchema)

            let match = {
                _id: counterOfName
            }
            let update = { $inc: { counter_value: 1 } }
            let options = { upsert: true, 'new': true };
            const seqData = await Counters.findOneAndUpdate(match, update, options)
            return seqData.counter_value
        } catch (error) {
            throw error
        }
    }
}

module.exports = commonHelperFunctions;