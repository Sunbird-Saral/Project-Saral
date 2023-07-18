import React,{useState} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { monospace_FF,MARKS_INFO,MARKS_INFO_DEFAULT } from '../../utils/CommonUtils';
import ButtonComponent from '../common/components/ButtonComponent';
import ModalPopup from '../common/components/Modal';
import MarksHeaderTable from '../ScannedDetails/MarksHeaderTable';
import Strings from '../../utils/Strings';
const{width,height} = Dimensions.get('window');
const ScanStatusList = ({
    themeColor1,
    themeColor2,
    id,
    studentList,
    scanitemdata,
    BrandLabel,
    Review = "Review",
    Reviewd = "Reviewd",
    index
}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [reviewed, setReviewd] = useState(true)
    console.log('reviewed',reviewed);

    let studentName = studentList.filter((e) => {
        if (id == e.studentId) {
            return true
        }
    })
    
    const renderSRNo = (m, i) => {
        return `${i + 1}`
    }

    const closeModelfun = () =>{
        setModalVisible(!modalVisible)
        setReviewd(false)
    }

    
    return (
        <View style={{flexDirection:'row',margin:5,justifyContent:'center', alignItems:'center'}}>
             <View style={{width:'10%',height:studentName[0] && studentName[0].name.length >50 ? 100:50,borderWidth:0.5,border:10,justifyContent:'center',alignItems:'center',backgroundColor:AppTheme.WHITE}}>
             <Text>{index + 1}</Text>
          </View>
          <View style={{width:'50%',backgroundColor:AppTheme.WHITE}}>
             <View style={{height:25,borderWidth:0.5,border:10,justifyContent:'center'}}>
             <Text style={{marginLeft:10}}>{id}</Text>
             </View>
             <View style={{height:studentName[0] && studentName[0].name.length >50 ? 75 :25,borderWidth:0.5,border:10,justifyContent:'center'}}>
             <Text style={{marginLeft:10}}>{studentName.length > 0 && studentName[0].name}</Text>
             </View>
             </View>
             <View style={{ width:'35%' }}>
                    <ButtonComponent
                        customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: !reviewed ? themeColor2 ? '#AED3D3' : AppTheme.BLUE :  themeColor1 ? themeColor1 : AppTheme.BLUE,height:studentName[0] && studentName[0].name.length >50 ? 100:50}]}
                        customBtnTextStyle={[styles.buttonText,{color:!reviewed ? 'black' : 'white'}]}
                        btnText={!reviewed ? Reviewd.toUpperCase() :Review.toUpperCase()}
                        activeOpacity={0.8}
                        onPress={() => setModalVisible(true)}
                    />
                </View>
            <ModalPopup
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
                onPress={closeModelfun}
                btnText={Strings.close.toUpperCase()}
                themeColor1={themeColor1}
                themeColor2={themeColor2}
                borderCutomStyle={[styles.borderStyle, { borderColor: themeColor1 ? themeColor1 : AppTheme.GREEN,backgroundColor: themeColor1 ? themeColor2 : AppTheme.GREEN}]}
                data={
                    <View style={{ marginVertical: 0 }}>
                         <Text style={styles.textStyle}>{`studentId : ` }<Text style={{fontWeight:'normal',fontFamily : monospace_FF}}>{`${scanitemdata&&scanitemdata.studentId}`}</Text></Text>
                        <Text style={styles.textStyle}>{`predictedStudentId : ` }<Text style={{fontWeight:'normal',fontFamily : monospace_FF}}>{`${scanitemdata&&scanitemdata.predictedStudentId ? scanitemdata.predictedStudentId:''}`}</Text></Text>
                        <Text style={styles.textStyle}>{`section :` }<Text style={{fontWeight:'normal',fontFamily : monospace_FF}}>{`${scanitemdata&&scanitemdata.section}`}</Text></Text>
                        <Text style={styles.textStyle}>{`studentAvailability : ` }<Text style={{fontWeight:'normal',fontFamily : monospace_FF}}>{`${scanitemdata&&scanitemdata.studentAvailability}`}</Text></Text>
                        <Text style={styles.textStyle}>{`marksInfo : `}</Text>

                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            {
                              BrandLabel && MARKS_INFO ?
                             <View style={{ flexDirection: 'row', width: '100%' }}>
                               <MarksHeaderTable
                                 customRowStyle={{width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={BrandLabel && BrandLabel.sr_no || MARKS_INFO.sr_no}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                               <MarksHeaderTable
                                 customRowStyle={{width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={BrandLabel && BrandLabel.questionId || MARKS_INFO.questionId}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                               <MarksHeaderTable
                                 customRowStyle={{ width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={BrandLabel && BrandLabel.obtainedMarks || MARKS_INFO.obtainedMarks}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                                <MarksHeaderTable
                                 customRowStyle={{ width:width/4.5, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={BrandLabel && BrandLabel.predictedMarks || MARKS_INFO.predictedMarks}
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
                                            customRowStyle={{width:width/4.5 }}
                                            rowTitle={renderSRNo(M, i)}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                                        />
                                        <MarksHeaderTable
                                            customRowStyle={{ width:width/4.5 }}
                                            rowTitle={M.questionId}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                            
                                        />
                                        <MarksHeaderTable
                                            customRowStyle={{width:width/4.5 }}
                                            rowTitle={M.obtainedMarks}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                                        />
                                        <MarksHeaderTable
                                            customRowStyle={{width:width/4.5 }}
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
export default ScanStatusList;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 40,
        padding: 15,
        borderRadius: 10
    },
    childCon: {
        backgroundColor: 'white',
        borderWidth: 1
    },
    align: {
        textAlign: 'center',
        padding: 8,
        fontFamily : monospace_FF
    },
    line: {
        height: 1,
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
    nxtBtnStyle1: {
        padding: 5, marginVertical: 5, height: 50,marginLeft:0,borderBottomRightRadius:5,borderTopRightRadius:5,borderBottomLeftRadius:0,borderTopLeftRadius:0
    },
    borderStyle: {
        borderWidth: 5,
        margin: 5,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 14
    }
});