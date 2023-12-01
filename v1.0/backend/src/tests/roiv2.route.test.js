const request = require('supertest');
const app = require('../app');
const Rois = require('../models/roiv2')
const Schools = require('../models/school')
const mockRoiData = require("./mock-data/roiv2.json")
const schoolMockData = require("./mock-data/school.json")

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

jest.mock('../middleware/helper', () => {
    return {
        getValueForNextSequence: () => {
            return "1"
        }
    }
})

describe('Test /v2/roi routes', () => {

    it('should throw 400 error when POST to /v2/roi already exists', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue(mockRoiData)
        const roiPayload = {schemaName:mockRoiData.schemaName, roi:mockRoiData.roi}
      const response = await request(app)
        .post('/v2/roi')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(roiPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("roi already exist");
      
    });

    it('should throw 400 error when POST to /v2/roi with invalid fields', async () => {
      const response = await request(app)
        .post('/v2/roi')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(mockRoiData);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invaid Input");
      
    });

    it('should return 201 when POST to /v2/roi is success', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue(null)
        Rois.create = jest.fn().mockReturnValue(mockRoiData)
        const roiPayload = {subject:mockRoiData.subject, classId:mockRoiData.classId, type:mockRoiData.type, roi:mockRoiData.roi, set:mockRoiData.set}
      const response = await request(app)
        .post('/v2/roi')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(roiPayload);

        expect(Rois.create).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(201);
      
    });

    it('should return 201 when PATCH to /v2/roi/:schemaName is success', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        Rois.update = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        const roiPayload = {roi:mockRoiData.roi}
      const response = await request(app)
        .patch('/v2/roi/test')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PATCH')
        .send(roiPayload);

        expect(Rois.update).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("ROI is updated successfully.")
      
    });

    it('should return 400 when PATCH to /v2/roi/:schemaName for non existing roiId', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => null})
        Rois.update = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        const roiPayload = {roi:mockRoiData.roi}
      const response = await request(app)
        .patch('/v2/roi/test')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PATCH')
        .send(roiPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("roi does not exist")
      
    });

    it('should return 400 when PATCH to /v2/roi/:schemaName with Invalid payload', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        Rois.update = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        const roiPayload = {}
      const response = await request(app)
        .patch('/v2/roi/test')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PATCH')
        .send(roiPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid Input .")
      
    });

    it('should return 200 when DELETE to /v2/roi/:schemaName is success', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        Rois.findOneAndRemove = jest.fn().mockReturnValue(mockRoiData)
      const response = await request(app)
        .delete('/v2/roi/test')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')

        expect(Rois.findOneAndRemove).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ROI has been deleted successfully.")
      
    });

    it('should return 400 when DELETE to /v2/roi/:schemaName for non existing roiId', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => null})
      const response = await request(app)
        .delete('/v2/roi/test')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("roi does not exist")
      
    });

    it('should return 200 when GET to /v2/roi/:schemaName is success', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue(mockRoiData)
      const response = await request(app)
        .get('/v2/roi/test')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'GET')

        expect(response.statusCode).toBe(200);
    });

    it('should return 400 when GET to /v2/roi/:schemaName for non existing roiId', async () => {
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue(null)
      const response = await request(app)
        .get('/v2/roi/test')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'GET')
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("roi does not exist")
    });
});
  
  
  
  