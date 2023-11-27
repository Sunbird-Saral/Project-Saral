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
    },

    //custom function to validate and modify PUT/POST payload against schema model
    transformAndValidateDataBasedOnModel: function (objectRef, schemaRef) {
        let fobj = {}
    
        function transformData(key, schemaobj, val, objRef, fObjRef) {
            if(!objRef.hasOwnProperty(key) && !schemaobj.hasOwnProperty('default') && schemaobj.type == String) {
                return;
            }
            let modval = null;
            if((val == null || val == undefined) && !schemaobj.required) {
                if(schemaobj.hasOwnProperty('default')) {
                    modval = schemaobj.default
                } else if(schemaobj.type == Array) {
                    modval = []
                }
            } else if(val || val == 0 || val == '') {
                if(schemaobj.type == String) {
                    modval = val.toString().trim()
                    if(schemaobj.uppercase) {
                        modval = val.toUpperCase()
                    }
                } else {
                    modval = val
                }
            }
    
            fObjRef[key] = modval;
        }
    
        function iterateOverObject(obj, i=null, path=null, object = objectRef) {
            if(typeof obj == 'object') {
                Object.keys(obj).forEach(key => {
                    if(!Array.isArray(obj[key])) {
                        if(path) {
                            fobj[path] = fobj[path] || [];
                            fobj[path][i] = fobj[path][i] || {};
                            transformData(key, schemaRef[path][0][key], object[key], object, fobj[path][i]);
                        }
                        else if(schemaRef[key]){
                            transformData(key, schemaRef[key], object[key], object, fobj);
                        }
                    } else if(Array.isArray(obj[key])) {
                        if(object[key].length == 0 || !object[key]) {
                            fobj[key] = []
                        }
                        object[key].forEach((sobj, j) => {
                            iterateOverObject(schemaRef[key][0], j, key, sobj)
                        })
                    }
                })
            } else {
                transformData(path, schemaRef[path], object[path], object, fobj);
            }
        }
        
        iterateOverObject(schemaRef)
        return fobj;
    }
}

module.exports = commonHelperFunctions;