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



    it("should able to lock school when locktype is schoolId ", () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params = schoolMockdata

        Lock.find = jest.fn().mockReturnValue({ lean: () => lockMockdata })

        Helper.lockScreenValidator(req, res)
        expect(Lock.find).toHaveBeenCalledTimes(1)
        expect(Helper.lockScreenValidator(schoolMockdata, "schoolId"))
    });


    it("should  able to lock school when locktype is state ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params = schoolMockdata

        Lock.find = jest.fn().mockReturnValue({ lean: () => lockStateMockdata })

        await Helper.lockScreenValidator(req, res)
        expect(Lock.find).toHaveBeenCalledTimes(1)
        expect(Helper.lockScreenValidator(schoolMockdata, "state"))
    });

    it("should able to lock school when locktype is district ", async () => {
        try{
        const req = mockRequest();
        const res = mockResponse()
        req.params = schoolMockdata

        Lock.find = jest.fn().mockReturnValue({ lean: () => lockDistrictMockdata })

        await Helper.lockScreenValidator(req, res,'district')
        expect(Lock.find).toHaveBeenCalledTimes(1)
        // expect(Helper.lockScreenValidator(schoolMockdata, "district"))
        }catch(e){
            expect(e).toThrowError;  
        }
    });





});