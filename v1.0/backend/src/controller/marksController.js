const Mark = require('../models/marks')
const Helper = require('../middleware/helper')
const { stringObject } = require('../utils/commonUtils')

const fromTime = "T00:00:00"
const toTime = "T23:59:59"


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
    let set = {}

    if (req.body.set) set = req.body.set

    req.body.studentsMarkInfo.forEach(studentsData => {
        const marksData = new Mark({
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
        

        for (let data of marks) {
            if (!data.examDate && data.examDate == undefined) {
                data.examDate = new Date().toLocaleDateString()
            }

            let studentMarksExist = await Mark.findOne({ schoolId: data.schoolId, studentId: data.studentId, classId: data.classId, subject: data.subject, examDate: data.examDate, roiId: data.roiId })
            if (!studentMarksExist) {
                await Mark.create(data)
            } else {
                if (data.schoolId == studentMarksExist.schoolId && data.studentId == studentMarksExist.studentId && data.classId == studentMarksExist.classId && data.subject == studentMarksExist.subject && data.examDate == studentMarksExist.examDate) {

                    let lookup = {
                        studentId: data.studentId,
                        subject: data.subject,
                        examDate: data.examDate
                    }

                    let update = { $set: { studentIdTrainingData: data.studentIdTrainingData, predictedStudentId: data.predictedStudentId, studentAvailability: data.studentAvailability, marksInfo: data.marksInfo, maxMarksTrainingData: data.maxMarksTrainingData, maxMarksPredicted: data.maxMarksPredicted, securedMarks: data.securedMarks, totalMarks: data.totalMarks, obtainedMarksTrainingData: data.obtainedMarksTrainingData, obtainedMarksPredicted: data.obtainedMarksPredicted, set: data.set } }
                    await Mark.update(lookup, update)
                }
            }
        }
        res.status(200).json({ status: 'success', message: 'Data Saved Successfully' })
    } catch (e) {
        if (e && e.message == stringObject().lockScreen) {
            res.status(500).json({ status: "fail", error: e.message })
        }
        else {
            res.status(400).json({ status: "fail", e })
        }
    }
}

exports.getSaveScan = async (req, res, next) => {
    try {
        if (req.body.schoolId) {
            req.body.userId = req.school.userId.toLowerCase()
            req.body.schoolId = req.body.schoolId.toLowerCase()
        } else {
            req.body.userId = req.school.userId.toLowerCase()
            req.body.schoolId = req.school.schoolId.toLowerCase()
        }

        const { schoolId, classId, section, subject, fromDate, toDate, roiId, userId } = req.body

        const match = {}
        if (schoolId) {
            match.schoolId = schoolId
        }

        if (userId) {
            match.userId = userId
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

        let startTime = new Date(fromDate + fromTime).getTime()
        let endTime = new Date(toDate + toTime).getTime()

        if (startTime && !endTime) {
            match.createdOn = {
                $gte: startTime
            }
        } else if (!startTime && endTime) {
            match.createdOn = {
                $lte: endTime
            }
        } else if (startTime && endTime) {
            match.createdOn = {
                $gte: startTime,
                $lte: endTime
            }
        }

        if (req.body.page) {
            req.body.limit = 10;
            req.body.page = 1;
        } else {
            req.body.limit = 0;
            req.body.page = 1;
        }

        const savedScan = await Mark.find(match, { _id: 0, __v: 0 })
            .limit(parseInt(req.body.limit) * 1)
            .skip((parseInt(parseInt(req.body.page)) - 1) * parseInt(parseInt(req.body.limit)))


        res.status(200).json({ data: savedScan })
    } catch (e) {
        res.status(400).json({ "error": true, e })
    }
}