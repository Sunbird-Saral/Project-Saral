import axios from 'axios';
import C from '../constants'
// import RNFetchBlob from 'rn-fetch-blob'
import Strings from '../../../utils/Strings';
import { collectErrorLogs } from '../../../modules/CollectErrorLogs';


export default function dispatchAPI(api) {    
    if(api.reqType === 'MULTIPART') {
        return  dispatch => {
            dispatch(apiStatusAsync(true, false, ''))
            axios.post(api.apiEndPoint(), api.getFormData(), api.getHeaders())
                .then(function (res) {
                    api.processResponse(res.data)
                    dispatch(apiStatusAsync(false, false, null, res.data))
                    dispatch(dispatchAPIAsync(api));
                    if(typeof api.getNextStep === 'function' && res.data && (res.status == 200 || res.status == 201))
                        dispatch(api.getNextStep())
                })
                .catch(function (err) {
                    collectErrorLogs("apitransport.js","MULTIPART MEthod", api.apiEndPoint(), err, true)
                    dispatch(apiStatusAsync(false, true, Strings.something_went_wrong_please_try_again, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                });
        }
    }
    else{
        if(api.method === 'POST') {
            return  dispatch => {
                dispatch(apiStatusAsync(true, false, ''))
                let apiResponse = null
                const source = axios.CancelToken.source()
                const id = setTimeout(() => {
                    if(apiResponse === null) {
                        source.cancel('The request timed out.');
                    }
                }, 60000);
                axios.post(api.apiEndPoint(), api.getBody(), { headers: api.getHeaders(), cancelToken: source.token },)
                    .then(function (res) {
                        apiResponse = res
                        clearTimeout(id)
                        api.processResponse(res)
                        dispatch(apiStatusAsync(false, false, null, res.data))
                        dispatch(dispatchAPIAsync(api));
                        if(typeof api.getNextStep === 'function' && res.data && (res.status == 200 || res.status == 201))
                            dispatch(api.getNextStep())
                    })
                    .catch(function (err) {
                        collectErrorLogs("apitransport.js","POST MEthod", api.apiEndPoint(), err, true)
                        clearTimeout(id)
                         if(err && err.response?.status == 403) {
                            dispatch(apiStatusAsync(false, true, err && err.response && err.response.data && err.response.data.error ? err.response.data.error : Strings.something_went_wrong_please_try_again))
                        }
                        else if(err && err.message == 'The request timed out.') {
                            dispatch(apiStatusAsync(false, true, Strings.request_timeout_custom_message, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                        else if(err && err.message == 'Network Error') {
                            dispatch(apiStatusAsync(false, true, Strings.you_seem_to_be_offline_please_check_your_internet_connection, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                        else if(api.type == 'login_process' && err.response.status != 500) {
                            dispatch(apiStatusAsync(false, true, err && err.response && err.response.status && err.response.status === 401 ? Strings.schoolid_password_doesnot_match : Strings.something_went_wrong_please_try_again, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                        else if(err && err.response.status == 500) {
                            dispatch(apiStatusAsync(false, true, err && err.response && err.response.data && err.response.data.error == Strings.lock_screen ? Strings.lock_screen : Strings.something_went_wrong_please_try_again))
                        }
                        else{
                            dispatch(apiStatusAsync(false, true, Strings.something_went_wrong_please_try_again, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                    });
            }
        }
        else if(api.method === "PUT") {
            return  dispatch => {
                dispatch(apiStatusAsync(true, false, ''))
                let apiResponse = null
                const source = axios.CancelToken.source()
                const id = setTimeout(() => {
                    if(apiResponse === null) {
                        source.cancel('The request timed out.');
                    }
                }, 60000);
                axios.put(api.apiEndPoint(), api.getBody(), { headers: api.getHeaders(), cancelToken: source.token },)
                    .then(function (res) {
                        apiResponse = res
                        clearTimeout(id)
                        api.processResponse(res)
                        dispatch(apiStatusAsync(false, false, null, res.data))
                        dispatch(dispatchAPIAsync(api));
                        if (typeof api.getNextStep === 'function' && res.data && (res.status == 200 || res.status == 201))
                            dispatch(api.getNextStep())
                    })
                    .catch(function (err) {
                        collectErrorLogs("apitransport.js","PUT MEthod", api.apiEndPoint(), err, true)
                        clearTimeout(id)
                        if (err && err.message == 'The request timed out.') {
                            dispatch(apiStatusAsync(false, true, Strings.request_timeout_custom_message, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                        else if(err && err.message == 'Network Error') {
                            dispatch(apiStatusAsync(false, true, Strings.you_seem_to_be_offline_please_check_your_internet_connection, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                        else if(api.type == 'login_process') {
                            dispatch(apiStatusAsync(false, true, err && err.response && err.response.status && err.response.status === 422 ? Strings.schoolid_password_doesnot_match : Strings.something_went_wrong_please_try_again, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                        else{
                            dispatch(apiStatusAsync(false, true, Strings.something_went_wrong_please_try_again, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                    });
            }

        }

        else if(api.method === 'DELETE') {
            return  dispatch => {
                dispatch(apiStatusAsync(true, false, ''))
                axios.delete(api.apiEndPoint(), api.getHeaders())
                    .then(function (res) {
                        api.processResponse(res.data)
                        dispatch(apiStatusAsync(false, false, null, res.data))
                        dispatch(dispatchAPIAsync(api));
                        if(typeof api.getNextStep === 'function' && res.data && (res.status == 200 || res.status == 201))
                            dispatch(api.getNextStep())
                    })
                    .catch(function (err) {
                        collectErrorLogs("apitransport.js","DELETE MEthod", api.apiEndPoint(), err, true)
                        dispatch(apiStatusAsync(false, true, Strings.something_went_wrong_please_try_again, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                    });
            }
        } else{
            return dispatch => {
                dispatch(apiStatusAsync(true, false, ''))
                let apiResponse = null
                const source = axios.CancelToken.source()
                const id = setTimeout(() => {
                    if(apiResponse === null) {
                        source.cancel('The request timed out.');
                    }
                }, 60000);
                axios.get(api.apiEndPoint(), { headers: api.getHeaders(), cancelToken: source.token },)
                    .then(function (res) {
                        apiResponse = res
                        clearTimeout(id)
                        api.processResponse(res)
                        dispatch(apiStatusAsync(false, false, null, res.data))
                        dispatch(dispatchAPIAsync(api));
                        if (typeof api.getNextStep === 'function' && res.data && (res.status == 200 || res.status == 201))
                            dispatch(api.getNextStep())
                    })
                    .catch(function (err) {
                        collectErrorLogs("apitransport.js","GET MEthod", api.apiEndPoint(), err, true)
                        clearTimeout(id)
                        if (err.response) {
                            dispatch(apiStatusAsync(false, true, Strings.something_went_wrong_please_try_again, null, err && err.response && err.response.status && err.response.status === 401 || err.response.status === 404 ? true : false))
                        } else if(err && err.message == 'The request timed out.') {
                            dispatch(apiStatusAsync(false, true, Strings.request_timeout_custom_message, null, err && err.response && err.response.status && err.response.status === 401 ? true : false))
                        }
                    });
            }
        }
    }
}


function dispatchAPIAsync(api) {
    return {
        type: api.type,
        payload: api.getPayload()
    }
}

function apiStatusAsync(progress, error, message, res = null, unauthorized = false) {
    if(res === null || !(res.status && res.status.statusCode && res.status.statusCode !== 200 && res.status.statusCode !== 201)) {
        return {
            type: C.APISTATUS,
            payload: {
                progress: progress,
                error: error,
                message: message,
                unauthorized: unauthorized
            }
        }
    }
    else{
        return {
            type: C.APISTATUS,
            payload: {
                progress: progress,
                error: (res.status.statusCode === 200 || res.status.statusCode === 201) ? false : true,
                message: (res.status.statusCode === 200 || res.status.statusCode === 201) ? message : res.status.errorMessage,
                unauthorized: unauthorized
            }
        }
    }
}

