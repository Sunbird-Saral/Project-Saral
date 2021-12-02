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

const checkNetworkConnectivity = () => {
    const subscribe = NetInfo.addEventListener(state => {
        return state.isConnected
    })
    return subscribe()
}


const testPushNotification = (title, msg) => {

    PushNotification.createChannel(
        {
            channelId: "1dzD0LtdsIe6n1OalyqYdQZvrFv1", // (required)
            channelName: "Notifications", // (required)
            channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
            soundName: "notification.mp3",
            importance: 4,
            vibrate: true,
        });

    PushNotification.configure({
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true
    })

    PushNotification.localNotification({
        channelId: "1dzD0LtdsIe6n1OalyqYdQZvrFv1",
        smallIcon: "ic_notification",
        color: "white",
        vibrate: true,
        shortcutId: "shortcut-id",
        title: title,
        message: msg,
        playSound: true,
        soundName: "notification.mp3",
        priority: "high"
    });
}


setTimeout(() => {
    storeFactory.dispatch(flagAction(true))
    if (checkNetworkConnectivity()) {
        testPushNotification("Uploading...☻☻☻", "please wait we are uploading")
    }
}, 9000);


const AppNavigation = createSwitchNavigator(
    {
        auth: AuthStack,
        mainMenu: MainStack,
    },
    {
        initialRouteName: 'auth',
    }
);


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        bgFlag: bgFlag
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(AppContainer = createAppContainer(AppNavigation));
