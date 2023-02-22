const Exam = require('../models/exams')
const ROI = require('../models/roi')
const School = require('../models/school')


exports.getRoiData = async (req, res, next) => {
    try {
        const examExist = await Exam.findOne({ examId: req.params.examId }).lean()
 
        if (examExist) {
            const school = await School.findOne({ schoolId: req.school.schoolId })  
            const roiExist = await ROI.findOne({ classId: examExist.classId, subject: examExist.subject, state: school.state, type: examExist.type }).lean()
            let examSetLookupExist = {}
            
            if (roiExist) {
                if (req.query.set && examExist && typeof examExist == "object" && examExist.set) {

                    examSetLookupExist = {
                        classId: examExist.classId,
                        subject: examExist.subject,
                        state: school.state,
                        type: examExist.type,
                        set: req.query.set
                    }
                } else {
                    examSetLookupExist = {
                        classId: examExist.classId,
                        subject: examExist.subject,
                        state: school.state,
                        type: examExist.type
                    }
                }
                let roi = await ROI.find(examSetLookupExist, { roiId: 1,roi:1 }).lean()
           
                if (roi.length) {
                    res.status(200).json({
                        status: 'success',
                        layout : roi[0].roi.layout,
                        roiId : roi[0].roiId
                    });
                } else {
                    res.status(404).json({ "message": "ROI does not exist" })
                }
            } else {
                res.status(404).json({ "message": "ROI does not exist" })
            }
        } else {
            res.status(404).json({ "message": "Exam Id does not exist" })
        }
    } catch (e) {
        res.status(400).json(e)
    }
}
