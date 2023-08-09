const express = require('express')
const router = express.Router({ mergeParams: true });
const schoolsSchema = require('../models/school')
const classesSchema = require("../models/classes")
const studentsSchema = require("../models/students")
const marksSchema = require("../models/marks")
const schoolController = require("../controller/schoolController")


router.route('/schools/login').post(schoolController.loginSchool)


router.post('/schools/create', async (req, res, next) => {
    try {

        let connection = req.dbConnection
        const Schools = connection.model('Schools', schoolsSchema)

        const school = new Schools({ ...req.body })

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

        res.status(201).send({ schools })
    } catch (e) {
        if (e.message.includes(' duplicate key error')) {
            let key = Object.keys(e.keyValue)
            res.status(401).send({ error: `${key[0]}: ${e.keyValue[key[0]]} already exist` })
        } else {
            res.status(400).send(e)
        }
    }finally {
        next()
      }
})

router.get('/schools', async (req, res,next) => {
    try {
        let connection = req.dbConnection
        const Schools = connection.model('Schools', schoolsSchema)

        const school = await Schools.find({$comment: "Get School API For Find Schools Data."})
        let schools = []
        if (school) {
            school.forEach(element => {
                let obj = {
                    name: element.name,
                    schoolId: element.schoolId,
                    state: element.state,
                    district: element.district,
                    storeTrainingData: element.storeTrainingData
                }
                schools.push(obj)
            });
        }
        res.send({ schools })
    } catch (e) {
        res.send(e)
    }finally {
        next()
      }
})

router.delete('/schools/:schoolId', async (req, res, next) => {
    try {
        let connection = req.dbConnection
        const Schools = connection.model('Schools', schoolsSchema)
        const Classes = connection.model('Classes', classesSchema)
        const Students = connection.model('Students', studentsSchema)
        const Marks = connection.model('Marks', marksSchema);
        

        const school = await Schools.findOne({ schoolId: req.params.schoolId.toLowerCase() , $comment: "Delete School API For Find School Data." })
        if (!school) return res.status(404).send({ message: 'School Id does not exist.' })
        let lookup = {
            schoolId: school.schoolId
        }
        await Schools.deleteOne(lookup).lean()
        await Classes.findOneAndRemove(lookup).lean()
        await Students.findOneAndRemove(lookup).lean()
        await Marks.findOneAndRemove(lookup).lean()
        res.status(200).send({ message: 'School has been deleted.' })
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }finally {
        next()
      }
})

router.patch('/schools/:schoolId', async (req, res, next) => {
    try {
        let connection = req.dbConnection
        const Schools = connection.model('Schools', schoolsSchema)
        
        if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'state', 'district', 'udisceCode', 'storeTrainingData', 'autoSync', 'autoSyncFrequency', 'tags', 'autoSyncBatchSize']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Updates' })
        }
        let lookup = {
            schoolId: req.params.schoolId.toLowerCase(),
            $comment: "Update School API For Find And Update School Data." 
        }
        let update = req.body

        const school = await Schools.findOne(lookup).lean();
        if (!school) return res.status(404).send({ message: 'School Id does not exist.' })

        await Schools.updateOne(lookup, update).lean().exec();
        res.status(200).send({ message: 'School has been updated.' })

    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }finally {
        next()
      }
})

module.exports = router