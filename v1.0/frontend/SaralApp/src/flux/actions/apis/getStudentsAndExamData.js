/**
 * Students List and Exam Meta Data
 */
import API from '../apis/api';
import C from '../constants';

export class GetStudentsAndExamData extends API {
    constructor(requestBody, token, timeout = 30000) {
        super('GET', timeout, false);
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
        let url = ''
        url = `${super.apiEndPoint()}/fetchStudentsandExamsByQuery?classId=${this.requestBody.classId}&section=${this.requestBody.section}`;
        return url
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }
    }

    getBody() {
      
    }

    getPayload() {
        return this.response
    }
}