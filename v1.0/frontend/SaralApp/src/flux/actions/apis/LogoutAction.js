/**
 * Login API
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../apis/api';
import C from '../constants';


export function LogoutAction(payload) {
    return async dispatch => {
        try {
            await AsyncStorage.clear();
            dispatch({ type: C.LOGOUT_PROCESS, payload: payload })
            dispatch({ type: C.MULTI_BRANDING_CLEANUP })
            return dispatch({ type: C.LOGOUT_PROCESS });

        } catch (e) {
            console.log("error doing logout", e)
        }
    }

}