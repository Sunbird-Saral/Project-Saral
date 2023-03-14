const Lock = require("../models/lock")


const Helper = require('../middleware/helper')
const schoolMockdata = require('./mock-data/school.json')
const lockMockdata = require('./mock-data/mockLockData.json')
const lockStateMockdata = require('./mock-data/mockStateLockData.json')
const lockDistrictMockdata = require('./mock-data/mockDistrictLockData.json')




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


    it("should  able to lock school when locktype is state ", async () => {

        Lock.find = jest.fn().mockReturnValue({ lean: () => lockStateMockdata })

        await expect(Helper.lockScreenValidator(schoolMockdata,"state")).rejects.toThrow()
        expect(Lock.find).toHaveBeenCalledTimes(1)
    });



    it("should able to lock school when locktype is district ", async () => {

        Lock.find = jest.fn().mockReturnValue({ lean: () => lockDistrictMockdata })

        await expect(Helper.lockScreenValidator(schoolMockdata,"district")).rejects.toThrow()
        expect(Lock.find).toHaveBeenCalledTimes(1)
    });

    it("should able to lock school when locktype is schoolId ", async () => {

        Lock.find = jest.fn().mockReturnValue({ lean: () => lockMockdata })

        await expect(Helper.lockScreenValidator(schoolMockdata,"state")).rejects.toThrow()
        expect(Lock.find).toHaveBeenCalledTimes(1)
    });





});