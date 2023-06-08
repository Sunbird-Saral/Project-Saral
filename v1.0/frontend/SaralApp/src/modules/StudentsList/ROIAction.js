/**
 * ROI API
 */
 import configs from '../../configs/config';
import API from '../../flux/actions/apis/api';
 import C from '../../flux/actions/constants'
 
 export class ROIAction extends API {
    constructor(payload,token,deviceUniqId, timeout = 30000) {
        super('GET', timeout, false);
        this.payload = payload;
        this.token = token;
        this.type = C.ROI_DATA;
        this.deviceUniqId = deviceUniqId
    }
    toString() {
        return `${super.toString()} payload: ${this.payload} `
    }

    processResponse(res) {
        super.processResponse(res)
        if (res) {            
            this.roiData=res;
        }
    }

    apiEndPoint() {
        let url = ''
        if (this.payload.hasOwnProperty('set')) {
            url = `${super.apiEndPoint()}/roi/${this.payload.examId}${this.payload.set}`;
        } else {
            url = `${super.apiEndPoint()}/roi/${this.payload.examId}`;
        }
        return url
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
        return 
    }

    getPayload() {
        return this.roiData
    }
 
 }