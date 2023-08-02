const jwt = require('jsonwebtoken')
const usersSchema = require('../models/users')
const {pool} = require('../db/mongoose');
const auth  = async (req, res, next) => {
    
    try {
        const authStartTime = new Date();
        let connection = req.dbConnection
        const Users = connection.model('Users', usersSchema)

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const school = await Users.findOne({ userId: decoded.userId })
        req.authChkt = ((new Date()) - authStartTime);
    
        if(!school) {
            throw new Error()
        }
        
        req.token = token
        req.school = school
        next()
    } catch (e) {
        res.status(401).send({ error: "Please authenticate" })
        if(req.dbConnection) {

            pool.release(req.dbConnection)

        }
    } 
}

module.exports = { auth }
