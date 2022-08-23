import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoginData } from './StorageUtils';


export const setLoginApi = async (data) => {
    //GET LOGIN CREDENTIAL
    let loginCred = await getLoginData('login_data_key');
    let LOGIN_API_KEY = `${loginCred.school.schoolId}`
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
    let loginCred = await getLoginData('login_data_key');
    if (loginCred) {
        let LOGIN_API_KEY = `${loginCred.school.schoolId}`
        let loginData = await getData(LOGIN_API_KEY)
        return JSON.parse(loginData)
    } else {
        return JSON.parse(loginCred)
        
    }
}


export const setStudentExamApi = async (data, classData, section) => {
    //GET LOGIN CREDENTIAL
    let loginCred = await getLoginData('login_data_key');
    let EXAM_API_KEY = `${loginCred.school.schoolId}${classData}${section}`
    let json = JSON.stringify(data);
    let saved = await setData(EXAM_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getStudentExamApi = async (classData, section) => {
    //GET LOGIN CREDENTIAL
    let loginCred = await getLoginData('login_data_key');
    if (loginCred) {
        let EXAM_API_KEY = `${loginCred.school.schoolId}${classData}${section}`
        let examData = await getData(EXAM_API_KEY)
        return JSON.parse(examData)
    } else {
        return JSON.parse(loginCred)
        
    }
}


export const setRoiDataApi = async (data, examId) => {
    //GET LOGIN CREDENTIAL
    let loginCred = await getLoginData('login_data_key');
    let ROI_API_KEY = `${loginCred.school.schoolId}${examId}`
    let json = JSON.stringify(data);
    let saved = await setData(ROI_API_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getRoiDataApi = async (examId) => {
    //GET LOGIN CREDENTIAL
    let loginCred = await getLoginData('login_data_key');
    if (loginCred) {
        let ROI_API_KEY = `${loginCred.school.schoolId}${examId}`
        let roiData = await getData(ROI_API_KEY)
        return JSON.parse(roiData)
    } else {
        return JSON.parse(loginCred)
        
    }
}



export const setData = async (key, value) => {
    await AsyncStorage.setItem(key, value);
    return true
}

export const getData = async (key) => {
    let data = await AsyncStorage.getItem(key);
    return data
}