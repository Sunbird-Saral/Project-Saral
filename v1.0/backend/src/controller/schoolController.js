const Schools = require('../models/school')
const Classes = require("../models/classes")
const Users = require("../models/users")
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils');

exports.loginSchool = async (req, res, next) => {
  try {
    let userId = {}
    if (req.body.schoolId) {
      userId = req.body.schoolId.toLowerCase()
    }
  
    const users = await Helper.findByCredentials(userId, req.body.password)
    
    const schools = await Schools.findOne({ schoolId: users.schoolId })

    await Helper.lockScreenValidator(schools)

    const token = await Users.generateAuthToken(users)

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
      isManualEditEnabled: schools.isManualEditEnabled,
      scanTimeoutMs: schools.scanTimeoutMs,
      supportEmail: schools.supportEmail,
      offlineMode: schools.offlineMode,
      isAppForceUpdateEnabled: schools.isAppForceUpdateEnabled,
      lock: schools.lock,
      isFBAnalyticsEnabled: schools.isFBAnalyticsEnabled,
      userId: users.userId,


    }

    let data = {
      school,
      token
    }

    if (req.body.classes) {
      const classData = await Classes.findClassesBySchools(schools.schoolId)

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
        error: e.message
      })
    }
    else if (e && e.message == stringObject().lockScreen) {
      res.status(500).json({
        error: e.message
      })
    }
    else {
      res.status(400).json({
        e
      });
    }
  }
};
