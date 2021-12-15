/**
 * Save Scan Data
 */
 import API from '../apis/api';
 import C from '../constants';
 
 export class MultiBrandingAction extends API {
     constructor(requestBody, token, timeout = 30000) {
         super('GET', timeout, false);
         
         this.requestBody = '';
         this.token = token;
         this.type = C.MULTI_BRANDING;
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
             'Authorization': `Bearer ${this.token}`
         }
     }
 
     getBody() {
         return 
     }
 
     getPayload() {
         return this.multiBrandingData
     }
 }