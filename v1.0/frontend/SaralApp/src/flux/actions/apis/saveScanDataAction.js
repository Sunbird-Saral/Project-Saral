/**
 * Save Scan Data
 */
import { apkVersion } from '../../../configs/config';
import API from '../apis/api';
import C from '../constants';

export class SaveScanData extends API {
    constructor(requestBody, token,deviceUniqId, timeout = 30000) {
        console.log('deviceUniqId?????????',deviceUniqId);
        super('PUT', timeout, false);
        this.requestBody = requestBody;
        this.token = token;
        this.type = C.SAVE_SCAN_DATA;
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
        return `${super.apiEndPoint()}/saveMarks`;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'X-App-Version': apkVersion,
            'x-request-deviceid' :`${this.deviceUniqId}`
        }
    }

    getBody() {
        return this.requestBody
    }

    getPayload() {
        return this.response
    }
}