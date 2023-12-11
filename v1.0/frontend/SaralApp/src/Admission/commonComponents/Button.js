import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {monospace_FF} from '../../utils/CommonUtils';
import AppTheme from '../../utils/AppTheme';

const Button = ({label, onPress, buttonStyle, textStyle, disabled}) => {
  console.log('from button', disabled);
  return (
    <Pressable
      onPress={() => {
        onPress();
      }}
      disabled={disabled}
      style={{
        backgroundColor: AppTheme.BLUE,
        height: 60,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 1,
        shadowColor: 'lightgrey',
        margin: 5,
        opacity: disabled ? 0.5 : 1,
        ...buttonStyle,
      }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: monospace_FF,
          color: AppTheme.WHITE,
          letterSpacing: 0.5,
          ...textStyle,
        }}>
        {label}
      </Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({});
