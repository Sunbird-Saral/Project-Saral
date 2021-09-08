const express = require('express')
const router = new express.Router()
const Exam = require('../models/exams')
const ROI = require('../models/roi')
const { auth } = require('../middleware/auth')
const School = require('../models/school')
const { compareSync } = require('bcryptjs')
const Counter = require('../models/counter')


router.post('/createRoi',auth, async (req, res) => {
    try { 
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['subject', 'classId', 'roi', 'extractionMethod']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))
   
        if(!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }
    
        let lookup={
            schoolId: req.school.schoolId,
            subject: req.body.subject,
            classId: req.body.classId
        }
        
        const examExist = await Exam.findOne(lookup)
        if(examExist){
            const roiExist = await ROI.findOne({classId: req.body.classId, subject: req.body.subject})
            if(!roiExist){
                const school = await School.findOne({schoolId:examExist.schoolId})
                req.body.state = school.state
                req.body.roiId= await Counter.getValueForNextSequence("roiId")
                let roi = await ROI.create(req.body)
                let roiResponse = {
                  roiId: roi.roiId,
                  classId: roi.classId,
                  subject: roi.subject,
                  state: roi.state,
                  createdAt: roi.createdAt
                }
                res.status(201).send(roiResponse)
            }else{
                res.status(400).send( {"message":`roiId already exist`})    
            } 
        }else{
            res.status(400).send( {"message":`examId does not exist`}) 
        }
    
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
            return res.status(400).send({ error: 'Invalid Updates' })
        }
        let lookup ={
            roiId: req.params.roiId
        }
        let roiData = await ROI.findOne(lookup).lean();
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
        if(!roi) res.status(404).send({"message": "ROI ID has been already deleted."})
        res.status(200).send({"message": "ROI has been deleted successfully."})
    } catch (e){   
        res.status(400).send(e)
    }
})

router.get('/roi/:examId',auth, async (req, res) => {
    try {
        const examExist = await Exam.findOne({examId: req.params.examId}).lean()
        if(examExist){
            const school = await School.findOne({schoolId: req.school.schoolId})
            let lookup = {
                classId: examExist.classId,
                subject: examExist.subject,
                state: school.state
            }
            let roi = await ROI.find(lookup,{_id: 0,__v: 0 }).lean()
            for(let data of roi){
            delete data.createdAt
            delete data.updatedAt
            }
            res.status(200).send(roi)
        }else{
            res.status(404).send({"message": "Exam Id does not exist"})
        }
    } catch (e){   
        res.status(400).send(e)
    }
})




module.exports = router