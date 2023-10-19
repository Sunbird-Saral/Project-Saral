const request = require('supertest');
const app = require('../app');
const Students = require('../models/students')
const Exams = require('../models/exams')
const Marks = require('../models/marks').marksSchema
const mockClassData = require("./mock-data/classes.json");
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

describe('Test /classes routes', () => {

    it('should return 201 when POST to /classes is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static findOne(){
                                return null
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      const response = await request(app)
        .post('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(mockClassData);

        expect(response.statusCode).toBe(201);
      
    });

    it('should return 201 when POST to /classes even when class exists', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static findOne(){
                                const res = mockClassData[0];
                                res.save =jest.fn().mockImplementation(()=>{
                                    return null
                            })
                                return res
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      const response = await request(app)
        .post('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(mockClassData);

        expect(response.statusCode).toBe(201);
      
    });

    it('should return 400 when POST to /classes causes unkown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static findOne(){
                                throw new Error("Something went wrong")
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      const response = await request(app)
        .post('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'POST')
        .send(mockClassData);

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 201 when PUT to /classes is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static findOne(){
                                return null
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      const payload = {section:mockClassData[0].section, classId:mockClassData[0].classId}      
      const response = await request(app)
        .put('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PUT')
        .send(payload);

        expect(response.statusCode).toBe(201);
      
    });

    it('should return 200 when PUT to /classes successfully replaces existing class data', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static findOne(){
                                const res = mockClassData[0];
                                res.save =jest.fn().mockImplementation(()=>{
                                    return null
                            })
                                return res 
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      const payload = {section:mockClassData[0].section, classId:mockClassData[0].classId}      
      const response = await request(app)
        .put('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PUT')
        .send(payload);

        expect(response.statusCode).toBe(200);
      
    });

    it('should return 400 when PUT to /classes has Invalide fields for update', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static findOne(){
                                return null
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      const response = await request(app)
        .put('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PUT')
        .send(mockClassData);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invaid Updates");
      
    });

    it('should return 400 when PUT to /classes causes unkwon error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static findOne(){
                                throw new Error("Some Error")
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      const payload = {section:mockClassData[0].section, classId:mockClassData[0].classId}      
      const response = await request(app)
        .put('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PUT')
        .send(payload);

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 400 when PUT to /classes causes unkwon error when saving class', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        throw new Error("Some error")
                                })
                            }
                            static findOne(){
                                return null
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      const payload = {section:mockClassData[0].section, classId:mockClassData[0].classId}      
      const response = await request(app)
        .put('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'PUT')
        .send(payload);

        expect(response.statusCode).toBe(400);
      
    });

    it('should return 200 when DELETE to /classes is success', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static deleteOne(){
                                return null
                            }
                            static findOne(){
                                return mockClassData[0]
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      Students.find = jest.fn().mockReturnValue({lean:()=>mockStudentData})
      Marks.deleteMany = jest.fn().mockReturnValue(null)
      Students.deleteMany = jest.fn().mockReturnValue({lean:()=>null})
      Exams.deleteMany = jest.fn().mockReturnValue(null)    
      const response = await request(app)
        .delete('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')
        .send({
            "classId": "3"
        })

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Class has been deleted successfully.");
      
    });

    it('should return 404 when DELETE to /classes does not exists', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static deleteOne(){
                                return null
                            }
                            static findOne(){
                                return null
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      Marks.deleteMany = jest.fn().mockReturnValue(null)
      Students.deleteMany = jest.fn().mockReturnValue(null)
      Exams.deleteMany = jest.fn().mockReturnValue(null)    
      const response = await request(app)
        .delete('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')
        .send({
            "classId": "3"
        })

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Class does not exist.");
      
    });

    it('should return 400 when DELETE to /classes does not have classId in request payload', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static deleteOne(){
                                return null
                            }
                            static findOne(){
                                return null
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      Marks.deleteMany = jest.fn().mockReturnValue(null)
      Students.deleteMany = jest.fn().mockReturnValue(null)
      Exams.deleteMany = jest.fn().mockReturnValue(null)    
      const response = await request(app)
        .delete('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')
        .send({
            
        })

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Validation error.");
      
    });

    it('should return 400 when DELETE to /classes throws unkown error', async () => {
        getClientPool.mockImplementation((req, res, next) => {
            req.dbConnection = {
                model: (ref, schema) => {
                    if(ref == 'Classes') {
                        class Classes {
                            constructor() {
                                this.save = jest.fn().mockImplementation(()=>{
                                        return null
                                })
                            }
                            static deleteOne(){
                                return null
                            }
                            static findOne(){
                                throw new Error("Some error")
                            }
                        }
                        return Classes
                    }
                    return schema
                }
            }
            next()});
      Students.find = jest.fn().mockReturnValue({lean:()=>mockStudentData[0]})
      Marks.deleteMany = jest.fn().mockReturnValue(null)
      Students.deleteMany = jest.fn().mockReturnValue(null)
      Exams.deleteMany = jest.fn().mockReturnValue(null)    
      const response = await request(app)
        .delete('/classes')
        .set('Content-Type', 'application/json')
        .set('Origin', 'https://test-api.dummy.org')
        .set('methods', 'DELETE')
        .send({
            "classId": "3"
        })

        expect(response.statusCode).toBe(400);
      
    });
});
  
  
  
  