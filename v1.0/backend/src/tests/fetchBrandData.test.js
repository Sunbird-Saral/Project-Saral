const School = require("../models/school")
const Brand = require("../models/brand")

const brandController = require('../controller/brandController')
const schoolMockdata = require('./mock-data/school.json')
const brandMockdata = require('./mock-data/mockBrandData.json')
const mockDefaultBrandData = require('./mock-data/mockDefaultBrandData.json')
const AppError = require('../utils/appError')




const mockRequest = () => {
  const req = {}
  req.body = jest.fn().mockReturnValue(req)
  req.params = jest.fn().mockReturnValue(req)
  req.school = jest.fn().mockReturnValue(req)
  return req
}

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAxIiwic2Nob29sSWQiOiJ1MDAxIiwiaWF0IjoxNjcxMTY4OTY3fQ.jwx3xxTTP3dtJwJFUD4QAUsuBT8uemzyTpiKEIRhzKg"


describe('fetch brand data ', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it("should not able to get brand default data  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
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

    School.findOne = jest.fn().mockResolvedValue(schoolMockdata) 
    Brand.findOne = jest.fn().mockResolvedValue(null)
    Brand.find = jest.fn().mockReturnValue({ lean: () => null })
    await brandController.fetchBrandData(req, res)

    expect(School.findOne).toHaveBeenCalledTimes(1)  
    expect(Brand.findOne).toHaveBeenCalledTimes(1)
    expect(Brand.find).toHaveBeenCalledTimes(1)
    
    let error = new AppError("Brand does not exist.", 404);
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');

  });

  it("should able to get brand default data  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
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

    School.findOne = jest.fn().mockResolvedValue(schoolMockdata) 
    Brand.findOne = jest.fn().mockResolvedValue(null)
    Brand.find = jest.fn().mockReturnValue({ lean: () => mockDefaultBrandData })
    await brandController.fetchBrandData(req, res)

    expect(School.findOne).toHaveBeenCalledTimes(1)  
    expect(Brand.findOne).toHaveBeenCalledTimes(1)
    expect(Brand.find).toHaveBeenCalledTimes(1)
    
    let error = new AppError("Brand does not exist.", 404);
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');

  });

  it("should able to get brand data  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
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

    School.findOne = jest.fn().mockResolvedValue(schoolMockdata) 
    Brand.findOne = jest.fn().mockReturnValue({ lean: () => brandMockdata })
    await brandController.fetchBrandData(req, res)

    expect(School.findOne).toHaveBeenCalledTimes(1)
    expect(res.json({ status: 'success' }).status(200));
  });



});
