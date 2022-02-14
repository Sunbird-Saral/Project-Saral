import moment from 'moment'

export const validateToken = (expireTime) => {
    let expireArr = expireTime.replace(/-/g, '/').split('/')
    let formattedExpireTime = expireArr[1] + '/' + expireArr[0] + '/' + expireArr[2]

    let tokenExpireTime = moment(new Date(Date.parse(formattedExpireTime)))
    let currentTime = moment()
    if (currentTime > tokenExpireTime) {
        return false
    }
    else {
        return true
    }
}

export const cryptoText = (text) => {
    let strTempChar = ''
    let encText = ''
    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i)
        if (char.charCodeAt(0) < 128) {
            strTempChar = char.charCodeAt(0) + 128
        }
        else if (char.charCodeAt(0) > 128) {
            strTempChar = char.charCodeAt(0) - 128
        }
        encText += String.fromCharCode(strTempChar)
    }
    return encText
}

export const SCAN_TYPES = {
    SAT_TYPE: 'sat',
    PAT_TYPE: 'pat'
}

export const TABLE_HEADER = [
    "Sr No", "Questions", "Marks"
]

export const TABLE_HEADER_WITH_TAG = [
    "Sr No", "Questions", "Marks", "Tagging"
]

export const MULTIPLE_TAG_DATAS = [
    {
        name: "REact native",
        selected: false
    },
    {
        name: "DevOps",
        selected: false
    },
    {
        name: "Ruby",
        selected: false
    },
    {
        name: "C++",
        selected: false
    },
    {
        name: "Java",
        selected: false
    },
    {
        name: "JavaScript",
        selected: false
    },
    {
        name: "TypeScript",
        selected: false
    },
    {
        name: "Alaska",
        selected: false
    },
    {
        name: "Go",
        selected: false
    },
    {
        name: "Lang",
        selected: false
    }
]

export const Exam_QuestionHeader = [
    "Question Id", "Indicator Title", "Question Marks"
]

export const neglectData = ["ROLLNUMBER", "STUDENTID", "MARKS_OBTAINED", "MAX_MARKS", "ROLLID"];

export const student_ID = ["ROLLNUMBER", "STUDENTID", "ROLLID"]

export const multipleStudent = ["ROLLNUMBERID"]

export const CELL_OMR = "CELL_OMR"

export const studentLimitSaveInLocal = 50