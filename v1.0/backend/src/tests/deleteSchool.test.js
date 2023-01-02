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


describe('delete school', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })
  
    it("should able to delete school", async () => {
      const req = mockRequest();
      const res = mockResponse()
      req.params.schoolId = "u001"
  
      School.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockSchoolData) }));
  
      School.deleteOne = jest.fn().mockResolvedValue(null)
      ClassModel.findOneAndRemove = jest.fn().mockResolvedValue(null)
      Student.findOneAndRemove = jest.fn().mockResolvedValue(null)
      Mark.findOneAndRemove = jest.fn().mockResolvedValue(null)
  
      await schoolController.deleteSchool(req, res)
  
      expect(School.findOne).toHaveBeenCalledTimes(1)
      expect(School.deleteOne).toHaveBeenCalledTimes(1)
      expect(ClassModel.findOneAndRemove).toHaveBeenCalledTimes(1)
      expect(Student.findOneAndRemove).toHaveBeenCalledTimes(1)
      expect(Mark.findOneAndRemove).toHaveBeenCalledTimes(1)
      expect(res.status).toBeCalledWith(200);
    });
  
  
    it("should not be able to delete school", async () => {
      const req = mockRequest();
      const res = mockResponse()
      req.params.schoolId = ""
  
      School.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) }));
  
      await schoolController.deleteSchool(req, res)
      let error = new AppError('School Id does not exist.', 404);
      expect(error.statusCode).toBe(404);
      expect(error.status).toBe('fail');
      expect(School.findOne).toHaveBeenCalledTimes(1)
    });
  });