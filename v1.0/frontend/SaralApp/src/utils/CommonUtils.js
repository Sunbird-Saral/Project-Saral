import moment from 'moment'
import C from '../flux/actions/constants'
import NetInfo from "@react-native-community/netinfo";
import { getLoginData } from './StorageUtils';
import checkVersion from 'react-native-store-version';
import { apkURL, apkVersionId } from '../configs/config';
import { Alert, BackHandler, Linking } from 'react-native';
import { collectErrorLogs } from '../modules/CollectErrorLogs';


export const validateToken = (expireTime) => {
    let expireArr = expireTime.replace(/-/g, '/').split('/')
    let formattedExpireTime = expireArr[1] + '/' + expireArr[0] + '/' + expireArr[2]

    let tokenExpireTime = moment(new Date(Date.parse(formattedExpireTime)))
    let currentTime = moment()
    if (currentTime > tokenExpireTime) {
        return false
    }
    else {
        return true
    }
}

export const cryptoText = (text) => {
    let strTempChar = ''
    let encText = ''
    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i)
        if (char.charCodeAt(0) < 128) {
            strTempChar = char.charCodeAt(0) + 128
        }
        else if (char.charCodeAt(0) > 128) {
            strTempChar = char.charCodeAt(0) - 128
        }
        encText += String.fromCharCode(strTempChar)
    }
    return encText
}

export const dispatchCustomModalMessage = (value) => {
    return ({
        type: C.CUSTOM_MODAL_MESSAGE,
        payload: value
    })
}

export const dispatchCustomModalStatus = (value) => {
    return ({
        type: C.CUSTOM_MODAL_STATUS,
        payload: value
    })
}

export const checkNetworkConnectivity = async () => {
    let subscribe = false
   await NetInfo.fetch().then(state => {
        subscribe = state.isConnected;
    });
    return subscribe
}

export const checkAppVersion = async () => {
    let hasAppForceEnable = await getLoginData();
    let hasUpdate = false;
    if (hasAppForceEnable != null) {
        if (hasAppForceEnable.school.hasOwnProperty("isAppForceUpdateEnabled") && hasAppForceEnable.school.isAppForceUpdateEnabled) {
            try {
                const check = await checkVersion({
                  version: apkVersionId, // app local version
                  iosStoreURL: 'ios app store url',
                  androidStoreURL: apkURL,
                  country: 'IN', // default value is 'jp'
                });
          
                if (check.result == 'new') {
                 hasUpdate = true
                  Alert.alert(
                    'Please Update',
                    'You will have to update your app to the latest version to continue using.',
                    [
                      {
                        text : 'Update',
                        onPress: () => {
                          BackHandler.exitApp();
                          Linking.openURL(apkURL)
                        },
                      },
                    ],
                    {cancelable: false}
                  );
                }
              } catch (error) {
                collectErrorLogs("CommonUtils.js","checkAppVersion MEthod", apkURL, error, false)
                hasUpdate = false
              }
        }
    }
    
    return hasUpdate;
}


export const SCAN_TYPES = {
    SAT_TYPE: 'sat',
    PAT_TYPE: 'pat'
}

export const MARKS_INFO = {
    "sr_no":"Sr No",
    "questionId":"question Id",
    "obtainedMarks":"obtained Marks",
    "predictedMarks":"predicted Marks"
}

export const MARKS_INFO_DEFAULT = [
    "Sr No",
    "Question",
    "Obtained Marks",
    "Predicted Marks"
]

export const TABLE_HEADER = [
    "Sr No", "Questions", "Marks"
]

export const defaultHeaderTable = {
    "id": "Identifier",
    "sr_no": "Sr No",
    "questions":"Questions",
    "marks":"Marks"  
}

export const TABLE_HEADER_WITH_TAG = [
    "Sr No", "Questions", "Marks", "Tags"
]

export const Exam_QuestionHeader = [
    "Question Id", "Indicator Title", "Question Marks"
]

export const neglectData = ["ROLLNUMBER", "STUDENTID", "MARKS_OBTAINED", "MAX_MARKS", "ROLLID"];

export const student_ID = ["ROLLNUMBER", "STUDENTID", "ROLLID"]

export const multipleStudent = ["ROLLNUMBERID"]

export const CELL_OMR = "CELL_OMR"

export const studentLimitSaveInLocal = 500

export const monospace_FF = 'sans-serif-medium'