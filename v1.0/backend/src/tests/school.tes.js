const authController = require('../controller/authController');
const User = require('../models/users');
const auth = require("../utils/commonUtils")
const loginMockData = require("./mock-data/login.json")

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

const mockCreateUser = {
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWEyZWNiYjVjMTBiNjJjNDRmNmZlNCIsImlhdCI6MTYyOTEwNTg2OCwiZXhwIjoxNjM2ODgxODY4fQ.Vi1wj6MlEk3C850C8lZKmMkoLjDd6pkTI7MszcIw7ZQ",
  "data": {
    "user": {
      "role": "user",
      "active": true,
      "_id": "611a2ecbb5c10b62c44f6fe4",
      "name": "user",
      "email": "apurvabisht02@gmail.com",
      "__v": 0
    }
  }
}

const mockNewUser = {
  role: 'user',
  active: true,
  _id: "611cdc116a07be47c4a1a938",
  name: 'user',
  email: 'test118w71@gmail.com',
  password: '$2a$12$xK5zvwgNExIr2I/nCWr20.EHau2PzVb8CLkDU2GrxxDLMATmpuDSe',
  __v: 0
}


describe('create user', () => {
  jest.setTimeout(100000000);

  it("should create a user  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = createMockData

    User.create = jest.fn().mockResolvedValue(mockNewUser)
    auth.createSendToken  = jest.fn().mockResolvedValue(mockCreateUser)
    await authController.signup(req, res)
    expect(User.create).toHaveBeenCalledTimes(1)
    expect(auth.createSendToken).toHaveBeenCalledTimes(1)
    // expect(res.status).toHaveBeenCalledWith(201);
    //   expect(res.json).toEqual(mockGetUser)
  });
});

const mockSignInUser =  {
    "name": "user2",
    "userId": "99897896",
    "schoolId": "u002",
    "password": "tarento@123"
}

const mockSignIn = {
        "school": {
            "storeTrainingData": true,
            "name": "Dummy school 1",
            "schoolId": "u001",
            "state": "up",
            "district": "district1",
            "autoSync": false,
            "autoSyncFrequency": 600000,
            "tags": true,
            "supportEmail": "abc@gmail.com , xyz@gmail.com",
            "offlineMode": true,
            "userId": "98616789"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ODYxNjc4OSIsInNjaG9vbElkIjoidTAwMSIsImlhdCI6MTY2OTY5ODMzN30.YYRNTcMjEDKZWd2KBetr_FUL7nznhFrnZ3CRXV81iXQ",
        "classes": []
}

describe('login user', () => {
  jest.setTimeout(100000000);

  it("should able to login when email and password is provided  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = loginMockData

    User.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockSignInUser)}));

    auth.createSendToken  = jest.fn().mockResolvedValue(mockSignIn)
    await authController.signin(req, res)
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(auth.createSendToken).toHaveBeenCalledTimes(1)
    // expect(res.status).toHaveBeenCalledWith(201);
  });
});


const mockUpdatedPassword = {
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRlN2Y4MzNmMWM1MDU0Yzc5ODg5MSIsImlhdCI6MTYyOTM1OTg5NCwiZXhwIjoxNjM3MTM1ODk0fQ.VnQ_cGvy3tcsCzUZ_a1Mjh4Yh-YedtI6Y_TITIkQ48M",
  "data": {
      "user": {
          "_id": "611de7f833f1c5054c798891",
          "passwordChangedAt": "2021-08-19T07:58:12.731Z"
      }
  }
}

describe('update Password', () => {
  jest.setTimeout(100000000);

  it("should able to update password when old and new passowrd is provided  ", async () => {
    const req = mockRequest();
    const res = mockResponse()
    req.body = {
      "passwordCurrent":"test12345678",
      "password":"test1234",
      "passwordConfirm":"test1234"
  }

    User.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce({
      _id: "611e1276bbfc394438ef144a",
      password: '$2a$12$w1XT9Apn9z67QnbO7NyMsOdVedOHzguT7glyS8mgFdDBMNtUwKv1i'
    })}));

    auth.createSendToken  = jest.fn().mockResolvedValue(mockSignIn)
    await authController.signin(req, res)
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(auth.createSendToken).toHaveBeenCalledTimes(1)
    // expect(res.status).toHaveBeenCalledWith(201);
  });
});

const nobody = {
  "status": "error",
  "error": {
      "statusCode": 500,
      "status": "error"
  },
  "message": "Illegal arguments: undefined, string",
  "stack": "Error: Illegal arguments: undefined, string\n    at _async (C:\\Users\\test\\Desktop\\tour\\tours\\node_modules\\bcryptjs\\dist\\bcrypt.js:286:46)\n    at C:\\Users\\test\\Desktop\\tour\\tours\\node_modules\\bcryptjs\\dist\\bcrypt.js:307:17\n    at new Promise (<anonymous>)\n    at Object.bcrypt.compare (C:\\Users\\test\\Desktop\\tour\\tours\\node_modules\\bcryptjs\\dist\\bcrypt.js:306:20)\n    at model.userSchema.methods.correctPassword (C:\\Users\\test\\Desktop\\tour\\tours\\models\\userModels.js:72:23)\n    at C:\\Users\\test\\Desktop\\tour\\tours\\controller\\authController.js:166:20\n    at processTicksAndRejections (internal/process/task_queues.js:95:5)"
}










// / const request = require('supertest')
// const jwt = require('jsonwebtoken')
// const mongoose = require('mongoose')
// const app = require('../app')
// const User = require('../models/users')

// beforeEach( async () => {await User.deleteMany()})
// test('Should signup a new user', async () => {
// const response = await request(app).post('/school/login')
// .send({
// name: "user1",
// schoolId: "u001",
// userId:"u001",
// password:"tarento@123"
// })
// .expect(201)
// console.log(response)
// //Assert that the database was changed correctly
// const user = await User.findByCredentials(response.body.userId,response.body.password)
// expect(response.body).toMatchObject({
// user:{
//   userId:"u001",
//   password:"tarento@123"
// },
// token: user.tokens[0].token
// })
// expect(user.password).not.toBe('1234567890')
// })

// const User = require('../models/users');
// const loginMockData = require("../../tests/mock-data/login.json")
// console.log("hiiiiiiiiii")
// const mockRequest = () => {
//   const req = {}
//   req.body = jest.fn().mockReturnValue(req)
//   req.params = jest.fn().mockReturnValue(req)
//   return req
// }

// const mockResponse = () => {
//   const res = {}
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   return res
// }

// const mockSignInUser = {
//   role: 'user',
//   _id: "611de7f833f1c5054c798891",
//   name: 'user',
//   email: 'test118w7945@gmail.com',
//   password: '$2a$12$HJR5LWDDTJEPl6lHA/g5guBm2bnrO0PZTPMPafY.oWFCbrC0gzA7W',
//   __v: 0
// }

// const mockSignIn = {
//   "status": "success",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRlN2Y4MzNmMWM1MDU0Yzc5ODg5MSIsImlhdCI6MTYyOTM1NDYyNywiZXhwIjoxNjM3MTMwNjI3fQ._I4vB3WNg6i1_VZt38QGHx0LaXddEbp63BReVYD4zTc",
//   "data": {
//       "user": {
//           "role": "user",
//           "_id": "611de7f833f1c5054c798891",
//           "name": "user",
//           "email": "test118w7945@gmail.com",
//           "__v": 0
//       }
//   }
// }

// // describe('login user', () => {
// //   jest.setTimeout(100000000);

// //   it("should able to login when userid and password is provided  ", async () => {
// //     const req = mockRequest();
// //     const res = mockResponse()
// //     req.body = loginMockData

// //     User.findByCredentials = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockSignInUser)}));
// //     console.log("insideeeeeeeeeee")
// //     // auth.createSendToken  = jest.fn().mockResolvedValue(mockSignIn)
// //     // await authController.signin(req, res)
// //     // expect(User.findOne).toHaveBeenCalledTimes(1)
// //     // expect(auth.createSendToken).toHaveBeenCalledTimes(1)
// //     // expect(res.status).toHaveBeenCalledWith(201);
// //   });
// // });

// test("should login existing user",async()=>{
//   const response = await request(app)
//   .post('/user/login')
//   .send({
//     schoolId: "u001",
//     password: "tarento@123"
//   }).except(200)
//   const user = await User.findByCredentials(loginMockData)
//   except(response.body.token)
// })

// const nobody = {
//   "status": "error",
//   "error": {
//       "statusCode": 500,
//       "status": "error"
//   },
//   "message": "Illegal arguments: undefined, string",
//   "stack": "Error: Illegal arguments: undefined, string\n    at _async (C:\\Users\\test\\Desktop\\tour\\tours\\node_modules\\bcryptjs\\dist\\bcrypt.js:286:46)\n    at C:\\Users\\test\\Desktop\\tour\\tours\\node_modules\\bcryptjs\\dist\\bcrypt.js:307:17\n    at new Promise (<anonymous>)\n    at Object.bcrypt.compare (C:\\Users\\test\\Desktop\\tour\\tours\\node_modules\\bcryptjs\\dist\\bcrypt.js:306:20)\n    at model.userSchema.methods.correctPassword (C:\\Users\\test\\Desktop\\tour\\tours\\models\\userModels.js:72:23)\n    at C:\\Users\\test\\Desktop\\tour\\tours\\controller\\authController.js:166:20\n    at processTicksAndRejections (internal/process/task_queues.js:95:5)"
// }
