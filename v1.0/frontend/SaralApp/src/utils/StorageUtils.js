import AsyncStorage from '@react-native-async-storage/async-storage';


const SCAN_KEY = 'scan_key'
const LOGIN_DATA_KEY = 'login_data_key'
const LOGIN_CRED_KEY = 'login_cred_key'
const STUDENTS_EXAM_KEY = 'students_exam_key'
const FETCH_SCAN_KEY = 'fetch_scan_key'
const SAVE_ABSENT_DATA_INTO_LOCAL = 'save_absent_data_into_local'
const SAVE_TOTAL_STUDENT = 'save_total_student'
const SAVED_SCANNED_DATA_INTO_LOCAL = 'saved_scanned_data_into_local'
const SET_PRESENT_ABSENT_DATA = 'set_present_absent_data'
const SET_ERROR_MESSAGE = 'set_error_message'
const REMEMBERME_KEY = 'remember_key'
const REMEMBERME_KEY_PASS = 'remember_key_pass'


export const setErrorMessage = async (data) => {
    let value = JSON.stringify(data)
    await AsyncStorage.removeItem(SET_ERROR_MESSAGE)
    let saved = await AsyncStorage.setItem(SET_ERROR_MESSAGE, value);
    if (saved) {
        return true
    } else {
        return false
    }
}

export const eraseErrorLogs = async () => {
    await AsyncStorage.removeItem(SET_ERROR_MESSAGE)
}

export const setData = async (key, value) => {
    await AsyncStorage.setItem(key, value);
    return true
}

export const getData = async (key) => {
    let data = await AsyncStorage.getItem(key);
    return data
}

export const erasesetData = async (key) => {
    await AsyncStorage.removeItem(key)
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


export const getPresentAbsentStudent = async () => {
    const data = await AsyncStorage.getItem(SET_PRESENT_ABSENT_DATA);
    return JSON.parse(data)
}
export const setPresentAbsentStudent = async (data) => {
    const value = JSON.stringify(data)
    const saved = await AsyncStorage.setItem(SET_PRESENT_ABSENT_DATA, value);
    if (saved) {
        return true
    } else {
        return false
    }
}

export const getErrorMessage = async () => {
    const message = await AsyncStorage.getItem(SET_ERROR_MESSAGE)
    if (message != null) {
        return JSON.parse(message)
    } else {
        return 
    }
}

export const setRememberUser = async (data) => {
    let json = data;
    await setData(REMEMBERME_KEY, json);
    console.log('json_setData', json)

};

export const setRememberPassword = async (data) => {
    let json = data;
    await setData(REMEMBERME_KEY_PASS, json);
    console.log('json_setData', json)

};


export const getRememberedUser = async () => {
    let schoolId = await getData(REMEMBERME_KEY);
    if (schoolId != null) {
        console.log('json_schoolId_getData', schoolId)
        return schoolId
    } else {
        return
    }
};

export const getRememberedPassword = async () => {
    let password = await getData(REMEMBERME_KEY_PASS);
    if (password != null) {
        console.log('json_password_getData', password)
        return password
    } else {
        return
    }
};

export const forgetUser = async () => {
    try {
        await AsyncStorage.removeItem(REMEMBERME_KEY);
    } catch (error) {
        // Error removing
    }
}

export const forgetUserpass = async () => {
    try {
        await AsyncStorage.removeItem(REMEMBERME_KEY_PASS);
    } catch (error) {
        // Error removing
    }
}


export const setMultiBranding = async (data) => {
    let json = JSON.stringify(data);
    await AsyncStorage.setItem(MULTIBRAND_KEY, json);
    console.log('MULTIBRAND_KEY_settttt', json)

};
export const getMultiBranding = async () => {
    let multibrandData = await AsyncStorage.getItem(MULTIBRAND_KEY);
    if (multibrandData != null) {
        console.log('MULTIBRAND_KEY////////', multibrandData)
        return multibrandData
    } else {
        return
    }
}

export const removeMultiBranding = async () => {
    try {
        await AsyncStorage.removeItem(MULTIBRAND_KEY);
        console.log('removeItem???????????????????')
    } catch (error) {
        // Error removing
        console.log('error',error)
    }
}

export const erasesetTotalStudent = async () => {
    await AsyncStorage.removeItem(SAVE_TOTAL_STUDENT)
}

export const erasesetAbsentStudentDataIntoAsync = async () => {
    await AsyncStorage.removeItem(SAVE_ABSENT_DATA_INTO_LOCAL)
}

export const erasesetLoginCred = async () => {
    await AsyncStorage.removeItem(LOGIN_CRED_KEY)
}

export const erasesetLoginData = async () => {
    await AsyncStorage.removeItem(LOGIN_DATA_KEY)
}

export const erasesetScanData = async () => {
    await AsyncStorage.removeItem(SCAN_KEY)
}

export const erasesetStudentsExamData = async () => {
    await AsyncStorage.removeItem(STUDENTS_EXAM_KEY)
}

export const erasesetFetchedScanData = async () => {
    await AsyncStorage.removeItem(FETCH_SCAN_KEY)
}

export const erasesetScannedDataIntoLocal = async () => {
    await AsyncStorage.removeItem(SAVED_SCANNED_DATA_INTO_LOCAL)
}

export const erasegetPresentAbsentStudent = async () => {
    await AsyncStorage.removeItem(SET_PRESENT_ABSENT_DATA)
}
