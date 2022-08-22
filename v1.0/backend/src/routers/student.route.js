const express = require('express')
const Student = require('../models/students')
const Exam = require('../models/exams')
const Marks = require('../models/marks')
const { auth } = require('../middleware/auth')
const { getSectionCode } = require('../utils/commonUtils')
const router = new express.Router()



router.post('/student', auth, async (req, res) => {
    try {
        if(!req.body.identifier)  return res.status(400).send({ error: "Identifier Id is required." })
        // let commonDigit = "0000000"
        const category1 = req.body.studentClass && req.body.studentClass.length > 0 ? req.body.studentClass[0].category1 : "2"
        const category2 = req.body.category2 ? req.body.category2 : "A"
        // const studentsCount = await Student.getStudentsCountByClassAndSection(req.school.orgId, category1, section)

        // const newStudentCount = String(studentsCount + 1)
        // const newStudentLastSevenDigit = commonDigit.slice(0, - newStudentCount.length) + newStudentCount
        // const sectionCode = getSectionCode(section)
    
        const studentClass = req.body.studentClass && req.body.studentClass.length > 0 && [{
            category1: req.body.studentClass[0].category1,
            categoryName: `Class-${req.body.studentClass[0].category1}`
        }]
        const students = new Student({
            ...req.body,
            studentClass,
            orgId: req.school.orgId
        })

        await students.save()
        let response = {
            studentClass: students.studentClass,
            category2: students.category2,
            name: students.name,
            identifier: students.identifier,
            orgId: students.orgId,
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
    match.orgId = req.school.orgId
    if (req.body.category1) {
        let studentClassObj = {
            category1: req.body.category1,
            categoryName: `Class-${req.body.category1}`
        }
        let studentClass = [studentClassObj]
        match.studentClass = studentClass
    }

    if (req.body.category2 && req.body.category2 != "0") {
        match.category2 = req.body.category2
    }

    try {
        const students = await Student.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        res.send(students)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
})

router.post('/fetchStudentsandExamsByQuery', auth, async (req, res) => {
    const match = {}
    const examMatch = {}
    match.orgId = req.school.orgId

    if (req.body.category1) {
        let studentClassObj = {
            category1: req.body.category1,
            categoryName: `Class-${req.body.category1}`
        }
        let studentClass = [studentClassObj]
        match.studentClass = studentClass
        examMatch.category1 = studentClassObj.category1
        examMatch.orgId = req.school.orgId
    } else {
        if (req.school.minimal == true) {
            examMatch.orgId = req.school.orgId
        } else {
        return res.status(404).send({ message: 'Please send category1' })
    }
    }

    if (req.body.category2 && req.body.category2 != "0") {
        match.category2 = req.body.category2
    }

    if (req.body.hasOwnProperty('category3')) {
        let category3 = req.body.category3.split(' ')
        examMatch.date = category3[1]
    }
    try {
        const students = await Student.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()
        for(let student of students){
            let marks = await Marks.findOne({"identifier": student.identifier, "date": examMatch.date}) 
            if(marks && typeof marks == "object" && marks.date == examMatch.date){
                student["availability"] = marks.availability
            }else{
                student["availability"] = true
                }
                }

        const exams = await Exam.find(examMatch, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()
        res.send({ students, exams })
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
})

router.delete('/student/:identifier', async (req, res) => {
    try {
        const student = await Student.findOne({ identifier: req.params.identifier })
        if (!student) return res.status(404).send({ message: 'Identifier Id does not exist.' })
        let lookup = {
            identifier: student.identifier
        }
        await Student.deleteOne(lookup).lean()
        await Marks.findOneAndRemove(lookup).lean()
        return res.status(200).send({ "message": "Identifier has been deleted." })
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }

})

router.patch('/student/:identifier', async (req, res) => {
    if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
    const inputKey = Object.keys(req.body)
    const allowedUpdates = ['name', 'studentClass']
    const isValidOperation = inputKey.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ message: 'Invaid Updates' })
    }
    let lookup = {
        identifier: req.params.identifier
    }
    try {
        let updateData = {}
        if (inputKey.includes("name"))
            updateData["name"] = req.body.name;


        if (inputKey.includes("studentClass")) {
            const studentClass = req.body.studentClass && req.body.studentClass.length > 0 && [{
                category1: req.body.studentClass[0].category1,
                categoryName: `Class-${req.body.studentClass[0].category1}`
            }]
            updateData["studentClass"] = studentClass
        }
        const school = await Student.findOne(lookup).lean();
        if (!school) return res.status(404).send({ message: 'Identifier Id does not exist.' })

        await Student.updateOne(lookup, updateData).lean().exec();
        res.status(200).send({ message: 'Identifier has been updated.' })

    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})



module.exports = router