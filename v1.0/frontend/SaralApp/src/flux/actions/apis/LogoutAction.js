/**
 * Login API
 */
import C from '../constants';
import {eraseErrorLogs,erasesetTotalStudent,erasesetAbsentStudentDataIntoAsync,erasesetLoginCred,erasesetLoginData,erasesetScanData,
    erasesetStudentsExamData,erasesetFetchedScanData,
    erasegetPresentAbsentStudent, setMinimalValue} from './../../../utils/StorageUtils'


export function LogoutAction(payload) {
    return async dispatch => {
        try {
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