const express = require('express')
const router = express.Router();
const { auth } = require('../middleware/auth')
const Students = require("../models/students")
const Marks = require("../models/marks")

const studentController = require('../controller/studentController')

router.get('/fetchStudentsandExamsByQuery',auth,studentController.fetchStudentsandExams)

router.post('/student', auth, async (req, res) => {
    try {
        if (!req.body.studentId) return res.status(400).send({ error: "Student Id is required." })

        let className
        if (req.body.classId) {
            className = `Class-${req.body.classId}`
        }

        const students = new Students({
            ...req.body,
            className,
            schoolId: req.school.schoolId
        })

        await students.save()
        let response = {
            classId: students.classId,
            className: students.className,
            section: students.section,
            name: students.name,
            studentId: students.studentId,
            schoolId: students.schoolId,
            createdAt: students.createdAt,
            updatedAt: students.updatedAt
        }

        res.status(201).send(response)
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.post('/fetchStudentsByQuery', auth, async (req, res) => {
    const match = {}
    match.schoolId = req.school.schoolId
    if (req.body.classId) {
        match.classId = req.body.classId,
            match.className = req.body.className
    }

    if (req.body.section && req.body.section != "0") {
        match.section = req.body.section
    }

    try {
        const students = await Students.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        res.send(students)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
})

router.delete('/student/:studentId', async (req, res) => {
    try {
        const student = await Students.findOne({ studentId: req.params.studentId })
        if (!student) return res.status(404).send({ message: 'Student Id does not exist.' })
        let lookup = {
            studentId: student.studentId
        }
        await Students.deleteOne(lookup).lean()
        await Marks.findOneAndRemove(lookup).lean()
        return res.status(200).send({ "message": "Student has been deleted." })
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }

})

router.patch('/student/:studentId', async (req, res) => {
    if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
    const inputKey = Object.keys(req.body)
    const allowedUpdates = ['name', 'classId']
    const isValidOperation = inputKey.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ message: 'Invaid Updates' })
    }
    let lookup = {
        studentId: req.params.studentId
    }
    try {
        let updateData = {}
        if (inputKey.includes("name"))
            updateData["name"] = req.body.name;


        if (inputKey.includes("classId")) {
            updateData["classID"] = req.body.classID
        }

        const school = await Students.findOne(lookup).lean();

        if (!school) return res.status(404).send({ message: 'Student Id does not exist.' })

        await Students.updateOne(lookup, updateData).lean().exec();
        res.status(200).send({ message: 'Student has been updated.' })

    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})



module.exports = router