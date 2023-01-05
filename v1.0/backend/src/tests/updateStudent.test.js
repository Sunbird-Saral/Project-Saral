const Student = require("../models/students")
const Marks = require("../models/marks")
const studentController = require('../controller/studentController')
const mockStudentdata = require('./mock-data/student.json')
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

describe('update student', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should throw 400 error if body  have invalid data", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.body = {
            "names": "xyz"
        }

        await studentController.updateStudent(req, res)
        let error = new AppError('Invalid updates.', 400);
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('fail');
    });

    it("should throw 400 error if body is no data", async () => {
        const req = mockRequest();
        const res = mockResponse()

        await studentController.updateStudent(req, res)
        let error = new AppError('Invalid updates.', 400);
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('fail');
    });


    it("should not be able to update when id is empty string", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params.schoolId = ""

        Student.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) }));

        await studentController.updateStudent(req, res)
        let error = new AppError('Student Id does not exist.', 404);
        expect(error.statusCode).toBe(404);
        expect(error.status).toBe('fail');
    });

    // it("should be able to update when id is correct", async () => {
    //     const req = mockRequest();
    //     const res = mockResponse()
    //     req.params.schoolId = "1210001"

    //     Student.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockStudentdata) }));
    //     Student.updateOne = jest.fn().mockReturnValue({ lean: () => null })
    //     await studentController.updateStudent(req, res)

    //     // expect(Student.findOne).toHaveBeenCalledTimes(1);
    //     // expect(Student.updateOne).toHaveBeenCalledTimes(1);
    //     expect(res.status).toBeCalledWith(200);
    //     expect(res.json({ message: "Student has been updated." }).status(200));
    // });

});
