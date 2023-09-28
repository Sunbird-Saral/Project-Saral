const express = require('express')
const router = express.Router();
const { auth } = require('../middleware/auth')
const studentsSchema = require("../models/students")
const marksSchema = require("../models/marks").marksSchema
const clientPool = require('../db/mongoose');

const studentController = require('../controller/studentController')

router.get('/fetchStudentsandExamsByQuery', auth, studentController.fetchStudentsandExams)

router.post('/student', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection
        const Students = connection.model('Students', studentsSchema)

        if (!req.body.studentId) return res.status(400).send({ error: "Student Id is required." })

        let className
        if (req.body.classId) {
            className = `Class-${req.body.classId}`
        }

        const students = new Students({
            ...req.body,
            className,
            schoolId: req.school.schoolId,
            $comment: "Create Student API for Saving Students"
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
        if (e.message.includes(' duplicate key error')) {
            let key = Object.keys(e.keyValue)
            res.status(400).send({ error: `${key[0]}: ${e.keyValue[key[0]]} already exist` })
        } else {
            res.status(400).send(e)
        }
    }finally {
        next()
      }
})

router.post('/fetchStudentsByQuery', auth, async (req, res, next) => {
    const match = {}
    match.schoolId = req.school.schoolId
    if (req.body.classId) {
        match.classId = req.body.classId,
            match.className = req.body.className,
            $comment = "Get Student API for Find Students Data"
    }

    if (req.body.section && req.body.section != "0") {
        match.section = req.body.section
    }
    
    try {
        let connection = req.dbConnection;
        const Students = connection.model('Students', studentsSchema)

        const students = await Students.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        res.send(students)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }finally {
        next()
      }
})

router.delete('/student/:studentId', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection;
        const Students = connection.model('Students', studentsSchema)
        const Marks = connection.model('Marks', marksSchema)

        const student = await Students.findOne({ studentId: req.params.studentId, $comment: "Delete Student API for Find Student Data" })
        if (!student) return res.status(404).send({ message: 'Student Id does not exist.' })
        let lookup = {
            schoolId: req.school.schoolId,
            studentId: student.studentId
        }
        await Students.deleteOne(lookup).lean()
        await Marks.findOneAndRemove(lookup).lean()
        return res.status(200).send({ "message": "Student has been deleted." })
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }finally {
       next()
      }

})

router.patch('/student/:studentId', auth, async (req, res, next) => {
    if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
    const inputKey = Object.keys(req.body)
    const allowedUpdates = ['name', 'classId']
    const isValidOperation = inputKey.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ message: 'Invaid Updates' })
    }
    let lookup = {
        studentId: req.params.studentId,
        $comment: "Update Student API For Find And Update Student Data"
    }
    
    try {
        let connection = req.dbConnection;
        const Students = connection.model('Students', studentsSchema)
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
    }finally {
        next()
      }
})



module.exports = router
