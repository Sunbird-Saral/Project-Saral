/**
 * SCANSTATUS API
 */
import configs from '../../configs/config';
import API from '../../flux/actions/apis/api';
import C from '../../flux/actions/constants'

export class scanStatusDataAction extends API {
    constructor(payload, token, deviceUniqId, timeout = 30000) {
        super('POST', timeout, false);
        this.payload = payload;
        this.token = token;
        this.type = C.SCANNED_DATA;
        this.deviceUniqId = deviceUniqId
    }
    toString() {
        return `${super.toString()} payload:${this.payload} type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res) {
            this.scanedData = res.data;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPoint()}/getSavedScan`;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'methods': super.method,
             'origin': configs.BASE_URL,
            'x-request-deviceid' :`${this.deviceUniqId}`
        }
    }

    getBody() {
        return this.payload
    }

    getPayload() {
        return this.scanedData
    }

}