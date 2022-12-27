const reviewController = require('../controller/reviewcontroller');
const Student = require('../models/students');
const createmockdata = require("../tests/mock-data/review-data.json")


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

const mockGetfetchStudentByqueryAndExam = 
{
    "students": [
        {
            "studentClass": [
                {
                    "classId": "2",
                    "className": "Class-2"
                }
            ],
            "section": "D",
            "name": "Student1",
            "studentId": "4204001",
            "schoolId": "u002",
            "studentAvailability": true
        },
        {
            "studentClass": [
                {
                    "classId": "2",
                    "className": "Class-2"
                }
            ],
            "section": "D",
            "name": "Student53",
            "studentId": "4204053",
            "schoolId": "u002",
            "studentAvailability": true
        }
    ],
    "exams": [
        {
            "set": [
                "A",
                "B",
                "C"
            ],
            "subject": "Hindi",
            "examLO": "Hindi",
            "classId": "2",
            "examDate": "11/10/2021",
            "totalMarks": 20,
            "type": "hindi_8s_13q_omr",
            "questions": [
                {
                    "questionId": "ROLLNUMBER1_Q1_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-1",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q2_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-2",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q3_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-3",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q4_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-4",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q5_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-5",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q6_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-6",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q7_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-7",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q8_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-8",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q9_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-9",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q10_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q11_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-11",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q12_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-12",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER1_Q13_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-13",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q1_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-1",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q2_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-2",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q3_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-3",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q4_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-4",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q5_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-5",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q6_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-6",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q7_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-7",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q8_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-8",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q9_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-9",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q10_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q11_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-11",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q12_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-12",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER2_Q13_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-13",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q1_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-1",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q2_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-2",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q3_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-3",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q4_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-4",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q5_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-5",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q6_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-6",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q7_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-7",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q8_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-8",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q9_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-9",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q10_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q11_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q12_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER3_Q13_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q1_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-1",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q2_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-2",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q3_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-3",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q4_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-4",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q5_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-5",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q6_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-6",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q7_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-7",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q8_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-8",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q9_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-9",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q10_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q11_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q12_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER4_Q13_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q1_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-1",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q2_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-2",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q3_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-3",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q4_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-4",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q5_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-5",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q6_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-6",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q7_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-7",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q8_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-8",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q9_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-9",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q10_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q11_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q12_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER5_Q13_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q1_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-1",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q2_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-2",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q3_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-3",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q4_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-4",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q5_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-5",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q6_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-6",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q7_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-7",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q8_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-8",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q9_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-9",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q10_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q11_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q12_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER6_Q13_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q1_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-1",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q2_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-2",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q3_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-3",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q4_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-4",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q5_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-5",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q6_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-6",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q7_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-7",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q8_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-8",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q9_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-9",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q10_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q11_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q12_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER7_Q13_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q1_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-1",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q2_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-2",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q3_1",
                    "tags": [
                        {
                            "tagName": "Stage1",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-3",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q4_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-4",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q5_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-5",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q6_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-6",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q7_2",
                    "tags": [
                        {
                            "tagName": "Stage2",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-7",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q8_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-8",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q9_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-9",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q10_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q11_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q12_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                },
                {
                    "questionId": "ROLLNUMBER8_Q13_3",
                    "tags": [
                        {
                            "tagName": "Stage3",
                            "selected": false
                        }
                    ],
                    "indicatorTitle": "L0-10",
                    "questionMarks": "1"
                }
            ],
            "examId": 14,
            "schoolId": "u002"
        }
    ]
}


describe('shows the details of students and exams', () => {
    jest.setTimeout(100000000);

    it("should return all students and exam of a particular class ", async () => {
        const req = mockRequest();
        const res = mockResponse()

        Student.find = jest.fn().mockResolvedValue(mockGetfetchStudentByqueryAndExam)

        await reviewController.getAllReviews(req, res)
        expect(Review.find).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should  return review of tour when id param is provided ', async () => {
        const req = mockRequest();
        const res = mockResponse()

        req.params.id = "5c8a355b14eb5c17645c9109";

        Review.find = jest.fn().mockResolvedValue(mockGetReviews)
        await reviewController.getAllReviews(req, res)
        expect(Review.find).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200);

    });

});


const mockCreateReviewTour = {
    "status": "success",
    "data": {
        "review": {
            "_id": "611a0edcb045c73658d48733",
            "review": "Nice tour",
            "tour": "6116435e3653e44464650b2e",
            "user": "5c8a1e1a2f8fb814b56fa182",
            "createdAt": "2021-08-16T07:08:12.903Z",
            "__v": 0,
            "id": "611a0edcb045c73658d48733"
        }
    }
}


describe('create tour review', () => {
    jest.setTimeout(100000000);

    it("should create review for tour ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.body = createmockdata;

        Review.create = jest.fn().mockResolvedValue(mockCreateReviewTour)

        await reviewController.createReview(req, res)
        expect(Review.create).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200);
    });

});

const mockUpdateReviewTour = {
    "status": "success",
    "data": {
        "data": {
            "_id": "5c8a355b14eb5c17645c9109",
            "review": "Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!",
            "rating": 4,
            "user": {
                "_id": "5c8a1dfa2f8fb814b56fa181",
                "name": "Lourdes Browning",
                "photo": "user-2.jpg"
            },
            "tour": "5c88fa8cf4afda39709c295a",
            "createdAt": "2021-07-28T05:18:48.036Z",
            "__v": 0,
            "id": "5c8a355b14eb5c17645c9109"
        }
    }
}


describe('update tour review', () => {
    jest.setTimeout(100000000);

    it("should update review for tour ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.body = {
            "rating": 4
        }

        Review.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdateReviewTour)

        await reviewController.updateReview(req, res)
        expect(Review.findByIdAndUpdate).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200);
    });

});

const mockDeleteReview =
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "5c8a359914eb5c17645c910a",
            "review": "Convallis turpis porttitor sapien ad urna efficitur dui vivamus in praesent nulla hac non potenti!",
            "rating": 5,
            "user": {
                "_id": "5c8a1dfa2f8fb814b56fa181",
                "name": "Lourdes Browning",
                "photo": "user-2.jpg"
            },
            "tour": "5c88fa8cf4afda39709c295d",
            "createdAt": "2021-07-28T05:18:48.037Z",
            "__v": 0,
            "id": "5c8a359914eb5c17645c910a"
        }
    }
}
describe('delete tour review', () => {
    jest.setTimeout(100000000);

    it("should delete review for tour  ", async () => {
        const req = mockRequest();
        const res = mockResponse()
        req.params.id = "5c8a364c14eb5c17645c910c"

        Review.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeleteReview)

        await reviewController.deleteReview(req, res)
        expect(Review.findByIdAndUpdate).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200);
    });

});