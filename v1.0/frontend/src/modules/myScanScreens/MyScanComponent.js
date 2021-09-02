import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Platform, PermissionsAndroid, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StackActions, NavigationActions } from 'react-navigation';
import SystemSetting from 'react-native-system-setting'
import RNOpenCvCameraModel from '../../utils/RNOpenCvCamera';
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import Spinner from '../common/components/loadingIndicator';
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction'
import { apkVersion } from '../../configs/config';
import HeaderComponent from '../common/components/HeaderComponent';
import { SCAN_TYPES } from '../../utils/CommonUtils';

class MyScanComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showFooter: true,
            oldBrightness: null,
            activityOpen: false,
            isLoading: false,
        }
        this.onBack = this.onBack.bind(this)
    }

    componentDidMount() {
        const { navigation } = this.props
        const { params } = navigation.state
        navigation.addListener('willFocus', payload => {
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
            RNOpenCvCameraModel.cancelActivity().then(data => {
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
                this.props.navigation.navigate('selectDetails', { from_screen: 'cameraActivity' })
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
                    } else if(permRes['android.permission.READ_EXTERNAL_STORAGE'] == 'never_ask_again' ||
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
    
    openCameraActivity = () => {
        const { scanTypeData } = this.props
        SystemSetting.setBrightnessForce(1).then(async (success) => {
            if (success) {
                SystemSetting.saveBrightness();
                this.setState({
                    activityOpen: true
                })
                let uniqStudentsList = ['1234567', '2345678' ]
                const scannerType = scanTypeData.scanType ? scanTypeData.scanType : SCAN_TYPES.PAT_TYPE
                const scannerCode = this.getScannerType(scannerType)
                RNOpenCvCameraModel.openScanCamera(JSON.stringify(uniqStudentsList), scannerType, scannerCode)
                    .then(data => {
                        console.log("imgArrSuccess", JSON.parse(data));
                        let scannerResponse = JSON.parse(data)
                        scannerResponse.scannerCode = scannerCode
                        scannerResponse.scannerType = scannerType
                        this.props.OcrLocalResponseAction(scannerResponse)
                        this.setState({ isLoading: false })

                        if(scannerType == SCAN_TYPES.PAT_TYPE) {
                            this.props.navigation.navigate('patScanDetails', { oldBrightness: this.state.oldBrightness })
                        } else if(scannerType == SCAN_TYPES.SAT_TYPE) {
                            this.props.navigation.navigate('satScanDetails', { oldBrightness: this.state.oldBrightness })
                        }

                    })
                    .catch((code, errorMessage) => {
                        this.setState({ isLoading: false })
                        Alert.alert(Strings.message_text, Strings.table_image_is_not_proper)
                        console.log("dataFailure", code, "Message", errorMessage);
                    });
                }
            else if (!success) {
                Alert.alert(Strings.permission_deny, Strings.you_have_no_permission_to_change_settings, [
                    { 'text': Strings.ok_text, style: Strings.cancel_text },
                    { 'text': Strings.open_settings, onPress: () => SystemSetting.grantWriteSettingPremission() }
                ])
            }
        });
    }

    getScannerType = (scanType) => {
        const { filteredData } = this.props
        let response = filteredData.response
        let classId = response.class
        if(scanType == SCAN_TYPES.PAT_TYPE) {
            let subject = response.subject.toLowerCase()
            let classId = response.class
            if(subject == 'math' && (classId == 3 || classId == 4|| classId == 5)) { //subject math - class -3,4&5.  - type -1
                return 1
            } else if(subject == 'hindi' && (classId == 2 || classId == 3)) { //subject hindi - class -2&3 - type - 2
                return 2
            }
            else if(subject == 'hindi' && (classId == 4 || classId == 5)) { //subject hindi - class -4&5 - type - 2
                return 3
            }
        } else if(scanType == SCAN_TYPES.SAT_TYPE) {
            if(classId == 3 || classId == 4 || classId == 5) {
                return 1
            } else if(classId == 6 || classId == 7 || classId == 8) {
                return 2
            }
        }
    }

    render() {
        const { isLoading } = this.state;
        const { loginData } = this.props
        return (

            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <HeaderComponent
                    title={Strings.up_saralData}
                />
                {(loginData && loginData.data) && 
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text 
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold',  paddingHorizontal: '5%', paddingVertical: '2%' }}
                    >
                        {Strings.school_name+' : '}
                        <Text style={{ fontWeight: 'normal'}}>
                            {loginData.data.school.name}
                        </Text>
                    </Text>
                    <Text 
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
                    >
                        {Strings.schoolId_text+' : '}
                        <Text style={{ fontWeight: 'normal'}}>
                            {loginData.data.school.schoolId}
                        </Text>
                    </Text>
                    </View>}
                    <Text 
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR-3, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', marginBottom: '4%' }}
                    >
                        {Strings.version_text+' : '}
                        <Text style={{ fontWeight: 'normal'}}>
                            {apkVersion}
                        </Text>
                    </Text>
                <ScrollView
                    contentContainerStyle={{  paddingTop: '5%', paddingBottom: '35%' }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                </ScrollView>
                <View style={styles.bottomTabStyle}>
                </View>

                <View style={[styles.bottomTabStyle, { height: 135, width: '50%', marginHorizontal: '25%', backgroundColor: 'transparent', justifyContent: 'center' }]}>
                    <TouchableOpacity style={[styles.subTabContainerStyle]}
                        onPress={this.onScanClick}
                    >
                        <TouchableOpacity 
                            style={[styles.scanTabContainerStyle,]}
                        >
                            <TouchableOpacity
                                style={styles.scanSubTabContainerStyle}
                            >
                                <Image
                                    source={require('../../assets/images/scanIcon.jpeg')}
                                    style={styles.tabIconStyle}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Text style={[styles.tabLabelStyle, { paddingTop: '71%' }]}>
                            {Strings.scan_text}
                        </Text>
                    </TouchableOpacity>
                </View>
                {isLoading &&
                    <Spinner
                        animating={isLoading}
                        customContainer={{ opacity: 0.9, elevation: 15 }}
                    />}
            </View>
        );
    }
}

const styles = {
    container1: {
        flex: 1,
        marginHorizontal: '6%',
        alignItems: 'center'
    },
    bottomTabStyle: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        height: 90,
        left: 0,
        right: 0,
        backgroundColor: AppTheme.WHITE,
        elevation: 10,
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'space-between'
    },
    subTabContainerStyle: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabIconStyle: {
        width: 40,
        height: 40
    },
    tabLabelStyle: {
        lineHeight: 40,
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    scanTabContainerStyle: {
        width: 85,
        height: 85,
        backgroundColor: AppTheme.WHITE,
        position: 'absolute',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scanSubTabContainerStyle: {
        width: '90%',
        height: '90%',
        backgroundColor: AppTheme.BLUE,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    }
}

const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse,
        loginData: state.loginData,
        filteredData: state.filteredData,
        scanTypeData: state.scanTypeData.response
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        OcrLocalResponseAction: OcrLocalResponseAction,
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(MyScanComponent));