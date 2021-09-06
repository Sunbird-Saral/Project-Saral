const express = require('express')
const Exam = require('../models/exams')
const ExamMetaData = require('../models/examMetaData')
const { auth } = require('../middleware/auth')
const { getSubjectCode } = require('../utils/commonUtils')
const router = new express.Router()

router.post('/addExamsByClass', async (req, res) => {    
    const body = [...req.body]
    const exams = []
    const examsMeta = []
    body.forEach(data => {
        let subjectCode =  getSubjectCode(data.examName)
        
        let classId = data.classId !== "10" ? `0${data.classId}`: data.classId
        let examDate = data.examDate.split('/').join('')
        let examId = `EXAM${classId}${subjectCode}${examDate}`
        const examData =  new Exam({
            ...data,
            examId,
            uniqueId: `${examId}_${classId}`
        })
        exams.push(examData)

        const examMetaData = new ExamMetaData({
            ...data,
            examId,
            classId: data.classId,
            examDate: data.examDate
        })
        examsMeta.push(examMetaData)
    });
    
    try {
        await Exam.insertMany(exams)
        await ExamMetaData.insertMany(examsMeta)
        res.status(201).send({exams, examsMeta})
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.post('/getExamsByClass', auth, async (req, res) => {
    const match = {}
    if(req.body.classId) {
        match.classId = req.body.classId
    }
    
    try {
        const exams = await Exam.find(match)
        
        if(!exams) {
            res.status(404).send()
        }
        res.send(exams)
    } 
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

router.post('/deleteExamByExamIdAndClassId', auth, async (req, res) => {    
    const match = {}
    if(req.body.examId && req.body.classId) {
        match.uniqueId = `${req.body.examId}_${req.body.classId}`
    }
    
    try {
        const exam = await Exam.findOneAndDelete(match)        
        
        if(!exam) {
            res.status(404).send()
        }
        res.send(exam)
    } 
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }

})


module.exports = router