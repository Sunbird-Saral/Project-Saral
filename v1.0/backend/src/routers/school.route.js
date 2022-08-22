const express = require('express')
const School = require('../models/school')
const ClassModel = require('../models/classModel')
const Student = require('../models/students')
const Mark = require('../models/marks')
const { auth } = require('../middleware/auth')
const router = new express.Router()


router.post('/schools/create', async (req, res) => {
    const school = new School({ ...req.body })
    try {
        school.state = req.body.state.toLowerCase()
        school.orgId = req.body.orgId.toLowerCase()

        if (req.body.autoSync) school.autoSync = req.body.autoSync
        if(req.body.autoSyncFrequency)   school.autoSyncFrequency = req.body.autoSyncFrequency
        if(req.body.tags) school.tags = req.body.tags
        if(req.body.autoSyncBatchSize)   school.autoSyncBatchSize = req.body.autoSyncBatchSize
        await school.save()
        let schools = {
            storeTrainingData: school.storeTrainingData,
            name: school.name,
            orgId: school.orgId,
            state: school.state
        }
        const token = await school.generateAuthToken()
        res.status(201).send({ schools, token })
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
                    orgId: element.orgId,
                    state: element.state,
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

router.post('/schools/login', async (req, res) => {
    try {
        const schools = await School.findByCredentials(req.body.orgId.toLowerCase(), req.body.password)
        const token = await schools.generateAuthToken()
        let classes = []
        let school = {
            storeTrainingData: schools.storeTrainingData,
            name: schools.name,
            orgId: schools.orgId,
            state: schools.state,
            autoSync: schools.autoSync,
            autoSyncFrequency: schools.autoSyncFrequency,
            tags: schools.tags,
            autoSyncBatchSize: schools.autoSyncBatchSize,
            isMinimalMode: schools.isMinimalMode,
            supportEmail: schools.supportEmail
        }

        let response = {
            school,
            token
        }
        if (req.body.classes) {
            const classData = await ClassModel.findClassesBySchools(schools.orgId)

            classData.forEach(data => {
                const { categories, category1, className } = data
                let obj = {
                    categories,
                    category1,
                    className
                }
                classes.push(obj)
            });
            classes.sort((a, b) => a.category1.trim().localeCompare(b.category1.trim()))
            response.classes = classes
        }

        res.send(response)
    } catch (e) {

        if (e && e.message == 'Org Id or Password is not correct.') {
            res.status(422).send({ error: e.message })
        }
        else {
            res.status(400).send(e)
        }
    }
})

router.delete('/schools/:orgId', async (req, res) => {
    try {
        const school = await School.findOne({ orgId: req.params.orgId.toLowerCase() })
        if (!school) return res.status(404).send({ message: 'Org Id does not exist.' })
        let lookup = {
            orgId: school.orgId
        }
        await School.deleteOne(lookup).lean()
        await ClassModel.findOneAndRemove(lookup).lean()
        await Student.findOneAndRemove(lookup).lean()
        await Mark.findOneAndRemove(lookup).lean()
        res.status(200).send({ message: 'Org has been deleted.' })
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.patch('/schools/:orgId', async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'state', 'udisceCode', 'storeTrainingData', 'autoSync', 'autoSyncFrequency','tags','autoSyncBatchSize']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Updates' })
        }
        let lookup = {
            orgId: req.params.orgId.toLowerCase()
        }
        let update = req.body

        const school = await School.findOne(lookup).lean();
        if (!school) return res.status(404).send({ message: 'Org Id does not exist.' })

        await School.updateOne(lookup, update).lean().exec();
        res.status(200).send({ message: 'Org has been updated.' })

    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

module.exports = router