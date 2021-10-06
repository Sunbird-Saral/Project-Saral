import axios from "axios";
import { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { getLoginCred } from "../utils/StorageUtils";
import { scanStatusDataAction } from "./ScanStatus/scanStatusDataAction";

export default function  callScanStatusDataConst(filteredData) {

    return async dispatch => {
        console.log("FilteredDAta", filteredData.response);

        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.response.class,
            "subject": filteredData.response.subject,
            "fromDate": filteredData.response.examDate,
            "page": 1,
            "downloadRes": true
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
            console.log("loginCred", loginCred.schoolId, loginCred.password);
            axios.post(apiObj.apiEndPoint(), apiObj.getBody(), {
                auth: {
                    username: loginCred.schoolId,
                    password: loginCred.password
                }
            })
                .then(function (res) {
                    console.log("RES", res);
                    apiResponse = res
                    clearTimeout(id)
                    apiObj.processResponse(res)
                    dispatch(dispatchAPIAsync(apiObj));
                })
                .catch(function (err) {
                    console.log("ERROR", err);
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









