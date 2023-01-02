const User = require('../models/users');
const School = require("../models/school")
const ClassModel = require("../models/classModel")
const schoolController = require('../controller/schoolController')

const AppError = require('../utils/appError')
const Helper = require('../middleware/helper')


const mockSchoolData = require("./mock-data/school.json")
const mockSignInUser = require("./mock-data/signInUserData.json");
const mockClassData = require("./mock-data/classes.json")


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


describe('login school', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  
  it("should not login when password is not correct ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = {
      "schoolId": "",
      "password": "tarento"
    }
    Helper.findByCredentials = jest.fn().mockResolvedValue(undefined)
    await schoolController.loginSchool(req, res)

    let error = new AppError('School Id or Password is not correct.', 401);
    expect(Helper.findByCredentials).toHaveBeenCalledTimes(1)
    expect(error.statusCode).toBe(401);
    expect(error.status).toBe('fail');
  });

  it("should not login when school is locked ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = {
      "schoolId": "u001",
      "password": "tarento@123"
    }
    Helper.findByCredentials = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockSignInUser) }));
    School.findOne = jest.fn().mockResolvedValue(mockSchoolData)
    Helper.lockScreenValidator = jest.fn().mockResolvedValue(undefined)

    await schoolController.loginSchool(req, res)

    let error = new AppError("State/District/School is locked for scanning" , 500);
    expect(Helper.findByCredentials).toHaveBeenCalledTimes(1)
    expect(School.findOne).toHaveBeenCalledTimes(1)
    expect(error.statusCode).toBe(500);
  });

  it("should able to login to school  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = {
      "userId": "u001",
      "password": "tarento@123",
      "classes": true
    }

    Helper.findByCredentials = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockSignInUser) }));
    School.findOne = jest.fn().mockResolvedValue(mockSchoolData)
    Helper.lockScreenValidator = jest.fn().mockResolvedValue(undefined)

    User.generateAuthToken = jest.fn().mockResolvedValue(token)
    ClassModel.findClassesBySchools = jest.fn().mockResolvedValue(mockClassData)

    await schoolController.loginSchool(req, res)

    expect(Helper.findByCredentials).toHaveBeenCalledTimes(1)
    expect(School.findOne).toHaveBeenCalledTimes(1)
    expect(Helper.lockScreenValidator).toHaveBeenCalledTimes(1)
    expect(User.generateAuthToken).toHaveBeenCalledTimes(1)
    expect(ClassModel.findClassesBySchools).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json({ status: 'success' }).status(200));
  });

});

