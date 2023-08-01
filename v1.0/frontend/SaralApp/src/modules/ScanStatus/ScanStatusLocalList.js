import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, BackHandler, Platform ,PermissionsAndroid, ScrollView } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import ModalPopup from '../common/components/Modal';
import Strings from '../../utils/Strings';
import ButtonComponent from '../common/components/ButtonComponent';
import MarksHeaderTable from '../ScannedDetails/MarksHeaderTable';
import { bindActionCreators } from 'redux';
import { connect,useDispatch } from 'react-redux';

import APITransport from '../../flux/actions/transport/apitransport'
import { checkAppVersion, checkNetworkConnectivity, dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF,neglectData,multipleStudent,MARKS_INFO,MARKS_INFO_DEFAULT } from '../../utils/CommonUtils';
import SystemSetting from 'react-native-system-setting'
import SaralSDK from '../../../SaralSDK'
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction'
import { ReScanButton } from '../../utils/Analytics';

const{width,height} = Dimensions.get('window');
const ScanStatusLocalList = ({
    themeColor1,
    id,
    loacalstutlist,
    scanitemdata,
    status = "Saved",
    Review = "Review",
    Reviewd = "Reviewed",
    minimalFlag = false,
    BrandLabel,
    themeColor2,
    index,
    loginData,
    navigation,
    roiData,
    
}) => {

    console.log('loginData>>>',navigation);
    const [modalVisible, setModalVisible] = useState(false)
    const [reviewed, setReviewd] = useState(true)
    const [roiIndex,setRoiindex] = useState(-1)
    const [activityOpen,setActivityOpen] = useState(false)

    const dispatch = useDispatch()

    let studentName = loacalstutlist.filter((e) => {
        if (id == e.studentId) {
            return true
        }
    })

    useEffect(() => {
        const backAction = () => {
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
      }, []);

    const renderSRNo = (m, i) => {
        return `${i + 1}`
    }

    const navigateFun = () => {
        setModalVisible(!modalVisible)
        setReviewd(false)
        navigation.navigate('ScannedDetailsComponent')
    }

    const closeModelfun = () =>{
        setModalVisible(!modalVisible)
        setReviewd(false)
    }
    const callCustomModal=(title, message, isAvailable, cancel)=> {
        let data = {
            title: title,
            message: message,
            isOkAvailable: isAvailable,
            isCancel : cancel
        }
        dispatchCustomModalStatus(true);
        dispatchCustomModalMessage(data);
    }
    const onScanClick = async () => {
        let hasUpdate = await checkAppVersion();
        if (!hasUpdate) {
        SystemSetting.getBrightness().then((brightness) => {
            // this.setState({ oldBrightness: brightness })
        });

        if (Platform.OS !== 'ios') {
            const grantedRead = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            const grantedWrite = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            const grantedCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)

            if (grantedRead && grantedWrite && grantedCamera) {
                let hasEmpty = roiData.hasOwnProperty("config") ? true : roiData.length > 0
                if (minimalFlag && roiIndex != -1) {
                    if (!hasEmpty) {
                        callCustomModal(Strings.message_text, Strings.roi_cache_not_available,false,false)
                    } else {
                        openCameraActivity()
                        ReScanButton(loginData.data.school.schoolId)
                    }
                } else if (!minimalFlag ) {
                    if (loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode && hasEmpty) {
                        openCameraActivity()
                        ReScanButton(loginData.data.school.schoolId)
                    } else if(loginData.data.school.hasOwnProperty("offlineMode") == false || loginData.data.school.offlineMode == false && hasEmpty){
                        openCameraActivity()
                        ReScanButton(loginData.data.school.schoolId)
                    } else {
                        callCustomModal(Strings.message_text,Strings.roi_cache_not_available,false,false)
                    }
                }
            }
            else {
                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA
                    ],
                    {
                        title: Strings.permission_text,
                        message: Strings.app_needs_permission
                    }
                ).then((permRes) => {
                    if (
                        permRes['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                        permRes['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                        permRes['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
                    ) {
                        if (minimalFlag && roiIndex != -1) {
                            openCameraActivity()
                            ReScanButton(loginData.data.school.schoolId)
                        } else if (!minimalFlag ) {
                            openCameraActivity()
                            ReScanButton(loginData.data.school.schoolId)
                        }
                         else {
                            callCustomModal(Strings.message_text,Strings.please_select_roi_layout,false,false)
                        }
                    } else if (permRes['android.permission.READ_EXTERNAL_STORAGE'] == 'never_ask_again' ||
                        permRes['android.permission.WRITE_EXTERNAL_STORAGE'] == 'never_ask_again' ||
                        permRes['android.permission.CAMERA'] == 'never_ask_again') {
                        Alert.alert(Strings.message_text, Strings.give_permission_from_settings, [
                            { 'text': Strings.ok_text, style: 'cancel' }
                        ]);
                    } else {
                        Alert.alert(Strings.message_text, Strings.please_give_permission_to_use_app, [
                            { 'text': Strings.cancel_text, style: 'cancel' },
                            { 'text': Strings.ok_text, onPress: () => onScanClick }

                        ]);
                    }
                });
            }
        }
    }
    }

   const openCameraActivity = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "SaralSDK Demo App Camera Permission",
                    message:
                        "SaralSDK Demo application require camera to perform scanning operation ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setActivityOpen(!activityOpen)
                let totalPages = roiData.data.layout.hasOwnProperty("pages") && roiData.data.layout.pages
                let pageNumber = totalPages || totalPages > 0 ? "1" : null
                let jsonRoiData = roiData.data
                let hasTimer   =  loginData.data.school.hasOwnProperty("scanTimeoutMs") ? loginData.data.school.scanTimeoutMs : 0
                let isManualEditEnabled   =  loginData.data.school.hasOwnProperty("isManualEditEnabled") ? loginData.data.school.isManualEditEnabled : false
                SaralSDK.startCamera(JSON.stringify(jsonRoiData), pageNumber, hasTimer, isManualEditEnabled).then(res => {
                    let roisData = JSON.parse(res);
                    let cells = roisData.layout.cells;
                    consolidatePrediction(cells, roisData)


                }).catch((code, message) => {
                })
            } else {
            }
        } catch (err) {
        }
    };

   const consolidatePrediction =(cells, roisData)=> {
        var marks = "";
        var predictionConfidenceArray = []
      
        var studentIdPrediction = ""
        for (let i = 0; i < cells.length; i++) {
            marks = ""
            predictionConfidenceArray = []
            for (let j = 0; j < cells[i].rois.length; j++) {
                if (cells[i].rois[j].hasOwnProperty("result")) {
                    marks = marks + cells[i].rois[j].result.prediction
                        predictionConfidenceArray.push(cells[i].rois[j].result.confidence)
                    // roisData.layout.cells[i].predictionConfidence = cells[i].rois[j].result.confidence
                } else {
                    let resultProperty = {
                        "prediction": "0",
                        "confidence": 0
                    }
                    roisData.layout.cells[i].rois[j].result = resultProperty
                }
            }
            roisData.layout.cells[i].consolidatedPrediction = marks
            roisData.layout.cells[i].predictionConfidence = predictionConfidenceArray
            let rollNumber = roisData.layout.cells[i].format.name.replace(/[0-9]/g, '');
            let checkRoLLNumberExist = '';
          
            if (roisData.layout.hasOwnProperty("identifierPrefix")) {
                checkRoLLNumberExist = roisData.layout.identifierPrefix
            
            } else if (rollNumber == neglectData[0]) {
                checkRoLLNumberExist = rollNumber
            } else {
               checkRoLLNumberExist = multipleStudent[0]
            }

            if ((rollNumber === checkRoLLNumberExist && rollNumber.length == checkRoLLNumberExist.length)) {
                roisData.layout.cells[i].studentIdPrediction = marks
            } else if((rollNumber.trim() === checkRoLLNumberExist && rollNumber != 0)){
                roisData.layout.cells[i].studentIdPrediction = marks
            }
            else {
                roisData.layout.cells[i].predictedMarks = marks
            }
        }
        dispatch(OcrLocalResponseAction(JSON.parse(JSON.stringify(roisData))))
        navigation.navigate('ScannedDetailsComponent')
        
       
       
    }

  
    return (
        <ScrollView>
        <View style={{flex:1, flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
             <View style={{width:'10%', height:studentName[0] && studentName[0].name.length >50 ? 100:50,borderWidth:1,borderColor:'#DADADA',borderRightWidth:0, border:10,justifyContent:'center',alignItems:'center',backgroundColor:AppTheme.WHITE}}>
             <Text style={{fontSize:18}}>{index + 1}</Text>
             </View>
             <View style={{width:'50%',backgroundColor:AppTheme.WHITE}}>
             <View style={{height:25,borderWidth:1,borderColor:'#DADADA', border:10,justifyContent:'center'}}>
             <Text style={{marginLeft:10,fontWeight:'bold'}}>{id}</Text>
             </View>
             <View style={{height:studentName[0] && studentName[0].name.length >50 ? 75 :25,borderWidth:1,borderColor:'#DADADA',borderTopWidth:0, border:10,justifyContent:'center'}}>
             {
                    !minimalFlag
                    &&
             <Text style={{marginLeft:10}}>{studentName.length > 0 && studentName[0].name}</Text>
           }
             </View>
             </View>
             <View style={{width:'30%',marginLeft:10 }}>
                    <ButtonComponent
                        customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: !reviewed ? themeColor2 ? '#AED3D3' : AppTheme.BLUE :  themeColor1 ? themeColor1 : AppTheme.BLUE,height:studentName[0] && studentName[0].name.length >50 ? 100:50}]}
                        customBtnTextStyle={[styles.buttonText,{color:!reviewed ? 'black' : 'white'}]}
                        btnText={!reviewed ? Reviewd :Review}
                        activeOpacity={0.8}
                        onPress={() => setModalVisible(true)}
                    />
                </View>
            
            
            <ModalPopup
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
                reScan={'Re-Scan'.toUpperCase()}
                onPressReScanBtn={onScanClick}
                onPress={closeModelfun}
                btnText={Strings.close.toUpperCase()}
                themeColor1={themeColor1}
                borderCutomStyle={[styles.borderStyle, { borderColor: themeColor1 ? themeColor1 : AppTheme.GREEN }]}
                data={
                    <View style={{  }}>
                        <Text style={styles.textStyle}>{`Student ID : `}<Text style={{fontWeight:'400'}}>{`${scanitemdata&&scanitemdata.studentId}`}</Text></Text>
                        {
                    !minimalFlag
                    &&
                    <Text style={styles.textStyle}>{`Student Name : `}<Text style={{fontWeight:'400'}}>{`${studentName.length > 0 && studentName[0].name}`}</Text></Text>
    
           }
                        {/* <Text style={styles.textStyle}>{`Section : ` }<Text style={{fontWeight:'400'}}>{`${scanitemdata&&scanitemdata.section}`}</Text></Text> */}

                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            {
                              BrandLabel && MARKS_INFO ?
                             <View style={{ flexDirection: 'row', width: '100%' }}>
                               <MarksHeaderTable
                                 customRowStyle={{width:width/2.25, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={ BrandLabel && BrandLabel.questionId || MARKS_INFO.questionId}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                               <MarksHeaderTable
                                 customRowStyle={{ width:width/2.25, backgroundColor: AppTheme.TABLE_HEADER}}
                                 rowTitle={ BrandLabel && BrandLabel.obtainedMarks || MARKS_INFO.obtainedMarks}
                                 rowBorderColor={AppTheme.TAB_BORDER}
                                 editable={false}
                               />
                             </View>
                             :
                             MARKS_INFO_DEFAULT.map((data) => {
                                return (
                                    <MarksHeaderTable
                                        customRowStyle={{ width:width/2.25, backgroundColor: AppTheme.TABLE_HEADER }}
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
                                            customRowStyle={{height:height/12,width:width/2.25 }}
                                            rowTitle={renderSRNo(M, i)}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                                        />
                                        <MarksHeaderTable
                                            customRowStyle={{height:height/12,width:width/2.25 }}
                                            rowTitle={M.obtainedMarks}
                                            rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                            editable={false}
                                            keyboardType={'number-pad'}
                                        />

                                    </View>
                                )
                            })
                        }
                    </View>}
            />
        </View>
        </ScrollView>
        
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
        fontWeight: '600',
        paddingHorizontal: '5%',
        paddingVertical: '2%',
    },
    borderStyle: {
        borderWidth: 5,
        margin: 5,
        borderRadius: 10
    },
    nxtBtnStyle1: {
        padding: 5, marginVertical: 5, height: 50,marginLeft:0,borderRadius:10
    },
    nxtBtnStyle:{marginHorizontal:20, borderRadius: 10,height: 40, width: width/1.5,padding: 5, marginTop:10 },
    buttonText: {
        fontSize: 14
    }
});

const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanedData: state.scanedData.response,
        multiBrandingData: state.multiBrandingData.response.data,
        roiData: state.roiData.response,
        minimalFlag: state.minimalFlag,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        OcrLocalResponseAction: OcrLocalResponseAction,
        dispatchCustomModalStatus: dispatchCustomModalStatus,
        dispatchCustomModalMessage: dispatchCustomModalMessage,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanStatusLocalList);



