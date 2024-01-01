const express = require('express')
const router = new express.Router()
const { auth } = require('../middleware/auth')
const roisv2Schema = require('../models/roiv2')
const schoolsSchema = require('../models/school')
const Helper = require('../middleware/helper')

router.get('/v2/roi/:schemaName', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection;
        const Schools = connection.model('Schools', schoolsSchema)
        const Roisv2 = connection.model('Roisv2', roisv2Schema)
        const school = await Schools.findOne({ schoolId: req.school.schoolId, $comment: "Get V2 ROI API For Find School Data" });
        let roiLookup = {
            schoolId: req.school.schoolId,
            schemaName: req.params.schemaName,
            state: school.state,
            $comment: "Get V2 ROI API For Find ROI Data"
        }

        const roiExist = await Roisv2.findOne(roiLookup)
        if (roiExist) {
            res.status(200).json({
                layout: roiExist.roi.layout,
                roiId: roiExist.roiId
            });
        } else {
            res.status(400).send({ "message": `roi does not exist` })
        }

    } catch (err) {
        res.status(400).send(err)
    } finally {
        next()
    }
})


router.post('/v2/roi', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection;
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['schemaName', 'roi']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }
        const Schools = connection.model('Schools', schoolsSchema)
        const Roisv2 = connection.model('Roisv2', roisv2Schema)
        const school = await Schools.findOne({ schoolId: req.school.schoolId, $comment: "Create V2 ROI API For Find School Data" });
        let roiLookup = {
            schoolId: req.school.schoolId,
            schemaName: req.body.schemaName,
            state: school.state,
            $comment: "Create V2 ROI API For Find ROI Data"
        }

        const roiExist = await Roisv2.findOne(roiLookup)
        if (!roiExist) {
            req.body.schoolId = req.school.schoolId
            req.body.state = school.state
            req.body.roiId = await Helper.getValueForNextSequence(connection, "roiId")
            let roi = await Roisv2.create(req.body)
            let roiResponse = {
                roiId: roi.roiId,
                schoolId: roi.schoolId,
                schemaName: roi.schemaName,
                state: roi.state.toLowerCase(),
                createdAt: roi.createdAt
            }
            res.status(201).send(roiResponse)
        } else {
            res.status(400).send({ "message": `roi already exist` })
        }

    } catch (err) {
        res.status(400).send(err)
    } finally {
        next()
    }
})

router.patch('/v2/roi/:schemaName', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection;
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['roi']
        if (Object.keys(req.body) != "roi") return res.status(400).send({ message: 'Invalid Input .' })

        const Schools = connection.model('Schools', schoolsSchema)
        const Roisv2 = connection.model('Roisv2', roisv2Schema)
        const school = await Schools.findOne({ schoolId: req.school.schoolId, $comment: "Update V2 ROI API For Find School Data" });
        let roiLookup = {
            schoolId: req.school.schoolId,
            schemaName: req.params.schemaName,
            state: school.state,
            $comment: "Update V2 ROI API For Find ROI Data"
        }

        const roiExist = await Roisv2.findOne(roiLookup).lean()
        if (roiExist) {
            let filter = {
                roiId: roiExist.roiId,
                $comment: "Update ROI V2 API for updating ROI"
            }
            await Roisv2.update(filter, req.body).lean();
            res.status(201).send({ "message": 'ROI is updated successfully.' })
        } else {
            res.status(400).send({ "message": `roi does not exist` })
        }

    } catch (err) {
        res.status(400).send(err)
    } finally {
        next()
    }
})

router.delete('/v2/roi/:schemaName', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection;
        const Schools = connection.model('Schools', schoolsSchema)
        const Roisv2 = connection.model('Roisv2', roisv2Schema)
        const school = await Schools.findOne({ schoolId: req.school.schoolId, $comment: "Delete V2 ROI API For Find School Data" });
        let roiLookup = {
            schoolId: req.school.schoolId,
            schemaName: req.params.schemaName,
            state: school.state,
            $comment: "Delete V2 ROI API For Find ROI Data"
        }

        const roiExist = await Roisv2.findOne(roiLookup).lean()
        if (roiExist) {
            let filter = {
                roiId: roiExist.roiId,
                $comment: "Delete ROI V2 API for updating ROI"
            }
            await Roisv2.findOneAndRemove(filter);
            res.status(200).send({ "message": 'ROI has been deleted successfully.' })
        } else {
            res.status(400).send({ "message": `roi does not exist` })
        }

    } catch (err) {
        res.status(400).send(err)
    } finally {
        next()
    }
})



module.exports = router