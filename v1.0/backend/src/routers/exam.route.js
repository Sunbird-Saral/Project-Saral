const express = require('express')
const Exam = require('../models/exams')
const { auth } = require('../middleware/auth')
const { getSubjectCode } = require('../utils/commonUtils')
const Counter = require('../models/counter')
const router = new express.Router()

router.post('/exam', auth, async (req, res) => {
    const body = [...req.body]
    const exams = []
    let orgId = req.school.orgId

    for (let i = 0; i < body.length; i++) {

        if(!body[i].date && body[i].date == undefined){
            body[i].date = new Date().toLocaleDateString()
        }
 
        body[i].type = body[i].type.toUpperCase()
        let examExist = await Exam.find({ orgId, category1: body[i].category1, date: body[i].date, category3: body[i].category3 })
        if (examExist.length) continue
        let examId = await Counter.getValueForNextSequence("examId")
        const examData = new Exam({
            ...body[i],
            examId,
            orgId
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


router.get('/examByClass/:category1', auth, async (req, res) => {
    const match = {
        orgId: req.school.orgId,
        category1: req.params.category1
    }

    if (req.query.category3) {
        match.category3 = req.query.category3
    }
    if (req.query.date) {
        match.date = req.query.date
    }

    try {
        const exams = await Exam.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()

        if (!exams.length) {
            return res.status(404).send({ "message": `Exam dose not exist for ${req.params.category1}` })
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
        const exam = await Exam.findOneAndDelete({ examId: req.params.examId }).lean()

        if (exam) {
            res.status(200).send({ "message": "Exam has been deleted successfully." })
        }else{
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
        const allowedUpdates = ['category3', 'examLO', 'date', 'totalResults', 'questions']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invaild Updates' })
        }
        let match = {
            examId: req.params.examId,
            orgId: req.school.orgId
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
//         let orgId = req.school.orgId   
//         let examExist = await Exam.find({orgId, category1: data.category1,date: data.date,category3: data.category3})
//         console.log(examExist.length)
//         if(!examExist.length){
//         // let examId = await Counter.getValueForNextSequence("examId")
//         const examData = new Exam({
//             ...data,
//             examId: await Counter.getValueForNextSequence("examId"),
//             orgId
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