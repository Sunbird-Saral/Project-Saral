const express = require('express')
const router = new express.Router()
const Exam = require('../models/exams')
const ROI = require('../models/roi')
const uuidv1 = require('uuidv1')


router.post('/createRoi/:examId', async (req, res) => {
    try { 
        const exams = await Exam.findOne({examId:req.params.examId}).lean()  
        if(!exams) {
            res.status(404).send({"message":'TestId Does not exist'})
        }
        let createObject = req.body
        createObject.roiId = uuidv1()

        let roi = await ROI.create(createObject);
        
        res.status(201).send(roi)  
    } catch (e){   
        res.status(400).send(e)
    }
})

router.patch('/updateRoi/:roiId', async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
        const updates = Object.keys(req.body)
        const allowedUpdates = ['roi', 'extractionMethod']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Updates' })
        }
        let roi = await ROI.findOneAndUpdate({ roiId: req.params.roiId },req.body).lean();
        if(!roi) res.status(404).send({"message": 'ROI is not updated.'})  
        res.status(201).send({"message": 'ROI is updated successfully.'})  
    } catch (e){   
        res.status(400).send(e)
    }
})

router.delete('/deleteRoi/:roiId', async (req, res) => {
    try {
        let roi = await ROI.findOneAndRemove({roiId: req.params.roiId})
        if(!roi) res.status(404).send({"message": "ROI ID has been deleted."})
        res.status(200).send({"message": "ROI has been deleted."})
    } catch (e){   
        res.status(400).send(e)
    }
})



module.exports = router