const School = require('../models/school')
const User = require('../models/users')
const ClassModel = require("../models/classModel")
const Student = require("../models/students")
const Mark = require("../models/marks")
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils');
const { auth } = require('../middleware/auth');

// exports.GetSchoolsDetail = async (req, res, next) => {
//   try {
    
//     const school = await School.find({}, { name: 1, schoolId: 1, state: 1, district: 1, storeTrainingData: 1, _id: 0 })

//     res.status(200).json({
//       status: 'success',
//       school
//     });
//   } catch (e) {
//     res.status(400).json({
//       status: 'fail',
//       e
//     });
//   }

// };

exports.loginSchool = async (req, res, next) => {
  try {
    let userId = {}
    if (req.body.schoolId) {
      userId = req.body.schoolId.toLowerCase()
    }
  
    const users = await Helper.findByCredentials(userId, req.body.password)
    
    const schools = await School.findOne({ schoolId: users.schoolId })

    await Helper.lockScreenValidator(schools)

    const token = await User.generateAuthToken(users)

    let classes = []
    let school = {
      storeTrainingData: schools.storeTrainingData,
      name: schools.name,
      schoolId: schools.schoolId,
      state: schools.state,
      district: schools.district,
      autoSync: schools.autoSync,
      autoSyncFrequency: schools.autoSyncFrequency,
      tags: schools.tags,
      autoSyncBatchSize: schools.autoSyncBatchSize,
      isMinimalMode: schools.isMinimalMode,
      supportEmail: schools.supportEmail,
      offlineMode: schools.offlineMode,
      isAppForceUpdateEnabled: schools.isAppForceUpdateEnabled,
      lock: schools.lock,
      userId: users.userId
    }

    let data = {
      school,
      token
    }

    if (req.body.classes) {
      const classData = await ClassModel.findClassesBySchools(schools.schoolId)

      classData.forEach(data => {
        const { sections, classId, className } = data
        let obj = {
          sections,
          classId,
          className
        }
        classes.push(obj)
      });
      classes.sort((a, b) => a.classId.trim().localeCompare(b.classId.trim()))
      data.classes = classes
    }

    res.status(200).json({
      ... data
    });
  } catch (e) {
    if (e && e.message == 'School Id or Password is not correct.') {
      res.status(401).json({
        status: 'fail',
        error: e.message
      })
    }
    else if (e && e.message == stringObject().lockScreen) {
      res.status(500).json({
        status: 'fail',
        error: e.message
      })
    }
    else {
      res.status(400).json({
        status: 'fail',
        e
      });
    }
  }
};

// exports.createSchool = async (req, res, next) => {
//   try {
//     const school = { ...req.body }

//     school.state = req.body.state.toLowerCase()
//     school.schoolId = req.body.schoolId.toLowerCase()

//     if (req.body.autoSync) school.autoSync = req.body.autoSync
//     if (req.body.autoSyncFrequency) school.autoSyncFrequency = req.body.autoSyncFrequency
//     if (req.body.tags) school.tags = req.body.tags
//     if (req.body.autoSyncBatchSize) school.autoSyncBatchSize = req.body.autoSyncBatchSize

//     const schoolData = await School.create(req.body);

//     let schools = {
//       storeTrainingData: schoolData.storeTrainingData,
//       name: schoolData.name,
//       schoolId: schoolData.schoolId,
//       state: schoolData.state,
//       district: schoolData.district
//     }

//     res.status(201).json({
//       status: 'success',
//       schools
//     });

//   } catch (e) {
//     if (e.message.includes(' duplicate key error')) {
//       let key = Object.keys(e.keyValue)
//       res.status(400).json({
//         status: 'fail',
//         error: `${key[0]}: ${e.keyValue[key[0]]} already exist`
//       });
//     } else {
//       res.status(400).json({
//         status: 'fail',
//         e
//       });
//     }
//   }
// }

// exports.deleteSchool = async (req, res, next) => {
//   try {

//     const school = await School.findOne({ schoolId: req.params.schoolId })

//     if (!school) return res.status(404).json({ message: 'School Id does not exist.' })

//     let lookup = {
//       schoolId: req.params.schoolId
//     }

//     await School.deleteOne(lookup)
//     await ClassModel.findOneAndRemove(lookup)
//     await Student.findOneAndRemove(lookup)
//     await Mark.findOneAndRemove(lookup)
//     res.status(200).json({
//       status: 'success',
//       message: 'School has been deleted.'
//     });
//   } catch (e) {
//     console.log(e)
//     res.status(400).json({
//       status: 'fail',
//       e
//     });
//   }
// }

// exports.updateSchool = async (req, res, next) => {
//   try {
//     if (Object.keys(req.body).length === 0) res.status(400).json({ message: 'Validation error.' })
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'state', 'district', 'udisceCode', 'storeTrainingData', 'autoSync', 'autoSyncFrequency', 'tags', 'autoSyncBatchSize']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//       return res.status(400).json({ error: 'Invaid Updates' })
//     }


//     let update = req.body

//     const school = await School.findOne({ schoolId: req.params.schoolId });

//     if (!school) return res.status(404).json({ message: 'School Id does not exist.' })

//     await School.updateOne({ schoolId: req.params.schoolId }, update);

//     res.status(200).json({ message: 'School has been updated.' })

//   } catch (e) {
//     console.log(e)
//     res.status(400).json({
//       status: 'fail',
//       e
//     });
//   }
// }



