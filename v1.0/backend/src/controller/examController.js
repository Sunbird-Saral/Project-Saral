const Exam = require('../models/exams')
const Counter = require('../models/counter')

exports.createExam = async (req, res, next) => {
    const body = [...req.body]
    const exams = []
    let schoolId = req.school.schoolId

    for (let i = 0; i < body.length; i++) {

        if (!body[i].examDate && body[i].examDate == undefined) {
            body[i].examDate = new Date().toLocaleDateString()
        }

        body[i].type = body[i].type.toUpperCase()
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
        res.status(400).json({
            status: 'fail',
            e
        });

    }
}

exports.getExamDataByClass = async (req, res, next) => {
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
            return res.status(404).send({ "message": `Exam dose not exist for ${req.params.classId}` })
        }
        res.status(200).json({
            status: 'success',
            exams
        });

    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });

    }
}


exports.deleteExam = async (req, res, next) => {
    try {
        const exam = await Exam.findOneAndDelete({ examId: req.params.examId }).lean()

        if (exam) {
            res.status(200).send({ "message": "Exam has been deleted successfully." })
        } else {
            res.status(404).send({ "message": 'Exam Id does not exist.' })
        }

    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });
    }
}

exports.updateExam = async (req, res, next) => {
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

    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });

    }
}