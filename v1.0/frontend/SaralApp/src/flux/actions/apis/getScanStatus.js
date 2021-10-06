/**
 * File Upload API
 */
 import API from './api';
 import C from '../constants';
 
 export class GetScanStatusAction extends API {
     constructor(payload, token, timeout = 30000) {
         super('POST', timeout, false);
         this.payload = payload;
         this.token = token;
         this.type = C.GET_SCAN_STATUS;
     }
 
     toString() {
         return `${super.toString()} payload: ${this.payload} type: ${this.type}`
     }
 
     processResponse(res) {
         super.processResponse(res)
         if (res) {
             this.response=res;
         }
     }
 
     apiEndPoint() {
         return `${super.apiEndPoint()}/StudentsAPI/GetMarksEntryStatusWithStudentId`;
     }
 
     getHeaders() {
         return {
             // headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
                 'Authorization': `Bearer ${this.token}`
             // }
         }
     }
 
     getBody() {
         // let params = {
         //     SCHOOLiD: this.schoolId,
         // }
         
         const data = Object.keys(this.payload).map(key =>
             encodeURIComponent(key) + '=' + encodeURIComponent(this.payload[key]))
             .join('&');
         
         return data
         
     }
 
     getPayload() {
         return this.response
     }
 
 }