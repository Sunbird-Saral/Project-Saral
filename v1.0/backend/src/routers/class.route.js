const express = require('express')
const Classes = require('../models/classes')
const { auth } = require('../middleware/auth')
const _ = require('lodash')
const Promise = require('bluebird')
const Students = require('../models/students')
const Exams = require('../models/exams')
const Marks = require('../models/marks')
const router = new express.Router()

router.post('/classes', auth, async (req, res) => {

    const body = [...req.body]
    const classModel = []
    body.forEach(data => {
        const classData = new Classes({
            ...data,
            className: `Class-${data.classId}`,
            schoolId: req.school.schoolId
        })
        classModel.push(classData)
    });
    try {
        let finalUpdatedData = []
        Promise.map(classModel, async doc => {
            let match = {
                schoolId: doc.schoolId,
                classId: doc.classId,
                $comment: "Create Classes API For Find Class Data"
            }
            let dataExists = await Classes.findOne(match);
            if (!dataExists) {
                await doc.save()
                let response = {
                    sections: doc.sections,
                    classId: doc.classId,
                    className: doc.className,
                    schoolId: doc.schoolId,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt
                }
                finalUpdatedData.push(response)
            } else {
                let updatedSections = dataExists['sections'] ? dataExists['sections'].concat(doc['sections']) : doc['sections']
                dataExists['sections'] = _.uniqBy(updatedSections, 'section');

                await dataExists.save()
                let response = {
                    sections: doc.sections,
                    classId: doc.classId,
                    className: doc.className,
                    schoolId: doc.schoolId,
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
    const allowedUpdates = ['sections', 'classId']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invaid Updates' })
    }

    const match = {
        schoolId: req.school.schoolId,
        classId: req.body.classId,
        $comment: "Update Classes API For Find Class Data"
    }

    try {
        const classData = await Classes.findOne(match)

        if (!classData || (classData && classData.length == 0)) {
            const classModel = new Classes({
                ...req.body,
                className: `Class-${req.body.classId}`,
                schoolId: req.school.schoolId
            })

            try {
                await classModel.save()
                let response = {
                    sections: classModel.sections,
                    classId: classModel.classId,
                    className: classModel.className,
                    schoolId: classModel.schoolId,
                    createdAt: classModel.createdAt,
                    updatedAt: classModel.updatedAt
                }

                res.status(201).send(response)
            } catch (e) {
                console.log(e);
                res.status(400).send(e)
            }
        } else {

            let updatedSections = classData['sections'] ? classData['sections'].concat(req.body['sections']) : req.body['sections']
            classData['sections'] = _.uniqBy(updatedSections, 'section');
            await classData.save()
            let response = {
                sections: classData.sections,
                classId: classData.classId,
                className: classData.className,
                schoolId: classData.schoolId,
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
    if (Object.keys(req.body) != "classId") return res.status(400).send({ message: 'Validation error.' })

    const match = {
        schoolId: req.school.schoolId,
        classId: req.body.classId,
        $comment: "Delete Classes API For Find Class and Exam Data"
    }

    try {
        const classData = await Classes.findOne(match)
        if (classData) {
            await Classes.deleteOne(match)
            let lookup = {
                schoolId: req.school.schoolId,
                studentClass: { $elemMatch: { classId: req.body.classId } },
                $comment: "Delete Classes API For Find Student And Delete Data"
            }
            let students = await Students.find(lookup).lean()
            if (students.length) {
                for (let student of students) {
                    await Marks.deleteMany({ schoolId: req.school.schoolId, studentId: student.studentId, $comment: "Delete Classes API For Find Marks and Delete Data" })
                }
                await Students.deleteMany(lookup).lean()
            }
            await Exams.deleteMany(match)
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

router.get('/classes/:classId', auth, async (req, res) => {
    try {

        const match = {
            schoolId: req.school.schoolId,
            classId: req.params.classId
        }

        const classData = await Classes.findOne(match).lean();
        
        if (classData) {

            let classobj = {
                className: classData.className,
                classId: classData.classId,
                sections: classData.sections,
                schoolId: classData.schoolId,
            }

            res.send( classobj )

        } else {

            res.status(404).send({ message: 'class Id does not exist.' })

        }

    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

module.exports = router