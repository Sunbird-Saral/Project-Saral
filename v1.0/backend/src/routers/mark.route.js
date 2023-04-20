const express = require('express')
const path = require('path')
const Marks = require('../models/marks')
const Schools = require('../models/school')
const Exams = require('../models/exams')
const Classes = require('../models/classes')
const Lock = require('../models/lock')
const { auth, basicAuth } = require('../middleware/auth')
const excel = require('exceljs');
const { getFilePath, deleteAllfilesFromReports } = require('../utils/commonUtils')
const Helper = require('../middleware/helper')
const router = new express.Router()
const _ = require('lodash')
const fs = require('fs');
const marksController = require("../controller/marksController")


router.put('/saveMarks',auth,marksController.saveMarks)
router.post('/getSavedScan', auth,marksController.getSaveScan) 

module.exports = router
