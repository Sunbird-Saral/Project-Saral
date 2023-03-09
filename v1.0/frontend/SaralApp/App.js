/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  BackHandler,
  Linking
} from 'react-native';

import AppNavigator from './src/navigator/AppNavigator'
import { Provider } from 'react-redux';
import { storeFactory } from './src/flux/store/store';
import { setCustomText, setCustomTextInput, setCustomTouchableOpacity } from 'react-native-global-props';

//npm
import checkVersion from 'react-native-store-version';
import { apkURL, apkVersionId } from './src/configs/config';
import { getLoginData } from './src/utils/StorageUtils';
import { collectErrorLogs } from './src/modules/CollectErrorLogs';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { firebase } from '@react-native-firebase/perf';
const customTextProps = {
  allowFontScaling: false,
};

const customTextInputProps = {
  allowFontScaling: false,
};

const customTouchableOpacityProps = {
  
	allowFontScaling: false,
};

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);
setCustomTouchableOpacity(customTouchableOpacityProps);


const App = () => {
  
  useEffect(async() => {
    let hasAppForceEnable = await getLoginData();
    StatusBar.setBackgroundColor('#FFF')
    if (hasAppForceEnable != null) {
      if (hasAppForceEnable.school.hasOwnProperty("isAppForceUpdateEnabled") && hasAppForceEnable.school.isAppForceUpdateEnabled) {
        checkAppVersion();
      }
    }
  },[])

  const checkAppVersion = async () => {
    try {

      const check = await checkVersion({
        version: apkVersionId, // app local version
        iosStoreURL: 'ios app store url',
        androidStoreURL: apkURL,
        country: 'IN', // default value is 'jp'
      });

      if (check.result == 'new') {
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
      collectErrorLogs("App.js","checkAppVersion MEthod", apkURL, error, false)
    }
}


function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

  return (
    <>
      <Provider store={storeFactory}>
          {Platform.os !== 'ios' &&  <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />}
          <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <AppNavigator 
             onNavigationStateChange={async (prevState, currentState) => {
              const currentRouteName = getActiveRouteName(currentState);
              const previousRouteName = getActiveRouteName(prevState);
        
              if (previousRouteName !== currentRouteName) {
                // the line below uses the @react-native-firebase/analytics tracker
                // change the tracker here to use other Mobile analytics SDK.
                  // alert(currentRouteName)
                await analytics().logScreenView({
                  screen_name: currentRouteName,
                  screen_class: currentRouteName
                });
              }
            }} 
            />
          </SafeAreaView>
      </Provider>
    </>
  );
};

export default App;



// import React, { useEffect } from 'react';
// import { View, Button } from 'react-native';
// import crashlytics from '@react-native-firebase/crashlytics';

// async function onSignIn(user) {
//   crashlytics().log('User signed in.');
//   await Promise.all([
//     crashlytics().setUserId(user.uid),
//     crashlytics().setAttribute('credits', String(user.credits)),
//     crashlytics().setAttributes({
//       role: 'admin',
//       followers: '13',
//       email: user.email,
//       username: user.username,
//     }),
//   ]);
// }

// export default function App() {
//   useEffect(() => {
//     crashlytics().log('App mounted.');
//   }, []);

//   return (
//     <View>
//       <Button
//         title="Sign In"
//         onPress={() =>
//           onSignIn({
//             uid: 'Aa0Bb1Cc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9',
//             username: 'Joaquin Phoenix',
//             email: 'phoenix@example.com',
//             credits: 42,
//           })
//         }
//       />
//       <Button title="Test Crash" onPress={() => crashlytics().crash()} />
//     </View>
//   );
// }