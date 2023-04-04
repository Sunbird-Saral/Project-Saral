const Schools = require("../models/school")
const Students = require("../models/students")
const Marks = require("../models/marks")
const Exams = require('../models/exams')
const Helper = require('../middleware/helper')



exports.fetchStudentsandExams = async (req, res, next) => {
    const match = {}
    const examMatch = {}

    match.schoolId = req.school.schoolId
    if (req.body.classId) {
        match.classId = req.body.classId,
        examMatch.classId = req.body.classId
        const school = await Schools.findOne({ schoolId: req.school.schoolId })
        examMatch.state = school.state
    } else {
        return res.status(404).json({ message: 'Please send classId' })
    }

    if (req.body.section && req.body.section != "0") {
        match.section = req.body.section
    }

    if (req.body.hasOwnProperty('subject')) {
        let subject = req.body.subject.split(' ')
        examMatch.subject = subject[0]
        examMatch.examDate = subject[1]
    }

    try {

        await Helper.lockScreenValidator(req.school)

        const students = await Students.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()


        for (let student of students) {
            let lookup = {
                studentId: student.studentId,
                subject: examMatch.subject,
                examDate: examMatch.examDate
            }

            if (req.body.set) {
                lookup.set = req.body.set
            }

            let marks = await Marks.findOne(lookup)

            if (marks && typeof marks == "object") {
                student["studentAvailability"] = marks.studentAvailability
            } else {
                student["studentAvailability"] = true
            }
        }


        const exams = await Exams.find(examMatch, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })

        res.status(200).json({
            students, exams
        });
    } catch (e) {
        res.status(400).json({
            e
        });
    }
};






