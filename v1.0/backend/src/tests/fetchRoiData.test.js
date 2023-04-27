const School = require("../models/school")
const Roi = require("../models/roi")
const Exam = require("../models/exams")

const roiController = require('../controller/roiController')
const schoolMockdata = require('./mock-data/school.json')
const mockResponseRoi = require('./mock-data/roi.json')
const mockFetchExamData = require('./mock-data/mockGetExamData.json')
const AppError = require('../utils/appError')




const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.query = jest.fn().mockReturnValue(req)
    req.school = jest.fn().mockReturnValue(req)
    return req
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAxIiwic2Nob29sSWQiOiJ1MDAxIiwiaWF0IjoxNjcxMTY4OTY3fQ.jwx3xxTTP3dtJwJFUD4QAUsuBT8uemzyTpiKEIRhzKg"


describe('fetch roi data ', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should not able to get roi data when examid is invalid", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params.examId = 109 
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
        Exam.findOne = jest.fn().mockReturnValue({ lean: () => null })
        await roiController.getRoiData(req, res)
        let error = new AppError("Exam Id does not exist", 404);
        expect(Exam.findOne).toHaveBeenCalledTimes(1)
        expect(error.statusCode).toBe(404);
        expect(error.status).toBe('fail');
    });

    it("should able to get roi data  ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params.examId = 22
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


        Exam.findOne = jest.fn().mockReturnValue({ lean: () => mockFetchExamData })
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Roi.findOne= jest.fn().mockReturnValue({ lean: () => mockResponseRoi })
        Roi.find= jest.fn().mockReturnValue({ lean: () => mockResponseRoi })
        await roiController.getRoiData(req, res)

        expect(Exam.findOne).toHaveBeenCalledTimes(1)
        expect(School.findOne).toHaveBeenCalledTimes(1)
        expect(Roi.findOne).toHaveBeenCalledTimes(1)
        expect(Roi.find).toHaveBeenCalledTimes(1)
        expect(res.json({ status: 'success' }).status(200))
    });


    it("should not able to get roi data ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params.examId = 22
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
        Exam.findOne = jest.fn().mockReturnValue({ lean: () => mockFetchExamData })
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Roi.findOne = jest.fn().mockReturnValue({ lean: () => null })
        await roiController.getRoiData(req, res)

        let error = new AppError("Roi Id does not exist", 404);
        expect(Exam.findOne).toHaveBeenCalledTimes(1)
        expect(School.findOne).toHaveBeenCalledTimes(1)
        expect(Roi.findOne).toHaveBeenCalledTimes(1)
        expect(error.statusCode).toBe(404);
        expect(error.status).toBe('fail');
    });

    it("should able to get roi data according to set ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.query.set = 'A'
        req.params.examId = 23
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


        Exam.findOne = jest.fn().mockReturnValue({ lean: () => mockFetchExamData })
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Roi.findOne = jest.fn().mockReturnValue({ lean: () => [] })
        Roi.find = jest.fn().mockReturnValue({ lean: () =>  mockResponseRoi })
        await roiController.getRoiData(req, res)

        expect(Exam.findOne).toHaveBeenCalledTimes(1)
        expect(School.findOne).toHaveBeenCalledTimes(1)
        expect(Roi.findOne).toHaveBeenCalledTimes(1)
        expect(Roi.find).toHaveBeenCalledTimes(1)
        expect(res.json({ status: 'success' }).status(200))

    });

    it("should not able to get roi data according to set ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.query.set = 'A'
        req.params.examId = 23
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

        Exam.findOne = jest.fn().mockReturnValue({ lean: () => mockFetchExamData })
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Roi.findOne = jest.fn().mockReturnValue({ lean: () => [] })
        Roi.find = jest.fn().mockReturnValue({ lean: () =>  [] })
        await roiController.getRoiData(req, res)

        
        let error = new AppError("Roi Id does not exist", 404);
        expect(Exam.findOne).toHaveBeenCalledTimes(1)
        expect(School.findOne).toHaveBeenCalledTimes(1)
        expect(Roi.findOne).toHaveBeenCalledTimes(1)
        expect(Roi.find).toHaveBeenCalledTimes(1)
        expect(error.statusCode).toBe(404);
        expect(error.status).toBe('fail');

    });


});
