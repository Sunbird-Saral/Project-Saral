/**
 * Students List and Exam Meta Data
 */
import API from '../apis/api';
import C from '../constants';

export class GetStudentsAndExamData extends API {
    constructor(requestBody, token, timeout = 30000) {
        super('POST', timeout, false);
        this.requestBody = requestBody;
        this.token = token;
        this.type = C.GET_STUDENTS_EXAMS_LIST;
    }

    toString() {
        return `${super.toString()} requestBody: ${this.requestBody} type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res) {
            this.response=res;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPoint()}/fetchStudentsandExamsByQuery`;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }
    }

    getBody() {
        return this.requestBody
    }

    getPayload() {
        return this.response
    }
}