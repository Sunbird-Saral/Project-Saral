const Student = require("../models/students")
const Marks = require("../models/marks")
const AppError = require('../utils/appError')
const studentController = require('../controller/studentController')
const mockStudentdata = require('./mock-data/student.json')
const mockDeleteRespose = require('./mock-data/deleteOneResponse.json')



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

describe('delete student', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should able to delete student", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params.studentId = "1210001"

        Student.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockStudentdata) }));

        Student.deleteOne = jest.fn().mockReturnValue({ lean: () => mockDeleteRespose })
        Marks.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null })

        await studentController.deleteStudent(req, res)

        expect(Student.findOne).toHaveBeenCalledTimes(1)
        expect(Student.deleteOne).toHaveBeenCalledTimes(1)
        expect(Marks.findOneAndRemove).toHaveBeenCalledTimes(1)
        expect(res.status).toBeCalledWith(200);
        expect(res.json({ message: "Student has been deleted." }).status(200));
    });

    it("should not be able to delete when id is empty string", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params.studentId = ""

        Student.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) }));

        await studentController.deleteStudent(req, res)
        let error = new AppError('Student Id does not exist.', 404);
        expect(error.statusCode).toBe(404);
        expect(error.status).toBe('fail');
    });

  

});
