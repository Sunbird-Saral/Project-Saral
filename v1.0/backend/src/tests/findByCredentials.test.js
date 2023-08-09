const User = require("../models/users")


const Helper = require('../middleware/helper')
const userMockdata = require('./mock-data/user.json')
const bcrypt = require('bcryptjs')
const dummyPass =  require("../utils/commonUtils")




const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.dbConnection = {
        model: (ref, schema) => {
            return schema
        }
      }
    return req
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res
}

describe('fetch User By credentials ', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should able to get user data  ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params = {
            userId: "u001",
            password: dummyPass
        }

        User.findOne = jest.fn().mockResolvedValue(userMockdata)
        bcrypt.compare = jest.fn().mockResolvedValue(true)
        await Helper.findByCredentials(req.dbConnection, req, res)

        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
    });

    it("should not able to get user data when userId is not correct  ", async () => {
        try {
            const req = mockRequest();
            const res = mockResponse()
            req.params = {
                userId: "u00",
                password: dummyPass
            }
            User.findOne = jest.fn().mockResolvedValue(null)
            await Helper.findByCredentials(req.dbConnection, res, jest.fn())
        } catch(e) {
            expect(e).toThrowError;
            expect(e.message).toEqual('School Id or Password is not correct.');    
        }
    });

    it("should not able to get user data when password is not correct  ", async () => {
        try {
            const req = mockRequest();
            const res = mockResponse()
            req.params = {
                userId: "u001",
                password: dummyPass
            }
            User.findOne = jest.fn().mockResolvedValue(userMockdata)
            bcrypt.compare = jest.fn().mockResolvedValue(false)
            await Helper.findByCredentials(req.dbConnection, res, jest.fn())
        } catch(e) {
            expect(e).toThrowError;
            expect(e.message).toEqual('School Id or Password is not correct.');    
        }
    });

  

});