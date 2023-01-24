const express = require('express')
const path = require('path')
const Mark = require('../models/marks')
const School = require('../models/school')
const Exams = require('../models/exams')
const Class = require('../models/classModel')
const Lock = require('../models/lock')
const { auth, basicAuth } = require('../middleware/auth')
const excel = require('exceljs');
const { getFilePath, deleteAllfilesFromReports, stringObject } = require('../utils/commonUtils')
const Helper = require('../middleware/helper')
const router = new express.Router()
const _ = require('lodash')
const fs = require('fs');
const marksController = require("../controller/marksController")

const fromTime = "T00:00:00"
const toTime = "T23:59:59"

router.put('/saveMarks',auth,marksController.saveMarks)
router.post('/getSavedScan', basicAuth,marksController.getSaveScan) 

// router.put('/saveMarks', auth, async (req, res) => {
//     const marks = []
    
//     if (req.header('X-App-Version')) {
//         console.log("APP VERSION", req.get('X-App-Version'))
//     }

//     const subject = req.body.subject
//     const examDate = req.body.examDate
//     const examId = req.body.examId
//     const schoolId = req.school.schoolId
//     const classId = req.body.classId
//     const userId = req.school.userId
//     const createdOn = new Date().getTime()
//     const roiId = req.body.roiId
//     let set = {}

//     if (req.body.set) set = req.body.set

//     req.body.studentsMarkInfo.forEach(studentsData => {
//         const marksData = new Mark({
//             ...studentsData,
//             schoolId,
//             examDate,
//             subject,
//             classId,
//             createdOn,
//             roiId,
//             examId,
//             userId
//         })
//         marks.push(marksData)
//     });
//     try {

//         await Helper.lockScreenValidator(req.school)
        
//         for (let data of marks) {
//             if (!data.examDate && data.examDate == undefined) {
//                 data.examDate = new Date().toLocaleDateString()
//             }
         
//             let studentMarksExist = await Mark.findOne({ schoolId: data.schoolId, studentId: data.studentId, classId: data.classId, subject: data.subject, examDate: data.examDate, roiId: data.roiId })

//             if (!studentMarksExist) {
//                 await Mark.create(data)
//             } else {
//                 if (data.schoolId == studentMarksExist.schoolId && data.studentId == studentMarksExist.studentId && data.classId == studentMarksExist.classId && data.subject == studentMarksExist.subject && data.examDate == studentMarksExist.examDate) {
//                     let lookup = {
//                         studentId: data.studentId,
//                         subject: data.subject,
//                         examDate: data.examDate
//                     }
                    
//                     let update = { $set: { studentIdTrainingData: data.studentIdTrainingData, predictedStudentId: data.predictedStudentId, studentAvailability: data.studentAvailability, marksInfo: data.marksInfo, maxMarksTrainingData: data.maxMarksTrainingData, maxMarksPredicted: data.maxMarksPredicted, securedMarks: data.securedMarks, totalMarks: data.totalMarks, obtainedMarksTrainingData: data.obtainedMarksTrainingData, obtainedMarksPredicted: data.obtainedMarksPredicted, set: data.set } }
//                     await Mark.update(lookup, update)
//                 }
//             }
//         }
//         // let studentIds = marks.map(id => id.studentId)
//         // let marksExist = await Mark.StudentsMark(studentIds)

//         // if(!marksExist.length){
//         // await Mark.insertMany(marks)
//         // }else{
//         // for(let data of marks){
//         //     for(let mark of marksExist){
//         //         if(data.studentId === mark.studentId){
//         //             let lookup = {
//         //                 studentId: data.studentId
//         //             }
//         //             let update = { $set: {studentAvailability: data.studentAvailability, marksInfo: data.marksInfo
//         //             }}
//         //             await Mark.update(lookup ,update)
//         //         }
//         //     }
//         // }
//         // }
//         res.status(200).send({ message: 'Data Saved Successfully' })
//     } catch (e) {
//         console.log(e);
//         if (e && e.message == stringObject().lockScreen) {
//             res.status(500).send({ error: e.message })
//         }
//         else {
//             res.status(400).send(e)
//         }
//     }
// })

// const fetchSavedData = async (req) => {
//     const { schoolId, classId, section, subject, fromDate, toDate, roiId,userId } = req.body
//     const match = {}
//     if (schoolId) {
//         match.schoolId = schoolId
//     }

//     if(userId){
//         match.userId = userId
//     }

//     if (classId) {
//         match.classId = classId
//     }

//     if (section && section != "0") {
//         match.section = section
//     }
//     if (roiId) {
//         match.roiId = roiId
//     }

//     // if(req.body.examId) {
//     //     match.examId = req.body.examId
//     // } 
//     // else {
//     //     res.status(404).send({ error: 'Please send examId' })
//     // }
//     if (subject && subject != 'Subject') {
//         match.subject = new RegExp(`^${subject}$`, 'i')
//     }

//     let startTime = new Date(fromDate + fromTime).getTime()
//     let endTime = new Date(toDate + toTime).getTime()

//     if (startTime && !endTime) {
//         match.createdOn = {
//             $gte: startTime
//         }
//     } else if (!startTime && endTime) {
//         match.createdOn = {
//             $lte: endTime
//         }
//     } else if (startTime && endTime) {
//         match.createdOn = {
//             $gte: startTime,
//             $lte: endTime
//         }
//     }

//     try {
//         const count = await Mark.countDocuments(match)
//         // let totalPages;
//         if (req.body.page) {
//             req.body.limit = 10;
//             req.body.page = 1;
//             // totalPages = count ? Math.ceil(count / parseInt(req.body.limit)) : 0
//         }else{
//             req.body.limit = 0;
//             req.body.page = 1;
//             // totalPages = 1
//         }

//         const savedScan = await Mark.find(match, { _id: 0, __v: 0 })
//             .limit(parseInt(req.body.limit) * 1)
//             .skip((parseInt(parseInt(req.body.page)) - 1) * parseInt(parseInt(req.body.limit)))

//         return {
//             data: savedScan,
//             // totalPages: totalPages,
//             // currentPage: totalPages != 0 ? parseInt(req.body.page) : 0
//         }
//     }
//     catch (e) {
//         console.log(e);
//         return { "error": true, e }
//     }
// }

const fetchAllSavedData = async (req) => {
    try {
        const count = await Mark.countDocuments("{}")
        const savedScan = await Mark.find({})
        return {
            data: savedScan,
        }
    }
    catch (e) {
        console.log(e);
        return { "error": true, e }
    }
}

// router.get('/getSavedScan?', basicAuth, async (req, res) => {
//     try {
//         const resposne = await fetchSavedData(req)
//         if (resposne && resposne.error) {
//             return res.status(404).send(resposne)
//         }
//         const { downloadRes = false, subject } = req.query
//         if (downloadRes) {
//             deleteAllfilesFromReports()
//             let filePath = getFilePath(subject, 'json')
//             fs.writeFile(filePath, JSON.stringify(resposne), (err) => {
//                 if (err) throw err;
//                 res.download(filePath)
//             });
//         } else {
//             res.send(resposne)
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(400).send({ "error": true, e })
//     }
// })

// router.post('/getSavedScan', basicAuth, async (req, res) => {
//     try {
//         if(req.body.schoolId){
//             req.body.userId = req.school.userId.toLowerCase()
//             req.body.schoolId = req.body.schoolId.toLowerCase()
//         }else{
//             req.body.userId = req.school.userId.toLowerCase()
//             req.body.schoolId = req.school.schoolId.toLowerCase()
//         }
        
//         const resposne = await fetchSavedData(req)
//         if (resposne && resposne.error) {
//             return res.status(404).send(resposne)
//         }
//         const { downloadRes = false, subject } = req.body
//         if (downloadRes) {
//             deleteAllfilesFromReports()
//             let filePath = getFilePath(subject, 'json')
//             fs.writeFile(filePath, JSON.stringify(resposne), (err) => {
//                 if (err) throw err;
//                 res.download(filePath)
//             });
//         } else {
//             res.send(resposne)
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(400).send({ "error": true, e })
//     }
// })

router.get('/getMarksReport',async (req, res) => {
    try {

        const resposne = await fetchAllSavedData(req)
        if (resposne && resposne.error) {
            return res.status(404).send(resposne)
        }
        res.send(resposne)
    } catch (e) {
        console.log(e);
        res.status(400).send({ "error": true, e })
    }
})

router.get('/createReport', async (req, res) => {
    try {
        let exams = await Exams.find({})
        let classes = await Class.find({})
        let schools = await School.find({})
        if (exams && classes && schools) {
            let examsGroupByName = _.groupBy(exams, 'examName')
            let classesGroupById = _.groupBy(classes, 'classId')
            let schoolsGroupById = _.groupBy(schools, 'schoolId')

            let subjects = []
            let classIds = []
            let schoolIds = []
            _.forEach(examsGroupByName, (exams, index) => {
                subjects.push(index)
            })
            _.forEach(classesGroupById, (classes, index) => {
                classIds.push(index)
            })
            _.forEach(schoolsGroupById, (schools, index) => {
                schoolIds.push(index)
            })

            res.render('dashboard', { title: 'Scan Status', subjects, classIds, schoolIds });
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.get('/generateReport', async (req, res) => {
    deleteAllfilesFromReports()
    const match = {}
    if (req.query.schoolId && req.query.schoolId != 'School Id') {
        match.schoolId = req.query.schoolId
    }

    if (req.query.classId && req.query.classId != 'Class Id') {
        match.classId = req.query.classId
    }

    if (req.query.subject && req.query.subject != 'Subject') {
        match.subject = new RegExp(`^${req.query.subject}$`, 'i')
    }


    try {
        const savedScan = await Mark.find(match)
        if (!savedScan || savedScan.length == 0) {
            res.render('index', { "message": "No data available. Please try again" });
            return
        }
        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('Scan Report'); //creating worksheet
        workbook.creator = 'Rohit Kumar';
        //  WorkSheet Header
        sheetColumns = [
            { header: 'School Id', key: 'schoolId', width: 30 },
            { header: 'Class Id', key: 'classId', width: 10 },
            { header: 'Section', key: 'section', width: 10 },
            { header: 'Subject', key: 'subject', width: 50 },
            { header: 'Exam Date', key: 'examDate', width: 50 },
            { header: 'Student Id', key: 'studentId', width: 30 },
            { header: 'Total Marks', key: 'totalMarks', width: 10 },
            { header: 'Secured Marks', key: 'securedMarks', width: 10 },
            { header: 'Created On', key: 'createdOn', width: 30 }
        ];
        let rowsData = []
        savedScan.forEach((element, index) => {
            let rowsObj = {
                schoolId: element.schoolId,
                classId: element.classId,
                section: element.section,
                subject: element.subject,
                examDate: element.examDate,
                studentId: element.studentId,
                totalMarks: element.totalMarks,
                securedMarks: element.securedMarks
            }
            element.marksInfo.forEach((o) => {
                if (index == 0) {
                    let columnObj = {
                        header: o.questionId,
                        key: o.questionId,
                        width: 15
                    }
                    sheetColumns.push(columnObj)
                }
                rowsObj[o.questionId] = o.obtainedMarks
            });
            rowsObj['createdOn'] = element.createdOn
            rowsData.push(rowsObj)
        });
        worksheet.columns = sheetColumns
        // Add Array Rows
        worksheet.addRows(rowsData);

        let filePath = getFilePath(req.query.subject, 'xlsx')
        // Write to File
        workbook.xlsx.writeFile(filePath)
            .then(function () {
                res.render('index', { title: 'Scan Summary', rowsData, sheetColumns, filePath });
            });
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.get('/downloadReport', (req, res) => {
    if (!req.query.filePath) {
        res.status(404).send({ "message": "no file" })
    }
    const filePath = path.join(__dirname, `../../${req.query.filePath}`)
    res.download(filePath)
})

router.get('/downloadSchoolList', async (req, res) => {
    deleteAllfilesFromReports()
    try {
        const school = await School.find({})
        if (!school || school.length == 0) {
            res.render('index', { "message": "No data available. Please try again" });
            return
        }

        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('School List'); //creating worksheet
        workbook.creator = 'Rohit Kumar';
        //  WorkSheet Header
        sheetColumns = [
            { header: 'SNo', key: 'index', width: 10 },
            { header: 'District', key: 'district', width: 20 },
            { header: 'Block', key: 'block', width: 20 },
            { header: 'School Id', key: 'schoolId', width: 20 },
            { header: 'School Name', key: 'name', width: 30 },
            { header: 'Name of HM', key: 'hmName', width: 30 },
            { header: 'Enrolled Students', key: 'noOfStudents', width: 15 },

        ];
        let rowsData = []
        school.forEach((element, index) => {
            rowsData.push({
                index: index + 1,
                district: element.district,
                block: element.block,
                schoolId: element.schoolId,
                name: element.name,
                hmName: element.hmName,
                noOfStudents: element.noOfStudents
            })
        });
        worksheet.columns = sheetColumns
        // Add Array Rows
        worksheet.addRows(rowsData);

        let filePath = getFilePath(null, 'xlsx')
        // Write to File
        workbook.xlsx.writeFile(filePath)
            .then(function () {
                const filename = path.join(__dirname, `../../${filePath}`)
                res.download(filename)
            });
    } catch (e) {
        res.send(e)
    }
})


module.exports = router




// const { limit = 10, page = 1 } = req.body

// if (parseInt(page) < 0 || parseInt(page) === 0) {
//     return { "error": true, "message": "invalid page number, should start with 1" }
// }

// const count = await Mark.countDocuments(match)

// let totalPages = count ? Math.ceil(count / parseInt(limit)) : 0

// if (totalPages == 0) {
//     return { data: [], totalPages }
// } else if (parseInt(page) > totalPages) {
//     return { "error": true, totalPages, "message": "invalid page number, can not be more than Total pages" }
// }

// const savedScan = await Mark.find(match, { _id: 0, __v: 0 })
//     .limit(parseInt(limit) * 1)
//     .skip((parseInt(parseInt(page)) - 1) * parseInt(parseInt(limit)))

// return {
//     data: savedScan,
//     totalPages,
//     currentPage: totalPages != 0 ? parseInt(page) : 0
// }