
const AppObject = require("./appObjectScreen");
class CredentialScreen {
    async loginIds(schoolId, password) {
        // await driver.pause(5000);
        await AppObject.schoolId.addValue(schoolId);
        await AppObject.password.addValue(password);
    }
}

module.exports = new CredentialScreen();