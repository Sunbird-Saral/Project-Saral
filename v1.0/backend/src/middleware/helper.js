const { stringObject } = require('../utils/commonUtils')
const Lock = require('../models/lock')
const User = require("../models/users")
const bcrypt = require('bcryptjs')


const commonHelperFunctions = {
    lockScreenValidator: async function (schoolData) {
        try {
            const locks = await Lock.find().lean()
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

    findByCredentials: async function (userId, password) {
        try {    
            const user = await User.findOne({
                userId: userId,
                __v: 0
            })
          
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
    }
}

module.exports = commonHelperFunctions;