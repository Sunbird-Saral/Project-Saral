const express = require('express')
const ClassModel = require('../models/classModel')
const { auth } = require('../middleware/auth')
const _ = require('lodash')
const Promise = require('bluebird')
const router = new express.Router()

router.post('/addClasses', auth, async (req, res) => {

    const body = [...req.body]
    const classModel = []
    body.forEach(data => {
        const classData =  new ClassModel({
            ...data,
            className: `Class-${data.classId}`,
            schoolId: req.school.schoolId
        })
        classModel.push(classData)
    });
    
    try {
        // await ClassModel.insertMany(classModel)
        let finalUpdatedData = []
        Promise.map(classModel, async doc => {
            let match = {
                schoolId: doc.schoolId,
                classId: doc.classId
            }
            let dataExists = await ClassModel.findOne(match);
            if(!dataExists) {
                await doc.save()
                finalUpdatedData.push(doc)
            } else {
                let updatedSections = dataExists['sections'] ? dataExists['sections'].concat(doc['sections']) : doc['sections']
                dataExists['sections'] = _.uniqBy(updatedSections, 'section');
                await dataExists.save()
                finalUpdatedData.push(dataExists)
            }
        }).then(() => {
            res.status(201).send(finalUpdatedData)
         }).catch(e => {
            res.status(400).send(e)
         })
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.post('/updateClass', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['sections', 'classId']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invaid Updates' })
    }

    const match = {
        schoolId: req.school.schoolId,
        classId: req.body.classId
    }
    
    try {
        const classData = await ClassModel.findOne(match)
        
        if(!classData || (classData && classData.length == 0)) {
            const classModel  = new ClassModel({
                ...req.body,
                className: `Class-${req.body.classId}`,
                schoolId: req.school.schoolId
            })
            
            try {
                await classModel.save()
                res.status(201).send(classModel)
            } catch (e) {
                console.log(e);
                res.status(400).send(e)
            }
        } else {
            let updatedSections = classData['sections'] ? classData['sections'].concat(req.body['sections']) : req.body['sections']
            classData['sections'] = _.uniqBy(updatedSections, 'section');
            await classData.save()
            res.send(classData)
        }
    } 
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

module.exports = router