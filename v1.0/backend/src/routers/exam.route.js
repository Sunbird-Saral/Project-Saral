const express = require('express')
const Exam = require('../models/exams')
const ExamMetaData = require('../models/examMetaData')
const { auth } = require('../middleware/auth')
const { getSubjectCode } = require('../utils/commonUtils')
const router = new express.Router()

router.post('/addExamsByClass', auth,async (req, res) => {
    const body = [...req.body]
    const exams = []
    const examsMeta = []
    body.forEach(data => {
        // let subjectCode = getSubjectCode(data.subject)
        // let classId = data.classId !== "10" ? `0${data.classId}` : data.classId
        let examDate = data.examDate.split('/').join('')
        // let examId = `EXAM${classId}${subjectCode}${examDate}`    
        // let examId =  await Counter.getValueForNextSequence("item_id")
        let examId = 2
        let schoolId = req.school.schoolId

        const examData = new Exam({
            ...data,
            examId,
            schoolId
        })
        exams.push(examData)
        })
    
    try {
        await Exam.insertMany(exams)
        res.status(201).send(exams)
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
            res.status(404).send({"message":`Exam dose not exist for ${req.params.classId}`}) 
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
        res.send(exam)
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
    
})

router.patch('/updateExam/:examId', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['subject', 'examLO','examDate', 'totalMarks', 'questions']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if(!isValidOperation) {
            return res.status(400).send({ message: 'Invaild Updates' })
        }
        let match={
            examId: req.params.examId,
            schoolId: req.school.schoolId
    } 
        let update = { $set: req.body }
        const exam = await Exam.find(match).lean()
        if(exam.length){
            await Exam.updateOne(match, update).lean().exec();
            res.status(200).send({"message": "Exam has been updated successfully."})
        }else{
            res.status(404).send({ "message": 'Exam Id does not exist.' })
        }
       
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }

})


module.exports = router