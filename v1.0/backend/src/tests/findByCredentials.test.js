const User = require("../models/users")


const Helper = require('../middleware/helper')
const userMockdata = require('./mock-data/user.json')
const bcrypt = require('bcryptjs')
const AppError = require('../utils/appError')




const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
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
            password: "tarento@123"
        }

        User.findOne = jest.fn().mockResolvedValue(userMockdata)
        bcrypt.compare = jest.fn().mockResolvedValue(true)
        await Helper.findByCredentials(req, res)

        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
    });

    it("should not able to get user data  ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params = {
            userId: "u00",
            password: "tarento@123"
        }
        User.findOne = jest.fn().mockResolvedValue(null)
        await Helper.findByCredentials(req, res)
    
        expect(User.findOne).toThrow(new TypeError('School Id or Password is not correct.'))
    }); 

});