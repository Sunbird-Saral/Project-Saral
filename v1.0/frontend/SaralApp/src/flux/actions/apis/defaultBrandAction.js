/**
 * Save Scan Data
 */
 import configs from '../../../configs/config';
import API from '../apis/api';
 import C from '../constants';
 
 export class DefaultBrandAction extends API {
     constructor(requestBody,deviceUniqId, timeout = 30000) {
        console.log('deviceUniqId|||||||||||',deviceUniqId);
         super('GET', timeout, false);
         
         this.requestBody = '';
         this.type = C.DEFAULT_BRAND;
         this.deviceUniqId = deviceUniqId
     }
 
     toString() {
        return `${super.toString()} payload: ${this.payload} `
    }
 
     processResponse(res) {
         super.processResponse(res)
         if (res) {
             this.defaultBrandingdata=res;
         }
     }
 
     apiEndPoint() {
      
         return `${super.apiEndPoint()}/brand/default`;
         
     }
 
     getHeaders() {
         return {
             'Content-Type': 'application/json',
             'Authorization': `Bearer `,
             'methods': super.method,
             'origin': configs.BASE_URL,
             'x-request-deviceid' :`${this.deviceUniqId}`
         }
     }
 
     getBody() {
         return 
     }
 
     getPayload() {
         return this.defaultBrandingdata
     }
 }