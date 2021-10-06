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
  Platform
} from 'react-native';

import AppNavigator from './src/navigator/AppNavigator'
import { Provider } from 'react-redux';
import { storeFactory } from './src/flux/store/store';
// import RNBootSplash from "react-native-bootsplash";
import { setCustomText, setCustomTextInput, setCustomTouchableOpacity } from 'react-native-global-props';

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
  
  useEffect(() => {
    // RNBootSplash.hide({ duration: 50 });
    StatusBar.setBackgroundColor('#FFF')
  },[])

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
