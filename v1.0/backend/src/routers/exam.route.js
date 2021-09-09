const express = require('express')
const Exam = require('../models/exams')
const { auth } = require('../middleware/auth')
const { getSubjectCode } = require('../utils/commonUtils')
const Counter = require('../models/counter')
const router = new express.Router()

router.post('/addExamsByClass', auth, async (req, res) => {
    const body = [...req.body]
    const exams = []
    let schoolId = req.school.schoolId

    for (let i = 0; i < body.length; i++) {
        let examExist = await Exam.find({ schoolId, classId: body[i].classId, examDate: body[i].examDate, subject: body[i].subject })
        if (examExist.length) continue
        let examId = await Counter.getValueForNextSequence("examId")
        const examData = new Exam({
            ...body[i],
            examId,
            schoolId
        })
        exams.push(examData)
    }
    try {
        if (exams.length) {
            await Exam.insertMany(exams)
            res.status(201).send({ exams })
        } else {
            res.status(400).send({ "message": "Exam Id should be unique." })
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})


router.get('/getExamsByClas/:classId', auth, async (req, res) => {
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
        const exams = await Exam.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()

        if (!exams.length) {
            res.status(404).send({ "message": `Exam dose not exist for ${req.params.classId}` })
        }
        res.send(exams)
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.delete('/deleteExamByExamIdAndClassId/:examId', auth, async (req, res) => {
    try {
        const exam = await Exam.findOneAndDelete({ examId: req.params.examId }).lean()

        if (!exam) {
            res.status(404).send({ "message": 'Exam Id does not exist.' })
        }
        res.status(200).send({ "message": "Exam has been deleted successfully." })
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }

})

router.patch('/updateExam/:examId', auth, async (req, res) => {
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
        const exam = await Exam.find(match).lean()
        if (exam.length) {
            await Exam.updateOne(match, update).lean().exec();
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


// router.post('/addExamsByClass', auth,async (req, res) => {
//     try {
//     const body = [...req.body]
//     const exams = []
//     for(let data of body){
//         let schoolId = req.school.schoolId   
//         let examExist = await Exam.find({schoolId, classId: data.classId,examDate: data.examDate,subject: data.subject})
//         console.log(examExist.length)
//         if(!examExist.length){
//         // let examId = await Counter.getValueForNextSequence("examId")
//         const examData = new Exam({
//             ...data,
//             examId: await Counter.getValueForNextSequence("examId"),
//             schoolId
//         })
//         exams.push(examData)
//         console.log(exams.length)
//             let examResult = await Exam.insertMany(exams)
//             console.log(examResult)
//             res.status(201).send(examResult)
//     }else{
//         res.status(400).send({"message": "Exam Id should be unique."})
//     }
//     }
//     } catch (e) {
//         console.log(e);
//         res.status(400).send(e)
//     }
// })