import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

//constant
import C from '../../../flux/actions/constants';

//redux
import {  useDispatch } from 'react-redux';

const modalView = ({
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
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible()
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.cardView,]}>
            <View style={styles.row}>
            <Text style={styles.version}>Saral Release Version</Text>
            <Text>{modalMessage['saral.release.version']}</Text>
            </View>

            
            <Text style={[styles.version,{marginTop:10}]}>Saral Info</Text>
            <Text>{modalMessage['saral.info']}</Text>

            <Text style={[styles.version,{marginTop:10}]}>saral documentation link</Text>
            <Text>{modalMessage['saral.documentation.link']}</Text>

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
    margin: 40
  },
  row: {
    flexDirection:'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center'
  },
  version:{
    fontWeight: 'bold',
    fontSize: 18
  }
});
export default modalView;