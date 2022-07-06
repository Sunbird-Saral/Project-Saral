const express = require('express')
const ClassModel = require('../models/classModel')
const { auth } = require('../middleware/auth')
const _ = require('lodash')
const Promise = require('bluebird')
const Student = require('../models/students')
const Exam = require('../models/exams')
const Mark = require('../models/marks')
const router = new express.Router()

router.post('/classes', auth, async (req, res) => {

    const body = [...req.body]
    const classModel = []
    body.forEach(data => {
        const classData = new ClassModel({
            ...data,
            className: `Class-${data.category1}`,
            orgId: req.school.orgId
        })
        console.log(classData)
        classModel.push(classData)
    });
    try {
        // await ClassModel.insertMany(classModel)
        let finalUpdatedData = []
        Promise.map(classModel, async doc => {
            let match = {
                orgId: doc.orgId,
                category1: doc.category1
            }
            let dataExists = await ClassModel.findOne(match);
            if (!dataExists) {
                await doc.save()
                let response = {
                    category2: doc.category2,
                    category1: doc.category1,
                    className: doc.className,
                    orgId: doc.orgId,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt
                }
                finalUpdatedData.push(response)
            } else {
                let updatedSections = dataExists['category2'] ? dataExists['category2'].concat(doc['category2']) : doc['category2']
                dataExists['category2'] = _.uniqBy(updatedSections, 'section');
                
                await dataExists.save()
                let response = {
                    category2: doc.category2,
                    category1: doc.category1,
                    className: doc.className,
                    orgId: doc.orgId,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt
                }
                finalUpdatedData.push(response)
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

router.put('/classes', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['category2', 'category1']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invaid Updates' })
    }

    const match = {
        orgId: req.school.orgId,
        category1: req.body.category1
    }

    try {
        const classData = await ClassModel.findOne(match)

        if (!classData || (classData && classData.length == 0)) {
            const classModel = new ClassModel({
                ...req.body,
                className: `Class-${req.body.category1}`,
                orgId: req.school.orgId
            })

            try {
                await classModel.save()
                let response = {
                    category2: classModel.category2,
                    category1: classModel.category1,
                    className: classModel.className,
                    orgId: classModel.orgId,
                    createdAt: classModel.createdAt,
                    updatedAt: classModel.updatedAt
                }
                
                res.status(201).send(response)
            } catch (e) {
                console.log(e);
                res.status(400).send(e)
            }
        } else {
            
            let updatedSections = classData['category2'] ? classData['category2'].concat(req.body['category2']) : req.body['category2']
            classData['category2'] = _.uniqBy(updatedSections, 'section');
            await classData.save()
            let response = {
                category2: classData.category2,
                category1: classData.category1,
                className: classData.className,
                orgId: classData.orgId,
                createdAt: classData.createdAt,
                updatedAt: classData.updatedAt
            }
            
            res.send(response)
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.delete('/classes', auth, async (req, res) => {
    if (Object.keys(req.body) != "category1") return res.status(400).send({ message: 'Validation error.' })
    // const inputKeys = Object.keys(req.body)
    // const allowedUpdates = ['category1']
    // const isValidOperation = inputKeys.every((update) => allowedUpdates.includes(update))

    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid delete opration' })
    // }

    const match = {
        orgId: req.school.orgId,
        category1: req.body.category1
    }

    try {
        const classData = await ClassModel.findOne(match)
        if (classData) {
            await ClassModel.deleteOne(match)
            let lookup = {
                orgId: req.school.orgId,
                studentClass: { $elemMatch: { category1: req.body.category1 } }
            }
            let students = await Student.find(lookup).lean()
            if (students.length) {
                for (let student of students) {
                    await Mark.deleteMany({ orgId: req.school.orgId, studentId: student.studentId })
                }
                await Student.deleteMany(lookup).lean()
            }
            await Exam.deleteMany(match)
            res.status(200).send({ "message": "Class has been deleted successfully." })
        } else {
            res.status(404).send({ "message": 'Class does not exist.' })
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

module.exports = router