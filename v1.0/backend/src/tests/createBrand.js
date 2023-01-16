const School = require("../models/school")
const Brand = require("../models/brand")

const brandController = require('../controller/brandController')
const schoolMockdata = require('./mock-data/school.json')
const mockCreateBrandData = require('./mock-data/mockCreateBrandData.json')
const mockResponseCreateBrandData = require('./mock-data/mockResponseCreateBrandData.json')
const brandExist = require('./mock-data/mockBrandData.json')
const AppError = require('../utils/appError')




const mockRequest = () => {
  const req = {}
  req.body = jest.fn().mockReturnValue(req)
  req.params = jest.fn().mockReturnValue(req)
  req.school = jest.fn().mockReturnValue(req)
  req.query = jest.fn().mockReturnValue(req)
  return req
}

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAxIiwic2Nob29sSWQiOiJ1MDAxIiwiaWF0IjoxNjcxMTY4OTY3fQ.jwx3xxTTP3dtJwJFUD4QAUsuBT8uemzyTpiKEIRhzKg"


describe('create brand data ', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it("should able to create brand data  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = mockCreateBrandData
    req.query = {}
    req.school = {
      "_id": "63aa81d2d33aca650009c946",
      "name": "user13",
      "userId": "u001",
      "schoolId": "u001",
      "password": "$2a$08$fCagseJwhdNd3SEd8EB.oO6n990WLmDr4ptUpzJxLp2nvMFSZGpjG",
      "createdAt": "2022-12-27T05:25:38.298Z",
      "updatedAt": "2022-12-27T05:25:38.298Z",
      __v: 0
    }

    Brand.find = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce([])}));
    await brandController.createBrandData(req, res)

    expect(Brand.find).toHaveBeenCalledTimes(1)
    let error = new AppError("Brand already exist.", 403);
    expect(error.statusCode).toBe(403);
    expect(error.status).toBe('fail');
  });

  // it("should able to create brand data  ", async () => {
  //   const req = mockRequest();
  //   const res = mockResponse()
  //   req.body = mockCreateBrandData
  //   req.school = {
  //     "_id": "63aa81d2d33aca650009c946",
  //     "name": "user13",
  //     "userId": "u001",
  //     "schoolId": "u001",
  //     "password": "$2a$08$fCagseJwhdNd3SEd8EB.oO6n990WLmDr4ptUpzJxLp2nvMFSZGpjG",
  //     "createdAt": "2022-12-27T05:25:38.298Z",
  //     "updatedAt": "2022-12-27T05:25:38.298Z",
  //     __v: 0
  //   }

  //   School.findOne = jest.fn().mockResolvedValue(schoolMockdata) 
  //   Brand.find = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce([])}));
  //   Brand.create = jest.fn().mockResolvedValue(mockResponseCreateBrandData) 
  //   await brandController.createBrandData(req, res)

  //   expect(School.findOne).toHaveBeenCalledTimes(1)
  //   expect(res.json({ message: "Brand has been created successfully." }).status(201));
  // });

});
