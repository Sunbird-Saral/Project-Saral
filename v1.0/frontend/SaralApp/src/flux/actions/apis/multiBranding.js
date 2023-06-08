/**
 * Save Scan Data
 */
 import configs from '../../../configs/config';
import API from '../apis/api';
 import C from '../constants';
 
 export class MultiBrandingAction extends API {
     constructor(requestBody, token,deviceUniqId, timeout = 30000) {
        // console.log('deviceUniqId???>>>>',deviceUniqId);
         super('GET', timeout, false);
         
         this.requestBody = '';
         this.token = token;
         this.type = C.MULTI_BRANDING;
         this.deviceUniqId = deviceUniqId
     }
 
     toString() {
        return `${super.toString()} payload: ${this.payload} `
    }
 
     processResponse(res) {
         super.processResponse(res)
         if (res) {
             this.multiBrandingData=res;
         }
     }
 
     apiEndPoint() {
      
         return `${super.apiEndPoint()}/brand`;
         
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
         return this.multiBrandingData
     }
 }