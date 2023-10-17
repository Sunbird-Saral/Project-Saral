const request = require('supertest');
const app = require('../app');
const schoolMockdata = require('./mock-data/school.json')
const brandMockdata = require('./mock-data/mockBrandData.json')
const mockDefaultBrandData = require('./mock-data/mockDefaultBrandData.json')
const School = require("../models/school")
const Brand = require("../models/brand")

jest.mock('../db/mongoose', () => {
    return {
        getClientPool: (req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()
        },
        releaseClientPool: (req, res, next) => {
            next()
        }
    }
})

jest.mock('../middleware/auth', () => {
    return {
        auth: (req, res, next) => {
            req.school = {
                schoolId: "testId",
                state: "test"
            }
            next()
        }
    }
})

describe('Test /brand routes', () => {
    it('should throw 403 error when POST to /brand already exists', async () => {
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Brand.find = jest.fn().mockReturnValue({ lean: () => mockDefaultBrandData })
      const response = await request(app)
        .post('/brand')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(brandMockdata);

        expect(School.findOne).toHaveBeenCalledTimes(1);
        expect(Brand.find).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe("Brand already exist.");
      
    });

    it('should return 201 success when POST to /brand does not exists', async () => {
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Brand.find = jest.fn().mockReturnValue([])
        Brand.create = jest.fn().mockResolvedValue(null)
      const response = await request(app)
        .post('/brand')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(brandMockdata);

        expect(School.findOne).toHaveBeenCalledTimes(1);
        expect(Brand.find).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Brand has been created successfully .");
      
    });

    it('should return 200 success when DELETE to /brand', async () => {
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Brand.deleteOne = jest.fn().mockResolvedValue({deletedCount: 1})
      const response = await request(app)
        .delete('/brand')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(Brand.deleteOne).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Brand has been deleted successfully.");
      
    });

    it('should return 404 when DELETE to /brand does not exists', async () => {
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Brand.deleteOne = jest.fn().mockResolvedValue({deletedCount: 0})
      const response = await request(app)
        .delete('/brand')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(Brand.deleteOne).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Brand does not exist.");
      
    });

    it('should return 200 success when PUT to /brand', async () => {
        const updatePayload = {logoImage: brandMockdata.logoImage}
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Brand.update = jest.fn().mockResolvedValue({})
      const response = await request(app)
        .put('/brand')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PUT')
        .send(updatePayload);

        expect(Brand.update).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Brand has been updated successfully.");
      
    });

    it('should return 400 when PUT to /brand is not allowed for Invalid fields', async () => {
        School.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        Brand.update = jest.fn().mockResolvedValue({})
      const response = await request(app)
        .put('/brand')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PUT')
        .send(brandMockdata);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invalid Input");
      
    });
});
  
  
  
  