const express = require('express')
const School = require('../models/school')
const ClassModel = require('../models/classModel')
const Student = require('../models/students')
const Mark = require('../models/marks')
const { auth } = require('../middleware/auth')
const router = new express.Router()


router.post('/schools/create', async (req, res) => {
    const school = new School({ ...req.body, udiseCode: req.body.schoolId })
    try {
        school.state = req.body.state.toLowerCase()
        school.schoolId = req.body.schoolId.toLowerCase()
        await school.save()
        const token = await school.generateAuthToken()
        res.status(201).send({ school, token })
    } catch (e) {
        if (e.message.includes(' duplicate key error')) {
            let key = Object.keys(e.keyValue)
            res.status(401).send({ error: `${key[0]}: ${e.keyValue[key[0]]} already exist` })
        }else{
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
                    block: element.block,
                    hmName: element.hmName,
                    noOfStudents: element.noOfStudents,
                    storeTrainingData: element.storeTrainingData,
                    createdAt: element.createdAt,
                    updatedAt: element.updatedAt
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
        const school = await School.findByCredentials(req.body.schoolId.toLowerCase(), req.body.password)
        const token = await school.generateAuthToken()
        let classes = []
        let response = {
            school,
            token
        }
        if (req.body.classes) {
            const classData = await ClassModel.findClassesBySchools(school.schoolId)

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

        res.send(response)
    } catch (e) {

        if (e && e.message == 'School Id or Password is not correct.') {
            res.status(422).send({ error: e.message })
        }
        else {
            res.status(400).send(e)
        }
    }
})

router.delete('/deleteSchoolBySchoolId/:schoolId', async (req, res) => {
    try {
        const school = await School.findOne({ schoolId: req.params.schoolId.toLowerCase() })
        if(!school) return res.status(404).send({ message: 'School Id does not exist.' })
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

router.patch('/updateSchool/:schoolId', async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'state', 'district', 'block', 'hmName', 'hmMobileNo', 'noOfStudents', 'udisceCode','storeTrainingData']
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