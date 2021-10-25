/**
 * Login API
 */
 import API from '../apis/api';
 import C from '../constants';
 
 export class LogoutAction extends API {
     constructor(loginObj, timeout = 30000) {
         this.type = C.LOGIN_PROCESS;
     }
 
     toString() {
         return {}
     }
 
    
 
     apiEndPoint() {
         return 
     }
 
     getHeaders() {
         return 
     }
 
     getBody() {
         return 
     }
 
     getPayload() {
         return 
         
     }
 
 }