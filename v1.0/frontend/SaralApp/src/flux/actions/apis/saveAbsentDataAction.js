/**
 * File Upload API
 */
 import API from '../apis/api';
 import C from '../constants';
 
 export class SaveAbsentDataAction extends API {
     constructor(payload, token, timeout = 30000) {
         super('POST', timeout, false);
         this.payload = payload;
         this.token = token;
         this.type = C.SAVE_ABSENT_STUDENT_DATA;
     }
 
     toString() {
         return `${super.toString()} payload: ${this.payload} type: ${this.type}`
     }
 
     processResponse(res) {
         super.processResponse(res)
         if (res) {
             this.payload = res;
         }
     }
 
     apiEndPoint() {
         return `${super.apiEndPoint()}/StudentsAPI/SaveAbsentees`;
     }
 
     getHeaders() {
         return {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${this.token}`
         }
     }
 
     getBody() {
         return this.payload
     }
 
     getPayload() {
         return this.payload
 
     }
 
 }