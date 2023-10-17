const request = require('supertest');
const app = require('../app');
const Schools = require('../models/school')
const Classes = require("../models/classes")
const Students = require("../models/students")
const Marks = require("../models/marks").marksSchema
const mockSchoolData = require("./mock-data/school.json");
const {getClientPool} = require("../db/mongoose")

jest.mock('../db/mongoose', () => {
    return {
        getClientPool: jest.fn(),
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

describe('Test /schools routes', () => {
    it('should throw 401 error when POST to /schools/create already exists', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Schools') {
                        return function School() {
                            this.save = jest.fn().mockImplementation(()=>{
                                    let err = new Error()
                                    err = {message:" duplicate key error ", keyValue:{"duplicate":"od001"}}
                                    throw err;
                            })
                        }
                    }
                    return schema
                }
            }
            next()});
      const response = await request(app)
        .post('/schools/create')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(mockSchoolData);

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("duplicate: od001 already exist");
      
    });

    it('should throw 400 error when POST to /schools/create fails with unkown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Schools') {
                        return function School() {
                            this.save = jest.fn().mockImplementation(()=>{
                                    let err = new Error("Something went wrong")
                                    throw err;
                            })
                        }
                    }
                    return schema
                }
            }
            next()});
      const response = await request(app)
        .post('/schools/create')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(mockSchoolData);

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 201 when POST to /schools/create is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Schools') {
                        return function School() {
                            this.save = jest.fn().mockImplementation(()=>{
                                    return null
                            })
                        }
                    }
                    return schema
                }
            }
            next()});
      const response = await request(app)
        .post('/schools/create')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'POST')
        .send(mockSchoolData);

        expect(response.statusCode).toBe(201);
      
    });

    it('should return 200 when GET to /schools is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Schools.find = jest.fn().mockReturnValue([mockSchoolData])
      const response = await request(app)
        .get('/schools')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'GET')

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body)).toStrictEqual(["schools"])
      
    });

    it('should return 200 when DELETE to /schools/:schoolId is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Schools.findOne = jest.fn().mockReturnValue(mockSchoolData)
        Schools.deleteOne = jest.fn().mockReturnValue({ lean: () => null})
        Classes.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
        Students.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
        Marks.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
      const response = await request(app)
        .delete('/schools/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("School has been deleted.")
      
    });

    it('should return 404 when DELETE to /schools/:schoolId for non existing schoolId', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Schools.findOne = jest.fn().mockReturnValue(null)
        Schools.deleteOne = jest.fn().mockReturnValue({ lean: () => null})
        Classes.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
        Students.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
        Marks.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
      const response = await request(app)
        .delete('/schools/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("School Id does not exist.")
      
    });

    it('should return 400 when DELETE to /schools/:schoolId fails with unknown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Schools.findOne = jest.fn().mockReturnValue(mockSchoolData)
        Schools.deleteOne = jest.fn().mockReturnValue({ lean: () => {throw new Error("some error")}})
        Classes.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
        Students.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
        Marks.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
      const response = await request(app)
        .delete('/schools/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 200 when PATCH to /schools/:schoolId is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        const patchPayload = {name: mockSchoolData.name, state: mockSchoolData.state}
        Schools.findOne = jest.fn().mockReturnValue({ lean: () => mockSchoolData})
        Schools.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/schools/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(patchPayload)

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("School has been updated.")
      
    });

    it('should return 404 when PATCH to /schools/:schoolId for non existing schoolId', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        const patchPayload = {name: mockSchoolData.name, state: mockSchoolData.state}
        Schools.findOne = jest.fn().mockReturnValue({ lean: () => null})
        Schools.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/schools/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(patchPayload)

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("School Id does not exist.")
      
    });

    it('should return 400 when PATCH to /schools/:schoolId not allowed for certain fields', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Schools.findOne = jest.fn().mockReturnValue({ lean: () => mockSchoolData})
        Schools.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/schools/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(mockSchoolData)

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invaid Updates")
      
    });

    it('should return 400 when PATCH to /schools/:schoolId fails with unknown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        const patchPayload = {name: mockSchoolData.name, state: mockSchoolData.state}
        Schools.findOne = jest.fn().mockReturnValue({ lean: () => {throw new Error("some error")}})
        Schools.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/schools/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'http://test-api.org')
        .set('methods', 'PATCH')
        .send(patchPayload)

        expect(response.statusCode).toBe(400);
      
    });
});
  
  
  
  