const express = require('express')
const { auth } = require('../middleware/auth')
const _ = require('lodash')
const Promise = require('bluebird')
const router = new express.Router()

const classController = require("../controller/classController")


router.post('/classes',auth,classController.createClasses)
router.put('/classes',auth,classController.updateClass)
router.delete('/classes',auth,classController.deleteClass)

module.exports = router