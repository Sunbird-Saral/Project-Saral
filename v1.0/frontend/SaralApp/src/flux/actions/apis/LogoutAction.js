/**
 * Login API
 */
 import API from '../apis/api';
 import C from '../constants';
 


//  export function LogoutAction (){
//     console.warn('logoutttttt')
//     dispatch({
//         type:C.LOGIN_PROCESS,
//         payload:{}
//     })
//      try {
//         setTimeout(() => {
//             console.warn('gghhfhfhf')
//             dispatch({
//                 type:C.LOGIN_PROCESS,
//                 payload:'login_process'
//             })
//         },2000)
//     }
//     catch(e) {
//         console.warn(e)
//         dispatch({
//             type : C.LOGIN_PROCESS,
//             payload: 'login_process'
//         })
//     }
 
//  }

 export const LogoutAction = () => (dispatch) => {
     console.warn('logout',this.loginData)
    this.loginData.LogoutAction();
    dispatch({
      type: C.LOGOUT_PROCESS,
      payload:{}
    });
  };