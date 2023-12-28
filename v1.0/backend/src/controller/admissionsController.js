const admissionsSchema = require('../models/admissions')
const encryptionUtil = require('../utils/encryptionUtils');

exports.saveAdmissions = async (req, res, next) => {

    try {
        let connection = req.dbConnection;
        const Admissions = connection.model('Admissions', admissionsSchema)
        const studentAdmissionData = new Admissions(req.body)
        const filter = {
            schoolId: req.school.schoolId,
            admissionNumber: studentAdmissionData.admissionNumber
        }
        studentAdmissionData.schoolId = req.school.schoolId;
        studentAdmissionData.userId = req.school.userId;
        delete studentAdmissionData._doc._id
        delete studentAdmissionData._doc.predictionInfo
        const encryptedData = {}
        Object.keys(studentAdmissionData._doc).forEach((key)=>{
            encryptedData[key] = encryptionUtil.encrypt(studentAdmissionData[key]);
        })
        console.log("encryptedData", encryptedData)
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

        // no search document capability yet
        // let pageSize = 10; pageNumber = 1;
        // if(req.query) {
        //     match = {...req.query, ...match}
        //     if(req.query.pageSize) {
        //         pageSize = req.query.pageSize
        //         delete match.pageSize
        //     }
        //     if(req.query.pageNumber) {
        //         pageNumber = req.query.pageNumber
        //         delete match.pageNumber
        //     }
        // }

        const totalCount = await Admissions.countDocuments(match);
        
        if(summary) {
        // const savedScan = await Admissions.find(match, { _id: 0, __v: 0 })
        //     .limit(parseInt(pageSize) * 1)
        //     .skip((parseInt(parseInt(pageNumber)) - 1) * parseInt(parseInt(pageSize)))
        //     res.status(200).json({ data: savedScan, pageSize, pageNumber, totalCount })
        // } else {
            res.status(200).json({totalScannedDocument: totalCount})
        } else {
            res.status(400).json({"error": "Invalid operation, please set summary=true"})
        }
    } catch (e) {
        res.status(400).json({ "error": true, e })
    } finally {
        next()
    }
}