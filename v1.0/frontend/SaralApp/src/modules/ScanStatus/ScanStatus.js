import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Platform ,PermissionsAndroid,BackHandler} from 'react-native';

//redux
import { connect,useDispatch } from 'react-redux';

//constant
import Strings from '../../utils/Strings';

//components
import ScanStatusList from './ScanStatusList';

//styles
import { styles } from './ScanStatusStyle';

//Redux
import { bindActionCreators } from 'redux';

//api
import APITransport from '../../flux/actions/transport/apitransport'
import AppTheme from '../../utils/AppTheme';
import { getPresentAbsentStudent, getScannedDataFromLocal } from '../../utils/StorageUtils';
import ShareComponent from '../common/components/Share';
import MultibrandLabels from '../common/components/multibrandlabels';
// import { monospace_FF,checkAppVersion } from '../../utils/CommonUtils';
import ButtonComponent from '../common/components/ButtonComponent';
import { checkAppVersion, checkNetworkConnectivity, dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF,neglectData,multipleStudent } from '../../utils/CommonUtils';
import SystemSetting from 'react-native-system-setting'
import { ROIAction } from '../StudentsList/ROIAction';
import SaralSDK from '../../../SaralSDK'
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction'

const ScanStatus = ({
    loginData,
    scanedData,
    multiBrandingData,
    navigation,
    filteredData,
    roiData,
    minimalFlag,
    scanFun
}) => {

    const [studentList, setStudentList] = useState([])
    const [presentStudentList, setPresentStudentList] = useState([])
    const [roiIndex,setRoiindex] = useState(-1)
    const [activityOpen,setActivityOpen] = useState(false)
    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.scanStatus[0]
    
    console.log('props>>>>>>>>>>>',scanFun);
    const dispatch = useDispatch()
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
    //function
    const renderItem = ({ item, index }) => {
        return (
            <ScanStatusList
                themeColor1={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
                themeColor2={multiBrandingData ? multiBrandingData.themeColor2 : AppTheme.BLUE}
                scanitemdata={item} 
                index ={index}
                id={item.studentId}
                subject={item.subject}
                studentList={studentList}
                BrandLabel={BrandLabel}
            />
        )
    }

    const renderEmptyData = ({ item }) => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={{fontFamily : monospace_FF}}>No Data Available</Text>
            </View>
        )
    }

    const onBackPress = () => {
        navigation.push('myScan');
    };

        useEffect(() => {
            getDataFromLocal()
            getStudentList()
            getPresentStudentList()
        }, [])

    const getStudentList = async () => {
        let data = await getPresentAbsentStudent()
        if (data != null) {
            setStudentList(data)
        }
    }

    const getDataFromLocal = async () => {
        let data = await getScannedDataFromLocal();
        if (data != null) {
            let students = data.studentsMarkInfo
        }
    }

    const getPresentStudentList = ()=>{
        let hasSet = filteredData.hasOwnProperty("set") ? filteredData.set.length >= 0 ? filteredData.set : '' : null
        let data = typeof (scanedData) === "object"
        ?
        scanedData.data
            ?
            scanedData.data.filter((o, index) => {
                let stdCondition = hasSet==null ?
                 o.studentAvailability && o.marksInfo.length > 0 & o.examDate == filteredData.examDate 
                 : hasSet.length >= 0 ? o.studentAvailability && o.marksInfo.length > 0 && hasSet == o.set 
                 : false
                if (stdCondition) {
                    return true
                }
            })
            :
            []
        :
        []
        setPresentStudentList(data)
        
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
                    }
                } else if (!minimalFlag ) {
                    if (loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode && hasEmpty) {
                        openCameraActivity()
                    } else if(loginData.data.school.hasOwnProperty("offlineMode") == false || loginData.data.school.offlineMode == false && hasEmpty){
                        openCameraActivity()
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
                        } else if (!minimalFlag ) {
                            openCameraActivity()
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
              console.log('jsonRoiData>>>>',jsonRoiData);
              console.log('isManualEditEnabled>>>',isManualEditEnabled);
                SaralSDK.startCamera(JSON.stringify(jsonRoiData), pageNumber, hasTimer, isManualEditEnabled).then(res => {
                    console.log('res>>>>>>>>',res);
                    let roisData = JSON.parse(res);
                    let cells = roisData.layout.cells;
                    consolidatePrediction(cells, roisData)
                    console.log('roisData>>>>',roisData);
                    console.log('cells>>>>',cells);

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
        <View style={[styles.container,{ flex: 1, backgroundColor:multiBrandingData.themeColor2 ? multiBrandingData.themeColor2 : 'white' }]}>
 <ShareComponent
                    navigation={navigation}
                    onPress={()=>navigation.navigate('myScan')}
                />
           <View style={{marginTop:30}}>
            <Text style={styles.scanStatus}>{Strings.save_status}</Text>

            <FlatList
                data={scanedData && presentStudentList}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyData}
                keyExtractor={(item, index) => `${index.toString()}`}
                contentContainerStyle={styles.content}
            />

           <View style={{alignItems:'center',flexDirection:"row"}}>
            <ButtonComponent
               customBtnStyle={[styles.nxtBtnStyle1, {flex:0, width: '45%', backgroundColor: multiBrandingData.themeColor1 ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
               customBtnTextStyle={{fontWeight:'normal',fontSize:14}}
               btnText={Strings.close.toUpperCase()}
                activeOpacity={0.8}
                onPress={()=> onBackPress()}
                />

          <ButtonComponent
               customBtnStyle={[styles.nxtBtnStyle1, {flex:0, width: '45%', backgroundColor: multiBrandingData.themeColor1 ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
               customBtnTextStyle={{fontWeight:'normal',fontSize:14}}
               btnText={'Re-scan'.toUpperCase()}
                activeOpacity={0.8}
                onPress={onScanClick}
                />
                </View>
                </View>
        </View>
    );
}
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

export default connect(mapStateToProps, mapDispatchToProps)(ScanStatus);
