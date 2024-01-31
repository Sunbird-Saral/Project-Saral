const admissionsSchema = require('../models/admissions')
const {transformDataBasedOnEncryption} = require('../middleware/helper')
exports.saveAdmissions = async (req, res, next) => {

    try {
        let connection = req.dbConnection;
        const Admissions = connection.model('Admissions', admissionsSchema)
        const studentAdmissionData = new Admissions(req.body)
        studentAdmissionData.schoolId = req.school.schoolId;
        studentAdmissionData.userId = req.school.userId;
        delete studentAdmissionData._doc._id
        const validationResult = studentAdmissionData.validateSync()
        if (validationResult instanceof Error) {
            throw validationResult
        }

        //revert this added for testing
        const encryptedData = studentAdmissionData._doc//await transformDataBasedOnEncryption(connection, studentAdmissionData._doc, 'admissions', req.school.schoolId)
        const filter = {
            schoolId: req.school.schoolId,
            admissionNumber: encryptedData.admissionNumber
        }
        await Admissions.updateOne(filter, encryptedData, {upsert:true, runValidators: true})
        res.status(200).json({ message: "Saved Successfully."})
    } catch (err) {
        res.status(400).send(err)
    } finally {
        next()
    }
}

exports.getAdmissions = async (req, res, next) => {

    try {
        let connection = req.dbConnection
        const summary = req.query.summary;
        const Admissions = connection.model('Admissions', admissionsSchema)

        let match = {
            schoolId: req.school.schoolId,
            userId: req.school.userId
        }

        let pageSize = 100; pageNumber = 1;
        if(req.query) {
            if(req.query.pageSize) {
                pageSize = req.query.pageSize
                if(pageSize > 100) {
                    throw new Error("pageSize should be between 1-100")
                }
            }
            if(req.query.pageNumber) {
                pageNumber = req.query.pageNumber
            }
        }

        const totalCount = await Admissions.countDocuments(match);
        
        if(!summary || summary == 'false') {
        const savedScan = await Admissions.find(match, { _id: 0, __v: 0 })
            .limit(parseInt(pageSize) * 1)
            .skip((parseInt(parseInt(pageNumber)) - 1) * parseInt(parseInt(pageSize)))
            res.status(200).json({ data: savedScan, pageSize, pageNumber, totalCount })
        } else {
            res.status(200).json({totalScannedDocument: totalCount})
        }
    } catch (e) {
        res.status(400).json({ "error": e.message ? e.message: e })
    } finally {
        next()
    }
}