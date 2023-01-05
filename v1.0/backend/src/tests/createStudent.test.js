const Student = require("../models/students")
const Marks = require("../models/marks")
const studentController = require('../controller/studentController')
const mockStudentdata = require('./mock-data/student.json')
const mockStudentdataResponse = require('./mock-data/mockCreateSchoolResponse.json')
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

describe('create student', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should able to create students", async () => {
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
            "studentClass": [
                {
                    "classId": "2",
                    "className": "Class-2"
                }
            ],
            "section": "D",
            "name": "Student1",
            "studentId": "1210001",
            "schoolId": "u001"
        }

        Student.create = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockStudentdataResponse)}));

        await studentController.createStudent(req, res)
        expect(Student.create).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json({ status: 'success' }).status(201));

    });

     it("should not able to create student when body doenot have data", async () => {
        const req = mockRequest();
        const res = mockResponse()

        await studentController.createStudent(req, res)
        let error = new AppError('Student Id is required.', 400);
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('fail');
    });
})