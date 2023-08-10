const Marks = require("../models/marks")
const marksController = require('../controller/marksController')
const mockSaveMarksBody = require("./mock-data/mockSaveMarksBody.json")
const mockUpdateMarksBody = require("./mock-data/mockUpdateSaveMarks.json")
const mockSavedData = require("./mock-data/savedScanData.json")
const mockSaveMarks2Body = require("./mock-data/mockSaveMarks2Body.json")
const Helper = require('../middleware/helper')


const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.school = jest.fn().mockReturnValue(req)
    req.header = jest.fn().mockReturnValue(req)
    req.get = jest.fn().mockReturnValue(req)
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

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAxIiwic2Nob29sSWQiOiJ1MDAxIiwiaWF0IjoxNjcxMTY4OTY3fQ.jwx3xxTTP3dtJwJFUD4QAUsuBT8uemzyTpiKEIRhzKg"

describe('save marks data ', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

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
        Marks.bulkWrite = jest.fn().mockResolvedValue(null)
        Marks.find = jest.fn().mockResolvedValue(mockSavedData)

        await marksController.saveMarks(req, res, jest.fn())
        expect(res.json({ status: 'success' }).status(200))
    });

    it("should not able to save marks data when request body is invalid ", async () => {
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
        req.body = mockSaveMarks2Body


        await marksController.saveMarks(req, res, jest.fn())

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json({ status: 'fail' }));


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

        await marksController.saveMarks(req, res, jest.fn())
        expect(res.json({ status: 'fail' }));


    });

});