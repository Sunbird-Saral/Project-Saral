const Student = require("../models/students")
const studentController = require('../controller/studentController')
const studentMockdata = require('../tests/mock-data/student.json')
const AppError = require('../utils/appError')
const Helper = require('../middleware/helper')



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

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAxIiwic2Nob29sSWQiOiJ1MDAxIiwiaWF0IjoxNjcxMTY4OTY3fQ.jwx3xxTTP3dtJwJFUD4QAUsuBT8uemzyTpiKEIRhzKg"


// describe('fetch student and exam data ', () => {
//   beforeEach(() => {
//     jest.useFakeTimers()
//   })


//   it("should able to get student data  ", async () => {
//     const req = mockRequest();
//     const res = mockResponse()
   
//     req.body = {
//       "classId": "2"
//     }

//     Helper.lockScreenValidator  = jest.fn().mockResolvedValue(undefined)
//     Student.find = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(studentMockdata)}));
   
//     await studentController.fetchStudentsandExams(req, res)
    
//     expect(Helper.lockScreenValidator ).toHaveBeenCalledTimes(1)
//     expect(Student.find).toHaveBeenCalledTimes(1)
   
//   });

// });
