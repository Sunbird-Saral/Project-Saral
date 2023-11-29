const Admissions = require("../models/admissions");
const admissionsController = require('../controller/admissionsController')
const mockAdmissionsBody = require("./mock-data/mockAdmissionsBody.json")

class AdmissionsMock {
    constructor() {

    }
    static updateOne = jest.fn().mockResolvedValue(null)
    static countDocuments = jest.fn().mockResolvedValue(1)
}
const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.school = jest.fn().mockReturnValue(req)
    req.header = jest.fn().mockReturnValue(req)
    req.get = jest.fn().mockReturnValue(req)
    req.dbConnection = {
        model: (ref, schema) => {
            return AdmissionsMock
        }
      }
    return req
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res
}

describe('Save Admissions data', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should able to save admissions data", async () => {
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
        req.body = mockAdmissionsBody

        await admissionsController.saveAdmissions(req, res, jest.fn())
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Saved Successfully.", documentCount: 1 });
    });

    it("should throw err when an exception occurs while save admissions data", async () => {
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
        req.body = mockAdmissionsBody
        AdmissionsMock.updateOne = jest.fn().mockImplementation(() => {
            throw new Error('Error while saving')
        });

        await admissionsController.saveAdmissions(req, res, jest.fn())
        expect(res.status).toHaveBeenCalledWith(400);
    });
})