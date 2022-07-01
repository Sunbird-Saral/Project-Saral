
// const LOGIN = require("./loginScreen-function"); 
import LOGIN from "./loginScreen-function";
class CredentialInput {
   
    async u002() {
       await LOGIN.loginIds("u002", "tarento@123");
    }

    async u001() {
      await LOGIN.loginIds("u001", "tarento@123");
   }

    async demoUser() {
        await LOGIN.loginIds("demouser", "Demo@123");
     }

     async od00() {
        await LOGIN.loginIds("od001", "tarento@123");
     }

     async a00() {
        await LOGIN.loginIds("a001", "tarento@123");
     }

     async minimal_mode() {
        await LOGIN.loginIds("m001", "tarento@123");
     }

     async book_distribution() {
        await LOGIN.loginIds("09670702901", "tarento@123");
     }
}
export default new CredentialInput();
// module.exports = new CredentialInput();