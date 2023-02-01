const express = require('express')
const router = express.Router();
const { auth } = require('../middleware/auth')
const Student = require("../models/students")
const Marks = require("../models/marks")

const studentController = require('../controller/studentController')

router.post('/fetchStudentsandExamsByQuery',auth,studentController.fetchStudentsandExams)

router.post('/student', auth, async (req, res) => {
    try {
        if(!req.body.studentId)  return res.status(400).send({ error: "Student Id is required." })
        // let commonDigit = "0000000"
        const classId = req.body.studentClass && req.body.studentClass.length > 0 ? req.body.studentClass[0].classId : "2"
        const section = req.body.section ? req.body.section : "A"
        // const studentsCount = await Student.getStudentsCountByClassAndSection(req.school.schoolId, classId, section)

        // const newStudentCount = String(studentsCount + 1)
        // const newStudentLastSevenDigit = commonDigit.slice(0, - newStudentCount.length) + newStudentCount
        // const sectionCode = getSectionCode(section)
    
        const studentClass = req.body.studentClass && req.body.studentClass.length > 0 && [{
            classId: req.body.studentClass[0].classId,
            className: `Class-${req.body.studentClass[0].classId}`
        }]
        const students = new Student({
            ...req.body,
            studentClass,
            schoolId: req.school.schoolId
        })

        await students.save()
        let response = {
            studentClass: students.studentClass,
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
        let studentClassObj = {
            classId: req.body.classId,
            className: `Class-${req.body.classId}`
        }
        let studentClass = [studentClassObj]
        match.studentClass = studentClass
    }

    if (req.body.section && req.body.section != "0") {
        match.section = req.body.section
    }

    try {
        const students = await Student.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        res.send(students)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
})

router.delete('/student/:studentId', async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.studentId })
        if (!student) return res.status(404).send({ message: 'Student Id does not exist.' })
        let lookup = {
            studentId: student.studentId
        }
        await Student.deleteOne(lookup).lean()
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
    const allowedUpdates = ['name', 'studentClass']
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


        if (inputKey.includes("studentClass")) {
            const studentClass = req.body.studentClass && req.body.studentClass.length > 0 && [{
                classId: req.body.studentClass[0].classId,
                className: `Class-${req.body.studentClass[0].classId}`
            }]
            updateData["studentClass"] = studentClass
        }
        const school = await Student.findOne(lookup).lean();
        if (!school) return res.status(404).send({ message: 'Student Id does not exist.' })

        await Student.updateOne(lookup, updateData).lean().exec();
        res.status(200).send({ message: 'Student has been updated.' })

    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})



module.exports = router