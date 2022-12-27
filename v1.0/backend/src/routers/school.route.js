const express = require('express')
const router = express.Router({ mergeParams: true });
const schoolController = require("../controller/schoolController")

router.route('/schools').get(schoolController.GetSchoolsDetail)
router.route('/schools/login').post(schoolController.loginSchool)
router.route('/schools/create').post(schoolController.createSchool)
router.route('/schools/:schoolId').delete(schoolController.deleteSchool)
router.route('/schools/:schoolId').patch(schoolController.updateSchool)


// router.delete('/schools/:schoolId', async (req, res) => {
//     try {
//         const school = await School.findOne({ schoolId: req.params.schoolId.toLowerCase() })
//         if (!school) return res.status(404).send({ message: 'School Id does not exist.' })
//         let lookup = {
//             schoolId: school.schoolId
//         }
//         await School.deleteOne(lookup).lean()
//         await ClassModel.findOneAndRemove(lookup).lean()
//         await Student.findOneAndRemove(lookup).lean()
//         await Mark.findOneAndRemove(lookup).lean()
//         res.status(200).send({ message: 'School has been deleted.' })
//     }
//     catch (e) {
//         console.log(e);
//         res.status(400).send(e)
//     }
// })

// router.patch('/schools/:schoolId', async (req, res) => {
//     try {
//         if (Object.keys(req.body).length === 0) res.status(400).send({ message: 'Validation error.' })
//         const updates = Object.keys(req.body)
//         const allowedUpdates = ['name', 'state', 'district','udisceCode', 'storeTrainingData', 'autoSync', 'autoSyncFrequency','tags','autoSyncBatchSize']
//         const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//         if (!isValidOperation) {
//             return res.status(400).send({ error: 'Invaid Updates' })
//         }
//         let lookup = {
//             schoolId: req.params.schoolId.toLowerCase()
//         }
//         let update = req.body

//         const school = await School.findOne(lookup).lean();
//         if (!school) return res.status(404).send({ message: 'School Id does not exist.' })

//         await School.updateOne(lookup, update).lean().exec();
//         res.status(200).send({ message: 'School has been updated.' })

//     }
//     catch (e) {
//         console.log(e);
//         res.status(400).send(e)
//     }
// })

module.exports = router