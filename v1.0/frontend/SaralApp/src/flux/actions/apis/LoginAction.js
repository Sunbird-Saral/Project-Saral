/**
 * Login API
 */
 import configs from '../../../configs/config';
import API from '../apis/api';
 import C from '../constants';

 export class LoginAction extends API {
     constructor(loginObj,deviceUniqId, timeout = 30000) {
         super('POST', timeout, false);
         this.loginObj = loginObj;
         this.type = C.LOGIN_PROCESS;
         this.deviceUniqId = deviceUniqId
     }
 
     toString() {
         return `${super.toString()} loginObj: ${this.loginObj} type: ${this.type}`
     }
 
     processResponse(res) {
         super.processResponse(res)
         if (res) {
             this.loginData=res;
         }
     }
 
     apiEndPoint() {
         return `${super.apiEndPoint()}/schools/login`
     }
 
     getHeaders() {
         return {
             'Content-Type': 'application/json',
             'methods': 'POST',
             'origin': configs.BASE_URL,
             'x-request-deviceid' :`${this.deviceUniqId}`
         }
     }
 
     getBody() {
         // this.loginObj["classes"] = true
         this.loginObj.classes = true
         
         return this.loginObj
     }
 
     getPayload() {
         return this.loginData
         
     }
 
 }