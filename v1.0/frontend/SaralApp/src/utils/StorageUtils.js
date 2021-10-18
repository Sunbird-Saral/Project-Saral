import AsyncStorage from '@react-native-async-storage/async-storage';


const SCAN_KEY = 'scan_key'
const LOGIN_DATA_KEY = 'login_data_key'
const LOGIN_CRED_KEY = 'login_cred_key'
const STUDENTS_EXAM_KEY = 'students_exam_key'
const FETCH_SCAN_KEY = 'fetch_scan_key'
const SAVE_ABSENT_DATA_INTO_LOCAL = 'save_absent_data_into_local'
const SAVE_TOTAL_STUDENT = 'save_total_student'
const SAVED_SCANNED_DATA_INTO_LOCAL = 'saved_scanned_data_into_local'

export const setData = async (key, value) => {
    await AsyncStorage.setItem(key, value);
    return true
}

export const setTotalStudent = async (data) => {
    let value = JSON.stringify(data);
    let saved = await AsyncStorage.setItem(SAVE_TOTAL_STUDENT, value);
    if (saved) {
        return true
    } else {
        return false
    }
}

export const totalStudents = async () => {
    return await AsyncStorage.getItem("save_total_student");
}

export const setAbsentStudentDataIntoAsync = async (data) => {
    let value = JSON.stringify(data);
    if (value == []) {
        AsyncStorage.removeItem(SAVE_ABSENT_DATA_INTO_LOCAL)
    } else {
        let saved = await AsyncStorage.setItem(SAVE_ABSENT_DATA_INTO_LOCAL, value);
        if (saved) {
            return true
        }
        else {
            return false
        }
    }
}

export const getData = async (key) => {
    let data = await AsyncStorage.getItem(key);
    return data
}

export const setLoginCred = async (data) => {
    let json = JSON.stringify(data);
    let saved = await setData(LOGIN_CRED_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getLoginCred = async () => {
    let loginData = await getData(LOGIN_CRED_KEY)
    return JSON.parse(loginData)
}

export const setLoginData = async (data) => {
    let json = JSON.stringify(data);
    let saved = await setData(LOGIN_DATA_KEY, json)
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getLoginData = async () => {
    let loginData = await getData(LOGIN_DATA_KEY)
    return JSON.parse(loginData)
}

export const setScanData = async (data) => {
    let json = JSON.stringify(data);

    let saved = await setData(SCAN_KEY, json);
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getScanData = async () => {
    let scanData = await getData(SCAN_KEY)
    return JSON.parse(scanData)
}

export const setStudentsExamData = async (data) => {
    let json = JSON.stringify(data);

    let saved = await setData(STUDENTS_EXAM_KEY, json);
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getStudentsExamData = async () => {
    let scanData = await getData(STUDENTS_EXAM_KEY)
    return JSON.parse(scanData)
}

export const setFetchedScanData = async (data) => {
    let json = JSON.stringify(data);

    let saved = await setData(FETCH_SCAN_KEY, json);
    if (saved) {
        return true
    }
    else {
        return false
    }
}

export const getFetchedScanData = async () => {
    let scanData = await getData(FETCH_SCAN_KEY)
    return JSON.parse(scanData)
}

export const setScannedDataIntoLocal = async (data) => {
    const value = JSON.stringify(data)
    const saved = await AsyncStorage.setItem(SAVED_SCANNED_DATA_INTO_LOCAL, value);
    console.log("saved",saved);
    if (saved) {
        return true
    } else {
        return false
    }
}

export const getScannedDataFromLocal = async () => {
    const data = await AsyncStorage.getItem(SAVED_SCANNED_DATA_INTO_LOCAL);
    return JSON.parse(data)
}