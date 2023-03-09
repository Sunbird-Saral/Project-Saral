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


router.put('/saveMarks',auth,marksController.saveMarks)
router.post('/getSavedScan', basicAuth,marksController.getSaveScan) 

const fetchAllSavedData = async (req) => {
    try {
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
