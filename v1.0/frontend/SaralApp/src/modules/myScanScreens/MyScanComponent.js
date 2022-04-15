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
import { monospace_FF, multipleStudent, neglectData } from '../../utils/CommonUtils';
import ShareComponent from '../common/components/Share';
import MultibrandLabels from '../common/components/multibrandlabels';
import { Assets } from '../../assets';
import CustomPopup from '../common/components/CustomPopup';
import ModalView from '../common/components/ModalView';

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
        }
        this.onBack = this.onBack.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick =()=> {
        this.props.navigation.push('ScanHistory');
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


    onScanClick = async () => {
        SystemSetting.getBrightness().then((brightness) => {
            this.setState({ oldBrightness: brightness })
        });

        if (Platform.OS !== 'ios') {
            const grantedRead = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            const grantedWrite = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            const grantedCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)

            if (grantedRead && grantedWrite && grantedCamera) {
                this.openCameraActivity()
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
                        this.openCameraActivity()
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
                let totalPages = this.props.roiData.data.layout.hasOwnProperty("pages") && this.props.roiData.data.layout.pages
                let pageNumber = totalPages || totalPages > 0 ? "1" : null
                SaralSDK.startCamera(JSON.stringify(this.props.roiData.data), pageNumber).then(res => {
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

                <View style={styles.viewnxtBtnStyle1}>
                <ButtonComponent
                    customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                    btnText={Strings.backToDashboard.toUpperCase()}
                    activeOpacity={0.8}
                    onPress={() => this.props.navigation.navigate('selectDetails')}
                />

                <ButtonComponent
                    customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                    btnText={Strings.Back.toUpperCase()}
                    activeOpacity={0.8}
                    onPress={() => this.props.navigation.navigate('ScanHistory')}
                />
            </View>
                </ScrollView>
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
        height:35,
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
        width:'40%',
        height:52,
        marginHorizontal: 5,
        bottom: 10,
        borderRadius: 10
    },
    viewnxtBtnStyle1 : {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
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
        modalMessage: state.modalMessage
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        OcrLocalResponseAction: OcrLocalResponseAction
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(MyScanComponent));