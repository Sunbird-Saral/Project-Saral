const jwt = require('jsonwebtoken')
const Users = require('../models/users')
const Helper = require('../middleware/helper')
// const logger = wrapLogger(pino());
const {logger} = require('../logging/logger')
const auth  = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const school = await Users.findOne({ userId: decoded.userId })
    
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

module.exports = { auth }