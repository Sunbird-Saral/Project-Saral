import React from 'react'
import { Text, View, StyleSheet, Pressable, ScrollView,Modal } from 'react-native';
import ButtonComponent from './ButtonComponent';
import AppTheme from '../../../utils/AppTheme';
import { monospace_FF } from '../../../utils/CommonUtils';
import Strings from '../../../utils/Strings';

const ModalPopup = ({
    visible,
    onPress,
    onRequestClose,
    btnText,
    themeColor1,
    data,
    borderCutomStyle
})=> {
    
  return (
    <View>
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose= {onRequestClose}
      >
       <View style={{ backgroundColor: '#fff', flex: 1,bottom:5 }}>
        <ScrollView scrollEnabled showsVerticalScrollIndicator={false}>
          <View style={borderCutomStyle}>
            <Text style={[styles.modalText]}>{data}</Text>
            </View>
            <Pressable
              style={[styles.nxtBtnStyle,{ backgroundColor: themeColor1 ? themeColor1 : AppTheme.BLUE }]}
              onPress={onPress}
              activeOpacity={0.8}    
            >
              <Text style={styles.btnTextStyle}>{btnText}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
      </View>
  )
}
const styles = StyleSheet.create({
centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  btnTextStyle: {
    textAlign: 'center',
    fontSize: AppTheme.FONT_SIZE_LARGE,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: AppTheme.WHITE,
    fontFamily : monospace_FF,
},
  modalText: {
   padding:10
  },
  nxtBtnStyle:{marginHorizontal:20, borderRadius: 10,padding:15 },
  modelView:{
    margin:10,
    borderWidth:5
  }
});
export default ModalPopup