

import AppObject from "./appObjectScreen";
class CredentialScreen {
    async loginIds(schoolId, password) {
        await AppObject.schoolId.addValue(schoolId);
        await AppObject.password.addValue(password);
    }
}

module.exports = new CredentialScreen();