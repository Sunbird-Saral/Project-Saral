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
        let lookup ={
            roiId: req.params.roiId    
        }
        let roiData = await ROI.findOne(lookup);
        if(!roiData) res.status(404).send({"message": "ROI Id does not exist."})
        let updateObj = {}
        if(req.body.roi){
            updateObj["roi.top"] = !(req.body.roi.top) ? roiData.roi.top : req.body.roi.top
            updateObj["roi.bottom"] = !(req.body.roi.bottom) ? roiData.roi.bottom : req.body.roi.bottom
            updateObj["roi.left"] = !(req.body.roi.left) ? roiData.roi.left : req.body.roi.left
            updateObj["roi.right"] = !(req.body.roi.right) ? roiData.roi.right : req.body.roi.right
        }
        await ROI.update(lookup,updateObj).lean();
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

router.get('/roi?', async (req, res) => {
    try {
        let lookup = {}
        if(req.query)  lookup.roiId =  req.query.roiId
        let roi = await ROI.find(lookup,{_id: 0,__v: 0 }).lean()
        for(let data of roi){
        delete data.createdAt
        delete data.updatedAt
        }
        res.status(200).send(roi)
    } catch (e){   
        res.status(400).send(e)
    }
})




module.exports = router