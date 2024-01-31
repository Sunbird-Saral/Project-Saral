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
        const update = {
            "admissionNumber": encryptedData.admissionNumber,
            "dateOfAdmission": encryptedData.dateOfAdmission,
            "studentAadharNumber": encryptedData.studentAadharNumber,
            "studentFirstname": encryptedData.studentFirstname,
            "studentSurname": encryptedData.studentSurname,
            "studentDateOfBirth": encryptedData.studentDateOfBirth,
            "studentGender": encryptedData.studentGender,
            "studentAddress": encryptedData.studentAddress,
            "studentBlock": encryptedData.studentBlock,
            "studentDistrict": encryptedData.studentDistrict,
            "guardianFirstname": encryptedData.guardianFirstname,
            "guardianSurname": encryptedData.guardianSurname,
            "guardianRelation": encryptedData.guardianRelation,
            "fatherName": encryptedData.fatherName,
            "fatherEducation": encryptedData.fatherEducation,
            "fatherOccupation": encryptedData.fatherOccupation,
            "fatherContactDetails_phone1": encryptedData.fatherContactDetails_phone1,
            "fatherContactDetails_phone2": encryptedData.fatherContactDetails_phone2,
            "motherName": encryptedData.motherName,
            "motherEducation": encryptedData.motherEducation,
            "motherOccupation": encryptedData.motherOccupation,
            "motherContactDetails_phone1": encryptedData.motherContactDetails_phone1,
            "motherContactDetails_phone2": encryptedData.motherContactDetails_phone2,
            "rollNumber": encryptedData.rollNumber,
            "religion": encryptedData.religion,
            "category": encryptedData.category,
            "typeOfRationCard": encryptedData.typeOfRationCard,
            "CwSN": encryptedData.CwSN,
            "addressOnRationCard_address": encryptedData.addressOnRationCard_address,
            "addressOnRationCard_ward": encryptedData.addressOnRationCard_ward,
            "addressOnRationCard_block": encryptedData.addressOnRationCard_block,
            "addressOnRationCard_district": encryptedData.addressOnRationCard_district,
            "outOfSchool": encryptedData.outOfSchool,
            "predictionInfo": encryptedData.predictionInfo,
            "userId": req.school.userId,
            "schoolId": req.school.schoolId
         }
        const filter = {
            schoolId: req.school.schoolId,
            admissionNumber: encryptedData.admissionNumber
        }
        await Admissions.replaceOne(filter, update, {upsert:true, runValidators: true})
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