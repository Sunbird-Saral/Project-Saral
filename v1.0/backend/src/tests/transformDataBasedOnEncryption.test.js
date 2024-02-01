const Helper = require('../middleware/helper')
const schoolSchema = require('../models/school');
const brandSchema = require('../models/brand');
const brandMockdata = require('./mock-data/mockBrandData.json')
const schoolMockdata = require('./mock-data/school.json')
const mockAdmissionsBody = require("./mock-data/mockAdmissionsBody.json")
const encryptionUtil = require('../utils/encryptionUtils');

const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.dbConnection = {
        model: (ref, schema) => {
            return schema
        }
      }
    return req
}

describe('should encrypt data object based on set encryption type in branding', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should provide data as before if no encryption config is set in branding", async () => {
        const req = mockRequest();
        schoolSchema.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        brandSchema.findOne = jest.fn().mockResolvedValue({})
        const processedData = await Helper.transformDataBasedOnEncryption(req.dbConnection, mockAdmissionsBody, 'admissions', 'u002');
        expect(processedData).toEqual(mockAdmissionsBody)
    });

    it("should provide data encrypted if encryption config is set in branding", async () => {
        const req = mockRequest();
        schoolSchema.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        brandSchema.findOne = jest.fn().mockResolvedValue(brandMockdata)
        encryptionUtil.encrypt = jest.fn().mockReturnValue('encryptedData')
        encryptionUtil.hashWithSalt = jest.fn().mockReturnValue('hashedData')
        encryptionUtil.maskData = jest.fn().mockReturnValue('maskedData')
        const processedData = await Helper.transformDataBasedOnEncryption(req.dbConnection, mockAdmissionsBody, 'admissions', 'u002');
        expect(processedData.rollNumber).toEqual('hashedData')
        expect(processedData.studentAadharNumber).toEqual('maskedData')
        expect(processedData.studentFirstname).toEqual('encryptedData')
    });

    it("should provide even array data encrypted if encryption config is set in branding", async () => {
        const req = mockRequest();
        schoolSchema.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        brandSchema.findOne = jest.fn().mockResolvedValue(brandMockdata)
        encryptionUtil.encrypt = jest.fn().mockReturnValue('encryptedData')
        encryptionUtil.hashWithSalt = jest.fn().mockReturnValue('hashedData')
        encryptionUtil.maskData = jest.fn().mockReturnValue('maskedData')
        const processedData = await Helper.transformDataBasedOnEncryption(req.dbConnection, mockAdmissionsBody, 'admissions', 'u002');
        expect(processedData.predictionInfo[0].trainingData).toEqual('encryptedData')
    });

    it("should provide data encrypted based on default config if encryption config is not set state specific branding", async () => {
        const req = mockRequest();
        schoolSchema.findOne = jest.fn().mockResolvedValue(schoolMockdata)
        brandSchema.findOne = jest.fn((filter)=>{
            if(filter.state.$exists === false) {
                return brandMockdata //default branding data
            } else {
                return {}
            }
        })
        encryptionUtil.encrypt = jest.fn().mockReturnValue('encryptedData')
        encryptionUtil.hashWithSalt = jest.fn().mockReturnValue('hashedData')
        encryptionUtil.maskData = jest.fn().mockReturnValue('maskedData')
        const processedData = await Helper.transformDataBasedOnEncryption(req.dbConnection, mockAdmissionsBody, 'admissions', 'u002');
        expect(processedData.rollNumber).toEqual('hashedData')
        expect(processedData.studentAadharNumber).toEqual('maskedData')
        expect(processedData.studentFirstname).toEqual('encryptedData')
    });

    it("should throw an error back when an error occurs", async () => {
        const req = mockRequest();
        let error;
        schoolSchema.findOne = jest.fn().mockRejectedValue(new Error('Something went wrong'))

        try {
            await Helper.transformDataBasedOnEncryption(req.dbConnection, mockAdmissionsBody, 'admissions', 'u002');
        } catch (err) {
            error = err
        }
        expect(schoolSchema.findOne).toHaveBeenCalledTimes(1)
        expect(error.message).toEqual('Something went wrong')
    });
});