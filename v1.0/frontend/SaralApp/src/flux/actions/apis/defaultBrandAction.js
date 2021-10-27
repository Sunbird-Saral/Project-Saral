/**
 * Save Scan Data
 */
 import API from '../apis/api';
 import C from '../constants';
 
 export class DefaultBrandAction extends API {
     constructor(requestBody, token, timeout = 30000) {
         super('GET', timeout, false);
         
         this.requestBody = '';
        //  this.token = token;
         this.type = C.DEFAULT_BRAND;
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
             'Authorization': `Bearer `
         }
     }
 
     getBody() {
         return 
     }
 
     getPayload() {
         return this.defaultBrandingdata
     }
 }