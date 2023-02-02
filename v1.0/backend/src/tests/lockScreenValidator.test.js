const Lock = require("../models/lock")


const Helper = require('../middleware/helper')
const schoolMockdata = require('./mock-data/school.json')
const lockMockdata = require('./mock-data/mockLockData.json')
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

describe('should lock school ', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should able school   ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params = schoolMockdata

        Lock.find = jest.fn().mockReturnValue({ lean: () =>lockMockdata})
        
        await Helper.lockScreenValidator(req, res)

        expect(Lock.find).toHaveBeenCalledTimes(1)
    });



});