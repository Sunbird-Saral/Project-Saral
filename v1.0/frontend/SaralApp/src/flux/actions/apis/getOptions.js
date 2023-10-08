/**
 * Students List and Exam Meta Data
 */
import configs from '../../../configs/config';
import API from './api';
import C from '../constants';

export class GetOptions extends API {
    constructor(requestBody, token,deviceUniqId, timeout = 30000) {
        super('GET', timeout, false);
        this.requestBody = requestBody;
        this.token = token;
        this.type = C.GET_STUDENTS_EXAMS_LIST;
        this.deviceUniqId = deviceUniqId
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
        url = `${super.apiEndPoint()}/options`;
        return url
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'methods': 'GET',
            'origin': configs.BASE_URL,
            'x-request-deviceid' :`${this.deviceUniqId}`
        }
    }

    getBody() {
      
    }

    getPayload() {
        return this.response
    }
}