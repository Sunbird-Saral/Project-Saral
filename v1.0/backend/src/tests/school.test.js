const User = require('../models/users');
const School = require("../models/school")
const Student = require("../models/students")
const ClassModel = require("../models/classModel")
const Mark = require("../models/marks")
const schoolController = require('../controller/schoolController')

const AppError = require('../utils/appError')
const Helper = require('../middleware/helper')

const mockClassData = require("./mock-data/mockClassData.json")
const mockSchoolData = require("./mock-data/school.json")
const mockGetAllSchool = require("./mock-data/getAllSchool.json")
const mockSignInUser = require("./mock-data/signInUserData.json");
const mockStudentData = require("../tests/mock-data/mockStudentData.json")




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
    let error = new AppError('School Id does not exist.', 400);
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
    expect(School.findOne).toHaveBeenCalledTimes(1)
  });
});

describe('update school', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  //   it("should throw 400 error if id is empty string'", async () => {
  //   const req = mockRequest();
  //   const res = mockResponse()
  //   req.params.schoolId = ''
  //   req.body = {
  //     "name": "xyz"
  //   }

  //   School.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(null) }));
  //   await schoolController.updateSchool(req, res)
  //   let error = new AppError('School Id does not exist.', 404);
  //   expect(error.statusCode).toBe(404);
  //   expect(error.status).toBe('fail');
  // });

  it("should throw 400 error if body is undefined", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = {}

    await schoolController.updateSchool(req, res)
    let error = new AppError('Validation error.', 400);
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
  });

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
    School.findOne = jest.fn().mockResolvedValue(mockSchoolData)
    Helper.lockScreenValidator = jest.fn().mockResolvedValue(undefined)

    User.generateAuthToken = jest.fn().mockResolvedValue(token)
    await schoolController.loginSchool(req, res)

    expect(User.findByCredentials).toHaveBeenCalledTimes(1)
    expect(School.findOne).toHaveBeenCalledTimes(1)
    expect(Helper.lockScreenValidator).toHaveBeenCalledTimes(1)
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

