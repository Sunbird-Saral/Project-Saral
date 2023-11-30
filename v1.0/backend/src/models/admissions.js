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
   studentDetails: {
      firstName: {
         type: String,
         required: true,
         trim: true
      },
      surname: {
         type: String,
         required: true,
         trim: true
      },
      dateOfBirth: {
         type: String,
         required: true
      },
      gender: {
         male: {
            type: String,
            required: true
         },
         female: {
            type: String,
            required: true
         }
      },
      address: {
         type: String,
         required: true,
         trim: true
      },
      block: {
         type: String,
         required: true,
         trim: true
      },
      district: {
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
      guardianRelation: {
         father: {
            type: String,
            required: true
         },
         mother: {
            type: String,
            required: true
         },
         other: {
            type: String,
            required: true,
            trim: true
         }
      }
   },
   fatherDetails: {
      name: {
         type: String,
         required: true,
         trim: true
      },
      education: {
         type: String,
         required: true,
         trim: true
      },
      occupation: {
         type: String,
         required: true,
         trim: true
      },
      contactDetails: {
         phone1: {
            type: String,
            required: true
         },
         phone2: {
            type: String,
            required: true
         }
      }
   },
   motherDetails: {
      name: {
         type: String,
         required: true,
         trim: true
      },
      education: {
         type: String,
         required: true,
         trim: true
      },
      occupation: {
         type: String,
         required: true,
         trim: true
      },
      contactDetails: {
         phone1: {
            type: String,
            required: true
         },
         phone2: {
            type: String,
            required: true
         }
      }
   },
   rollNumber: {
      type: String,
      required: true
   },
   religion: {
      hindu: {
         type: String,
         required: true
      },
      muslim: {
         type: String,
         required: true
      },
      christian: {
         type: String,
         required: true
      },
      sikh: {
         type: String,
         required: true
      },
      other: {
         type: String,
         required: true,
         trim: true
      }
   },
   category: {
      general: {
         type: String,
         required: true
      },
      OBC: {
         type: String,
         required: true
      },
      SC: {
         type: String,
         required: true
      },
      ST: {
         type: String,
         required: true
      }
   },
   typeOfRationCard: {
      APL: {
         type: String,
         required: true
      },
      APM: {
         type: String,
         required: true
      },
      Antyodaya: {
         type: String,
         required: true
      },
      other: {
         type: String,
         required: true,
         trim: true
      }
   },
   CwSN: {
      Yes: {
         type: String,
         required: true
      },
      No: {
         type: String,
         required: true
      }
   },
   addressOnRationCard: {
      address: {
         type: String,
         required: true,
         trim: true
      },
      ward: {
         type: String,
         required: true,
         trim: true
      },
      block: {
         type: String,
         required: true,
         trim: true
      },
      district: {
         type: String,
         required: true,
         trim: true
      }
   },
   outOfSchool: {
      Yes: {
         type: String,
         required: true
      },
      No: {
         type: String,
         required: true
      }
   },
   //This field contains prediction related data of above fields as a list of data objects.
   predictionInfo: [
      {
         reference: { type: String, required: true, enum: ['admissionNumber', 'dateOfAdmission', 'studentAadharNumber', 'studentDetails.firstName', 'studentDetails.surname', 'studentDetails.dateOfBirth', 'studentDetails.gender.male', 'studentDetails.gender.female', 'studentDetails.address', 'studentDetails.block', 'studentDetails.district', 'studentDetails.guardianFirstName', 'studentDetails.guardianSurname', 'studentDetails.guardianRelation.father', 'studentDetails.guradianRelation.mother', 'studentDetails.guradianRelation.other', 'fatherDetails.name', 'fatherDetails.education', 'fatherDetails.occupation', 'fatherDetails.contactDetails.phone1', 'fatherDetails.name.contactDetails.phone2', 'motherDetails.name', 'motherDetails.education', 'motherDetails.occupation', 'motherDetails.contactDetails.phone1', 'motherDetails.name.contactDetails.phone2', 'rollNumber', 'religion.hindu', 'religion.muslim', 'religion.christian', 'religion.sikh', 'religion.other', 'category.general', 'category.OBC', 'category.SC', 'category.ST', 'typeOfRationCard.APL', 'typeOfRationCard.APM', 'typeOfRationCard.Antyodaya', 'typeOfRationCard.other', 'CwSN.Yes', 'CwSN.No', 'addressOnRationCard.address', 'addressOnRationCard.ward', 'addressOnRationCard.block', 'addressOnRationCard.district', 'outOfSchool.Yes', 'outOfSchool.No'] },
         predictedValue: { type: String, required: true },
         predictionConfidence: { type: Array, required: false },
         trainingData: { type: Array, required: false }
      }
   ]
})

admissionsSchema.index({schoolId: -1, admissionNumber: -1, studentAadharNumber: -1})

module.exports = admissionsSchema