const express = require('express')
const router = new express.Router()
const Exam = require('../models/exams')
const ROI = require('../models/roi')
const { auth } = require('../middleware/auth')
const School = require('../models/school')
const { compareSync } = require('bcryptjs')
const Counter = require('../models/counter')
const roiController = require("../controller/roiController")

router.get('/roi/:examId?',auth,roiController.getRoiData)


router.post('/roi', auth, async (req, res) => {
    try {
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['subject', 'classId', 'type', 'roi','set']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }

        let lookup = {
            schoolId: req.school.schoolId,
            subject: req.body.subject,
            classId: req.body.classId
        }
        const examExist = await Exam.findOne(lookup)
        if (examExist) {
            const school = await School.findOne({ schoolId: examExist.schoolId })
            req.body.type = req.body.type.toUpperCase()
            const roiExist = await ROI.findOne({ classId: req.body.classId, subject: req.body.subject, state: school.state, type: req.body.type })
            if (!roiExist) {
                // const school = await School.findOne({schoolId:examExist.schoolId})
                req.body.state = school.state
                req.body.roiId = await Counter.getValueForNextSequence("roiId")
                let roi = await ROI.create(req.body)
                let roiResponse = {
                    roiId: roi.roiId,
                    classId: roi.classId,
                    subject: roi.subject,
                    state: roi.state.toLowerCase(),
                    createdAt: roi.createdAt
                }
                res.status(201).send(roiResponse)
            } else {
                res.status(400).send({ "message": `roiId already exist` })
            }
        } else {
            res.status(400).send({ "message": `examId does not exist` })
        }

    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/roi/:examId', auth, async (req, res) => {
    try {
        if (Object.keys(req.body) != "roi") return res.status(400).send({ message: 'Invalid Input .' })

        const examExist = await Exam.findOne({ examId: req.params.examId }).lean()
        if (examExist) {
            const school = await School.findOne({ schoolId: req.school.schoolId })
            let lookup = {
                classId: examExist.classId,
                subject: examExist.subject,
                state: school.state
            }

            const roiData = await ROI.findOne(lookup).lean()
            if (!roiData) return res.status(404).send({ "message": "ROI Id does not exist." })
            let updateObj = {}

            if (req.body.roi) updateObj["roi"] = req.body.roi

            let filter = {
                roiId: roiData.roiId
            }
            await ROI.update(filter, updateObj).lean();
            res.status(201).send({ "message": 'ROI is updated successfully.' })
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/roi/:examId', auth, async (req, res) => {
    try {
        const examExist = await Exam.findOne({ examId: req.params.examId }).lean()
        if (examExist) {
            const school = await School.findOne({ schoolId: req.school.schoolId })
            let lookup = {
                classId: examExist.classId,
                subject: examExist.subject,
                state: school.state
            }
            const roiExist = await ROI.findOne(lookup).lean()
            let roi = await ROI.findOneAndRemove({ roiId: roiExist.roiId })
            if (roi) {
                res.status(200).send({ "message": "ROI has been deleted successfully." })
            } else {
                res.status(404).send({ "message": "ROI does not exist." })
            }
        }

    } catch (e) {
        res.status(400).send(e)
    }
})

// router.get('/roi/:examId?', auth, async (req, res) => {
//     try {
//         const examExist = await Exam.findOne({ examId: req.params.examId }).lean()
    
//         if (examExist) {
//             const school = await School.findOne({ schoolId: req.school.schoolId })
//             const roiExist = await ROI.findOne({ classId: examExist.classId, subject: examExist.subject, state: school.state, type: examExist.type }).lean()
//             let examSetLookupExist = {}
            
//             if (roiExist) {

//                 if (req.query.set && examExist && typeof examExist == "object" && examExist.set) {

//                     examSetLookupExist = {
//                         classId: examExist.classId,
//                         subject: examExist.subject,
//                         state: school.state,
//                         type: examExist.type,
//                         set: req.query.set
//                     }
//                 } else {
//                     examSetLookupExist = {
//                         classId: examExist.classId,
//                         subject: examExist.subject,
//                         state: school.state,
//                         type: examExist.type
//                     }
//                 }
//                 let roi = await ROI.find(examSetLookupExist, { _id: 0, __v: 0 }).lean()
//                 if (roi.length) {
//                     let resultObj = {}
//                     for (let data of roi) {
//                         resultObj.layout = data.roi.layout,
//                         resultObj.roiId = data.roiId
//                     }
//                 res.status(200).send(resultObj)
//                 } else {
//                     res.status(404).send({ "message": "ROI does not exist" })
//                 }
//             } else {
//                 res.status(404).send({ "message": "ROI does not exist" })
//             }
//         } else {
//             res.status(404).send({ "message": "Exam Id does not exist" })
//         }
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })




module.exports = router