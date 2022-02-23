/**
 * Login API
 */
 import API from '../apis/api';
 import C from '../constants';
 
 export class ExamAction extends API {
     constructor(examObj, token , timeout = 30000) {
         super('GET', timeout, false);
         this.examObj = examObj;
         this.token = token;
         this.type = C.EXAM_PROCESS;
     }
 
     toString() {
         return `${super.toString()} examObj: ${this.examObj} type: ${this.type}`
     }
 
     processResponse(res) {
         super.processResponse(res)
         if (res) {
             this.examData=res;
         }
     }
 
     apiEndPoint() {
         return `${super.apiEndPoint()}/examByClass/${this.examObj.classId}?subject=${this.examObj.subject}`
     }
 
     getHeaders() {
         return {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${this.token}`
         }
     }
 
     getBody() {
     }
 
     getPayload() {
         return this.examData
         
     }
 
 }