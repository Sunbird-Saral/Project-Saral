/**
 * Login API
 */
 import API from '../apis/api';
 import C from '../constants';

  export const LogoutAction = () => {
    return {
        type: C.LOGIN_PROCESS,
        payload: {}
    };
};