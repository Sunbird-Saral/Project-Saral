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
        selectDetails: {
            screen: SelectDetailsComponent
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
        StudentsList: {
            screen: StudentsList
        },
        ScanHistory: {
            screen: ScanHistory
        },
        ScanStatus: {
            screen: ScanStatus
        }
    },
    {
        initialRouteName: 'dashboard',
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
