const mongoose = require('mongoose')

const admissionsSchema = new mongoose.Schema({
   schoolId: {
      type: String,
      required: true,
      trim: true
   },
   admissionNumber: {
      type: String,
      required: true,
      trim: true,
      index: true
   },
   admissionNumberTrainingData: {
      type: Array,
      required: false
   },
   predictedAdmissionNumber: {
      type: String,
      required: false
   },
   dateOfAdmission: {
      predicted: {
         type: String,
         required: false
      },
      predictionConfidence: {
         type: Array,
         required: false
      },
      obtained: {
         type: String,
         required: true
      },
      trainingData: {
         type: Array,
         required: false
      }
   },
   studentAadharNumber: {
      predicted: {
         type: String,
         required: false
      },
      predictionConfidence: {
         type: Array,
         required: false
      },
      obtained: {
         type: String,
         required: true
      },
      trainingData: {
         type: Array,
         required: false
      }
   },
   studentDetails: {
      firstName: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      surname: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      dateOfBirth: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      gender: {
         male: {
            predicted: {
               type: String,
               required: false
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         },
         female: {
            predicted: {
               type: String,
               required: false
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         }
      },
      address: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      block: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      district: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      guardianFirstName: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      guardianSurname: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      guardianRelation: {
         father: {
            predicted: {
               type: String,
               required: false
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         },
         mother: {
            predicted: {
               type: String,
               required: false
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         },
         other: {
            predicted: {
               type: String,
               required: false,
               trim: true
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true,
               trim: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         }
      }
   },
   fatherDetails: {
      name: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      education: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      occupation: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      contactDetails: {
         phone1: {
            predicted: {
               type: String,
               required: false
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         },
         phone2: {
            predicted: {
               type: String,
               required: false
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         }
      }
   },
   motherDetails: {
      name: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      education: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      occupation: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      contactDetails: {
         phone1: {
            predicted: {
               type: String,
               required: false
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         },
         phone2: {
            predicted: {
               type: String,
               required: false
            },
            predictionConfidence: {
               type: Array,
               required: false
            },
            obtained: {
               type: String,
               required: true
            },
            trainingData: {
               type: Array,
               required: false
            }
         }
      }
   },
   rollNumber: {
      predicted: {
         type: String,
         required: false
      },
      predictionConfidence: {
         type: Array,
         required: false
      },
      obtained: {
         type: String,
         required: true
      },
      trainingData: {
         type: Array,
         required: false
      }
   },
   religion: {
      hindu: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      muslim: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      christian: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      sikh: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      other: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      }
   },
   category: {
      general: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      OBC: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      SC: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      ST: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      }
   },
   typeOfRationCard: {
      APL: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      APM: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      Antyodaya: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      other: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      }
   },
   CwSN: {
      Yes: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      No: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      }
   },
   addressOnRationCard: {
      address: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      ward: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      block: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      district: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true,
            trim: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      }
   },
   outOfSchool: {
      Yes: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      },
      No: {
         predicted: {
            type: String,
            required: false
         },
         predictionConfidence: {
            type: Array,
            required: false
         },
         obtained: {
            type: String,
            required: true
         },
         trainingData: {
            type: Array,
            required: false
         }
      }
   }
})

module.exports = admissionsSchema