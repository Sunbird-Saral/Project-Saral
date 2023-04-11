/**
 * Save Scan Data
 */
 import API from '../apis/api';
 import C from '../constants';
 
 export class DefaultBrandAction extends API {
     constructor(requestBody, token,deviceUniqId, timeout = 30000) {
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