 /**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, AppState } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {decode, encode} from 'base-64'
import PushNotification from "react-native-push-notification";
import Strings from './src/utils/Strings';




PushNotification.createChannel(
    {
        channelId: Strings.saral_app_auto_sync_channel, // (required)
        channelName: "Notifications", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.,
        importance: 4,
        playSound: true,
        vibrate: true
    });


PushNotification.configure({
    onRegister: function (token) {
    },

    onNotification: function (notification) {
    },
    onAction: function (notification) {
    },
    onRegistrationError: function (err) {
        console.error(err.message, err);
    },

    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);


if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}