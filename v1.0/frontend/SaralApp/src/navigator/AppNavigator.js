import {
    createAppContainer,
    createSwitchNavigator,
} from "react-navigation";

import { createStackNavigator } from 'react-navigation-stack'
import LoginComponent from "../modules/loginScreens/LoginComponent";
import MyScanComponent from '../modules/myScanScreens/MyScanComponent';
import ScanDetailsComponent from "../modules/myScanScreens/ScanDetailsComponent";
import SelectDetailsComponent from "../modules/myScanScreens/SelectDetailsComponent";
import PatScanDetailsComponent from "../modules/myScanScreens/PatScanDetailsComponent";
import SatScanDetailsComponent from "../modules/myScanScreens/SatScanDetailsComponent";
import StudentsList from "../modules/StudentsList/StudentsList";
import ScanHistory from "../modules/ScanHistory/ScanHistory";
import ScanStatus from "../modules/ScanStatus/ScanStatus";
import DashboardComponent from '../modules/myScanScreens/DashboardComponent'
import ScannedDetailsComponent from "../modules/ScannedDetails/ScannedDetailsComponent";
import HomeComponent from "../modules/myScanScreens/Homescreen"
import { bindActionCreators } from "redux";
import { connect, useDispatch } from "react-redux";
import bgFlag from './../flux/reducers/bgFlag'
import { storeFactory } from '../flux/store/store'
import C from '../flux/actions/constants'
import NetInfo from "@react-native-community/netinfo";
import PushNotification, { Importance } from "react-native-push-notification";
import { getScannedDataFromLocal, setScannedDataIntoLocal } from "../utils/StorageUtils";
import { SaveScanData } from "../flux/actions/apis/saveScanDataAction";
import APITransport from '../flux/actions/transport/apitransport'
import { Alert } from "react-native";
import axios from "axios";
import Strings from "../utils/Strings";
import ScanStatusLocal from "../modules/ScanStatus/scanStatusLocal";
import { collectErrorLogs } from "../modules/CollectErrorLogs";


const AuthStack = createStackNavigator({
    login: {
        screen: LoginComponent
    }
}, {
    initialRouteName: 'login',
    headerMode: 'none'
})

const MainStack = createStackNavigator(
    {
        dashboard: {
            screen: DashboardComponent
        },
        Home: {
            screen: HomeComponent
        },
        selectDetails: {
            screen: SelectDetailsComponent
        },
        StudentsList: {
            screen: StudentsList
        },
        myScan: {
            screen: MyScanComponent
        },
        scanDetails: {
            screen: ScanDetailsComponent
        },
        patScanDetails: {
            screen: PatScanDetailsComponent
        },
        satScanDetails: {
            screen: SatScanDetailsComponent
        },
        ScanHistory: {
            screen: ScanHistory
        },
        ScanStatus: {
            screen: ScanStatus
        },
        ScanStatusLocal: {
            screen: ScanStatusLocal
        },
        ScannedDetailsComponent: {
            screen: ScannedDetailsComponent
        }
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none'
    }
)

function flagAction(payload) {
    return {
        type: C.BACKGROUND_FLAG,
        payload
    }
}

const checkNetworkConnectivity = async () => {
    var subscribe = false
    NetInfo.fetch().then(state => {
        subscribe = state.isConnected;
    });
    return subscribe
}


const testPushNotification = (title, msg) => {

    PushNotification.localNotification({
        channelId: Strings.saral_app_auto_sync_channel,
        // smallIcon: "ic_notification",
        // color: "white",
        vibrate: true,
        // shortcutId: "shortcut-id",
        title: title,
        message: msg,
        playSound: true,
        // soundName: "notification.mp3",
        priority: "high",
        importance: "high"
    });
}


const testCancel = () => {
    PushNotification.cancelAllLocalNotifications()
}

const saveDataInDB = async () => {

    const data = await getScannedDataFromLocal();
    storeFactory.dispatch(flagAction(false))
    if (data != null) {
        let len = 0
        data.forEach(element => {
            len = len + element.studentsMarkInfo.length
        });


        if (len >= 10) {

            storeFactory.dispatch(flagAction(true))
            testPushNotification("Uploading•••", Strings.auto_sync_in_progress_please_wait)
            const loginData = storeFactory.getState().loginData

            data.map(element => {

                let apiObj = new SaveScanData(element, loginData.data.token);
                let apiResponse = null
                const source = axios.CancelToken.source()
                const id = setTimeout(() => {
                    if (apiResponse === null) {
                        source.cancel('The request timed out.');
                    }
                }, 60000);
                axios.put(apiObj.apiEndPoint(), apiObj.getBody(), { headers: apiObj.getHeaders(), cancelToken: source.token },)
                    .then(function (res) {
                        let localDataResponse = removeItemFromLocalStorage(res, data)
                        if (localDataResponse.length == 0) {
                            setScannedDataIntoLocal(localDataResponse)
                            testPushNotification("Uploaded", Strings.auto_sync_completed)
                        }
                        apiResponse = res
                        
                        clearTimeout(id)
                        apiObj.processResponse(res)
                        storeFactory.dispatch(dispatchAPIAsync(apiObj));
                        if (typeof apiObj.getNextStep === 'function' && res.data && (res.status == 200 || res.status == 201))
                            storeFactory.dispatch(apiObj.getNextStep())
                        storeFactory.dispatch(flagAction(false))
                    })
                    .catch(function (err) {
                        collectErrorLogs("AppNavigator.js","backgroundJob",apiObj.apiEndPoint(),err,false)
                        clearTimeout(id)
                        Alert.alert("Something went wrong with background process, please contact Admin")
                        storeFactory.dispatch(flagAction(false))
                    });
            });
        }

    }
}

const removeItemFromLocalStorage = (res, value) => {

    let data = JSON.parse(res.config.data)

    value.forEach((element, index) => {
        if (element.classId == data.classId) {
            value.splice(index, 1)
        }
    });

    return value
}


function dispatchAPIAsync(apiObj) {
    return {
        type: apiObj.type,
        payload: apiObj.getPayload()
    }
}

setInterval(() => {

    const loginData = storeFactory.getState().loginData
    const hasAutoSync = Object.keys(loginData).length > 0  && loginData.data.school.hasOwnProperty("autoSync") && loginData.data.school.autoSync ? true : false
    
    if (hasAutoSync) {
        //get redux value 
        const isLogin = storeFactory.getState().loginData
        if (isLogin.status == 200) {
            storeFactory.dispatch(flagAction(true))
            if (checkNetworkConnectivity()) {
                saveDataInDB()
            }
        }
    }
    //timer for 10 min
}, 600000);


const AppNavigation = createSwitchNavigator(
    {
        auth: AuthStack,
        mainMenu: MainStack,
    },
    {
        initialRouteName: 'auth',
    }
);

const mapStateToProps = (state) => {
    return {
        loginData: state.loginData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        bgFlag: bgFlag,
        APITransport: APITransport
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer = createAppContainer(AppNavigation));