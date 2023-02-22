const Mark = require("../models/marks")
const marksController = require('../controller/marksController')
const mockSavedData = require("./mock-data/savedScanData.json")
const mockMinimalSaveScanData = require('./mock-data/minimalSavedScan.json')
const AppError = require('../utils/appError')



const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.school = jest.fn().mockReturnValue(req)
    return req
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res
}

describe('saved scan data ', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should able to fetch saved data ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.school = {
            "_id": "63aa81d2d33aca650009c946",
            "name": "user13",
            "userId": "u001",
            "schoolId": "u001",
            "password": "$2a$08$fCagseJwhdNd3SEd8EB.oO6n990WLmDr4ptUpzJxLp2nvMFSZGpjG",
            "createdAt": "2022-12-27T05:25:38.298Z",
            "updatedAt": "2022-12-27T05:25:38.298Z",
            __v: 0
        }
        req.body = {
            "classId": "9",
            "section": "C",
            "subject": "Hindi",
            "schoolId": "u001",
            "downloadRes": false,
            "limit": 10,
            "page": 1
        }

        Mark.find = jest.fn().mockImplementationOnce(() => ({
            limit: jest.fn().mockImplementationOnce(() => ({
                skip: jest.fn().mockResolvedValue(mockSavedData)
            }))
        }))

        await marksController.getSaveScan(req, res)

        expect(Mark.find).toHaveBeenCalledTimes(1)
        expect(res.json({ status: 'success' }).status(200))
    });


    it("should able to fetch saved data for minimal mode ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.school = {
            "_id": "63aa81d2d33aca650009c946",
            "name": "user13",
            "userId": "u001",
            "schoolId": "u001",
            "password": "$2a$08$fCagseJwhdNd3SEd8EB.oO6n990WLmDr4ptUpzJxLp2nvMFSZGpjG",
            "createdAt": "2022-12-27T05:25:38.298Z",
            "updatedAt": "2022-12-27T05:25:38.298Z",
            __v: 0
        }
        req.body =
        {
            "classId": 0,
            "subject": 0,
            "section": 0,
            "fromDate": 0,
            "page": 0,
            "downloadRes": false,
            "roiId": '44'
        }

        Mark.find = jest.fn().mockImplementationOnce(() => ({
            limit: jest.fn().mockImplementationOnce(() => ({
                skip: jest.fn().mockResolvedValue(mockSavedData)
            }))
        }))

        await marksController.getSaveScan(req, res)

        expect(Mark.find).toHaveBeenCalledTimes(1)
        expect(res.json({ status: 'success' }).status(200))
    });

});