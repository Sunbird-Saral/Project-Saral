const Brand = require("../models/brand")

const brandController = require('../controller/brandController')
const mockDefaultBrandData = require('./mock-data/mockDefaultBrandData.json')
const AppError = require('../utils/appError')




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


describe('fetch default brand data ', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it("should not able to get brand data  ", async () => {
    const req = mockRequest();
    const res = mockResponse()

    Brand.find = jest.fn().mockReturnValue({ lean: () => null})
    await brandController.fetchDefaultBrandData(req, res)

    let error = new AppError('Brand does not exist.', 404);
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(Brand.find).toHaveBeenCalledTimes(1)
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

    Brand.find = jest.fn().mockReturnValue({ lean: () => mockDefaultBrandData})
    await brandController.fetchDefaultBrandData(req, res)

    expect(Brand.find).toHaveBeenCalledTimes(1)
    expect(res.json({ status: 'success' }).status(200));
  });

});
