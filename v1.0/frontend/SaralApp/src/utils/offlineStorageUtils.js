import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoginData } from './StorageUtils';

const LOGIN_API_KEY = `LOGIN_API_KEY`
const EXAM_API_KEY = `EXAM_API_KEY`
const ROI_API_KEY = `ROI_API_KEY`
const SAVED_API_KEY = `SAVED_API_KEY`
const BRANDING_API_KEY = `BRANDING_API_KEY`

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
    await AsyncStorage.removeItem(LOGIN_API_KEY)
}

export const removeBrandingApiData = async () => {
    await AsyncStorage.removeItem(BRANDING_API_KEY)
}

export const removeStudenExamApiData = async () => {
    await AsyncStorage.removeItem(EXAM_API_KEY)
}

export const removeScanDataApiData = async () => {
    await AsyncStorage.removeItem(SCAN_API_KEY)
}
export const removeRoiDataApiData = async () => {
    await AsyncStorage.removeItem(ROI_API_KEY)
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
     await setData(SCANNED_API_KEY, json)
}