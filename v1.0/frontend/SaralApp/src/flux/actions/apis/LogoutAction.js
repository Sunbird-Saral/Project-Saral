/**
 * Login API
 */
 import API from '../apis/api';
 import C from '../constants';
 

  
  export const loggedOut = () => ({
    type: C.LOGOUT_PROCESS,
  });
  export const LogoutAction = () => async (dispatch, getState) => {
    await API.LogoutAction(getState).then((res) => {
      dispatch(loggedOut());
    }).catch((err) => { 
      console.log(err)
    });
  };