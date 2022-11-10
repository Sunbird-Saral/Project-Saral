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

export const removeAllCache = async () => {
    let emptyJson = JSON.stringify(null);
    let keyArray = [LOGIN_API_KEY, EXAM_API_KEY, ROI_API_KEY, SAVED_API_KEY, BRANDING_API_KEY, REGULAR_EXAM_API_KEY, REGULAR_ROI_API_KEY, REGULAR_SAVED_SCAN_API_KEY ]

    keyArray.map(async (el) => {
        await setData(el, emptyJson)
    });
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


export const removeRegularUserDataCacheByKey = async (key, schollId) => {
    let json = await getData(key);
    let jsonData = JSON.parse(json);
    let cloneData = jsonData != null ? [...jsonData] : [] ;

    let filterData = jsonData != null ? jsonData.filter((element) => {
        if (element.key == schollId || (element.key == "global" && cloneData.length == 2)) {
            return false
        } else {
            return true
        }
    })
        :
        []

    if (filterData.length > 0) {
        await setData(key, JSON.stringify(filterData))
    } else {
        await setData(key, JSON.stringify(null))
    }
}

export const removeRegularUserCache = async (schoolId) => {
    let loginCred = await getLoginCred(LOGIN_CRED_KEY);
    let array = [REGULAR_EXAM_API_KEY, REGULAR_ROI_API_KEY, REGULAR_SAVED_SCAN_API_KEY, BRANDING_API_KEY, LOGIN_API_KEY];

    array.map(async (el) => {
        if (el == BRANDING_API_KEY || el == LOGIN_API_KEY) {
            await removeRegularUserDataCacheByKey(el, loginCred.schoolId);
        } else {
            await removeRegularUserDataCacheByKey(el, schoolId);
        }
    });

}

export const removeMinimalUserCache = async (schoolId) => {
    let loginCred = await getLoginCred(LOGIN_CRED_KEY);
    let array = [EXAM_API_KEY, ROI_API_KEY, SAVED_API_KEY, BRANDING_API_KEY, LOGIN_API_KEY];

    array.map(async (el) => {
        if (el == BRANDING_API_KEY || el == LOGIN_API_KEY) {
            await removeRegularUserDataCacheByKey(el, loginCred.schoolId);
        } else {
            await removeRegularUserDataCacheByKey(el, schoolId);
        }
    });

}