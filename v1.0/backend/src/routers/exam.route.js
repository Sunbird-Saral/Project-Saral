const express = require('express')
const Exams = require('../models/exams')
const { auth } = require('../middleware/auth')
const Counters = require('../models/counter')
const router = new express.Router()

router.post('/exam', auth, async (req, res) => {
    const body = [...req.body]
    const exams = []
    let schoolId = req.school.schoolId

    for (let input of body) {

        if (input.examDate && input.examDate == undefined) {
            input.examDate = new Date().toLocaleDateString()
        }

        input.type = input.type.toUpperCase()
        let examExist = await Exams.find({ schoolId, classId: input.classId, examDate: input.examDate, subject: input.subject })
        if (examExist.length) continue
        let examId = await Counters.getValueForNextSequence("examId")
        const examData = new Exams({
            ...input,
            examId,
            schoolId
        })
        exams.push(examData)
    }
    try {
        if (exams.length) {
            await Exams.insertMany(exams)
            res.status(201).send({ exams })
        } else {
            res.status(400).send({ "message": "Exam Id should be unique." })
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})


router.get('/examByClass/:classId', auth, async (req, res) => {
    const match = {
        schoolId: req.school.schoolId,
        classId: req.params.classId
    }

    if (req.query.subject) {
        match.subject = req.query.subject
    }
    if (req.query.examDate) {
        match.examDate = req.query.examDate
    }

    try {
        const exams = await Exams.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()

        if (!exams.length) {
            return res.status(404).send({ "message": `Exam dose not exist for ${req.params.classId}` })
        }
        res.send(exams)
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.delete('/exam/:examId', auth, async (req, res) => {
    try {
        const exam = await Exams.findOneAndDelete({ examId: req.params.examId }).lean()

        if (exam) {
            res.status(200).send({ "message": "Exam has been deleted successfully." })
        } else {
            res.status(404).send({ "message": 'Exam Id does not exist.' })
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }

})

router.patch('/exam/:examId', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['subject', 'examLO', 'examDate', 'totalMarks', 'questions']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invaild Updates' })
        }
        let match = {
            examId: req.params.examId,
            schoolId: req.school.schoolId
        }
        let update = { $set: req.body }
        const exam = await Exams.find(match).lean()
        if (exam.length) {
            await Exams.updateOne(match, update).lean().exec();
            res.status(200).send({ "message": "Exam has been updated successfully." })
        } else {
            res.status(404).send({ "message": 'Exam Id does not exist.' })
        }

    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }

})


module.exports = router
