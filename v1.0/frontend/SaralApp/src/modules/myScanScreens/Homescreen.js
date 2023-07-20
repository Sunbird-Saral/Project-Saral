import React, { Component } from 'react';
import { View, Text, BackHandler, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash'
import AppTheme from '../../utils/AppTheme';
import { MultiBrandingAction } from '../../flux/actions/apis/multiBranding';
import { LogoutAction } from '../../flux/actions/apis/LogoutAction';
import APITransport from '../../flux/actions/transport/apitransport';
import Brands from '../common/components/Brands';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Assets } from '../../assets';
import { checkNetworkConnectivity, dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF } from '../../utils/CommonUtils';
import Spinner from '../common/components/loadingIndicator';
import { storeFactory } from '../../flux/store/store';
import constants from '../../flux/actions/constants';
import { GetStudentsAndExamData } from '../../flux/actions/apis/getStudentsAndExamData';
import { getMinimalValue,setScannedDataIntoLocal,getScannedDataFromLocal } from '../../utils/StorageUtils';
import { getBrandingDataApi, getStudentExamApi, setBrandingDataApi, setStudentExamApi } from '../../utils/offlineStorageUtils';
import Strings from '../../utils/Strings';
import MultibrandLabels from '../common/components/multibrandlabels';
import Constant from '../../flux/actions/constants'
import DeviceInfo from 'react-native-device-info';
import { SaveScanData } from "../../flux/actions/apis/saveScanDataAction";
import axios from 'axios';
import PushNotification, { Importance } from "react-native-push-notification";
class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
        this.onBack = this.onBack.bind(this)
    }

    flagAction(payload) {
        return {
            type: Constant.BACKGROUND_FLAG,
            payload
        }
    }

    dispatchAPIAsync(apiObj) {
        return {
            type: apiObj.type,
            payload: apiObj.getPayload()
        }
    }

    hitPushNotification = (title, msg) => {

        PushNotification.localNotification({
            channelId: Strings.saral_app_auto_sync_channel,
            // smallIcon: "ic_notification",
            // color: "white",
            vibrate: true,
            // shortcutId: "shortcut-id",
            title: title,
            message: msg,
            playSound: true,
            // soundName: "notification.mp3",
            priority: "high",
            importance: "high"
        });
    }

    removeItemFromLocalStorage = (res, value) => {

        let data = JSON.parse(res.config.data)
    
        value.forEach((element, index) => {
            if (element.classId == data.classId) {
                value.splice(index, 1)
            }
        });
    
        return value
    }

    saveDataInDB = async () => {
        const { loginData, dispatch } = this.props
        const autoSyncBatchSize = Object.keys(loginData).length > 0  && loginData.data.school.hasOwnProperty("autoSyncBatchSize") ? loginData.data.school.autoSyncBatchSize : 10
        const data = await getScannedDataFromLocal();
        storeFactory.dispatch(this.flagAction(false))
        if (data != null) {
            let len = 0
            data.forEach(element => {
                len = len + element.studentsMarkInfo.length
            });
    
            if (len >= autoSyncBatchSize) {
                storeFactory.dispatch(this.flagAction(true))
                this.hitPushNotification("Uploading•••", Strings.auto_sync_in_progress_please_wait)
    
                data.map(element => {
    
                    let apiObj = new SaveScanData(element, loginData.data.token);
                    let apiResponse = null
                    const source = axios.CancelToken.source()
                    const id = setTimeout(() => {
                        if (apiResponse === null) {
                            source.cancel('The request timed out.');
                        }
                    }, 60000);
                    var self =  this
                    axios.put(apiObj.apiEndPoint(), apiObj.getBody(), { headers: apiObj.getHeaders(), cancelToken: source.token },)
                        .then(function (res) {
                            let localDataResponse = self.removeItemFromLocalStorage(res, data)
                            if (localDataResponse.length == 0) {
                                setScannedDataIntoLocal(localDataResponse)
                                self.hitPushNotification("Uploaded", Strings.auto_sync_completed)
                            }
                            apiResponse = res
                            
                            clearTimeout(id)
                            apiObj.processResponse(res)
                            storeFactory.dispatch(self.dispatchAPIAsync(apiObj));
                            if (typeof apiObj.getNextStep === 'function' && res.data && (res.status == 200 || res.status == 201))
                                storeFactory.dispatch(apiObj.getNextStep())
                            storeFactory.dispatch(self.flagAction(false))
                        })
                        .catch(function (err) {
                            collectErrorLogs("Brand.js","backgroundJob",apiObj.apiEndPoint(),err,false)
                            clearTimeout(id)
                            let data = {
                                title : Strings.message_text,
                                message : "Something went wrong with background process, please contact Admin",
                                isOkAvailable : false,
                                isCancel : false
                            }
                            dispatch(dispatchCustomModalStatus(true));
                            dispatch(dispatchCustomModalMessage(data));
                            storeFactory.dispatch(self.flagAction(false))
                        });
                });
            }
    
        }
    }

    async componentDidMount() {
        this.callMultiBrandingActiondata()
        const { loginData } = this.props;
        const bgTimer = Object.keys(loginData).length > 0  && loginData.data.school.hasOwnProperty("autoSyncFrequency") ? loginData.data.school.autoSyncFrequency : 600000
        setInterval(async() => {
            const hasAutoSync = Object.keys(loginData).length > 0  && loginData.data.school.hasOwnProperty("autoSync") && loginData.data.school.autoSync ? true : false
            const hasNetwork = await checkNetworkConnectivity();
            if (hasAutoSync) {
                const isLogin = loginData.status
                if (isLogin == 200 & hasNetwork) {
                    storeFactory.dispatch( this.flagAction(true))
                        this.saveDataInDB()
                }
            }
            //timer for 10 min
        }, bgTimer);

      }

    async componentDidUpdate(prevProps) {
        const { studentsAndExamData, multiBranding, loginData, minimalFlag } = this.props;

        const { loginData: { data: { school } } } = this.props;
        let hasNetwork = await checkNetworkConnectivity();

        if (multiBranding && prevProps.multiBranding != multiBranding) {
            if (multiBranding.status && multiBranding.status == 200) {

                //set minimal Flag
                let isMinimalMode = await getMinimalValue();
                const isMinimalModedata = this.props.loginData && this.props.loginData.data && this.props.loginData.data.school && this.props.loginData.data.school.hasOwnProperty("isMinimalMode") ? this.props.loginData.data.school.isMinimalMode : null

                let hasminimal = false

                if (isMinimalMode === false || isMinimalMode) {
                    hasminimal = isMinimalMode
                } else if (isMinimalModedata) {
                    hasminimal = isMinimalModedata
                } else {
                    hasminimal = false
                }
                storeFactory.dispatch(this.minimalFlagAction(hasminimal));

                //calling students and exam api if minimal mode true
                if (hasminimal) {
                    this.callStudentsData(this.props.loginData.data.token)
                } else {
                    this.setState({ isLoading: false })
                }

                if (loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode && hasNetwork) {
                    let getBrandingCache = await getBrandingDataApi();
                    let userId = JSON.parse(loginData.config.data)
                    if (getBrandingCache != null) {

                        let data = getBrandingCache.filter((e) => {
                            if (e.key == userId.schoolId) {
                                return true
                            }
                        });

                        if (data.length > 0) {
                            for (let element of getBrandingCache) {
                                if (element.key == data[0].key) {
                                    element.data = multiBranding
                                    break;
                                }
                            };
                        } else {
                            let payload = {
                                key: `${userId.schoolId}`,
                                data: multiBranding
                            }
                            getBrandingCache.push(payload);
                        }
                        await setBrandingDataApi(getBrandingCache);
                    } else {
                        let payload = {
                            key: `${userId.schoolId}`,
                            data: multiBranding
                        }
                        await setBrandingDataApi([payload])
                    }
                }
            }
        }

        if (studentsAndExamData && prevProps.studentsAndExamData != studentsAndExamData) {
            if (studentsAndExamData.status && studentsAndExamData.status == 200) {
                this.setState({ isLoading: false })
                if (loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode && minimalFlag && hasNetwork) {
                    let getStudentExamCache = await getStudentExamApi(0, 0);
                    if (getStudentExamCache != null) {

                        let data = getStudentExamCache.filter((e) => {
                            if (e.key == loginData.data.school.schoolId) {
                                return true
                            }
                        });
                        if (data.length > 0) {
                            for (let element of getStudentExamCache) {
                                if (element.key == data[0].key) {
                                    element.data = studentsAndExamData
                                    break;
                                }
                            };
                        } else {
                            let payload = {
                                key: `${loginData.data.school.schoolId}`,
                                data: studentsAndExamData
                            }
                            getStudentExamCache.push(payload);
                        }
                        await setStudentExamApi(getStudentExamCache, 0, 0);
                    } else {
                        let payload = {
                            key: `${loginData.data.school.schoolId}`,
                            data: studentsAndExamData
                        }
                        await setStudentExamApi([payload], 0, 0);
                    }
                }
            }
        }
    }


    callStudentsData = async (token) => {

        let hasNetwork = await checkNetworkConnectivity();
        let hasCacheData = await getStudentExamApi(0, 0);

        let cacheFilterData = hasCacheData != null ? hasCacheData.filter((element) => {
            if (element.key == this.props.loginData.data.school.schoolId) {
                return true
            }
        })
            :
            []

        if (hasCacheData && cacheFilterData.length > 0) {
            storeFactory.dispatch(this.dispatchStudentExamData(cacheFilterData[0].data))
            this.setState({ isLoading: false })
        } else if (hasNetwork) {
            let dataPayload = {
                "classId": "0",
                "section": "0"
            }
            this.setState({
                isLoading: true,
            })
            let apiObj = new GetStudentsAndExamData(dataPayload, token);
            this.props.APITransport(apiObj)
        } else {
            this.callCustomModal(Strings.message_text, Strings.you_dont_have_cache, false)
            this.setState({ isLoading: false })
            //Alert message show message "something went wrong or u don't have cache in local"            
        }
    }

    callCustomModal(title, message, isAvailable, cancel) {
        let data = {
            title: title,
            message: message,
            isOkAvailable: isAvailable,
            isCancel: cancel
        }
        this.props.dispatchCustomModalStatus(true);
        this.props.dispatchCustomModalMessage(data);
    }

    dispatchStudentExamData(payload) {
        return {
            type: constants.GET_STUDENTS_EXAMS_LIST,
            payload
        }
    }

    minimalFlagAction(payload) {
        return {
            type: constants.MINIMAL_FLAG,
            payload
        }
    }

   async callMultiBrandingActiondata() {
    const deviceUniqId = await DeviceInfo.getUniqueId();
        let hasNetwork = await checkNetworkConnectivity();
        let hasCacheData = await getBrandingDataApi();

        let cacheFilterData = hasCacheData != null ? hasCacheData.filter((element) => {
            let userId = JSON.parse(this.props.loginData.config.data)
            if (element.key == userId.schoolId) {
                return true
            }
        })
            :
            []

        if (hasCacheData && cacheFilterData.length > 0) {
            storeFactory.dispatch(this.dispatchBrandingDataApi(cacheFilterData[0].data))
        } else if (hasNetwork) {
            let payload = this.props.multiBrandingData
            let token = this.props.loginData.data.token
            // console.log('deviceUniqId//////>>>>',deviceUniqId);
            let apiObj = new MultiBrandingAction(payload, token, deviceUniqId);
            this.props.APITransport(apiObj)
        } else {
            this.callCustomModal(Strings.message_text, Strings.you_dont_have_cache, false)
            this.setState({ isLoading: false })
            //Alert message show message "something went wrong or u don't have cache in local"            
        }
    }

    dispatchBrandingDataApi(payload) {
        return {
            type: constants.MULTI_BRANDING,
            payload
        }
    }

    onBack = () => {
        const { navigation } = this.props;
        BackHandler.exitApp()
        // navigation.goBack();
        return true
    }

    render() {
        const { isLoading } = this.state;
        const isMinimalModedata = this.props.loginData && this.props.loginData.data && this.props.loginData.data.school && this.props.loginData.data.school.isMinimalMode
        const Mode = isMinimalModedata ? !this.props.minimalFlag : this.props.minimalFlag
        const loginData = this.props.loginData && this.props.loginData.data && this.props.loginData.data.school
        const BrandLabel = this.props.multiBrandingData && this.props.multiBrandingData.screenLabels && this.props.multiBrandingData.screenLabels.homeScreen && this.props.multiBrandingData.screenLabels.homeScreen[0]
       
        if (this.props.multiBrandingData === undefined || this.props.multiBrandingData === null || this.state.isLoading) {

            return <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                {

                    this.state.isLoading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', fontFamily: monospace_FF }}>Loading Branding ...</Text>
                        </View> :
                        <Brands
                            Image1={Assets.AppLogo}
                            appName={'Saral OCR App'}
                            themeColor={AppTheme.BLUE}
                            onPress={() => this.props.navigation.navigate('selectDetails')}
                        />
                }
            </View>

        }
        return (
            <View style={{ flex: 1, backgroundColor: this.props.multiBrandingData.themeColor2 ? this.props.multiBrandingData.themeColor2 : AppTheme.WHITE, justifyContent: 'center', alignItems: 'center' }}>
               {/* <Brands /> */}
                <View>
                    <TouchableOpacity onPress={() => this.props.minimalFlag ? this.props.navigation.navigate("myScan") : this.props.navigation.navigate('selectDetails')}
                        style={{ backgroundColor: this.props.multiBrandingData && this.props.multiBrandingData.themeColor1 ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE, height: 120, width: 120, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                    >
                        {BrandLabel && BrandLabel.assessmentLogo ? <Image style={{ height: 80, width: 80, resizeMode: "stretch" }} source={{ uri: BrandLabel && "data:image/png;base64," + BrandLabel.assessmentLogo }} /> :
                            <Image style={{ height: 80, width: 60, resizeMode: 'stretch' }} source={Assets.assessments} />}
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{BrandLabel && BrandLabel.useCase1 ? BrandLabel.useCase1 : 'Assessments'}</Text>
                    {
                        loginData && loginData.useCase2 === true &&
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: this.props.multiBrandingData && this.props.multiBrandingData.themeColor1 ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE, height: 120, width: 120, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                            >
                                {BrandLabel && BrandLabel.assessmentLogo ? <Image style={{ height: 80, width: 60, resizeMode: "stretch" }} source={{ uri: BrandLabel && "data:image/png;base64," + BrandLabel.assessmentLogo }} /> :
                                    <Image style={{ height: 80, width: 60, resizeMode: "stretch" }} source={Assets.assessments} />}
                            </TouchableOpacity>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{BrandLabel && BrandLabel.useCase2 ? BrandLabel.useCase2 : 'Use Case 2'}</Text>
                        </View>
                    }

                    {
                        loginData && loginData.useCase3 === true &&
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: this.props.multiBrandingData && this.props.multiBrandingData.themeColor1 ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE, height: 120, width: 120, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                            >
                                {BrandLabel && BrandLabel.assessmentLogo ? <Image style={{ height: 100, width: 80, resizeMode: "stretch" }} source={{ uri: BrandLabel && "data:image/png;base64," + BrandLabel.assessmentLogo }} /> :
                                    <Image style={{ height: 80, width: 60, resizeMode: "stretch" }} source={Assets.assessments} />}
                            </TouchableOpacity>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{BrandLabel && BrandLabel.useCase3 ? BrandLabel.useCase3 : 'Use Case 3'}</Text>
                        </View>
                    }

                    {
                        loginData && loginData.useCase4 === true &&
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: this.props.multiBrandingData && this.props.multiBrandingData.themeColor1 ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE, height: 120, width: 120, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                            >
                                {BrandLabel && BrandLabel.assessmentLogo ? <Image style={{ height: 80, width: 60, resizeMode: "stretch" }} source={{ uri: BrandLabel && "data:image/png;base64," + BrandLabel.assessmentLogo }} /> :
                                    <Image style={{ height: 80, width: 60, resizeMode: "stretch" }} source={Assets.assessments} />}
                            </TouchableOpacity>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{BrandLabel && BrandLabel.useCase4 ? BrandLabel.useCase4 : 'Use Case 4'}</Text>
                        </View>
                    }

                    {
                        loginData && loginData.useCase5 === true &&
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: this.props.multiBrandingData && this.props.multiBrandingData.themeColor1 ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE, height: 120, width: 120, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                            >
                                {BrandLabel && BrandLabel.assessmentLogo ? <Image style={{ height: 80, width: 60, resizeMode: "stretch" }} source={{ uri: BrandLabel && "data:image/png;base64," + BrandLabel.assessmentLogo }} /> :
                                    <Image style={{ height: 80, width: 60, resizeMode: "stretch" }} source={Assets.assessments} />}
                            </TouchableOpacity>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{BrandLabel && BrandLabel.useCase5 ? BrandLabel.useCase5 : 'Use Case 5'}</Text>
                        </View>
                    }

                </View>

                {
                    isLoading
                    &&
                    <Spinner
                        animating={isLoading}
                        customContainer={{ opacity: 0.6, elevation: 15 }}
                    />
                }
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        multiBrandingData: state.multiBrandingData.response.data,
        multiBranding: state.multiBrandingData.response,
        minimalFlag: state.minimalFlag,
        studentsAndExamData: state.studentsAndExamData
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        LogoutAction: LogoutAction,
        dispatchCustomModalStatus: dispatchCustomModalStatus,
        dispatchCustomModalMessage: dispatchCustomModalMessage,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
