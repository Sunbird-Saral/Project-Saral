const Marks = require("../models/marks")
const marksController = require('../controller/marksController')
const mockSaveMarksBody = require("./mock-data/mockSaveMarksBody.json")
const mockSaveMarksResponse = require("./mock-data/mockSaveMarksResponse.json")
const mockStudentMarksExist = require("./mock-data/mockStudentMarksExist.json")
const mockUpdateMarksBody = require("./mock-data/mockUpdateSaveMarks.json")
const mockSavedData = require("./mock-data/savedScanData.json")
const Helper = require('../middleware/helper')
const AppError = require('../utils/appError')



const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.school = jest.fn().mockReturnValue(req)
    req.header = jest.fn().mockReturnValue(req)
    req.get = jest.fn().mockReturnValue(req)
    return req
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAxIiwic2Nob29sSWQiOiJ1MDAxIiwiaWF0IjoxNjcxMTY4OTY3fQ.jwx3xxTTP3dtJwJFUD4QAUsuBT8uemzyTpiKEIRhzKg"

describe('save marks data ', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should able to save marks data  ", async () => {
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
        req.body = mockSaveMarksBody

        Helper.lockScreenValidator = jest.fn().mockResolvedValue(undefined)
        Marks.findOne = jest.fn().mockReturnValue(null)
        Marks.create = jest.fn().mockResolvedValue(mockSaveMarksResponse)
        Marks.find = jest.fn().mockResolvedValue(mockSavedData)

        await marksController.saveMarks(req, res)

        expect(Helper.lockScreenValidator).toHaveBeenCalledTimes(1)
        expect(Marks.findOne).toHaveBeenCalledTimes(1)
        expect(Marks.create).toHaveBeenCalledTimes(1)
        expect(Marks.find).toHaveBeenCalledTimes(1)
        expect(res.json({ status: 'success' }).status(200))
    });


    it("should able to update marks data  ", async () => {
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
        req.body = mockUpdateMarksBody

        Helper.lockScreenValidator = jest.fn().mockResolvedValue(undefined)
        Marks.findOne = jest.fn().mockResolvedValue(mockStudentMarksExist);
        Marks.update = jest.fn().mockResolvedValue({ n: 1, nModified: 1, ok: 1 })
        Marks.find = jest.fn().mockResolvedValue(mockSavedData)

        await marksController.saveMarks(req, res)

        expect(Helper.lockScreenValidator).toHaveBeenCalledTimes(1)
        expect(Marks.findOne).toHaveBeenCalledTimes(1)
        expect(Marks.update).toHaveBeenCalledTimes(1)
        expect(Marks.find).toHaveBeenCalledTimes(1)
        expect(res.json({ status: 'success' }).status(200))
    });

    it("should not able to save marks data school is locked ", async () => {
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
        req.body = mockSaveMarksBody

        Helper.lockScreenValidator = jest.fn().mockImplementation(() => {
            throw new Error('State/District/School is locked for scanning')
        });

        await marksController.saveMarks(req, res)

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json({ status: 'fail' }));


    });

});