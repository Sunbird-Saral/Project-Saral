const schoolsSchema = require("../models/school")
const studentsSchema = require("../models/students")
const marksSchema = require("../models/marks")
const examsSchema = require('../models/exams')
const Helper = require('../middleware/helper')
const logger = require('../logging/logger')



exports.fetchStudentsandExams = async (req, res, next) => {
    try {
        let connection = req.dbConnection
        const Schools = connection.model('Schools', schoolsSchema)
        const Students = connection.model('Students', studentsSchema)
        const Marks = connection.model('Marks', marksSchema);
        const Exams = connection.model('Exams', examsSchema);

        const startTime = new Date();
        const match = {}
        const examMatch = {}
    
        match.schoolId = req.school.schoolId
        if (req.query.classId) {
            match.classId = req.query.classId,
                examMatch.classId = req.query.classId
        } else {
            return res.status(400).json({ message: 'Please send classId' })
        }
    
        const school = await Schools.findOne({ schoolId: req.school.schoolId })
        examMatch.state = school.state
    
        if (req.query.section && req.query.section != "0") {
            match.section = req.query.section
        }
    
        if (req.query.hasOwnProperty('subject')) {
            let subject = req.query.subject.split(' ')
            examMatch.subject = subject[0]
            examMatch.examDate = subject[1]
        }
        await Helper.lockScreenValidator(connection, req.school)

        const students = await Students.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()
        const endTime = new Date();
        const executionTime = endTime - startTime;

        logger.info(`Execution time for Get Students in Fetch Student and Marks API : ${executionTime}ms`);
        
        for (let student of students) {
            let lookup = {
                schoolId: req.school.schoolId,
                studentId: student.studentId,
                subject: examMatch.subject,
                examDate: examMatch.examDate
            }
        
            if(req.query.set){
                lookup.set = req.query.set 
            }

            let marks = await Marks.findOne({...lookup, $comment: "Find Students Marks"})
            
            if (marks && typeof marks == "object") {
                student["studentAvailability"] = marks.studentAvailability
            } else {
                student["studentAvailability"] = true
            }
        }

        const exams = await Exams.find(examMatch, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        
        const endTime2 = new Date();
        const executionTime2 = endTime2 - startTime;

        logger.info(`Execution time for Get Exams in Fetch Student and Marks API : ${executionTime2}ms`);
        res.status(200).json({
            students, exams
        });
    } catch (e) {
        logger.warn(e)
        res.status(400).json({
            e
        });
    }finally {
        next()
      }
};






