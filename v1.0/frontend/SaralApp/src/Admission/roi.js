export let roi = {
   "layout": {
       "version": "1.0",
       "name": "AdmissionFrom",
       "page": "2",
       "threshold": {
           "experimentalOMRDetection": false,
           "minWidth": 0,
           "minHeight": 0,
           "detectionRadius": 12
       },
       "cells": [
        {
            "cellId": "1",
            "page": "1",
            "rois": [
                {
                    "annotationTags": "ADMISSIONNUMBER_1",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "1",
                    "index": 0,
                    "rect": {
                        "top": 108,
                        "left": 216,
                        "bottom": 118,
                        "right": 227
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_2",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "2",
                    "index": 1,
                    "rect": {
                        "top": 108,
                        "left": 234,
                        "bottom": 118,
                        "right": 246
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_3",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "3",
                    "index": 2,
                    "rect": {
                        "top": 108,
                        "left": 254,
                        "bottom": 118,
                        "right": 265
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_4",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "4",
                    "index": 3,
                    "rect": {
                        "top": 108,
                        "left": 274,
                        "bottom": 118,
                        "right": 285
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_5",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "5",
                    "index": 4,
                    "rect": {
                        "top": 108,
                        "left": 293,
                        "bottom": 118,
                        "right": 304
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_6",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "6",
                    "index": 5,
                    "rect": {
                        "top": 108,
                        "left": 312,
                        "bottom": 118,
                        "right": 323
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_7",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "7",
                    "index": 6,
                    "rect": {
                        "top": 108,
                        "left": 330,
                        "bottom": 118,
                        "right": 341
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_8",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "8",
                    "index": 7,
                    "rect": {
                        "top": 108,
                        "left": 349,
                        "bottom": 118,
                        "right": 360
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_9",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "9",
                    "index": 8,
                    "rect": {
                        "top": 108,
                        "left": 368,
                        "bottom": 118,
                        "right": 379
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_10",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "10",
                    "index": 9,
                    "rect": {
                        "top": 108,
                        "left": 387,
                        "bottom": 118,
                        "right": 398
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_11",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "11",
                    "index": 10,
                    "rect": {
                        "top": 108,
                        "left": 406,
                        "bottom": 118,
                        "right": 417
                    }
                },
                {
                    "annotationTags": "ADMISSIONNUMBER_12",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "12",
                    "index": 11,
                    "rect": {
                        "top": 108,
                        "left": 425,
                        "bottom": 118,
                        "right": 436
                    }
                }
            ],
            "render": {
                "index": 1
            },
            "format": {
                "name": "ADMISSIONNUMBER",
                "value": ""
            },
            "validate": {
                "regExp": ""
            }
        },
        {
            "cellId": "2",
            "page": "1",
            "rois": [
                {
                    "annotationTags": "DATEOFADMISSION_1",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "13",
                    "index": 0,
                    "rect": {
                        "top": 123,
                        "left": 216,
                        "bottom": 133,
                        "right": 227
                    }
                },
                {
                    "annotationTags": "DATEOFADMISSION_2",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "14",
                    "index": 1,
                    "rect": {
                        "top": 123,
                        "left": 235,
                        "bottom": 133,
                        "right": 246
                    }
                },
                {
                    "annotationTags": "DATEOFADMISSION_3",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "15",
                    "index": 2,
                    "rect": {
                        "top": 124,
                        "left": 272,
                        "bottom": 134,
                        "right": 283
                    }
                },
                {
                    "annotationTags": "DATEOFADMISSION_4",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "16",
                    "index": 3,
                    "rect": {
                        "top": 124,
                        "left": 292,
                        "bottom": 134,
                        "right": 303
                    }
                },
                {
                    "annotationTags": "DATEOFADMISSION_5",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "17",
                    "index": 4,
                    "rect": {
                        "top": 123,
                        "left": 331,
                        "bottom": 133,
                        "right": 342
                    }
                },
                {
                    "annotationTags": "DATEOFADMISSION_6",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "18",
                    "index": 5,
                    "rect": {
                        "top": 122,
                        "left": 349,
                        "bottom": 132,
                        "right": 360
                    }
                },
                {
                    "annotationTags": "DATEOFADMISSION_7",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "19",
                    "index": 6,
                    "rect": {
                        "top": 123,
                        "left": 368,
                        "bottom": 133,
                        "right": 379
                    }
                },
                {
                    "annotationTags": "DATEOFADMISSION_8",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "20",
                    "index": 7,
                    "rect": {
                        "top": 122,
                        "left": 387,
                        "bottom": 132,
                        "right": 398
                    }
                }
            ],
            "render": {
                "index": 2
            },
            "format": {
                "name": "dateofAdmission",
                "value": "dateofAdmission"
            },
            "validate": {
                "regExp": ""
            }
        },
        {
            "cellId": "3",
            "page": "1",
            "rois": [
                {
                    "annotationTags": "STUDENTAADHARNUMBER_1",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "21",
                    "index": 0,
                    "rect": {
                        "top": 138,
                        "left": 216,
                        "bottom": 148,
                        "right": 227
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_2",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "22",
                    "index": 1,
                    "rect": {
                        "top": 138,
                        "left": 235,
                        "bottom": 148,
                        "right": 246
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_3",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "23",
                    "index": 2,
                    "rect": {
                        "top": 138,
                        "left": 255,
                        "bottom": 148,
                        "right": 266
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_4",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "24",
                    "index": 3,
                    "rect": {
                        "top": 138,
                        "left": 274,
                        "bottom": 148,
                        "right": 285
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_5",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "25",
                    "index": 4,
                    "rect": {
                        "top": 138,
                        "left": 293,
                        "bottom": 148,
                        "right": 304
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_6",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "26",
                    "index": 5,
                    "rect": {
                        "top": 138,
                        "left": 312,
                        "bottom": 148,
                        "right": 323
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_7",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "27",
                    "index": 6,
                    "rect": {
                        "top": 138,
                        "left": 331,
                        "bottom": 148,
                        "right": 342
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_8",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "28",
                    "index": 7,
                    "rect": {
                        "top": 138,
                        "left": 349,
                        "bottom": 148,
                        "right": 360
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_9",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "29",
                    "index": 8,
                    "rect": {
                        "top": 138,
                        "left": 368,
                        "bottom": 148,
                        "right": 379
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_10",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "30",
                    "index": 9,
                    "rect": {
                        "top": 138,
                        "left": 387,
                        "bottom": 148,
                        "right": 398
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_11",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "31",
                    "index": 10,
                    "rect": {
                        "top": 138,
                        "left": 407,
                        "bottom": 148,
                        "right": 418
                    }
                },
                {
                    "annotationTags": "STUDENTAADHARNUMBER_12",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "32",
                    "index": 11,
                    "rect": {
                        "top": 138,
                        "left": 425,
                        "bottom": 148,
                        "right": 436
                    }
                }
            ],
            "render": {
                "index": 3
            },
            "format": {
                "name": "studentAadharNumber",
                "value": "studentAadharNumber"
            },
            "validate": {
                "regExp": ""
            }
        },
        {
            "cellId": "4",
            "page": "1",
            "rois": [
                {
                    "annotationTags": "STUDENTFIRSTNAME_1",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "33",
                    "index": 0,
                    "rect": {
                        "top": 173,
                        "left": 217,
                        "bottom": 183,
                        "right": 228
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_2",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "34",
                    "index": 1,
                    "rect": {
                        "top": 174,
                        "left": 235,
                        "bottom": 184,
                        "right": 246
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_3",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "35",
                    "index": 2,
                    "rect": {
                        "top": 175,
                        "left": 254,
                        "bottom": 185,
                        "right": 265
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_4",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "36",
                    "index": 3,
                    "rect": {
                        "top": 174,
                        "left": 273,
                        "bottom": 184,
                        "right": 284
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_5",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "37",
                    "index": 4,
                    "rect": {
                        "top": 174,
                        "left": 293,
                        "bottom": 184,
                        "right": 304
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_6",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "38",
                    "index": 5,
                    "rect": {
                        "top": 174,
                        "left": 311,
                        "bottom": 184,
                        "right": 322
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_7",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "39",
                    "index": 6,
                    "rect": {
                        "top": 174,
                        "left": 331,
                        "bottom": 184,
                        "right": 342
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_8",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "40",
                    "index": 7,
                    "rect": {
                        "top": 173,
                        "left": 349,
                        "bottom": 183,
                        "right": 360
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_9",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "41",
                    "index": 8,
                    "rect": {
                        "top": 173,
                        "left": 368,
                        "bottom": 183,
                        "right": 379
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_10",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "42",
                    "index": 9,
                    "rect": {
                        "top": 173,
                        "left": 387,
                        "bottom": 183,
                        "right": 398
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_11",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "43",
                    "index": 10,
                    "rect": {
                        "top": 173,
                        "left": 406,
                        "bottom": 183,
                        "right": 417
                    }
                },
                {
                    "annotationTags": "STUDENTFIRSTNAME_12",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "44",
                    "index": 11,
                    "rect": {
                        "top": 173,
                        "left": 425,
                        "bottom": 183,
                        "right": 436
                    }
                }
            ],
            "render": {
                "index": 4
            },
            "format": {
                "name": "studentFirstname",
                "value": "studentFirstname"
            },
            "validate": {
                "regExp": ""
            }
        },
        {
            "cellId": "5",
            "page": "1",
            "rois": [
                {
                    "annotationTags": "STUDENTSURNAME_1",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "45",
                    "index": 0,
                    "rect": {
                        "top": 204,
                        "left": 216,
                        "bottom": 214,
                        "right": 227
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_2",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "46",
                    "index": 1,
                    "rect": {
                        "top": 203,
                        "left": 235,
                        "bottom": 213,
                        "right": 246
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_3",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "47",
                    "index": 2,
                    "rect": {
                        "top": 203,
                        "left": 254,
                        "bottom": 213,
                        "right": 265
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_4",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "48",
                    "index": 3,
                    "rect": {
                        "top": 204,
                        "left": 273,
                        "bottom": 214,
                        "right": 284
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_5",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "49",
                    "index": 4,
                    "rect": {
                        "top": 204,
                        "left": 292,
                        "bottom": 214,
                        "right": 303
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_6",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "50",
                    "index": 5,
                    "rect": {
                        "top": 204,
                        "left": 311,
                        "bottom": 214,
                        "right": 322
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_7",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "51",
                    "index": 6,
                    "rect": {
                        "top": 204,
                        "left": 331,
                        "bottom": 214,
                        "right": 342
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_8",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "52",
                    "index": 7,
                    "rect": {
                        "top": 205,
                        "left": 348,
                        "bottom": 215,
                        "right": 359
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_9",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "53",
                    "index": 8,
                    "rect": {
                        "top": 203,
                        "left": 368,
                        "bottom": 213,
                        "right": 379
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_10",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "54",
                    "index": 9,
                    "rect": {
                        "top": 204,
                        "left": 387,
                        "bottom": 214,
                        "right": 398
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_11",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "55",
                    "index": 10,
                    "rect": {
                        "top": 203,
                        "left": 406,
                        "bottom": 213,
                        "right": 417
                    }
                },
                {
                    "annotationTags": "STUDENTSURNAME_12",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "56",
                    "index": 11,
                    "rect": {
                        "top": 203,
                        "left": 425,
                        "bottom": 213,
                        "right": 436
                    }
                }
            ],
            "render": {
                "index": 5
            },
            "format": {
                "name": "studentSurname",
                "value": "studentSurname"
            },
            "validate": {
                "regExp": ""
            }
        },
        {
            "cellId": "6",
            "page": "1",
            "rois": [
                {
                    "annotationTags": "STUDENTDATEOFBIRTH_1",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "57",
                    "index": 0,
                    "rect": {
                        "top": 237,
                        "left": 217,
                        "bottom": 247,
                        "right": 228
                    }
                },
                {
                    "annotationTags": "STUDENTDATEOFBIRTH_2",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "58",
                    "index": 1,
                    "rect": {
                        "top": 237,
                        "left": 234,
                        "bottom": 247,
                        "right": 245
                    }
                },
                {
                    "annotationTags": "STUDENTDATEOFBIRTH_3",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "59",
                    "index": 2,
                    "rect": {
                        "top": 237,
                        "left": 274,
                        "bottom": 247,
                        "right": 285
                    }
                },
                {
                    "annotationTags": "STUDENTDATEOFBIRTH_4",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "60",
                    "index": 3,
                    "rect": {
                        "top": 238,
                        "left": 292,
                        "bottom": 248,
                        "right": 303
                    }
                },
                {
                    "annotationTags": "STUDENTDATEOFBIRTH_5",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "61",
                    "index": 4,
                    "rect": {
                        "top": 237,
                        "left": 330,
                        "bottom": 247,
                        "right": 341
                    }
                },
                {
                    "annotationTags": "STUDENTDATEOFBIRTH_6",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "62",
                    "index": 5,
                    "rect": {
                        "top": 236,
                        "left": 348,
                        "bottom": 246,
                        "right": 359
                    }
                },
                {
                    "annotationTags": "STUDENTDATEOFBIRTH_7",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "63",
                    "index": 6,
                    "rect": {
                        "top": 237,
                        "left": 367,
                        "bottom": 247,
                        "right": 378
                    }
                },
                {
                    "annotationTags": "STUDENTDATEOFBIRTH_8",
                    "extractionMethod": "NUMERIC_CLASSIFICATION",
                    "roiId": "64",
                    "index": 7,
                    "rect": {
                        "top": 236,
                        "left": 387,
                        "bottom": 246,
                        "right": 398
                    }
                }
            ],
            "render": {
                "index": 6
            },
            "format": {
                "name": "studentDateOfBirth",
                "value": "studentDateOfBirth"
            },
            "validate": {
                "regExp": ""
            }
        },
        {
            "cellId": "7",
            "page": "1",
            "rois": [
                {
                    "annotationTags": "STUDENTGENDER_MALE",
                    "extractionMethod": "CELL_OMR",
                    "roiId": "65",
                    "index": 0,
                    "rect": {
                        "top": 251,
                        "left": 273,
                        "bottom": 261,
                        "right": 284
                    }
                },
                {
                    "annotationTags": "STUDENTGENDER_FEMALE",
                    "extractionMethod": "CELL_OMR",
                    "roiId": "66",
                    "index": 1,
                    "rect": {
                        "top": 252,
                        "left": 348,
                        "bottom": 262,
                        "right": 359
                    }
                }
            ],
            "render": {
                "index": 7
            },
            "format": {
                "name": "studentGender",
                "value": "studentGender"
            },
            "validate": {
                "regExp": ""
            },
            "omrOptions": [
                "male",
                "female"
            ]
        },
        {
            "cellId": "8",
            "page": "1",
            "rois": [
                {
                    "annotationTags": "STUDENTADDRESS_1",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "67",
                    "index": 0,
                    "rect": {
                        "top": 266,
                        "left": 216,
                        "bottom": 276,
                        "right": 227
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_2",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "68",
                    "index": 1,
                    "rect": {
                        "top": 267,
                        "left": 235,
                        "bottom": 277,
                        "right": 246
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_3",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "69",
                    "index": 2,
                    "rect": {
                        "top": 266,
                        "left": 254,
                        "bottom": 276,
                        "right": 265
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_4",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "70",
                    "index": 3,
                    "rect": {
                        "top": 267,
                        "left": 273,
                        "bottom": 277,
                        "right": 284
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_5",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "71",
                    "index": 4,
                    "rect": {
                        "top": 267,
                        "left": 293,
                        "bottom": 277,
                        "right": 304
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_6",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "72",
                    "index": 5,
                    "rect": {
                        "top": 267,
                        "left": 311,
                        "bottom": 277,
                        "right": 322
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_7",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "73",
                    "index": 6,
                    "rect": {
                        "top": 268,
                        "left": 329,
                        "bottom": 278,
                        "right": 340
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_8",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "74",
                    "index": 7,
                    "rect": {
                        "top": 267,
                        "left": 348,
                        "bottom": 277,
                        "right": 359
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_9",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "75",
                    "index": 8,
                    "rect": {
                        "top": 266,
                        "left": 367,
                        "bottom": 276,
                        "right": 378
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_10",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "76",
                    "index": 9,
                    "rect": {
                        "top": 267,
                        "left": 387,
                        "bottom": 277,
                        "right": 398
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_11",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "77",
                    "index": 10,
                    "rect": {
                        "top": 266,
                        "left": 406,
                        "bottom": 276,
                        "right": 417
                    }
                },
                {
                    "annotationTags": "STUDENTADDRESS_12",
                    "extractionMethod": "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                    "roiId": "78",
                    "index": 11,
                    "rect": {
                        "top": 267,
                        "left": 425,
                        "bottom": 277,
                        "right": 436
                    }
                }
            ],
            "render": {
                "index": 8
            },
            "format": {
                "name": "studentAddress",
                "value": "studentAddress"
            },
            "validate": {
                "regExp": ""
            }
        }
    ]
   }
};
