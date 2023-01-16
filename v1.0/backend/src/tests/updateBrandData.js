const School = require("../models/school")
const Brand = require("../models/brand")

const brandController = require('../controller/brandController')
const schoolMockdata = require('./mock-data/school.json')
const mockUpdateBrandData = require('./mock-data/mockUpdateBrandData.json')
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


describe('update brand data ', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it("should not able to update brand data", async () => {
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
    req.body ={
        "themeColor1s": "#F09E29"
    }

    await brandController.updateBrandData(req, res)

    let error = new AppError('Invaid Input', 400);
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
  });

  it("should able to update brand data  ", async () => {
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

    req.body = mockUpdateBrandData

    School.findOne = jest.fn().mockResolvedValue(schoolMockdata) 
   
    Brand.update = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce( { n: 0, nModified: 0, ok: 1 }) }));
   
    await brandController.updateBrandData(req, res)

    expect(School.findOne).toHaveBeenCalledTimes(1)  
    expect(Brand.update).toHaveBeenCalledTimes(1)
    expect(res.json({ status: 'success' }).status(200));
    expect(res.json({ message: "Brand has been updated successfully." }).status(200));
  });


  it("should not able to update brand data  ", async () => {
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

    req.body = mockUpdateBrandData

    School.findOne = jest.fn().mockResolvedValue(schoolMockdata) 
    Brand.update = jest.fn().mockResolvedValue({}) 

    await brandController.updateBrandData(req, res)

    expect(School.findOne).toHaveBeenCalledTimes(1)  
    expect(Brand.update).toHaveBeenCalledTimes(1)
    let error = new AppError('Brand has not been updated successfully', 404);
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
  });
});
