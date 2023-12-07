const express = require('express')
const { auth } = require('../middleware/auth')
const router = new express.Router()
const admissionsController = require('../controller/admissionsController')


router.put('/admissions',auth,admissionsController.saveAdmissions)
router.get('/admissions',auth,admissionsController.getAdmissions)

module.exports = router