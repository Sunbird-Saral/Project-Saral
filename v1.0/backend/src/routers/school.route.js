const express = require('express')
const router = express.Router({ mergeParams: true });
const School = require('../models/school')
const User = require('../models/users')
const ClassModel = require("../models/classModel")
const Student = require("../models/students")
const Mark = require("../models/marks")
const Helper = require('../middleware/helper')
const schoolController = require("../controller/schoolController")
const { stringObject } = require('../utils/commonUtils');
const { auth } = require('../middleware/auth');


router.route('/schools/login').post(schoolController.loginSchool)


router.post('/schools/create', async (req, res) => {
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

        res.status(201).send({ schools })
    } catch (e) {
        if (e.message.includes(' duplicate key error')) {
            let key = Object.keys(e.keyValue)
            res.status(401).send({ error: `${key[0]}: ${e.keyValue[key[0]]} already exist` })
        } else {
            res.status(400).send(e)
        }
    }
})

router.get('/schools', async (req, res) => {
    try {
        const school = await School.find({})
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
    }
})

router.delete('/schools/:schoolId', async (req, res) => {
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
        res.status(200).send({ message: 'School has been deleted.' })
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.patch('/schools/:schoolId', async (req, res) => {
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

    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

module.exports = router