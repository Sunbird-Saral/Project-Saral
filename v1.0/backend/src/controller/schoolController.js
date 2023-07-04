const schoolsSchema = require('../models/school')
const classesSchema = require("../models/classes")
const usersSchema = require("../models/users")
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils');
const logger = require('../logging/logger')
const clientPool = require('../db/mongoose');
// const {getLoginData,setLoginData,getToken,setToken} = require('../logging/logger')

exports.loginSchool = async (req, res, next) => {
  let connection
  try {
    const startTime = new Date();
    connection = await clientPool.acquire();
    const Users = connection.model('Users', usersSchema)
    const Schools = connection.model('Schools', schoolsSchema)
    const Classes = connection.model('Classes', classesSchema)

    let userId = {}
    if (req.body.schoolId) {
      userId = req.body.schoolId.toLowerCase()
    }

    const users = await Helper.findByCredentials(userId, req.body.password)

    const schools = await Schools.findOne({ schoolId: users.schoolId, $comment: "Login School API For Find school data according to schoolId." })

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
      const classData = await Classes.find({ schoolId: schools.schoolId, $comment: "Login School API For Find classes according to schoolId." })

      if (!classData) {
        throw new Error('No Classes')
      }

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
    const endTime = new Date();
    const executionTime = endTime - startTime;

    logger.info(`Execution time for Get Login API : ${executionTime}ms`);

    res.status(200).json({
      ...data
    });
  } catch (e) {
    if (e && e.message == 'School Id or Password is not correct.') {
      logger.error(`${e}`)

      res.status(401).json({
        error: e.message
      })
    }
    else if (e && e.message == stringObject().lockScreen) {
      logger.warn(e)
      res.status(500).json({
        error: e.message
      })
    }
    else {
      logger.warn("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", e)
      res.status(400).json({
        e
      });
    }
  } finally {
    if (connection) {
      clientPool.release(connection);
    }
  }
};
