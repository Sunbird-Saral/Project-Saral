import axios from "axios";
import { getErrorMessage, getLoginCred, setErrorMessage } from "../utils/StorageUtils";
import { scanStatusDataAction } from "./ScanStatus/scanStatusDataAction";

export default function callScanStatusDataConst(filteredData) {

    return async dispatch => {

        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.response.class,
            "subject": filteredData.response.subject,
            "fromDate": filteredData.response.examDate,
            "page": 1,
            "downloadRes": false
        }
        let apiObj = new scanStatusDataAction(dataPayload);

        if (apiObj.method === 'POST') {
            let apiResponse = null
            const source = axios.CancelToken.source()
            const id = setTimeout(() => {
                if (apiResponse === null) {
                    source.cancel('The request timed out.');
                }
            }, 60000);
            axios.post(apiObj.apiEndPoint(), apiObj.getBody(), {
                auth: {
                    username: loginCred.schoolId,
                    password: loginCred.password
                }
            })
                .then(function (res) {
                    apiResponse = res
                    clearTimeout(id)
                    apiObj.processResponse(res)
                    dispatch(dispatchAPIAsync(apiObj));
                })
                .catch(function (err) {
                    collectErrorLogs("callScanStatusDataConst.js","callScanStatusDataConst",apiObj.apiEndPoint(),err,false)
                    clearTimeout(id)
                });
        }


        function dispatchAPIAsync(apiObj) {
            return {
                type: apiObj.type,
                payload: apiObj.getPayload()
            }
        }
        // }
    }

}









