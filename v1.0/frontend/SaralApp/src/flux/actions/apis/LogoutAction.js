/**
 * Login API
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../apis/api';
import C from '../constants';
import {eraseErrorLogs,erasesetTotalStudent,erasesetAbsentStudentDataIntoAsync,erasesetLoginCred,erasesetLoginData,erasesetScanData,
    erasesetStudentsExamData,erasesetFetchedScanData,erasesetScannedDataIntoLocal,
    erasegetPresentAbsentStudent,forgetUser,forgetUserpass,erasesetData,removeMultiBranding, setMinimalValue} from './../../../utils/StorageUtils'


export function LogoutAction(payload) {
    return async dispatch => {
        try {
                // await AsyncStorage.clear();
                //  await removeMultiBranding()
                //   await erasesetData()
                 await eraseErrorLogs()
                 await erasesetTotalStudent()
                 await erasesetAbsentStudentDataIntoAsync()
                 await erasesetLoginCred()
                 await erasesetLoginData()
                 await erasesetScanData()
                 await erasesetStudentsExamData()
                 await erasesetFetchedScanData()
                 await erasegetPresentAbsentStudent()
                 await setMinimalValue(null)
            dispatch({ type: C.LOGOUT_PROCESS, payload: payload })
            dispatch({ type: C.MULTI_BRANDING_CLEANUP })
            return dispatch({ type: C.LOGOUT_PROCESS });
        } catch (e) {
            console.log("error doing logout", e)
        }
    }

}