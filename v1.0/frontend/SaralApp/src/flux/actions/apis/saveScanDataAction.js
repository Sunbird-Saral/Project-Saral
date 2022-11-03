/**
 * Save Scan Data
 */
import { apkVersion } from '../../../configs/config';
import API from '../apis/api';
import C from '../constants';

export class SaveScanData extends API {
    constructor(requestBody, token, timeout = 30000) {
        super('PUT', timeout, false);
        
        this.requestBody = requestBody;
        this.token = token;
        this.type = C.SAVE_SCAN_DATA;
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
            'X-App-Version': apkVersion
        }
    }

    getBody() {
        return this.requestBody
    }

    getPayload() {
        return this.response
    }
}