const Marks = require('../models/marks')
const Users = require('../models/users')
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils')
require('../db/mongoose')
const logger = require('../logging/logger')
const mongoose = require('mongoose')
const httperror = require("http-errors");

exports.saveMarks = async (req, res, next) => {
    const marks = []

    if (req.header('X-App-Version')) {
        // console.log("APP VERSION", req.get('X-App-Version'))
    }

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {

            if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
            const input_keys = Object.keys(req.body)
            if (!["subject", "classId", "userId", "examId"].every((i) => input_keys.includes(i)))
                throw new httperror(400, "Invalid Request");


            const subject = req.body.subject
            const examDate = req.body.examDate
            const examId = req.body.examId
            const schoolId = req.school.schoolId
            const classId = req.body.classId
            const userId = req.school.userId
            const createdOn = new Date().getTime()
            const roiId = req.body.roiId


            req.body.studentsMarkInfo.forEach(studentsData => {
                const marksData = new Marks({
                    ...studentsData,
                    schoolId,
                    examDate,
                    subject,
                    classId,
                    createdOn,
                    roiId,
                    examId,
                    userId
                })
                marks.push(marksData)
            });

            await Helper.lockScreenValidator(req.school)


            let marksResult = await Marks.bulkWrite(
                marks.map((mark) => ({
                    updateOne: {
                        filter: {
                            studentId: mark.studentId,
                            subject: mark.subject,
                            examDate: mark.examDate
                        },
                        update: { $set: { studentIdTrainingData: mark.studentIdTrainingData, studentId: mark.studentId, predictionConfidence: mark.predictionConfidence, schoolId: mark.schoolId, examDate: mark.examDate, predictedStudentId: mark.predictedStudentId, studentAvailability: mark.studentAvailability, marksInfo: mark.marksInfo, maxMarksTrainingData: mark.maxMarksTrainingData, maxMarksPredicted: mark.maxMarksPredicted, securedMarks: mark.securedMarks, totalMarks: mark.totalMarks, obtainedMarksTrainingData: mark.obtainedMarksTrainingData, obtainedMarksPredicted: mark.obtainedMarksPredicted, set: mark.set, subject: mark.subject, classId: mark.classId, section: mark.section, examId: mark.examId, userId: mark.userId, roiId: mark.roiId } },
                        upsert: true
                    }
                }))
            );
            logger.info("marks responsee---->", marksResult)

            if (!marksResult) {
                await session.abortTransaction();
                console.error("Any operations that already occurred as part of this transaction will be rolled back.");
                return;
            }
            let match = {
                schoolId: marks[0].schoolId,
                classId: marks[0].classId,
                section: marks[0].section,
                examDate: marks[0].examDate,
                subject: marks[0].subject,
                $comment: "Save Marks API For Find Marks Details."
            }

            let marksData = await Marks.find(match)

            res.status(200).json({ data: marksData })
        }, transactionOptions);
    } catch (e) {
        console.log("The transaction was aborted due to an unexpected error: " + e);
        if (e && e.message == stringObject().lockScreen) {
            res.status(500).json({ error: e.message })
        }
        else {
            res.status(400).json({ error: e.message })
        }
    }
}

exports.getSaveScan = async (req, res, next) => {
    try {
        if (req.body.schoolId) {
            req.body.schoolId = req.body.schoolId.toLowerCase()
        }

        const match = {}

        if (req.body.userId && !req.body.schoolId) {
            req.body.userId = req.body.userId.toLowerCase()
            const userData = await Users.findOne({ userId: req.body.userId, $comment: "Get Saved Scan API for Find User Data." })
            match.schoolId = userData.schoolId
        }


        const { schoolId, classId, section, subject, fromDate, roiId } = req.body

        if (schoolId) {
            match.schoolId = schoolId,
                $comment = "Get Saved Scan API for Find Marks Data"
        }

        if (fromDate) {
            match.examDate = fromDate
        }

        if (classId) {
            match.classId = classId
        }

        if (section && section != "0") {
            match.section = section
        }

        if (roiId) {
            match.roiId = roiId
        }

        if (subject && subject != 'Subject') {
            match.subject = new RegExp(`^${subject}$`, 'i')
        }

        if (req.body.page) {
            req.body.limit = 10;
            req.body.page = 1;
        } else {
            req.body.limit = 0;
            req.body.page = 1;
        }

        const savedScan = await Marks.find(match, { _id: 0, __v: 0 })
            .limit(parseInt(req.body.limit) * 1)
            .skip((parseInt(parseInt(req.body.page)) - 1) * parseInt(parseInt(req.body.limit)))


        res.status(200).json({ data: savedScan })
    } catch (e) {
        res.status(400).json({ "error": true, e })
    }
}