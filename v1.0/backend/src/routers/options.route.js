const express = require('express')
const optionsSchema = require('../models/options')
const { auth } = require('../middleware/auth')
const router = new express.Router()

router.get('/options', auth, async (req, res,next) => {

    try {
        let connection = req.dbConnection;
        const Options = connection.model('Options', optionsSchema)
        const options = await Options.find().lean()

        if (!options.length) {
            return res.status(404).send({ "message": `Options does not exist` })
        }
        res.send(options)
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e)
    }finally {
        next()
    }
})

module.exports = router