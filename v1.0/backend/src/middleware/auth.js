const jwt = require('jsonwebtoken')
const usersSchema = require('../models/users')
const clientPool = require('../db/mongoose');

const auth  = async (req, res, next) => {
    let connection
    try {
        connection = await clientPool.acquire();
        const Users = connection.model('Users', usersSchema)

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
    } finally {
        if (connection) {
          clientPool.release(connection);
        }
      }
}

module.exports = { auth }