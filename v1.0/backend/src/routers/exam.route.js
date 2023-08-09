const express = require('express')
const { auth } = require('../middleware/auth')
const Helper = require('../middleware/helper')
const examsSchema = require('../models/exams')
const router = new express.Router()
const clientPool = require('../db/mongoose');

router.post('/exam', auth, async (req, res, next) => {
    try {

        let connection = req.dbConnection;
        const Exams = connection.model('Exams', examsSchema)

        const body = [...req.body]
        const exams = []
        let schoolId = req.school.schoolId
    
        for (let input of body) {
    
            if (input.examDate && input.examDate == undefined) {
                input.examDate = new Date().toLocaleDateString()
            }
    
            input.type = input.type.toUpperCase()
    
            let lookup = {
                state: input.state,
                classId: input.classId,
                examDate: input.examDate,
                subject: input.subject,
                $comment: "Create Exam API For Find Exam Data"
            }
    
            let examExist = await Exams.find(lookup)
            if (examExist.length) continue
            let examId = await Helper.getValueForNextSequence(connection , "examId")
            const examData = new Exams({
                ...input,
                examId,
                schoolId
            })
            exams.push(examData)
        }

        if (exams.length) {
            await Exams.insertMany(exams)
            res.status(201).send({ exams })
        } else {
            res.status(400).send({ "message": "Exam Id should be unique." })
        }
    } catch (e) {
        res.status(400).send(e)
    }finally {
        next()
    }
})


router.get('/examByClass/:classId', auth, async (req, res,next) => {
    const match = {
        schoolId: req.school.schoolId,
        classId: req.params.classId,
        $comment: "Get Exam API For Find Exam Data"
    }

    if (req.query.subject) {
        match.subject = req.query.subject
    }
    if (req.query.examDate) {
        match.examDate = req.query.examDate
    }

    try {
        let connection = req.dbConnection;
        const Exams = connection.model('Exams', examsSchema)
        console.log('match', match)
        const exams = await Exams.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()

        if (!exams.length) {
            return res.status(404).send({ "message": `Exam does not exist for ${req.params.classId}` })
        }
        res.send(exams)
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }finally {
        next()
    }
})

router.delete('/exam/:examId', auth, async (req, res,next) => {
    try {
        let connection = req.dbConnection;
        const Exams = connection.model('Exams', examsSchema)

        const exam = await Exams.findOneAndDelete({ examId: req.params.examId , $comment: "Delete Exams API For Find And Delete Exams Data"}).lean()

        if (exam) {
            res.status(200).send({ "message": "Exam has been deleted successfully." })
        } else {
            res.status(404).send({ "message": 'Exam Id does not exist.' })
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }finally {
        next()
    }

})

router.patch('/exam/:examId', auth, async (req, res,next) => {
    try {
        let connection = req.dbConnection;
        const Exams = connection.model('Exams', examsSchema)

        const updates = Object.keys(req.body)
        const allowedUpdates = ['subject', 'examLO', 'examDate', 'totalMarks', 'questions']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invaild Updates' })
        }
        let match = {
            examId: req.params.examId,
            schoolId: req.school.schoolId,
            $comment: "Update Exam API For Find And Update Exam Data"
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
    }finally {
        next()
    }

})


module.exports = router