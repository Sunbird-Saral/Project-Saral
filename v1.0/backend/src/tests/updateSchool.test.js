const User = require('../models/users');
const School = require("../models/school")
const Student = require("../models/students")
const ClassModel = require("../models/classModel")
const Mark = require("../models/marks")
const schoolController = require('../controller/schoolController')

const AppError = require('../utils/appError')
const Helper = require('../middleware/helper')

const mockSchoolData = require("./mock-data/school.json")


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


describe('update school', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })
  
    it("should throw 400 error if body is have invalid data", async () => {
      const req = mockRequest();
      const res = mockResponse()
      req.body = {
        "names": "xyz"
      }
  
      await schoolController.updateSchool(req, res)
      let error = new AppError('Invalid updates.', 400);
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail');
    });
  
    it("should not be able to update when id is empty string", async () => {
      const req = mockRequest();
      const res = mockResponse()
      req.params.schoolId = ""
  
      School.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) }));
  
      await schoolController.updateSchool(req, res)
      let error = new AppError('School Id does not exist.', 404);
      expect(error.statusCode).toBe(404);
      expect(error.status).toBe('fail');
    });
  
  
    it("should update data when id is correct", async () => {
      const req = mockRequest();
      const res = mockResponse()
      req.params.schoolId = "u001"
      req.body = {
        "name": "xyz"
      }
  
      School.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockSchoolData) }));
      School.updateOne = jest.fn().mockResolvedValue(
        { n: 1, nModified: 1, ok: 1 })
  
      await schoolController.updateSchool(req, res)
  
      expect(School.findOne).toHaveBeenCalledTimes(1);
      expect(School.updateOne).toHaveBeenCalledTimes(1);
      expect(res.status).toBeCalledWith(200);
    });
  
  });