/**
 * ROI API
 */
 import API from '../../flux/actions/apis/api';
 import C from '../../flux/actions/constants'
 
 export class ROIAction extends API {
    constructor(payload,token, timeout = 30000) {
        super('GET', timeout, false);
        this.payload = payload;
        this.token = token;
        this.type = C.ROI_DATA;
    }
    toString() {
        return `${super.toString()} payload: ${this.payload} type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res) {            
            this.roiData=res;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPoint()}/roi/${this.payload.examId}/type/${this.payload.type}`;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }
    }

    getBody() {        
        return 
    }

    getPayload() {
        return this.roiData
    }
 
 }