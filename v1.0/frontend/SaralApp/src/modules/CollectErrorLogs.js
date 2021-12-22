import { getErrorMessage, setErrorMessage } from "../utils/StorageUtils"

export const collectErrorLogs = async (fileName, funcName, apiEndPoint, error, isHttpMethod) => {

    let errorMsg = {
        "fileName": fileName,
        "functionName": funcName,
        "apiUrl": apiEndPoint,
        "errorMsg": error
    }

    if (isHttpMethod) {
        errorMsg.httpMethod = funcName
        delete errorMsg.functionName
    }

    let getErrorData = await getErrorMessage()

    if (getErrorData != null) {
        getErrorData.push(errorMsg)
        setErrorMessage(getErrorData)
    }
    else {
        setErrorMessage([errorMsg])
    }

}
