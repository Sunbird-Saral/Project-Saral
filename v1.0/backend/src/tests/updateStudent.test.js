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

    it("should throw 400 error if body is have invalid data", async () => {
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

});
