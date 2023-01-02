
const School = require("../models/school")
const schoolController = require('../controller/schoolController')

const AppError = require('../utils/appError')
const Helper = require('../middleware/helper')

const mockGetAllSchool = require("./mock-data/getAllSchool.json")


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

describe('get school', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })
  
  
    it("should able to get all schools  ", async () => {
      const req = mockRequest();
      const res = mockResponse()
  
  
      School.find = jest.fn().mockResolvedValue(mockGetAllSchool)
  
      await schoolController.GetSchoolsDetail(req, res)
  
      expect(School.find).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json({ status: 'success' }).status(200));
    });
  });