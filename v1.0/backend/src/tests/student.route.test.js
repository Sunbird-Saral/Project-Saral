const request = require('supertest');
const app = require('../app');
const Students = require("../models/students")
const Marks = require("../models/marks").marksSchema
const mockStudentData = require("./mock-data/student.json");
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

describe('Test /student routes', () => {
    it('should throw 400 error when POST to /student already exists', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Students') {
                        return function Students() {
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
        .post('/student')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(mockStudentData[0]);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("duplicate: od001 already exist");
      
    });

    it('should throw 400 error when POST to /student fails with unkown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Students') {
                        return function Students() {
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
        .post('/student')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(mockStudentData[0]);

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 201 when POST to /student is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Students') {
                        return function Students() {
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
        .post('/student')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(mockStudentData[0]);

        expect(response.statusCode).toBe(201);
      
    });

    it('should return students data when POST to /fetchStudentsByQuery is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
      Students.find = jest.fn().mockReturnValue(mockStudentData[0])
      const response = await request(app)
        .post('/fetchStudentsByQuery')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send({
            "classId": "2",
            "className": "Class-2",
            "section": "A"
        });

        expect(response.body).toStrictEqual(mockStudentData[0]);
      
    });

    it('should return students data when POST to /fetchStudentsByQuery with only className', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
      Students.find = jest.fn().mockReturnValue(mockStudentData[0])
      const response = await request(app)
        .post('/fetchStudentsByQuery')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send({
            "className": "Class-2"
        });

        expect(response.body).toStrictEqual(mockStudentData[0]);
      
    });

    it('should return 500 when POST to /fetchStudentsByQuery fails with unkown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    console.log('inside ref', ref)
                    return schema
                }
            }
            next()});
      Students.find = jest.fn().mockImplementation(()=>{throw new Error("some error")})
      const response = await request(app)
        .post('/fetchStudentsByQuery')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send({
            "classId": "2",
            "className": "Class-2"
        });

        expect(response.statusCode).toBe(500);
      
    });

    it('should return 200 when DELETE to /student/:studentId is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Students.findOne = jest.fn().mockReturnValue(mockStudentData[0])
        Students.deleteOne = jest.fn().mockReturnValue({ lean: () => null})
        Marks.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
      const response = await request(app)
        .delete('/student/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Student has been deleted.")
      
    });

    it('should return 404 when DELETE to /student/:studentId for non existing schoolId', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
            Students.findOne = jest.fn().mockReturnValue(null)
      const response = await request(app)
        .delete('/student/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Student Id does not exist.")
      
    });

    it('should return 400 when DELETE to /student/:studentId fails with unkown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Students.findOne = jest.fn().mockReturnValue(mockStudentData[0])
        Students.deleteOne = jest.fn().mockReturnValue({ lean: () => {throw new Error("some error")}})
        Marks.findOneAndRemove = jest.fn().mockReturnValue({ lean: () => null})
      const response = await request(app)
        .delete('/student/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 200 when PATCH to /student/:studentId is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        const patchPayload = {name: mockStudentData[0].name, classId: mockStudentData[0].classId}
        Students.findOne = jest.fn().mockReturnValue({ lean: () => mockStudentData[0]})
        Students.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/student/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PATCH')
        .send(patchPayload)

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Student has been updated.")
      
    });

    it('should return 404 when PATCH to /student/:studentId for non existing schoolId', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        const patchPayload = {name: mockStudentData[0].name, classId: mockStudentData[0].classId}
        Students.findOne = jest.fn().mockReturnValue({ lean: () => null})
        Students.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/student/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PATCH')
        .send(patchPayload)

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Student Id does not exist.")
      
    });

    it('should return 400 when PATCH to /student/:studentId not allowed for certain fields', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Students.findOne = jest.fn().mockReturnValue({ lean: () => mockStudentData[0]})
        Students.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/student/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PATCH')
        .send(mockStudentData[0])

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invaid Updates")
      
    });

    it('should return 400 when PATCH to /student/:studentId fails missing payload', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        Students.findOne = jest.fn().mockReturnValue({ lean: () => mockStudentData[0]})
        Students.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/student/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PATCH')
        .send({})

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Validation error.")
      
    });

    it('should return 400 when PATCH to /student/:studentId fails with unknown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    return schema
                }
            }
            next()});
        const patchPayload = {name: mockStudentData[0].name, classId: mockStudentData[0].classId}
        Students.findOne = jest.fn().mockReturnValue({ lean: () => {throw new Error("some error")}})
        Students.updateOne = jest.fn().mockReturnValue({ lean: () => {return {exec:()=>null}}})
      const response = await request(app)
        .patch('/student/1')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PATCH')
        .send(patchPayload)

        expect(response.statusCode).toBe(400);
      
    });
});
  
  
  
  