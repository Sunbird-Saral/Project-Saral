import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { monospace_FF } from '../../utils/CommonUtils';
import ModalPopup from '../common/components/Modal';
import Strings from '../../utils/Strings';
import ButtonComponent from '../common/components/ButtonComponent';

const ScanStatusLocalList = ({
    themeColor1,
    id,
    loacalstutlist,
    loacalstutlistdata,
    status = "Saved",
    Review = "Review",
    minimalFlag = false
}) => {
    const [modalVisible, setModalVisible] = useState(false)
    let studentName = loacalstutlist.filter((e) => {
        if (id.studentId == e.studentId) {
            return true
        }
    })

 
     console.log('marksInfodata',id );
    return (
        <View style={[styles.container, { backgroundColor: themeColor1 ? themeColor1 : AppTheme.GREEN }]}>
            <View style={styles.childCon}>
                {
                    !minimalFlag
                    &&
                    <>
                        <Text style={styles.align}>{studentName.length > 0 && studentName[0].name}</Text>
                        <View style={styles.line} />
                    </>
                }
                <Text style={styles.align}>{id.studentId}</Text>
                <View style={styles.line} />
                <Text style={styles.align}>{status}</Text>
                <View style={styles.line} />
                <View style={{alignItems:'center'}}>
            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: themeColor1 ?themeColor1 : AppTheme.BLUE }]}
                customBtnTextStyle={styles.buttonText}
                btnText={Review.toUpperCase()}
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
                />
                </View>

            </View>
            <ModalPopup
                     visible={modalVisible}
                     onRequestClose={() => setModalVisible(!modalVisible)}
                     onPress={() => setModalVisible(!modalVisible)}
                     btnText={Strings.close.toUpperCase()}
                     themeColor1={themeColor1}
                     borderCutomStyle={[styles.borderStyle,{borderColor:themeColor1 ? themeColor1 : AppTheme.GREEN }]}
                     data ={
                     <View style={{marginVertical:0}}>
                     <Text style={styles.textStyle}>{`studentId : ${id.studentId}`}</Text>
                     <Text style={styles.textStyle}>{`predictedStudentId : ${id.predictedStudentId}`}</Text>
                     {/* <Text style={styles.textStyle}>{`set : ${id.set}`}</Text> */}
                     <Text style={styles.textStyle}>{`section : ${id.section}`}</Text>
                     <Text style={styles.textStyle}>{`securedMarks :${id.securedMarks}`}</Text>
                     <Text style={styles.textStyle}>{`studentAvailability : ${id.studentAvailability}`}</Text>
                     <Text style={styles.textStyle}>{`marksInfo`} :</Text>
                           {id && id.marksInfo.map((m)=>{
                            return(
                              <Text style={{marginLeft:20,fontSize:14,fontWeight:'400'}}>
                                {`obtainedMarks : ${m.obtainedMarks}`}{'\n'} 
                                {`predictedMarks : ${m.predictedMarks}`}{'\n'}
                                {`predictionConfidence: ${m.predictionConfidence}`}{'\n'}
                                {`questionId : ${m.questionId}`}{'\n'}
                                
                                </Text>
                            )
                           })}
                     
    
                           {/* </Text> */}
                           </View>}
                />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 40,
        padding: 15,
        borderRadius: 10
    },
    childCon: {
        backgroundColor: 'white',
        borderWidth: 1,
        // width:'90%'
    },
    align: {
        textAlign: 'center',
        padding: 8,
        fontFamily: monospace_FF
    },
    line: {
        height: 1,
        // width:'80%',
        backgroundColor: AppTheme.BLACK
    },
    textStyle :{
        fontSize:15,
        fontWeight:'600',
        color:"#000"
    },
    borderStyle :{
        borderWidth:5,
        margin:5,
        borderRadius:10
    },
    nxtBtnStyle1:{
        padding:5,marginVertical:5,height:35,width:150
    },
    buttonText:{
        fontSize:14
    }
});
export default ScanStatusLocalList;

