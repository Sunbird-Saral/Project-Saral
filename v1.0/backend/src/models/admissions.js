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
   studentGender_male: {
      type: String,
      required: true
   },
   studentGender_female: {
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
   guardianFirstName: {
      type: String,
      required: true,
      trim: true
   },
   guardianSurname: {
      type: String,
      required: true,
      trim: true
   },
   guardianRelation_father: {
      type: String,
      required: true
   },
   guardianRelation_mother: {
      type: String,
      required: true
   },
   guardianRelation_other: {
      type: String,
      required: true,
      trim: true
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
   religion_hindu: {
         type: String,
         required: true
   },
   religion_muslim: {
         type: String,
         required: true
   },
   religion_christian: {
         type: String,
         required: true
   },
   religion_sikh: {
         type: String,
         required: true
   },
   religion_other: {
         type: String,
         required: true,
         trim: true
   },
   category_general: {
         type: String,
         required: true
   },
   category_OBC: {
         type: String,
         required: true
   },
   category_SC: {
         type: String,
         required: true
   },
   category_ST: {
         type: String,
         required: true
   },
   typeOfRationCard_APL: {
         type: String,
         required: true
   },
   typeOfRationCard_BPL: {
         type: String,
         required: true
   },
   typeOfRationCard_ANYODAY: {
         type: String,
         required: true
   },
   typeOfRationCard_ANYA: {
         type: String,
         required: true,
         trim: true
   },
   CwSN_Yes: {
         type: String,
         required: true
   },
   CwSN_No: {
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
   outOfSchool_Yes: {
         type: String,
         required: true
   },
   outOfSchool_No: {
         type: String,
         required: true
   },
   //This field contains prediction related data of above fields as a list of data objects.
   predictionInfo: [
      {
         reference: { type: String, required: true, enum: ['admissionNumber', 'dateOfAdmission', 'studentAadharNumber', 'studentFirstname', 'studentSurname', 'studentGender_male', 'studentGender_female', 'studentDateOfBirth', 'studentAddress', 'studentBlock', 'studentDistrict', 'guardianFirstName', 'guardianSurname', 'guardianRelation_father', 'guardianRelation_mother', 'guardianRelation_other', 'fatherName', 'fatherEducation', 'fatherOccupation', 'fatherContactDetails_phone1', 'fatherContactDetails_phone2', 'motherName', 'motherEducation', 'motherOccupation', 'motherContactDetails_phone1', 'motherContactDetails_phone1', 'rollNumber', 'religion_hindu', 'religion_muslim', 'religion_christian', 'religion_sikh', 'religion_other', 'category_general', 'category_OBC', 'category_SC', 'category_ST', 'typeOfRationCard_APL', 'typeOfRationCard_BPL', 'typeOfRationCard_ANYODAY', 'typeOfRationCard_ANYA', 'CwSN_Yes', 'CwSN_N0', 'addressOnRationCard_address', 'addressOnRationCard_ward', 'addressOnRationCard_block', 'addressOnRationCard_district', 'outOfSchool_Yes', 'outOfSchool_No'] },
         predictedValue: { type: String, required: true },
         predictionConfidence: { type: Array, required: false },
         trainingData: { type: Array, required: false }
      }
   ]
})

admissionsSchema.index({schoolId: -1, admissionNumber: -1, studentAadharNumber: -1})

module.exports = admissionsSchema