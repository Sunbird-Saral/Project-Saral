const School = require('../models/school')
const User = require('../models/users')
const ClassModel = require("../models/classModel")
const Student = require("../models/students")
const Mark = require("../models/marks")
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils');
const { auth } = require('../middleware/auth');

exports.GetSchoolsDetail = async (req, res, next) => {
  let schools = []
  const school = await School.find({})

  if (school) {
    for (i = 0; i <= school.length - 1; i++) {
      let obj = {
        name: school[i].name,
        schoolId: school[i].schoolId,
        state: school[i].state,
        district: school[i].district,
        storeTrainingData: school[i].storeTrainingData
      }
      schools.push(obj)
    }
  }
  res.status(200).json({
    status: 'success',
    schools
  });
};

exports.loginSchool = async (req, res, next) => {
  try {
    let userId = {}
    if (req.body.schoolId) {
      userId = req.body.schoolId.toLowerCase()
    }
    const users = await User.findByCredentials(userId, req.body.password)
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
      status: 'success',
      data
    });
  } catch (e) {
    console.log(e)
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

exports.createSchool = async (req, res, next) => {
  const school = new School({ ...req.body })
  try {
    school.state = req.body.state.toLowerCase()
    school.schoolId = req.body.schoolId.toLowerCase()

    if (req.body.autoSync) school.autoSync = req.body.autoSync
    if (req.body.autoSyncFrequency) school.autoSyncFrequency = req.body.autoSyncFrequency
    if (req.body.tags) school.tags = req.body.tags
    if (req.body.autoSyncBatchSize) school.autoSyncBatchSize = req.body.autoSyncBatchSize


    await school.save()
    let schools = {
      storeTrainingData: school.storeTrainingData,
      name: school.name,
      schoolId: school.schoolId,
      state: school.state,
      district: school.district
    }

    res.status(201).json({
      status: 'success',
      schools
    });

  } catch (e) {
    if (e.message.includes(' duplicate key error')) {
      let key = Object.keys(e.keyValue)
      res.status(400).json({
        status: 'fail',
        error: `${key[0]}: ${e.keyValue[key[0]]} already exist`
      });
    } else {
      res.status(400).json({
        status: 'fail',
        e
      });
    }
  }
}

exports.deleteSchool = async (req, res, next) => {
  try {
    const school = await School.findOne({ schoolId: req.params.schoolId.toLowerCase() })

    if (!school) return res.status(404).send({ message: 'School Id does not exist.' })

    let lookup = {
      schoolId: school.schoolId
    }


    await School.deleteOne(lookup).lean()
    await ClassModel.findOneAndRemove(lookup).lean()
    await Student.findOneAndRemove(lookup).lean()
    await Mark.findOneAndRemove(lookup).lean()
    res.status(200).json({
      status: 'success',
      message: 'School has been deleted.'
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      e
    });
  }
}

exports.updateSchool = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'state', 'district', 'udisceCode', 'storeTrainingData', 'autoSync', 'autoSyncFrequency', 'tags', 'autoSyncBatchSize']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invaid Updates' })
    }
    let lookup = {
      schoolId: req.params.schoolId.toLowerCase()
    }
    let update = req.body

    const school = await School.findOne(lookup).lean();
    if (!school) return res.status(404).send({ message: 'School Id does not exist.' })

    await School.updateOne(lookup, update).lean().exec();
    res.status(200).send({ message: 'School has been updated.' })

  } catch (e) {
    res.status(400).json({
      status: 'fail',
      e
    });
  }
}



