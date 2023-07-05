const express = require('express')
const router = new express.Router()
const { auth } = require('../middleware/auth')
const examsSchema = require('../models/exams')
const roisSchema = require('../models/roi')
const schoolsSchema = require('../models/school')
const Helper = require('../middleware/helper')
const roiController = require("../controller/roiController")
const clientPool = require('../db/mongoose');

router.get('/roi/:examId?', auth, roiController.getRoiData)


router.post('/roi', auth, async (req, res) => {
    let connection
    try {
        connection = await clientPool.acquire();
        const Schools = connection.model('Schools', schoolsSchema)
        const Exams = connection.model('Exams', examsSchema)
        const Rois = connection.model('Rois', roisSchema)

        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['subject', 'classId', 'type', 'roi', 'set']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }

        let lookup = {
            schoolId: req.school.schoolId,
            subject: req.body.subject,
            classId: req.body.classId,
            $comment: "Create ROI API For Find Exam Data"
        }
        const examExist = await Exams.findOne(lookup)
        if (examExist) {
            const school = await Schools.findOne({ schoolId: examExist.schoolId, $comment: "Create ROI API For Find School Data" })
            req.body.type = req.body.type.toUpperCase()
            const roiExist = await Rois.findOne({ classId: req.body.classId, subject: req.body.subject, state: school.state, type: req.body.type, $comment: "Create ROI API For Find ROI Data" })
            if (!roiExist) {
                req.body.state = school.state
                req.body.roiId = await Helper.getValueForNextSequence("roiId")
                let roi = await Rois.create(req.body)
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
    }finally {
        if (connection) {
          clientPool.release(connection);
        }
      }
})

router.patch('/roi/:examId', auth, async (req, res) => {
    let connection
    try {
        connection = await clientPool.acquire();
        const Schools = connection.model('Schools', schoolsSchema)
        const Exams = connection.model('Exams', examsSchema)
        const Rois = connection.model('Rois', roisSchema)

        if (Object.keys(req.body) != "roi") return res.status(400).send({ message: 'Invalid Input .' })

        const examExist = await Exams.findOne({ examId: req.params.examId, $comment: "Update ROI API for Find Exam Data" }).lean()
        if (examExist) {
            const school = await Schools.findOne({ schoolId: req.school.schoolId, $comment: "Update ROI API for Find School Data" })
            let lookup = {
                classId: examExist.classId,
                subject: examExist.subject,
                state: school.state,
                $comment: "Update ROI API For Find ROI Data"
            }

            const roiData = await Rois.findOne(lookup).lean()
            if (!roiData) return res.status(404).send({ "message": "ROI Id does not exist." })
            let updateObj = {}

            if (req.body.roi) updateObj["roi"] = req.body.roi

            let filter = {
                roiId: roiData.roiId,
                $comment: "Update ROI API for updating ROI"
            }
            await Rois.update(filter, updateObj).lean();
            res.status(201).send({ "message": 'ROI is updated successfully.' })
        }
    } catch (e) {
        res.status(400).send(e)
    }finally {
        if (connection) {
          clientPool.release(connection);
        }
      }
})

router.delete('/roi/:examId', auth, async (req, res) => {
    let connection
    try {
        connection = await clientPool.acquire();
        const Schools = connection.model('Schools', schoolsSchema)
        const Exams = connection.model('Exams', examsSchema)
        const Rois = connection.model('Rois', roisSchema)
        
        const examExist = await Exams.findOne({ examId: req.params.examId, $comment: "DELETE ROI API For Find Exam Data" }).lean()
        if (examExist) {
            const school = await Schools.findOne({ schoolId: req.school.schoolId, $comment: "DELETE ROI API For Find School Data" })
            let lookup = {
                classId: examExist.classId,
                subject: examExist.subject,
                state: school.state,
                $comment: "DELETE ROI API For Find ROI Data"
            }
            const roiExist = await Rois.findOne(lookup).lean()
            let roi = await Rois.findOneAndRemove({ roiId: roiExist.roiId, $comment: "DELETE ROI API For Find And Remove ROI Data" })

            if (roi) {
                res.status(200).send({ "message": "ROI has been deleted successfully." })
            } else {
                res.status(404).send({ "message": "ROI does not exist." })
            }
        }

    } catch (e) {
        res.status(400).send(e)
    }finally {
        if (connection) {
          clientPool.release(connection);
        }
      }
})



module.exports = router