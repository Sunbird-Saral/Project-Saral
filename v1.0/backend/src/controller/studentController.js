const School = require('../models/school')
const Student = require("../models/students")
const Marks = require("../models/marks")
const Exam = require('../models/exams')
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils');


exports.fetchStudentsandExams = async (req, res, next) => {
    const match = {}
    const examMatch = {}

    match.schoolId = req.school.schoolId
    if (req.body.classId) {
        let studentClassObj = {
            classId: req.body.classId,
            className: `Class-${req.body.classId}`
        }
        let studentClass = [studentClassObj]
        match.studentClass = studentClass
        examMatch.classId = studentClassObj.classId
        examMatch.schoolId = req.school.schoolId
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

    if (req.body.set) {
        setMatch = req.body.set ? req.body.set : ''
    }
    try {

        await Helper.lockScreenValidator(req.school)

        const students = await Student.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()

        for (let i = 0; i < students.length; i++) {
            let lookup = {
                studentId: students[i].studentId,
                subject: examMatch.subject,
                examDate: examMatch.examDate
            }
            if (req.body.set) {
                lookup.set = req.body.set
            }

            let marks = await Marks.findOne(lookup)

            if (marks && typeof marks == "object") {
                students[i].studentAvailability = marks.studentAvailability
            } else {
                students[i].studentAvailability = true
            }
        }

        const exams = await Exam.find(examMatch, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })

        res.status(200).json({
            status: 'success',
            students, exams
        });
    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });
    }
};


// exports.createStudent = async (req, res, next) => {
//     try {
//         if (!req.body.studentId) return res.status(400).json({ error: "Student Id is required." })

//         const studentClass = req.body.studentClass && req.body.studentClass.length > 0 && [{
//             classId: req.body.studentClass[0].classId,
//             className: `Class-${req.body.studentClass[0].classId}`
//         }]
//         const student = new Student({
//             ...req.body,
//             studentClass,
//             schoolId: req.school.schoolId
//         })

//         let students = await Student.create(student)
        
//         let response = {
//             studentClass: students.studentClass,
//             section: students.section,
//             name: students.name,
//             studentId: students.studentId,
//             schoolId: students.schoolId,
//             createdAt: students.createdAt,
//             updatedAt: students.updatedAt
//         }
//         res.status(201).json({
//             status: 'success',
//             response
//         });
//     } catch (e) {
//         res.status(400).json({
//             status: 'fail',
//             e
//         });
//     }
// }

// exports.fetchStudentsData = async (req, res, next) => {
//     const match = {}
//     match.schoolId = req.school.schoolId

//     if (req.body.classId) {
//         let studentClassObj = {
//             classId: req.body.classId,
//             className: `Class-${req.body.classId}`
//         }
//         let studentClass = [studentClassObj]
//         match.studentClass = studentClass
//     } else {
//         return res.status(404).json({ message: 'Please send classId' })
//     }

//     if (req.body.section && req.body.section != "0") {
//         match.section = req.body.section
//     }

//     try {

//         const students = await Student.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
//         res.status(200).json({
//             status: 'success',
//             students
//         });
//     } catch (e) {
//         res.status(400).json({
//             status: 'fail',
//             e
//         });
//     }
// }

// exports.deleteStudent = async (req, res, next) => {
//     try {
//         const student = await Student.findOne({ studentId: req.params.studentId })
//         if (!student) return res.status(404).json({ message: 'Student Id does not exist.' })
//         let lookup = {
//             studentId: student.studentId
//         }
//         await Student.deleteOne(lookup).lean()
//         await Marks.findOneAndRemove(lookup).lean()

//         res.status(200).json({
//             status: 'success',
//             message: "Student has been deleted."
//         });

//     } catch (e) {
//         res.status(400).json({
//             status: 'fail',
//             e
//         });
//     }
// }

// exports.updateStudent = async (req, res, next) => {
//     if (Object.keys(req.body).length === 0) res.status(400).json({ message: 'Validation error.' })
//     const inputKey = Object.keys(req.body)
//     const allowedUpdates = ['name', 'studentClass']
//     const isValidOperation = inputKey.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).json({ message: 'Invaid Updates' })
//     }

//     let lookup = {
//         studentId: req.params.studentId
//     }

//     try {
//         let updateData = {}
//         if (inputKey.includes("name"))
//             updateData["name"] = req.body.name;


//         if (inputKey.includes("studentClass")) {
//             const studentClass = req.body.studentClass && req.body.studentClass.length > 0 && [{
//                 classId: req.body.studentClass[0].classId,
//                 className: `Class-${req.body.studentClass[0].classId}`
//             }]
//             updateData["studentClass"] = studentClass
//         }
//         const school = await Student.findOne(lookup)
//         if (!school) return res.status(404).send({ message: 'Student Id does not exist.' })

//         await Student.updateOne(lookup, updateData).lean();

//         res.status(200).json({
//             status: 'success',
//             message: "Student has been updated."
//         });

//     } catch (e) {
//         res.status(400).json({
//             status: 'fail',
//             e
//         });
//     }
// }




