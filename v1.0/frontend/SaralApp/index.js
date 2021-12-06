 /**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {decode, encode} from 'base-64'
import PushNotification from "react-native-push-notification";




PushNotification.createChannel(
    {
        channelId: "1dzD0LtdsIe6n1OalyqYdQZvrFv1", // (required)
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