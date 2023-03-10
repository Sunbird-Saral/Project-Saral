const Exams = require('../models/exams')
const Rois = require('../models/roi')
const Schools = require('../models/school')


exports.getRoiData = async (req, res, next) => {
    try {
        const examExist = await Exams.findOne({ examId: req.params.examId }).lean()
 
        if (examExist) {
            const school = await Schools.findOne({ schoolId: req.school.schoolId })  
            const roiExist = await Rois.findOne({ classId: examExist.classId, subject: examExist.subject, state: school.state, type: examExist.type }).lean()
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
                let roi = await Rois.find(examSetLookupExist, { roiId: 1,roi:1 }).lean()
           
                if (roi.length) {
                    res.status(200).json({
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
