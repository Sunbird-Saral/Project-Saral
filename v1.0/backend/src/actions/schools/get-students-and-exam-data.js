const { StudentRepository } = require("../../repository/student");
const { MarksRepository } = require("../../repository/marks");
const { ExamRepository } = require("../../repository/exam")
const Helper = require("../../middleware/helper");
const Exam = require("../../models/exams");

class GetStudentsandExamData {
    constructor(school, data) {
        this.school = school;
        this.data = data;

    }

    async execute() {
        try {

            const match = {}
            const examMatch = {}

            match.schoolId = this.school.schoolId

            if (this.data.classId) {
                let studentClassObj = {
                    classId: this.data.classId,
                    className: `Class-${this.data.classId}`
                }
                let studentClass = [studentClassObj]
                match.studentClass = studentClass
                examMatch.classId = studentClassObj.classId
                examMatch.schoolId = this.school.schoolId
            } else {
                if (this.school.minimal == true) {
                    examMatch.schoolId = this.school.schoolId
                } else {
                    return res.status(404).send({ message: 'Please send classId' })
                }
            }

            if (this.data.section && this.data.section != "0") {
                match.section = this.data.section
            }

            if (this.data.hasOwnProperty('subject')) {
                let subject = this.data.subject.split(' ')
                examMatch.subject = subject[0]
                examMatch.examDate = subject[1]
            }

            if (this.data.set) {
                setMatch = this.data.set ? this.data.set : ''
            }
            await Helper.lockScreenValidator(this.school)
            let studentRepo = new StudentRepository();
            let marksRepo = new MarksRepository();
            let examRepo = new ExamRepository()

            const students = await studentRepo.getStudentsData(match)

            // const students = await Student.find(match, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()
            for (let student of students) {
                let lookup = {
                    studentId: student.studentId,
                    subject: examMatch.subject,
                    examDate: examMatch.examDate
                }

                if (this.data.set) {
                    lookup.set = this.data.set
                }


                let marks = await marksRepo.findStudentMarks(lookup)


                if (marks && typeof marks == "object") {
                    student["studentAvailability"] = marks.studentAvailability
                } else {
                    student["studentAvailability"] = true
                }
            }
            
            const exams = await examRepo.getExamsData(examMatch)
            return { students,exams }

        } catch (error) {
            throw error;
        }
    }
}

exports.GetStudentsandExamData = GetStudentsandExamData;
