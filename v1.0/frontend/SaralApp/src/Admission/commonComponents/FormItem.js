import {View, Text, TextInput} from 'react-native';
import React from 'react';
import {monospace_FF} from '../../utils/CommonUtils';

const FormItem = ({item, handleTextChange}) => {
  return (
    <View
      style={{
        padding: 10,
      }}>
      <Text style={{fontFamily: monospace_FF, fontSize: 15}}>
      {item.required && <Text style={{color: 'red'}}>* </Text>}
        {item.label}:
      </Text>
      <TextInput
        style={{
          fontFamily: monospace_FF,
          fontWeight: 'bold',
          height: 50,
          margin: 12,
          borderWidth: 1,
          padding: 10,
          color: 'black',
          fontSize: 18,
          alignItems: 'center',
        }}
        value={item.value}
        onChangeText={newValue => handleTextChange(item.label, newValue)}
        multiline={true}
        placeholder={'NA'}
      />
    </View>
  );
};

export default FormItem;
