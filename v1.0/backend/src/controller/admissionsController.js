const admissionsSchema = require('../models/admissions')

exports.saveAdmissions = async (req, res, next) => {

    try {
        let connection = req.dbConnection;
        const Admissions = connection.model('Admissions', admissionsSchema)
        const studentAdmissionData = new Admissions(req.body)
        const filter = {
            admissionNumber: studentAdmissionData.admissionNumber,
            schoolId: req.school.schoolId
        }

        const update = {
            schoolId: req.school.schoolId,
            admissionNumber: studentAdmissionData.admissionNumber,
            admissionNumberTrainingData: studentAdmissionData.admissionNumberTrainingData,
            predictedAdmissionNumber: studentAdmissionData.predictedAdmissionNumber,
            dateOfAdmission: studentAdmissionData.dateOfAdmission,
            studentAadharNumber: studentAdmissionData.studentAadharNumber,
            studentDetails: studentAdmissionData.studentDetails,
            fatherDetails: studentAdmissionData.fatherDetails,
            motherDetails: studentAdmissionData.motherDetails,
            rollNumber: studentAdmissionData.rollNumber,
            religion: studentAdmissionData.religion,
            category: studentAdmissionData.category,
            typeOfRationCard: studentAdmissionData.typeOfRationCard,
            CwSN: studentAdmissionData.CwSN,
            addressOnRationCard: studentAdmissionData.addressOnRationCard,
            outOfSchool: studentAdmissionData.outOfSchool
        }
        await Admissions.updateOne(filter, update, {upsert:true})
        res.status(200).json({ message: "Saved Successfully." })
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    } finally {
        next()
    }
}

exports.getAdmissions = async (req, res, next) => {

    try {
        let connection = req.dbConnection
        const Admissions = connection.model('Admissions', admissionsSchema)

        let match = {
            schoolId: req.school.schoolId
        }
        let pageSize = 10; pageNumber = 1;
        if(req.query) {
            match = {...req.query, ...match}
            if(req.query.pageSize) {
                pageSize = req.query.pageSize
                delete match.pageSize
            }
            if(req.query.pageNumber) {
                pageNumber = req.query.pageNumber
                delete match.pageNumber
            }
        }

        const totalCount = await Admissions.countDocuments(match);
        
        const savedScan = await Admissions.find(match, { _id: 0, __v: 0 })
            .limit(parseInt(pageSize) * 1)
            .skip((parseInt(parseInt(pageNumber)) - 1) * parseInt(parseInt(pageSize)))
        res.status(200).json({ data: savedScan, pageSize, pageNumber, totalCount })
    } catch (e) {
        logger.warn(e)
        res.status(400).json({ "error": true, e })
    } finally {
        next()
    }
}