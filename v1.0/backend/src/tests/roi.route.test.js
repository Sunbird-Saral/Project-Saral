const request = require('supertest');
const app = require('../app');
const Exams = require('../models/exams')
const Rois = require('../models/roi')
const Schools = require('../models/school')
const mockRoiData = require("./mock-data/roi.json")
const mockExamData = require("./mock-data/mockGetExamData.json")
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

describe('Test /roi routes', () => {
    it('should throw 400 error when POST to /roi for non existing examId', async () => {
        Exams.findOne = jest.fn().mockReturnValue(null)
        const roiPayload = {subject:mockRoiData.subject, classId:mockRoiData.classId, type:mockRoiData.type, roi:mockRoiData.roi, set:mockRoiData.set}
      const response = await request(app)
        .post('/roi')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(roiPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("examId does not exist");
      
    });

    it('should throw 400 error when POST to /roi already exists', async () => {
        Exams.findOne = jest.fn().mockReturnValue(mockExamData)
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue(mockRoiData)
        const roiPayload = {subject:mockRoiData.subject, classId:mockRoiData.classId, type:mockRoiData.type, roi:mockRoiData.roi, set:mockRoiData.set}
      const response = await request(app)
        .post('/roi')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(roiPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("roiId already exist");
      
    });

    it('should throw 400 error when POST to /roi with invalid fields', async () => {
      const response = await request(app)
        .post('/roi')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(mockRoiData);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invaid Input");
      
    });

    it('should return 201 when POST to /roi is success', async () => {
        Exams.findOne = jest.fn().mockReturnValue(mockExamData)
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue(null)
        Rois.create = jest.fn().mockReturnValue(mockRoiData)
        const roiPayload = {subject:mockRoiData.subject, classId:mockRoiData.classId, type:mockRoiData.type, roi:mockRoiData.roi, set:mockRoiData.set}
      const response = await request(app)
        .post('/roi')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(roiPayload);

        expect(Rois.create).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(201);
      
    });

    it('should return 201 when PATCH to /roi/:examId is success', async () => {
        Exams.findOne = jest.fn().mockReturnValue({ lean: () => mockExamData})
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        Rois.update = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        const roiPayload = {roi:mockRoiData.roi}
      const response = await request(app)
        .patch('/roi/2')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(roiPayload);

        expect(Rois.update).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("ROI is updated successfully.")
      
    });

    it('should return 404 when PATCH to /roi/:examId for non existing roiId', async () => {
        Exams.findOne = jest.fn().mockReturnValue({ lean: () => mockExamData})
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => null})
        Rois.update = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        const roiPayload = {roi:mockRoiData.roi}
      const response = await request(app)
        .patch('/roi/2')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(roiPayload);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("ROI Id does not exist.")
      
    });

    it('should return 400 when PATCH to /roi/:examId with Invalid payload', async () => {
        Exams.findOne = jest.fn().mockReturnValue({ lean: () => mockExamData})
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => null})
        Rois.update = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        const roiPayload = {}
      const response = await request(app)
        .patch('/roi/2')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(roiPayload);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid Input .")
      
    });

    it('should return 200 when DELETE to /roi/:examId is success', async () => {
        Exams.findOne = jest.fn().mockReturnValue({ lean: () => mockExamData})
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => mockRoiData})
        Rois.findOneAndRemove = jest.fn().mockReturnValue(mockRoiData)
      const response = await request(app)
        .delete('/roi/2')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(Rois.findOneAndRemove).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ROI has been deleted successfully.")
      
    });

    it('should return 404 when DELETE to /roi/:examId for non existing roiId', async () => {
        Exams.findOne = jest.fn().mockReturnValue({ lean: () => mockExamData})
        Schools.findOne = jest.fn().mockReturnValue(schoolMockData)
        Rois.findOne = jest.fn().mockReturnValue({ lean: () => null})
      const response = await request(app)
        .delete('/roi/2')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("ROI does not exist.")
      
    });
});
  
  
  
  