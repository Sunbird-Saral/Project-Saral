/**
 * Save Scan Data
 */
 import configs from '../../../configs/config';
import API from '../apis/api';
 import C from '../constants';
 
 export class DefaultBrandAction extends API {
     constructor(requestBody, token, timeout = 30000) {
         super('GET', timeout, false);
         
         this.requestBody = '';
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
             'Authorization': `Bearer `,
             'methods': super.method,
             'origin': configs.BASE_URL
         }
     }
 
     getBody() {
         return 
     }
 
     getPayload() {
         return this.defaultBrandingdata
     }
 }