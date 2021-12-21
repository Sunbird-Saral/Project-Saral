/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, AppState } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { decode, encode } from 'base-64'
import { eraseErrorLogs } from './src/utils/StorageUtils';


 AppState.addEventListener("change", nextAppState => {
    if (nextAppState === "active") {
    }
    // if (nextAppState === "background") {
    //     eraseErrorLogs()
    // }
});


AppRegistry.registerComponent(appName, () => App);


if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}