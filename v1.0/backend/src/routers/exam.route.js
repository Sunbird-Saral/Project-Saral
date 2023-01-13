const express = require('express')
const { auth } = require('../middleware/auth')
const router = new express.Router()
const examController = require("../controller/examController")

router.post('/exam',auth,examController.createExam)
router.get('/examByClass/:classId',auth,examController.getExamDataByClass)
router.delete('/exam/:examId',auth,examController.deleteExam)
router.patch('/exam/:examId',auth,examController.updateExam)


module.exports = router
