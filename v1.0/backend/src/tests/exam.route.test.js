const request = require('supertest');
const app = require('../app');
let Exams = require("../models/exams")
const mockExamData = require("./mock-data/mockGetExamData.json")


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

describe('Test /exam routes', () => {
    it('should throw 400 error when POST to /exam already exists', async () => {
        Exams.find = jest.fn().mockReturnValue([mockExamData])
      const response = await request(app)
        .post('/exam')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send([mockExamData]);

        expect(Exams.find).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Exam Id should be unique.");
      
    });

    it('should return 400 when POST to /exam fails with unknown error when inserting exams one by one', async () => {
        Exams.find = jest.fn().mockReturnValue([])
        Exams.insertMany = jest.fn().mockReturnValue(null)
      const response = await request(app)
        .post('/exam')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send([mockExamData]);

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 400 when POST to /exam fails with unknown error', async () => {
        Exams.find = jest.fn().mockReturnValue([])
        Exams.insertMany = jest.fn().mockImplementation(()=>{
            let err = new Error("Something went wrong")
            throw err;
    })
      const response = await request(app)
        .post('/exam')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send([mockExamData]);

        expect(response.statusCode).toBe(400);
      
    });

    it('should throw 404 error when GET to /examByClass/:classId no records found', async () => {
        Exams.find = jest.fn().mockReturnValue({ lean: () => []})
      const response = await request(app)
        .get('/examByClass/2')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'GET')

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Exam does not exist for 2");
      
    });

    it('should return 200 when GET to /examByClass/:classId is success', async () => {
        Exams.find = jest.fn().mockReturnValue({ lean: () => [mockExamData]})
      const response = await request(app)
        .get('/examByClass/2')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'GET')

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([mockExamData])
      
    });

    it('should return 400 when GET to /examByClass/:classId fails with unknown error', async () => {
        Exams.find = jest.fn().mockReturnValue({ lean: () => {throw new Error("some error")}})
      const response = await request(app)
        .get('/examByClass/2')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'GET')

        expect(response.statusCode).toBe(400);
      
    });

    it('should throw 404 error when DELETE to /exam/:examId no records found', async () => {
        Exams.findOneAndDelete = jest.fn().mockReturnValue({ lean: () => null})
      const response = await request(app)
        .delete('/exam/3')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Exam Id does not exist.");
      
    });

    it('should return 200 error when DELETE to /exam/:examId is success', async () => {
        Exams.findOneAndDelete = jest.fn().mockReturnValue({ lean: () => mockExamData})
      const response = await request(app)
        .delete('/exam/3')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Exam has been deleted successfully.");
      
    });

    it('should throw 400 error when DELETE to /exam/:examId fails with unknown error', async () => {
        Exams.findOneAndDelete = jest.fn().mockReturnValue({ lean: () => {throw new Error("some error")}})
      const response = await request(app)
        .delete('/exam/3')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 200 error when PATCH to /exam/:examId is success', async () => {
        Exams.find = jest.fn().mockReturnValue({ lean: () => [mockExamData]})
        Exams.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec: ()=>{}}}})
        const updateExam = { subject: mockExamData.subject}
      const response = await request(app)
        .patch('/exam/3')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(updateExam)

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Exam has been updated successfully.");
      
    });

    it('should throw 404 error when PATCH to /exam/:examId for non existing record', async () => {
        Exams.find = jest.fn().mockReturnValue({ lean: () => []})
        const updateExam = { subject: mockExamData.subject}
      const response = await request(app)
        .patch('/exam/3')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(updateExam)

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Exam Id does not exist.");
      
    });

    it('should throw 400 error when PATCH to /exam/:examId for Invaild Updates', async () => {
        Exams.find = jest.fn().mockReturnValue({ lean: () => []})
      const response = await request(app)
        .patch('/exam/3')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(mockExamData)

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invaild Updates");
      
    });

    it('should throw 400 error when PATCH to /exam/:examId is success', async () => {
        Exams.find = jest.fn().mockReturnValue({ lean: () => {throw new Error("some error")}})
        Exams.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec: ()=>{}}}})
        const updateExam = { subject: mockExamData.subject}
      const response = await request(app)
        .patch('/exam/3')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(updateExam)

        expect(response.statusCode).toBe(400);
      
    });
});
  
  
  
  