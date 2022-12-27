const supertest = require("supertest");
const app = require("../app")
const request = supertest(app);


const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAxIiwic2Nob29sSWQiOiJ1MDAxIiwiaWF0IjoxNjcyMTE4NzYwfQ.KsTxsjMO0snsYDOuIDRDyvQXi35htLYp8vAEe5_qY8g"

const mockgetStudentsData = jest.fn().mockResolvedValue([
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
                "studentId": "1210001",
                "schoolId": "u001"
            },
            {
                "studentClass": [
                    {
                        "classId": "2",
                        "className": "Class-2"
                    }
                ],
                "section": "D",
                "name": "Student2",
                "studentId": "1220002",
                "schoolId": "u001"
            },
            {
                "studentClass": [
                    {
                        "classId": "2",
                        "className": "Class-2"
                    }
                ],
                "section": "D",
                "name": "Student3",
                "studentId": "1220003",
                "schoolId": "u001"
            },
            {
                "studentClass": [
                    {
                        "classId": "2",
                        "className": "Class-2"
                    }
                ],
                "section": "D",
                "name": "Student4",
                "studentId": "1220004",
                "schoolId": "u001"
            },
            {
                "studentClass": [
                    {
                        "classId": "2",
                        "className": "Class-2"
                    }
                ],
                "section": "D",
                "name": "Student5",
                "studentId": "1220005",
                "schoolId": "u001"
            }
        ]
    }
]);


// const mockStudentMarksData = jest.fn().mockResolvedValue([
//    []
// ]);

// const mockExamsData = jest.fn().mockResolvedValue([{
//     "exams": [
//         {
//             "set": [],
//             "subject": "Hindi",
//             "examLO": "Hindi",
//             "classId": "2",
//             "examDate": "23/09/2021",
//             "totalMarks": 20,
//             "type": "hindi_4s_20q_omr",
//             "questions": [
//                 {
//                     "questionId": "ROLLNUMBER1_Q1",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-1",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q2",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-2",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q3",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-3",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q4",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-4",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q5",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-5",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q6",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-6",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q7",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-7",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q8",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-8",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q9",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-9",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q10",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-10",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q11",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-11",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q12",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-12",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q13",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-13",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q14",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-14",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q15",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-15",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q16",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-16",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q17",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-17",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q18",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-18",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q19",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-19",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER1_Q20",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-20",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q1",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-1",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q2",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-2",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q3",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-3",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q4",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-4",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q5",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-5",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q6",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-6",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q7",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-7",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q8",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-8",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q9",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-9",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q10",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-10",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q11",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-11",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q12",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-12",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q13",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-13",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q14",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-14",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q15",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-15",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q16",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-16",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q17",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-17",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q18",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-18",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q19",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-19",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER2_Q20",
//                     "tags": [
//                         {
//                             "tagName": "historic",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-20",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q1",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-1",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q2",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-2",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q3",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-3",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q4",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-4",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q5",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-5",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q6",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-6",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q7",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-7",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q8",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-8",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q9",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-9",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q10",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-10",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q11",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-11",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q12",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-12",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q13",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-13",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q14",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-14",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q15",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-15",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q16",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-16",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q17",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-17",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q18",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-18",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q19",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-19",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER3_Q20",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-20",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q1",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-1",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q2",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-2",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q3",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-3",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q4",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-4",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q5",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-5",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q6",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-6",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q7",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-7",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q8",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-8",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q9",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-9",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q10",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-10",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q11",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-11",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q12",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-12",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q13",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-13",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q14",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-14",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q15",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-15",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q16",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-16",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q17",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-17",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q18",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-18",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q19",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-19",
//                     "questionMarks": "1"
//                 },
//                 {
//                     "questionId": "ROLLNUMBER4_Q20",
//                     "tags": [
//                         {
//                             "tagName": "literature",
//                             "selected": false
//                         }
//                     ],
//                     "indicatorTitle": "L0-20",
//                     "questionMarks": "1"
//                 }
//             ],
//             "examId": 1,
//             "schoolId": "u001"
//         }
//     ]
// }
// ]);

jest.mock("../repository/student", () => {
    return {
        StudentRepository: jest.fn().mockImplementation(() => {
            return {
                getStudentsData: mockgetStudentsData
            };
        }),
    };
});

jest.mock("../repository/marks", () => {
    return {
        MarksRepository: jest.fn().mockImplementation(() => {
            return {
                findStudentMarks: mockStudentMarksData
            };
        }),
    };
});

jest.mock("../repository/exam", () => {
    return {
        MarksRepository: jest.fn().mockImplementation(() => {
            return {
                getExamsData: mockExamsData
            };
        }),
    };
});

describe("Return students ", () => {
    jest.setTimeout(10000);


    it("return list of students and exams", async (done) => {
        const response = await request
            .post("/fetchStudentsandExamsByQuery")
            // .set({ Authorization: token })
            // .set("Authorization", `Bearer ${token}`)
            .send({
                "classId": "2"
            });
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        done();
    });
});
