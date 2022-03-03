import React from 'react';
import { Linking, Modal, StyleSheet, Text, View } from 'react-native';

//constant
import C from '../../../flux/actions/constants';

//redux
import {  useDispatch } from 'react-redux';
import { monospace_FF } from '../../../utils/CommonUtils';

const ModalView = ({
  modalVisible,
  modalMessage
}) => {

  const dispatch = useDispatch();

  const dispatchModalStatus = (value) => {
    return ({
      type: C.MODAL_STATUS,
      payload: value
    })
  }

  const setModalVisible = () => {
    dispatch(dispatchModalStatus(!modalVisible))
  }

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible()
        }}
        statusBarTranslucent={true}
      >
        <View style={styles.centeredView}>
          <View style={[styles.cardView,]}>

            
            <Text style={[styles.version,{marginTop:10}]}>About</Text>
            <Text style={{fontFamily : monospace_FF}}>{modalMessage['saral.info']}</Text>

            <Text style={[styles.version,{marginTop:10}]}>Documentation</Text>
            <Text 
            style={{color:'blue',fontFamily : monospace_FF}} 
            onPress={()=>Linking.openURL((modalMessage['saral.documentation.link']))}>{modalMessage['saral.documentation.link']}</Text>
           
            <View style={styles.row}>
            <Text style={styles.version}>Release Version</Text>
            <Text 
            style={{color:'blue',fontFamily : monospace_FF}}
            onPress={()=> Linking.openURL(modalMessage['release.link'])}
            >{modalMessage['saral.release.version']}</Text>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000B5"
  },
  cardView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 20
  },
  row: {
    flexDirection:'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center'
  },
  version:{
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily : monospace_FF
  }
});
export default ModalView;