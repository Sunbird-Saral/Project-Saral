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
import NewRelic from 'newrelic-react-native-agent';
import {Platform} from 'react-native';
import * as appVersion from './package.json';
console.log('appVersion',appVersion.version);
console.log('Platform',Platform);

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

let appToken;

if (Platform.OS === 'ios') {
    appToken = 'AAa4f98b48afc14ae704f5a29f4950f1e65a90a3e7-NRMA';
} else {
    appToken = 'AAa4f98b48afc14ae704f5a29f4950f1e65a90a3e7-NRMA';
}


const agentConfiguration = {

//Android Specific
// Optional:Enable or disable collection of event data.
analyticsEventEnabled: true,

// Optional:Enable or disable crash reporting.
crashReportingEnabled: true,

// Optional:Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
interactionTracingEnabled: true,

// Optional:Enable or disable reporting successful HTTP requests to the MobileRequest event type.
networkRequestEnabled: true,

// Optional:Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
networkErrorRequestEnabled: true,

// Optional:Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
httpResponseBodyCaptureEnabled: true,

// Optional:Enable or disable agent logging.
loggingEnabled: true,

// Optional:Specifies the log level. Omit this field for the default log level.
// Options include: ERROR (least verbose), WARNING, INFO, VERBOSE, AUDIT (most verbose).
logLevel: NewRelic.LogLevel.INFO,

// iOS Specific
// Optional:Enable/Disable automatic instrumentation of WebViews
webViewInstrumentation: true,

// Optional:Set a specific collector address for sending data. Omit this field for default address.
collectorAddress: "",

// Optional:Set a specific crash collector address for sending crashes. Omit this field for default address.
crashCollectorAddress: ""
};
NewRelic.startAgent(appToken,agentConfiguration);
NewRelic.setJSAppVersion(appVersion.version);
AppRegistry.registerComponent(appName, () => App);


if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}