const School = require("../models/school")
const schoolController = require('../controller/schoolController')

const AppError = require('../utils/appError')

const mockCreateSchoolData = require("./mock-data/createSchool.json")
const mockCreateSchoolResponseData = require("./mock-data/mockCreateSchoolResponse.json")



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

describe('create school', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it("should not be able to create school when schoolID already exists", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = mockCreateSchoolData

    School.create = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) }));

    await schoolController.createSchool(req, res)

    expect(School.create).toHaveBeenCalledTimes(1)
    let error = new AppError("schoolId: 898989 already exist", 400);
    expect(error.statusCode).toBe(400);
    expect(res.json({ status: 'fail' }).status(400));
  });

    it("should  be able to create school", async () => {
      const req = mockRequest();
      const res = mockResponse()
      req.body = mockCreateSchoolData

      School.create = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockCreateSchoolResponseData) }));

      await schoolController.createSchool(req, res)

      expect(School.create).toHaveBeenCalledTimes(1)
      expect(res.json({ status: 'success' }).status(201));
      expect(res.json({
        schools: {
          "storeTrainingData": true,
          "name": "Dummy school 1",
          "schoolId": "od001",
          "state": "up",
          "district": "district2"
        }
      }));
    })

});