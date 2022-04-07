import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Platform, PermissionsAndroid, Alert, BackHandler, LogBox,Share} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StackActions, NavigationActions } from 'react-navigation';
import SystemSetting from 'react-native-system-setting'
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import Spinner from '../common/components/loadingIndicator';
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction'
import ScanHistoryCard from '../ScanHistory/ScanHistoryCard';
import SaralSDK from '../../../SaralSDK'
import { getScannedDataFromLocal,getErrorMessage } from '../../utils/StorageUtils';
import ButtonComponent from '../common/components/ButtonComponent';
import { dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF, multipleStudent, neglectData } from '../../utils/CommonUtils';
import ShareComponent from '../common/components/Share';
import MultibrandLabels from '../common/components/multibrandlabels';
import { Assets } from '../../assets';
import CustomPopup from '../common/components/CustomPopup';
import ModalView from '../common/components/ModalView';
import DropDownMenu from '../common/components/DropDownComponent';

LogBox.ignoreAllLogs()

class MyScanComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showFooter: true,
            oldBrightness: null,
            activityOpen: false,
            isLoading: false,
            scanStatusData:false,
            roiDataList: [],
            selectedRoiLayoutData: '',
            roiIndex: -1
        }
        this.onBack = this.onBack.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick =()=> {
        if (this.props.minimalFlag) {
            this.props.navigation.navigate('Home');
        } else {
            this.props.navigation.push('ScanHistory');
        }
        return true;
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        const { navigation, scanedData } = this.props
        const { params } = navigation.state
        navigation.addListener('willFocus', payload => {
            this.sumOfLocalData()
            BackHandler.addEventListener('hardwareBackPress', this.onBack)
            if (params && params.from_screen && params.from_screen == 'scanDetails') {
                this.setState({
                    showFooter: false
                }, () => this.onScanClick())

            }
            else {
                this.setState({
                    showFooter: true
                })
            }
        })
        this.willBlur = navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBack)
        );

        if (this.props.minimalFlag) {
            let roi = []
            // // this.props.roiData
            // this.props.roiData.data.map((el) => {
                if (this.props.roiData.data.layout.name) {
                    roi.push(this.props.roiData.data.layout.name)
                }
            // })
            this.setState({
                roiDataList: roi
            })
        }
    }

    //functions
    sumOfLocalData = async () => {
        const { filteredData } = this.props
        const data = await getScannedDataFromLocal()
        let len = 0
        if (data != null) {
            let filter = data.filter((e) => {
                let findSection = false
                findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)

                if (filteredData.class == e.classId && e.examDate == filteredData.examDate && e.subject == filteredData.subject && findSection) {
                    return true
                }
            })

            filter.forEach((element, index) => {
                len = len + element.studentsMarkInfo.length
            });
            this.setState({
                scanStatusData: len
            })
        } else {
            this.setState({
                scanStatusData: 0
            })
        }
    }

    onBack = () => {
        if (this.state.activityOpen) {
            this.setState({
                showFooter: true,
                activityOpen: false
            })
            SystemSetting.setBrightnessForce(this.state.oldBrightness).then((success) => {
                if (success) {
                    SystemSetting.saveBrightness();
                }
            })
            SaralSDK.stopCamera().then(data => {
                if (data) {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'myScan', params: { from_screen: 'cameraActivity' } })],
                    });
                     this.props.navigation.dispatch(resetAction);
                    return true
                }
            })
            return true
        }
        else {
            const { navigation } = this.props
            const { params } = navigation.state
            if (params && params.from_screen && params.from_screen == 'cameraActivity') {
                this.props.navigation.navigate('ScanHistory', { from_screen: 'cameraActivity' })
                return true
            }
        }
    }

    callCustomModal(title, message, isAvailable, cancel) {
        let data = {
            title: title,
            message: message,
            isOkAvailable: isAvailable,
            isCancel : cancel
        }
        this.props.dispatchCustomModalStatus(true);
        this.props.dispatchCustomModalMessage(data);
    }


    onScanClick = async () => {
        SystemSetting.getBrightness().then((brightness) => {
            this.setState({ oldBrightness: brightness })
        });

        if (Platform.OS !== 'ios') {
            const grantedRead = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            const grantedWrite = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            const grantedCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)

            if (grantedRead && grantedWrite && grantedCamera) {
                if (this.state.selectedRoiLayoutData.hasOwnProperty("layout")) {
                    this.openCameraActivity()
                } else {
                    this.callCustomModal("Warning","Please Select Roi",false,false)
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
                        if (this.state.selectedRoiLayoutData.hasOwnProperty("layout")) {
                            this.openCameraActivity()
                        } else {
                            this.callCustomModal("Warning","Please Select Roi",false,false)
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
                            { 'text': Strings.ok_text, onPress: () => this.onScanClick() }

                        ]);
                    }
                });
            }
        }
    }

    openCameraActivity = async () => {
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
                this.setState({
                    activityOpen: true
                })
                let totalPages = this.props.minimalFlag ? this.state.selectedRoiLayoutData.layout.hasOwnProperty("pages") && this.state.selectedRoiLayoutData.layout.pages : this.props.roiData.data.layout.hasOwnProperty("pages") && this.props.roiData.data.layout.pages
                let pageNumber = totalPages || totalPages > 0 ? "1" : null
                let jsonRoiData = this.props.minimalFlag ? this.state.selectedRoiLayoutData : this.props.roiData.data
                SaralSDK.startCamera(JSON.stringify(jsonRoiData), pageNumber).then(res => {
                    let roisData = JSON.parse(res);
                    let cells = roisData.layout.cells;
                    this.consolidatePrediction(cells, roisData)

                }).catch((code, message) => {
                })
            } else {
            }
        } catch (err) {
        }
    };

    consolidatePrediction(cells, roisData) {
        var marks = "";
        var predictionConfidenceArray = []
        var studentIdPrediction = ""
        for (let i = 0; i < cells.length; i++) {
            marks = ""
            predictionConfidenceArray = []
            for (let j = 0; j < cells[i].rois.length; j++) {
                if (cells[i].rois[j].hasOwnProperty("result")) {
                    marks = marks + cells[i].rois[j].result.prediction,
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
            if ((rollNumber === neglectData[0] && rollNumber.length == neglectData[0].length) || (rollNumber.trim() === multipleStudent[0])) {
                roisData.layout.cells[i].studentIdPrediction = marks
            } else {
                roisData.layout.cells[i].predictedMarks = marks
            }


        }
        this.props.OcrLocalResponseAction(JSON.parse(JSON.stringify(roisData)))
        this.props.navigation.navigate('ScannedDetailsComponent', { oldBrightness: this.state.oldBrightness })
    }

    onDropDownSelect(idx, value) {
        // for (const el of this.props.roiData.data) {
        //     if (el.type == value) {
        //         this.setState({
        //             selectedRoiLayoutData: el.roi
        //         })
        //         break;
        //     }
        // }
        console.log("this",this.props.roiData);
        if (value == this.props.roiData.data.layout.name) {
            this.setState({
                selectedRoiLayoutData: this.props.roiData.data
            })
        }
        this.setState({
            roiIndex: idx,
            selectedRoi: value
        })
    }
    
    render() {
        const { isLoading } = this.state;
        const { loginData,multiBrandingData, modalMessage, modalStatus} = this.props
        const BrandLabel = multiBrandingData&&multiBrandingData.screenLabels&&multiBrandingData.screenLabels.myScan[0]
        return (

            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                 <ShareComponent
                 navigation={this.props.navigation}
                 />
               <View>
               {( BrandLabel) ?
                <MultibrandLabels
                Label1={BrandLabel.School}
                Label2={BrandLabel.SchoolId}
                School ={loginData.data.school.name}
                SchoolId={loginData.data.school.schoolId}
                />:
                    (loginData && loginData.data)
                    &&
                    <View style={{ width:'60%' }}>
                        <Text
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%',fontFamily : monospace_FF }}
                        >
                            {Strings.school_name + ' : '}
                            <Text style={{ fontWeight: 'normal',fontFamily : monospace_FF }}>
                                {loginData.data.school.name}
                            </Text>
                        </Text>
                        <Text
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%',fontFamily : monospace_FF }}
                        >
                            {Strings.schoolId_text + ' : '}
                            <Text style={{ fontWeight: 'normal',fontFamily : monospace_FF }}>
                                {loginData.data.school.schoolId}
                            </Text>
                        </Text>
                    </View>
                }
                
                </View>
                
                {
                    !this.props.minimalFlag
                        ?
                        <ScrollView scrollEnabled>
                <View style={styles.container1}>
                <Text style={[styles.header1TextStyle, { borderColor: this.props.multiBrandingData ? this.props.multiBrandingData.themeColor2 : AppTheme.LIGHT_BLUE, backgroundColor: this.props.multiBrandingData ? this.props.multiBrandingData.themeColor2 : AppTheme.LIGHT_BLUE,fontFamily : monospace_FF }]}>
                    {Strings.ongoing_scan}
                </Text>
            </View>
                <ScanHistoryCard
                        scanstatusbutton ={true}
                        themeColor1={this.props.multiBrandingData ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE}
                        showButtons={false}
                        scanStatusData={this.state.scanStatusData}
                         navigation={this.props.navigation}
                    />

                <View>
                    <ButtonComponent
                        customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: this.props.multiBrandingData ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                        customBtnTextStyle={{ fontSize: 15 }}
                        btnText={Strings.backToDashboard}
                        activeOpacity={0.8}
                        onPress={() => this.props.navigation.navigate('selectDetails')}
                    />
                </View>
                        </ScrollView>
                        :
                
                        <View style={{ marginHorizontal:30, marginTop: 30, marginBottom: 20 }}>
                            <DropDownMenu
                                options={this.state.roiDataList}
                                onSelect={(idx, value) => this.onDropDownSelect(idx, value)}
                                defaultData={BrandLabel ? BrandLabel.SelectRoi : "Select Roi"}
                                defaultIndex={this.state.roiIndex}
                                selectedData={this.state.selectedRoi}
                                icon={require('../../assets/images/arrow_down.png')}
                        />
                        </View>
                }

                {
                    this.props.minimalFlag
                    &&
                    <View style={{  width: '100%',  paddingTop: '3%', paddingLeft: '6.5%', paddingRight: '6.5%'}}>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle,{padding:"3.4%",borderTopLeftRadius: 8}]}>
                                <Text style={{fontFamily : monospace_FF}}>{BrandLabel&&BrandLabel.ScanCount ? BrandLabel.ScanCount : Strings.scan_status}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle,{padding:"3.4%",borderTopRightRadius:8}]}>
                                <Text style={{fontFamily : monospace_FF}} >{0}</Text>
                            </View>
                        </View>

                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle,{padding:"3.4%"}]}>
                                <Text style={{fontFamily : monospace_FF}}>{BrandLabel&&BrandLabel.SaveCount ? BrandLabel.SaveCount : Strings.class_text}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle,{padding:"3.4%"}]}>
                                <Text style={{fontFamily : monospace_FF}} >{0}</Text>
                            </View>
                        </View>

                        <View style={{paddingLeft: '2%', paddingRight: '2%',width: '100%',  }}>
                            <View style={{paddingHorizontal:'2%',borderWidth:1,alignItems:'center',borderBottomLeftRadius: 8, borderBottomRightRadius: 8}}>
                            <ButtonComponent
                                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE,height:40 }]}
                                btnText={Strings.save_all_scan.toUpperCase()}
                                activeOpacity={0.8}
                                customBtnTextStyle={{fontSize: 12}}
                                // onPress={navigateToNext}
                            />
                              </View>
                            </View>
                        </View>
                }

                <View style={styles.bottomTabStyle}>
                <View style={[{elevation:10,  backgroundColor: 'transparent', justifyContent: 'center',alignItems:'center' }]}>
                    <TouchableOpacity style={[styles.subTabContainerStyle]}
                        onPress={this.onScanClick}
                    >
                        <TouchableOpacity
                            style={[styles.scanTabContainerStyle,]}
                        >
                            <TouchableOpacity
                                style={[styles.scanSubTabContainerStyle, { backgroundColor: this.props.multiBrandingData ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                            >
                                <Image
                                    source={Assets.ScanButton}
                                    style={styles.tabIconStyle}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Text style={styles.tabLabelStyle}>
                            {Strings.scan_text}
                        </Text>

                    </TouchableOpacity>
                </View>
                </View>
                {
                    isLoading
                    &&
                    <Spinner
                        animating={isLoading}
                        customContainer={{ opacity: 0.9, elevation: 15 }}
                    />
                }
                <CustomPopup
                title={"Message"}
                ok_button={"Ok"}
                bgColor={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
            />
                <ModalView modalVisible={modalStatus} modalMessage={modalMessage} />
            </View>
        );
    }
}

const styles = {
    container1: {
        marginHorizontal: '4%',
        alignItems: 'center',
         marginTop:10,
    },
    onGoingContainer: {
        marginHorizontal: '4%',
        alignItems: 'center',
        paddingVertical: '3%'
    },
    header1TextStyle: {
        backgroundColor: AppTheme.LIGHT_BLUE,
        lineHeight: 40,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: AppTheme.LIGHT_BLUE,
        width: '100%',
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        letterSpacing: 1
    },
    bottomTabStyle: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        height: 50,
        left: 0,
        right: 0,
        backgroundColor: AppTheme.WHITE,
        elevation: 10,
        justifyContent:'center',
        alignItems:'center'
        
    },
    subTabContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabIconStyle: {
        width: 40,
        height: 40
    },
    Backbutton: {
        width: 200,
        lineHeight: 40,
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_LARGE,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        fontWeight: 'bold'

    },
    tabLabelStyle: {
        height: 70,
        lineHeight: 40,
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        fontWeight: 'bold',
        fontFamily : monospace_FF
    },
    scanTabContainerStyle: {
        width: 80,
        height: 80,
        position: 'absolute',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scanSubTabContainerStyle: {
        width: '90%',
        height: '90%',
        marginBottom: 30,
        backgroundColor: AppTheme.BLUE,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nxtBtnStyle:{ marginHorizontal: 40,marginTop:8,marginBottom:20, borderRadius: 10 },
   
    nxtBtnStyle1: {
        marginTop:15,
        width:'45%',
        marginHorizontal: 5,
        marginBottom: 20,
        borderRadius: 10
    },
    viewnxtBtnStyle1 : {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    scanCardStyle: {
        flexDirection: 'row',
        paddingHorizontal: '2%',
    },
    scanLabelStyle: {
        padding: '2.4%',
        borderTopWidth: 1,
        borderColor: AppTheme.BLACK
    },
    scanLabelKeyStyle: {
        width: '40%',
        backgroundColor: AppTheme.TAB_BORDER,
        borderLeftWidth: 1,
        borderRightWidth: .5,
    },
    scanLabelValueStyle: {
        width: '60%',
        backgroundColor: AppTheme.WHITE,
        borderLeftWidth: .5,
        borderRightWidth: 1
    }
}

const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse,
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanTypeData: state.scanTypeData.response,
        scanedData: state.scanedData,
        roiData: state.roiData.response,
        multiBrandingData: state.multiBrandingData.response.data,
        apiStatus: state.apiStatus,
        modalStatus: state.modalStatus,
        modalMessage: state.modalMessage,
        minimalFlag: state.minimalFlag
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        OcrLocalResponseAction: OcrLocalResponseAction,
        dispatchCustomModalStatus: dispatchCustomModalStatus,
        dispatchCustomModalMessage: dispatchCustomModalMessage
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(MyScanComponent));