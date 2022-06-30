
const LOGIN = require("./loginScreen-function"); 
class CredentialInput {
    async up_u001() {
        await LOGIN.loginIds("u001", "tarento@123");
     }

    async up_u002() {
       await LOGIN.loginIds("u002", "tarento@123");
    }

    async demoUser() {
        await LOGIN.loginIds("demouser", "Demo@123");
     }

     async odisha() {
        await LOGIN.loginIds("od001", "tarento@123");
     }

     async assam() {
        await LOGIN.loginIds("a001", "tarento@123");
     }

     async minimal_mode() {
        await LOGIN.loginIds("m001", "tarento@123");
     }

     async book_distribution() {
        await LOGIN.loginIds("09670702901", "tarento@123");
     }
}

module.exports = new CredentialInput();