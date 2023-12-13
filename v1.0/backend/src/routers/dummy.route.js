const express = require('express')
const router = express.Router();
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

router.post('/dump', (req, res, next) => {
    try {
        const requestBody = JSON.stringify(req.body, null, 2); // Convert request body to JSON string

        // Write request body to a file
        fs.writeFile(`dump/request_data_${uuidv4()}.json`, requestBody, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('Request body written to file');
            }
        });
        res.status(200).send("done")
    } catch (e) {
        res.status(400).send(e)
    }finally {
        next()
      }
})

module.exports = router