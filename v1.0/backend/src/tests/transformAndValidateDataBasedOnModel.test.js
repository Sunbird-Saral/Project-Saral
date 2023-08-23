const Helper = require('../middleware/helper')
const marksSchema = require('../models/marks').rawSchemaJson;
const studentMaksMockdata = require('./mock-data/savedScanData.json')

describe('should transform object data based on refrence model schema', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    it("should provide data as before if data is as per model schema", async () => {
        const processedData = Helper.transformAndValidateDataBasedOnModel(studentMaksMockdata, marksSchema);
        expect(processedData).toEqual(studentMaksMockdata)
    });

    it("should remove any extra key-value present in data not as per model schema", async () => {
        const data = {...studentMaksMockdata}
        data['inValidKey'] = 'dummy value'
        const processedData = Helper.transformAndValidateDataBasedOnModel(data, marksSchema);
        expect(processedData).not.toHaveProperty('inValidKey');
    });

    it("should remove any extra space for string type value present in data not as per model schema", async () => {
        const data = {...studentMaksMockdata}
        data['classId'] = '2 '
        const processedData = Helper.transformAndValidateDataBasedOnModel(data, marksSchema);
        expect(processedData['classId']).toEqual('2')
    });

    it("should also validate nested schema", async () => {
        studentMaksMockdata['marksInfo'] = [
            {
                "questionId": "ROLLNUMBER1_Q1",
                "obtainedMarks": "1",
                "trainingData": [],
                "predictedMarks": "1",
                "predictionConfidence": [
                    "1"
                ],
                "tags": []
            }
        ]
        const processedData = Helper.transformAndValidateDataBasedOnModel(studentMaksMockdata, marksSchema);
        expect(processedData).toEqual(studentMaksMockdata)
    });

    it("should set default value", async () => {
        const data = {...studentMaksMockdata}
        delete data.examDate
        const processedData = Helper.transformAndValidateDataBasedOnModel(data, marksSchema);
        expect(processedData['examDate']).toEqual(null)
    });
});