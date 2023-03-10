const Marks = require('../models/marks')
const Users = require('../models/users')
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils')

exports.saveMarks = async (req, res, next) => {
    const marks = []

    if (req.header('X-App-Version')) {
        // console.log("APP VERSION", req.get('X-App-Version'))
    }

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
    try {

        await Helper.lockScreenValidator(req.school)

        let updates = []

        for (let i = 0; i < marks.length; i++) {

            updates.push({
                updateOne: {
                    filter: {
                        studentId: marks[i].studentId,
                        subject: marks[i].subject,
                        examDate: marks[i].examDate
                    },
                    update: { $set: { studentIdTrainingData: marks[i].studentIdTrainingData, studentId: marks[i].studentId, predictionConfidence: marks[i].predictionConfidence, schoolId: marks[i].schoolId, examDate: marks[i].examDate, predictedStudentId: marks[i].predictedStudentId, studentAvailability: marks[i].studentAvailability, marksInfo: marks[i].marksInfo, maxMarksTrainingData: marks[i].maxMarksTrainingData, maxMarksPredicted: marks[i].maxMarksPredicted, securedMarks: marks[i].securedMarks, totalMarks: marks[i].totalMarks, obtainedMarksTrainingData: marks[i].obtainedMarksTrainingData, obtainedMarksPredicted: marks[i].obtainedMarksPredicted, set: marks[i].set, subject: marks[i].subject, classId: marks[i].classId, section: marks[i].section, subject: marks[i].subject, examId: marks[i].examId, userId: marks[i].userId  ,roiId: marks[i].roiId} },
                    upsert: true
                }
            })
        }
        
        let marksResult = await Marks.bulkWrite(updates);
        console.log("marks responsee---->", marksResult)

        let match = {
            schoolId: marks[0].schoolId,
            classId: marks[0].classId,
            section: marks[0].section,
            examDate: marks[0].examDate,
            subject: marks[0].subject
        }

        let marksData = await Marks.find(match, { _id: 0, __v: 0 })
        res.status(200).json({ data: marksData })
    } catch (e) {
        if (e && e.message == stringObject().lockScreen) {
            res.status(500).json({ error: e.message })
        }
        else {
            res.status(400).json({ e })
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
            const userData = await Users.findOne({ userId: req.body.userId })
            match.schoolId = userData.schoolId
        }


        const { schoolId, classId, section, subject, fromDate, roiId } = req.body

        if (schoolId) {
            match.schoolId = schoolId
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