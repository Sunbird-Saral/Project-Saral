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
// import RNBootSplash from "react-native-bootsplash";
import { setCustomText, setCustomTextInput, setCustomTouchableOpacity } from 'react-native-global-props';

//npm
import checkVersion from 'react-native-store-version';
import { apkURL, apkVersionId } from './src/configs/config';
import { getLoginData } from './src/utils/StorageUtils';
import { collectErrorLogs } from './src/modules/CollectErrorLogs';

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
    // RNBootSplash.hide({ duration: 50 });
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

  return (
    <>
      <Provider store={storeFactory}>
          {Platform.os !== 'ios' &&  <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />}
          <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <AppNavigator />
          </SafeAreaView>
      </Provider>
    </>
  );
};

export default App;
