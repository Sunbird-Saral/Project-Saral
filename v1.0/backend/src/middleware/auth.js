const jwt = require('jsonwebtoken')
const School = require('../models/school')

const auth  = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const school = await School.findOne({ _id: decoded._id })
        
        if(!school) {
            throw new Error()
        }
        
        req.token = token
        req.school = school
        next()
    } catch (e) {
        res.status(401).send({ error: "Please authenticate" })
    }
}

const basicAuth = async (req, res, next) => {
    try {       
        let basicAuthHeader = req.header('Authorization').replace(/^Basic/, '')
        basicAuthHeader = (Buffer.from(basicAuthHeader, 'base64')).toString('utf8')
        let loginInfo = basicAuthHeader.split(':'); 
        
        const school = await School.findByCredentials(loginInfo[0], loginInfo[1])
        req.school = school
        next()
    } catch (e) {
        res.status(401).send({ error: "Please authenticate" })
    }
}

module.exports = { auth, basicAuth }