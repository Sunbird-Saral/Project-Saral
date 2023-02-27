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

            let studentMarksExist = await Mark.findOne({ schoolId: data.schoolId, userId: data.userId, studentId: data.studentId, classId: data.classId, subject: data.subject, examDate: data.examDate, roiId: data.roiId })
            
            if (!studentMarksExist) {
                await Mark.create(data)
            } else {
                if (data.schoolId == studentMarksExist.schoolId && data.studentId == studentMarksExist.studentId && data.classId == studentMarksExist.classId && data.subject == studentMarksExist.subject && data.examDate == studentMarksExist.examDate) {

                    let lookup = {
                        userId: data.userId,
                        studentId: data.studentId,
                        subject: data.subject,
                        examDate: data.examDate
                    }

                    let update = { $set: { studentIdTrainingData: data.studentIdTrainingData, predictedStudentId: data.predictedStudentId, studentAvailability: data.studentAvailability, marksInfo: data.marksInfo, maxMarksTrainingData: data.maxMarksTrainingData, maxMarksPredicted: data.maxMarksPredicted, securedMarks: data.securedMarks, totalMarks: data.totalMarks, obtainedMarksTrainingData: data.obtainedMarksTrainingData, obtainedMarksPredicted: data.obtainedMarksPredicted, set: data.set } }
                    await Mark.update(lookup, update)
                }
            }
        }
        res.status(200).json({ message: 'Data Saved Successfully' })
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

        if (req.body.userId) {
            req.body.userId = req.body.userId.toLowerCase()
        }

        const { schoolId, classId, section, subject, fromDate, roiId, userId } = req.body

        const match = {}
        if (schoolId) {
            match.schoolId = schoolId
        }

        if (userId) {
            match.userId = userId
        }

        if(fromDate){
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
        
        const savedScan = await Mark.find(match, { _id: 0, __v: 0 })
            .limit(parseInt(req.body.limit) * 1)
            .skip((parseInt(parseInt(req.body.page)) - 1) * parseInt(parseInt(req.body.limit)))


        res.status(200).json({ data: savedScan })
    } catch (e) {
        res.status(400).json({ "error": true, e })
    }
}