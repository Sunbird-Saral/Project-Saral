const Counter = require("../models/counter")
const Helper = require('../middleware/helper')
const counterMockdata = require('./mock-data/counters.json')

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

describe('get value for next sequence ', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should able to get value for next sequence of examId", async () => {
        const req = mockRequest();
        Counter.findOneAndUpdate = jest.fn().mockResolvedValue(counterMockdata)
        await Helper.getValueForNextSequence(req.dbConnection, "examId")
        expect(Counter.findOneAndUpdate).toHaveBeenCalledTimes(1)
    });

    it("should throw an error back when an error occurs", async () => {
        const req = mockRequest();
        let error;
        Counter.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Something went wrong'))

        try {
        await Helper.getValueForNextSequence(req.dbConnection, "examId")
        } catch (err) {
            error = err
        }
        expect(Counter.findOneAndUpdate).toHaveBeenCalledTimes(1)
        expect(error.message).toEqual('Something went wrong')
    });

});