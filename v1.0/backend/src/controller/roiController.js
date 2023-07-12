const examsSchema = require('../models/exams')
const RoisSchema = require('../models/roi')
const schoolsSchema = require('../models/school')
const logger = require('../logging/logger')

exports.getRoiData = async (req, res, next) => {
  
    try {
        const startTime = new Date();
        let connection = req.dbConnection;
        const Exams = connection.model('Exams', examsSchema)
        const Schools = connection.model('Schools', schoolsSchema)
        const Rois = connection.model('Rois', RoisSchema)
     
        const examExist = await Exams.findOne({ examId: req.params.examId, $comment: "Get Roi Data API For Find Exam Data." }).lean()

        if (examExist) {
            const school = await Schools.findOne({ schoolId: req.school.schoolId, $comment: "Get Roi Data API For Find School Data." })
            const roiExist = await Rois.findOne({ classId: examExist.classId, subject: examExist.subject, state: school.state, type: examExist.type, $comment: "Find ROI Data." }).lean()
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
                        type: examExist.type,
                        $comment :"Get Roi Data API For Find ROI Data"
                    }
                }
                let roi = await Rois.find(examSetLookupExist, { roiId: 1, roi: 1 }).lean()
                const endTime = new Date();
                const executionTime = endTime - startTime;
        
                logger.info(`Execution time for Get ROI API : ${executionTime}ms`);
                if (roi.length) {
                    res.status(200).json({
                        layout: roi[0].roi.layout,
                        roiId: roi[0].roiId
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
        logger.warn(e)
        res.status(400).json(e)
    }finally {
        next()
      }
}
