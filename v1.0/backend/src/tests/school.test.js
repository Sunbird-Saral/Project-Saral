const User = require('../models/users');
const School = require("../models/school")
const auth = require("../utils/commonUtils")
const schoolController = require('../controller/schoolController')
const AppError = require('../utils/appError')
const Helper = require('../middleware/helper')

const loginMockData = require("./mock-data/login.json")
const mockSchoolData = require("./mock-data/school.json")
const mockGetAllSchool = require("./mock-data/getAllSchool.json")
const mockSignInUser = require("./mock-data/signInUserData.json")



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
  });
});

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAxIiwic2Nob29sSWQiOiJ1MDAxIiwiaWF0IjoxNjcxMTY4OTY3fQ.jwx3xxTTP3dtJwJFUD4QAUsuBT8uemzyTpiKEIRhzKg"


describe('login school', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })


  it("should able to login to school  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = {
      "userId": "u001",
      "password": "tarento@123"
    }

    User.findByCredentials = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockSignInUser) }));
    School.findOne  = jest.fn().mockResolvedValue(mockSchoolData)
    Helper.lockScreenValidator  = jest.fn().mockResolvedValue(undefined)
    
    User.generateAuthToken  = jest.fn().mockResolvedValue(token)
    await schoolController.loginSchool(req, res)
    
    expect(User.findByCredentials).toHaveBeenCalledTimes(1)
    expect(School.findOne).toHaveBeenCalledTimes(1)
    expect(Helper.lockScreenValidator ).toHaveBeenCalledTimes(1)
    expect(User.generateAuthToken).toHaveBeenCalledTimes(1)
  });

  it("should not login when password is not correct ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = {
      "schoolId": "u001",
      "password": "tare"
    }
    User.findByCredentials = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) }));

    await schoolController.loginSchool(req, res)
    let error = new AppError('School Id or Password is not correct.', 422);
    expect(error.statusCode).toBe(422);
    expect(error.status).toBe('fail');
  });
});
