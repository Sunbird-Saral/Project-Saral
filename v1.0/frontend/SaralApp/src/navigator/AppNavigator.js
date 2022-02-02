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
import ScanStatusLocal from "../modules/ScanStatus/scanStatusLocal";


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

const AppNavigation = createSwitchNavigator(
    {
        auth: AuthStack,
        mainMenu: MainStack,
    },
    {
        initialRouteName: 'auth',
    }
);



export default (AppContainer = createAppContainer(AppNavigation));