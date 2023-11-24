const express = require('express')
const router = new express.Router()
const { auth } = require('../middleware/auth')
const roisv2Schema = require('../models/roiv2')
const roiController = require("../controller/roiController")
const schoolsSchema = require('../models/school')
const Helper = require('../middleware/helper')

router.get('/v2/roi/:schemaName', auth, roiController.getRoiData)


router.post('/v2/roi', auth, async (req, res, next) => {
    try {
        let connection = req.dbConnection;
        const allowedUpdates = ['schemaName', 'roi']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }
        const Schools = connection.model('Schools', schoolsSchema)
        const Roisv2 = connection.model('Roisv2', roisv2Schema)
        const school = await Schools.findOne({ schoolId: req.school.schoolId, $comment: "Create V2 ROI API For Find School Data" });
        let roiLookup = {
            orgId: req.school.schoolId,
            schemaName: req.body.schemaName,
            state: school.state,
            $comment: "Create V2 ROI API For Find ROI Data"
        }

        const roiExist = await Rois.findOne(roiLookup)
        if (!roiExist) {
            req.body.state = school.state
            req.body.roiId = await Helper.getValueForNextSequence(connection, "roiId")
            let roi = await Roisv2.create(req.body)
            let roiResponse = {
                roiId: roi.roiId,
                orgId: roi.orgId,
                schemaName: roi.schemaName,
                state: roi.state.toLowerCase(),
                createdAt: roi.createdAt
            }
            res.status(201).send(roiResponse)
        } else {
            res.status(400).send({ "message": `roi already exist` })
        }

    } catch (err) {
        res.status(400).send(e)
    } finally {
        next()
    }
})

router.patch('/v2/roi/:schemaName', auth, async (req, res, next) => {
    res.status(200).send("ok")
})

router.delete('/v2/roi/:schemaName', auth, async (req, res, next) => {
    res.status(200).send("ok")
})



module.exports = router