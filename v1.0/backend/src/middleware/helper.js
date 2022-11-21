const { stringObject } = require('../utils/commonUtils')
const Lock = require('../models/lock')


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
}

module.exports = commonHelperFunctions;