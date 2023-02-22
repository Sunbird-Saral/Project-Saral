const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Helper = require('../middleware/helper')

const auth  = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const school = await User.findOne({ userId: decoded.userId })
        
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
        const school = await Helper.findByCredentials(loginInfo[0].toLowerCase(), loginInfo[1])
        req.school = school
        next()
    } catch (e) {
        res.status(401).send({ error: "Please authenticate" })
    }
}

module.exports = { auth, basicAuth }