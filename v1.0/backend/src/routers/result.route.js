const express = require('express')
const path = require('path')
const Result = require('../models/result')
const { auth } = require('../middleware/auth')
const router = new express.Router()


router.put('/saveResults', auth, async (req, res) => {
    const results = []
    const category3 = req.body.category3
    const date = req.body.date
    const orgId = req.school.orgId
    const category1  = req.body.category1 
    const createdOn = new Date().getTime()
    const roiId = req.body.roiId

    req.body.studentsResultInfo.forEach(studentsData => {
        const resultData = new Result({
            ...studentsData,
            orgId,
            date,
            category3,
            category1 ,
            createdOn,
            roiId
        })
        results.push(resultData)
    });
    try {
        for (let data of results) {
         
            let studentResultsExist = await Result.findOne({ orgId:data.orgId,identifier: data.identifier,category1 :data.category1 ,category3: data.category3, date: data.date, roiId: data.roiId  })
            if (!studentResultsExist) {
                await Result.create(data)
            } else {
                if (data.orgId == studentResultsExist.orgId && data.identifier == studentResultsExist.identifier && data.category1  == studentResultsExist.category1  && data.category3 == studentResultsExist.category3 && data.date  == studentResultsExist.date) {
                    let lookup = {
                        identifier: data.identifier
                    }
                    let update = { $set: { identifierTrainingData: data.identifierTrainingData,predictedIdentifier: data.predictedIdentifier,availability: data.availability, resultInfo: data.resultInfo ,maxResultTrainingData: data.maxResultTrainingData,maxResultPredicted: data.maxResultPredicted, securedResult: data.securedResult, totalResult: data.totalResult,obtainedResultTrainingData: data.obtainedResultTrainingData,obtainedResultPredicted: data.obtainedResultPredicted  } }
                    await Result.update(lookup, update)
                }
            }
        }

        res.status(200).send({ message: 'Data Saved Successfully' })
    } catch (e) {
        console.log(e);
        res.status(400).send({ e })
    }
})
module.exports = router