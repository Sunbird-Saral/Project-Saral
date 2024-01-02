const mongoose = require('mongoose')

const admissionsSchema = new mongoose.Schema({
   schoolId: {
      type: String,
      required: true,
      trim: true
   },
   userId: {
      type: String,
      required: true,
      trim: true,
   },
   admissionNumber: {
      type: String,
      required: true,
      trim: true
   },
   dateOfAdmission: {
      type: String,
      required: true
   },
   studentAadharNumber: {
      type: String,
      required: true
   },
   studentFirstname: {
      type: String,
      required: true,
      trim: true
   },
   studentSurname: {
      type: String,
      required: true,
      trim: true
   },
   studentDateOfBirth: {
      type: String,
      required: true
   },
   studentGender: {
      type: String,
      required: true
   },
   studentAddress: {
      type: String,
      required: true,
      trim: true
   },
   studentBlock: {
      type: String,
      required: true,
      trim: true
   },
   studentDistrict: {
      type: String,
      required: true,
      trim: true
   },
   guardianFirstname: {
      type: String,
      required: true,
      trim: true
   },
   guardianSurname: {
      type: String,
      required: true,
      trim: true
   },
   guardianRelation: {
      type: String,
      required: true
   },
   fatherName: {
         type: String,
         required: true,
         trim: true
   },
   fatherEducation: {
         type: String,
         required: true,
         trim: true
   },
   fatherOccupation: {
         type: String,
         required: true,
         trim: true
   },
   fatherContactDetails_phone1: {
            type: String,
            required: true
   },
   fatherContactDetails_phone2: {
            type: String,
            required: true
   },
   motherName: {
         type: String,
         required: true,
         trim: true
   },
   motherEducation: {
         type: String,
         required: true,
         trim: true
   },
   motherOccupation: {
         type: String,
         required: true,
         trim: true
   },
   motherContactDetails_phone1: {
            type: String,
            required: true
   },
   motherContactDetails_phone2: {
            type: String,
            required: true
   },
   rollNumber: {
      type: String,
      required: true
   },
   religion: {
         type: String,
         required: true
   },
   category: {
         type: String,
         required: true
   },
   typeOfRationCard: {
         type: String,
         required: true
   },
   CwSN: {
         type: String,
         required: true
   },
   addressOnRationCard_address: {
         type: String,
         required: true,
         trim: true
   },
   addressOnRationCard_ward: {
         type: String,
         required: true,
         trim: true
   },
   addressOnRationCard_block: {
         type: String,
         required: true,
         trim: true
   },
   addressOnRationCard_district: {
         type: String,
         required: true,
         trim: true
   },
   outOfSchool: {
         type: String,
         required: true
   },
   //This field contains prediction related data of above fields as a list of data objects.
   predictionInfo: [
      {
         reference: { type: String, required: true, enum: ['admissionNumber', 'dateOfAdmission', 'studentAadharNumber', 'studentFirstname', 'studentSurname', 'studentGender', 'studentDateOfBirth', 'studentAddress', 'studentBlock', 'studentDistrict', 'guardianFirstname', 'guardianSurname', 'guardianRelation', 'fatherName', 'fatherEducation', 'fatherOccupation', 'fatherContactDetails_phone1', 'fatherContactDetails_phone2', 'motherName', 'motherEducation', 'motherOccupation', 'motherContactDetails_phone1', 'motherContactDetails_phone1', 'rollNumber', 'religion', 'category', 'typeOfRationCard', 'CwSN', 'addressOnRationCard_address', 'addressOnRationCard_ward', 'addressOnRationCard_block', 'addressOnRationCard_district', 'outOfSchool'] },
         predictedValue: { type: String, required: true },
         predictionConfidence: { type: Array, required: false },
         trainingData: { type: Array, required: false }
      }
   ]
})

admissionsSchema.index({schoolId: -1, admissionNumber: -1, studentAadharNumber: -1})

module.exports = admissionsSchema