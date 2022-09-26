import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoginCred } from './StorageUtils';

const LOGIN_API_KEY = `LOGIN_API_KEY`
const EXAM_API_KEY = `EXAM_API_KEY`
const ROI_API_KEY = `ROI_API_KEY`
const SAVED_API_KEY = `SAVED_API_KEY`
const BRANDING_API_KEY = `BRANDING_API_KEY`
const LOGIN_CRED_KEY = 'login_cred_key'

const REGULAR_EXAM_API_KEY = 'REGULAR_EXAM_API_KEY'
const REGULAR_ROI_API_KEY = 'REGULAR_ROI_API_KEY'
const REGULAR_SAVED_SCAN_API_KEY = 'REGULAR_SAVED_SCAN_API_KEY'

//For Minimal mode
export const setLoginApi = async (data) => {
    let json = JSON.stringify(data);
    let saved = await setData(LOGIN_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getLoginApi = async () => {
    //GET LOGIN CREDENTIAL
        let loginData = await getData(LOGIN_API_KEY)
        return JSON.parse(loginData)
}


export const setStudentExamApi = async (data) => {
    //GET LOGIN CREDENTIAL
    let json = JSON.stringify(data);
    let saved = await setData(EXAM_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getStudentExamApi = async () => {
        let examData = await getData(EXAM_API_KEY)
        return JSON.parse(examData)
}


export const setRoiDataApi = async (data) => {
    let json = JSON.stringify(data);
    let saved = await setData(ROI_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getRoiDataApi = async () => {
        let roiData = await getData(ROI_API_KEY)
        return JSON.parse(roiData)
}

export const setScanDataApi = async (data) => {
    let json = JSON.stringify(data);
    let saved = await setData(SAVED_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getScanDataApi = async () => {
        let scanData = await getData(SAVED_API_KEY)
        return JSON.parse(scanData)
}

export const setBrandingDataApi = async (data) => {
    let json = JSON.stringify(data);
    let saved = await setData(BRANDING_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getBrandingDataApi = async () => {
        let brandingData = await getData(BRANDING_API_KEY)
        return JSON.parse(brandingData)
    }

export const setData = async (key, value) => {
    await AsyncStorage.setItem(key, value);
    return true
}

export const getData = async (key) => {
    let data = await AsyncStorage.getItem(key);
    return data
}

export const removeLoginApiData = async () => {
    let loginData = await getLoginApi(LOGIN_API_KEY);
    let loginCred = await getLoginCred(LOGIN_CRED_KEY);

   let filterLoginData =  loginData.filter((element)=> {
        if (element.key == loginCred.schoolId) {
            return false
        } else {
            return true
        }
    });
    if (filterLoginData.length > 0) {
        await setLoginApi(filterLoginData)
    } else {
        await setLoginApi(null)
    }
}

export const removeBrandingApiData = async () => {
    let branding = await getBrandingDataApi();
    let loginCred = await getLoginCred(LOGIN_CRED_KEY);

    let filterBrandingData =  branding.filter((element)=> {
        if (element.key == loginCred.schoolId) {
            return false
        } else {
            return true
        }
    });
    if (filterBrandingData.length > 0) {
        await setBrandingDataApi(filterBrandingData)
    } else {
        await setBrandingDataApi(null)
    }
}

export const removeStudenExamApiData = async () => {
    let examApi = await getStudentExamApi();
    let loginCred = await getLoginCred(LOGIN_CRED_KEY);

    let filterExamData = examApi != null ? examApi.filter((element)=> {
        if (element.key == loginCred.schoolId) {
            return false
        } else {
            return true
        }
    })
    :
    []
    
    if (filterExamData.length > 0) {
        await setStudentExamApi(filterExamData)
    } else {
        await setStudentExamApi(null)
    }
}

export const removeScanDataApiData = async () => {
    let scanData = await getScanDataApi();
    let loginCred = await getLoginCred(LOGIN_CRED_KEY);

    let filterScanData = scanData != null ?  scanData.filter((element)=> {
        if (element.key == loginCred.schoolId) {
            return false
        } else {
            return true
        }
    }) 
    :
    []

    if (filterScanData.length > 0) {
        await setScanDataApi(filterScanData)
    } else {
        await setScanDataApi(null)
    }
}
export const removeRoiDataApiData = async () => {
    let roiData = await getRoiDataApi();
    let loginCred = await getLoginCred(LOGIN_CRED_KEY);

    let filterRoiData = roiData != null ?  roiData.filter((element)=> {
        if (element.key == loginCred.schoolId) {
            return false
        } else {
            return true
        }
    })
    :
    []
    
    if (filterRoiData.length > 0) {
        await setRoiDataApi(filterRoiData)
    } else {
        await setRoiDataApi(null)
    }
}

export const removeAllCache = async() => {
    //remove all user login data
    let login = JSON.stringify(null);
     await setData(LOGIN_API_KEY, login)

     //remove all user branding data
     let brand = JSON.stringify(null);
     await setData(BRANDING_API_KEY, brand)

     //remove all user studnetexam data
     let exam = JSON.stringify(null);
     await setData(EXAM_API_KEY, exam)

     //remove all user roi data
     let roi = JSON.stringify(null);
     await setData(ROI_API_KEY, roi)

     //remove all user db saved data
     let json = JSON.stringify(null);
     await setData(SAVED_API_KEY, json)
}

//For Regular Mode
export const setRegularStudentExamApi = async (data) => {
    //GET LOGIN CREDENTIAL
    let json = JSON.stringify(data);
    let saved = await setData(REGULAR_EXAM_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getRegularStudentExamApi = async () => {
        let examData = await getData(REGULAR_EXAM_API_KEY)
        return JSON.parse(examData)
}

export const setRegularRoiApi = async (data) => {
    //GET LOGIN CREDENTIAL
    let json = JSON.stringify(data);
    let saved = await setData(REGULAR_ROI_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getRegularRoipi = async () => {
        let examData = await getData(REGULAR_ROI_API_KEY)
        return JSON.parse(examData)
}


export const setRegularSavedScanApi = async (data) => {
    //GET LOGIN CREDENTIAL
    let json = JSON.stringify(data);
    let saved = await setData(REGULAR_SAVED_SCAN_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getRegularSavedScanpi = async () => {
        let examData = await getData(REGULAR_SAVED_SCAN_API_KEY)
        return JSON.parse(examData)
}