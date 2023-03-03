import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, BackHandler, Pressable, Dimensions } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { monospace_FF, MARKS_INFO,MARKS_INFO_DEFAULT} from '../../utils/CommonUtils';
import ModalPopup from '../common/components/Modal';
import Strings from '../../utils/Strings';
import ButtonComponent from '../common/components/ButtonComponent';
import MarksHeaderTable from '../ScannedDetails/MarksHeaderTable';

const{width,height} = Dimensions.get('window');
const ScanStatusLocalList = ({
    themeColor1,
    id,
    loacalstutlist,
    scanitemdata,
    status = "Saved",
    Review = "Review",
    minimalFlag = false,
    BrandLabel
}) => {
    const [modalVisible, setModalVisible] = useState(false)
    let studentName = loacalstutlist.filter((e) => {
        if (id == e.studentId) {
            return true
        }
    })

    const renderSRNo = (m, i) => {
        return `${i + 1}`
    }
  
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
                <Text style={styles.align}>{id}</Text>
                <View style={styles.line} />
                <Text style={styles.align}>{status}</Text>
                <View style={styles.line} />
                <View style={{ alignItems: 'center' }}>
                    <ButtonComponent
                        customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: themeColor1 ? themeColor1 : AppTheme.BLUE }]}
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
                borderCutomStyle={[styles.borderStyle, { borderColor: themeColor1 ? themeColor1 : AppTheme.GREEN }]}
                data={
                    <View style={{  }}>
                        <Text style={styles.textStyle}>{`studentId : `}<Text style={{fontWeight:'normal',fontFamily : monospace_FF}}>{`${scanitemdata&&scanitemdata.studentId}`}</Text></Text>
                        <Text style={styles.textStyle}>{`predictedStudentId : ` }<Text style={{fontWeight:'normal',fontFamily : monospace_FF}}>{`${scanitemdata&&scanitemdata.predictedStudentId ? scanitemdata.predictedStudentId : ''}`}</Text></Text>
                        <Text style={styles.textStyle}>{`section : ` }<Text style={{fontWeight:'normal',fontFamily : monospace_FF}}>{`${scanitemdata&&scanitemdata.section}`}</Text></Text>
                        <Text style={styles.textStyle}>{`studentAvailability : ` }<Text style={{fontWeight:'normal',fontFamily : monospace_FF}}>{`${scanitemdata&&scanitemdata.studentAvailability}`}</Text></Text>
                        <Text style={styles.textStyle}>{`marksInfo : `}</Text>

                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            {
                              BrandLabel && MARKS_INFO ?
                             <View style={{ flexDirection: 'row', width: '100%' }}>
                               <MarksHeaderTable
                                 customRowStyle={{width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={ BrandLabel && BrandLabel.sr_no || MARKS_INFO.sr_no}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                               <MarksHeaderTable
                                 customRowStyle={{width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={ BrandLabel && BrandLabel.questionId || MARKS_INFO.questionId}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                               <MarksHeaderTable
                                 customRowStyle={{ width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={ BrandLabel && BrandLabel.obtainedMarks || MARKS_INFO.obtainedMarks}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                                <MarksHeaderTable
                                 customRowStyle={{ width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={ BrandLabel && BrandLabel.predictedMarks || MARKS_INFO.predictedMarks}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                             </View>
                             :
                             MARKS_INFO_DEFAULT.map((data) => {
                                return (
                                    <MarksHeaderTable
                                        customRowStyle={{ width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER }}
                                        key={data}
                                        rowTitle={data}
                                        rowBorderColor={AppTheme.TAB_BORDER}
                                        editable={false}
                                    />
                                )
                            })
                            } 
                        </View>
                        {
                            scanitemdata && scanitemdata.marksInfo.map((M, i) => {
                                return (
                                    <View M={M} key={i} style={{ flexDirection: 'row' }}>

                                        <MarksHeaderTable
                                            customRowStyle={{height:height/12,width:width/4.5 }}
                                            rowTitle={renderSRNo(M, i)}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                                        />
                                        <MarksHeaderTable
                                            customRowStyle={{height:height/12, width:width/4.5 }}
                                            rowTitle={M.questionId}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                            
                                        />
                                        <MarksHeaderTable
                                            customRowStyle={{height:height/12,width:width/4.5 }}
                                            rowTitle={M.obtainedMarks}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                                        />
                                        <MarksHeaderTable
                                            customRowStyle={{height:height/12,width:width/4.5 }}
                                            rowTitle={M.predictedMarks}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                            
                                        />
                                        

                                    </View>
                                )
                                // }
                            })
                        }
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
    textStyle: {
        fontSize: 15,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        paddingHorizontal: '5%',
        paddingVertical: '2%',
        fontFamily : monospace_FF
    },
    borderStyle: {
        borderWidth: 5,
        margin: 5,
        borderRadius: 10
    },
    nxtBtnStyle1: {
        padding: 5, marginVertical: 5, height: 35, width: 150
    },
    nxtBtnStyle:{marginHorizontal:20, borderRadius: 10,height: 40, width: width/1.5,padding: 5, marginTop:10 },
    buttonText: {
        fontSize: 14
    }
});
export default ScanStatusLocalList;

