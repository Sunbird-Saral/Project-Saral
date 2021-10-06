/**
 * base class for API object
 */
import CONFIGS from '../../../configs/config';

export default class API {
    constructor(method = 'POST', timeout = 30000, auth = false) {
        this.code       = null;
        this.message    = null;
        this.domain     = null;
        this.method     = method;
        this.timeout    = timeout;
        this.auth       = auth;
    }

    toString() {
        return `( code: ${this.code} message: ${this.message} domain: ${this.domain} method: ${this.method} timeout: ${this.timeout} auth: ${this.auth}`;
    }

    apiEndPoint() {
        return CONFIGS.BASE_URL;
    }
    processResponse(res) {
        this.code       = res.code;
        this.message    = res.message;
        this.domain     = res.domain;
    }
}
