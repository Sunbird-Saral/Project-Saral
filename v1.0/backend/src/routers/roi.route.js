const express = require('express')
const router = new express.Router()
const { auth } = require('../middleware/auth')
const examsSchema = require('../models/exams')
const roisSchema = require('../models/roi')
const schoolsSchema = require('../models/school')
const Helper = require('../middleware/helper')
const roiController = require("../controller/roiController")
const clientPool = require('../db/mongoose');
const optionsSchema = require('../models/options')

router.get('/roi/:examId?', auth, roiController.getRoiData)


router.get('/roi/generic/:layout_name', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection;
        const roiLookup = {
            layout_name: req.params.layout_name
        }
        const Rois = connection.model('Rois', roisSchema)
        let roi = await Rois.find(roiLookup, { roiId: 1, roi: 1 }).lean()
        if (roi.length) {
            res.status(200).json({
                layout: roi[0].roi.layout,
                roiId: roi[0].roiId
            });
        }
    } catch (e) {
        res.status(400).send(e)
    } finally {
        next()
    }
})


router.post('/roi', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection;
        const Schools = connection.model('Schools', schoolsSchema)
        const Options = connection.model('Options', optionsSchema)
        const Exams = connection.model('Exams', examsSchema)
        const Rois = connection.model('Rois', roisSchema)
        if(req.body.layout_name) {
            console.log('inside>>>', req.body)
            req.body.roiId = await Helper.getValueForNextSequence(connection, "roiId")
            console.log('roi body', req.body);
            let roi = await Rois.create(req.body)
            await Options.create({roi_id: roi.roiId, layout_name: req.body.layout_name})
            let roiResponse = {
                roiId: roi.roiId,
                classId: roi.classId || null,
                subject: roi.subject || null,
                state: roi.state?.toLowerCase() || null,
                createdAt: roi.createdAt
            }
            return res.status(201).send(roiResponse)
        }

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
                req.body.roiId = await Helper.getValueForNextSequence(connection, "roiId")
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
        console.log('error', e)
        res.status(400).send(e)
    } finally {
        next()
    }
})

router.patch('/roi/:examId', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection
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
    } finally {
        next()
    }
})

router.delete('/roi/:examId', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection
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
           
            if(typeof roiExist === "object" && roiExist !== null) {
                let roi = await Rois.findOneAndRemove({ roiId: roiExist.roiId, $comment: "DELETE ROI API For Find And Remove ROI Data" })
                if (roi) {
                    res.status(200).send({ "message": "ROI has been deleted successfully." })
                }
            }else {
                res.status(404).send({ "message": "ROI does not exist." })
            }
        }

    } catch (e) {
        res.status(400).send(e)
    } finally {
        next()
    }
})



module.exports = router