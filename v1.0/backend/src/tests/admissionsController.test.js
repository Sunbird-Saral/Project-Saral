const Admissions = require("../models/admissions");
const admissionsController = require('../controller/admissionsController')
const mockAdmissionsBody = require("./mock-data/mockAdmissionsBody.json")


jest.mock('../middleware/helper', () => {
    return {
        transformDataBasedOnEncryption: jest.fn().mockResolvedValue({})
    }
})

class AdmissionsMock {
    constructor(data) {
        this._doc = {_id: "test", ...mockAdmissionsBody}
        this.validateSync = jest.fn().mockResolvedValue(null)
    }
    static replaceOne = jest.fn().mockResolvedValue(null)
    static countDocuments = jest.fn().mockResolvedValue(1)
    static find = jest.fn().mockReturnValueOnce({limit: jest.fn().mockReturnValueOnce({skip: jest.fn().mockResolvedValue([mockAdmissionsBody])})})
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

describe('Admissions controller', () => {
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
        expect(res.json).toHaveBeenCalledWith({ message: "Saved Successfully."});
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
        AdmissionsMock.replaceOne = jest.fn().mockImplementation(() => {
            throw new Error('Error while saving')
        });
        await admissionsController.saveAdmissions(req, res, jest.fn())
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should able to fetch admissions data count only", async () => {
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
        req.query = {
            summary: true
        }

        await admissionsController.getAdmissions(req, res, jest.fn())
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ totalScannedDocument: 1});
    });

    it("should be able to fetch all admissions data", async () => {
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
        req.query = {
            
        }
        await admissionsController.getAdmissions(req, res, jest.fn())
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: [mockAdmissionsBody], pageSize: 100, pageNumber: 1, totalCount: 1 })
    });

    it("should throw error when fetch all admissions data with pageSize more than 100", async () => {
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
        req.query = {
            pageSize: 101
        }
        await admissionsController.getAdmissions(req, res, jest.fn())
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"error": "pageSize should be between 1-100"})
        
    });

    it("should throw err when an exception occurs while fetch admissions record", async () => {
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
        AdmissionsMock.find = jest.fn().mockImplementation(() => {
            throw new Error('Error while saving')
        });
        await admissionsController.getAdmissions(req, res, jest.fn())
        expect(res.status).toHaveBeenCalledWith(400);
    });
})