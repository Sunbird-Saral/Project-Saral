const School = require('../models/school')
const User = require('../models/users')
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils')

exports.GetSchoolsDetail = async (req, res, next) => {
  const school = await School.find({})
  let schools = []
  // if (school) {
  //   school.forEach(element => {
  //     let obj = {
  //       name: element.name,
  //       schoolId: element.schoolId,
  //       state: element.state,
  //       district: element.district,
  //       storeTrainingData: element.storeTrainingData
  //     }
  //     schools.push(obj)
  //   });
  // }
  res.status(200).json({
    status: 'success',
    data: {
      school,
    },
  });
};

exports.loginSchool = async (req, res, next) => {
  try {
    let userId = {}
    if (req.body.schoolId) {
      userId = req.body.schoolId.toLowerCase()
    }
    const users = await User.findByCredentials(userId, req.body.password)
    // const schools = await School.findOne({ schoolId: users.schoolId })
    
    // await Helper.lockScreenValidator(schools)
    const token = await User.generateAuthToken()
    console.log("token",token)
    
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
      console.log("inside")
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
      response.classes = classes
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (e) {
    if (e && e.message == 'School Id or Password is not correct.') {
      res.status(422).json({
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



