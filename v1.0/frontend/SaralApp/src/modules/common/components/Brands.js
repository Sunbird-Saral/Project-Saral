import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet, Alert } from 'react-native'
import Strings from '../../../utils/Strings';
import AppTheme from '../../../utils/AppTheme';
import ButtonComponent from './ButtonComponent';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//api action
import APITransport from '../../../flux/actions/transport/apitransport'
import { SaveScanData } from "../../../flux/actions/apis/saveScanDataAction";
import bgFlag from '../../../flux/reducers/bgFlag'
import { storeFactory } from '../../../flux/store/store'
import Constant from '../../../flux/actions/constants'

//npm
import NetInfo from "@react-native-community/netinfo";
import PushNotification, { Importance } from "react-native-push-notification";
import axios from 'axios';

import { getScannedDataFromLocal, setScannedDataIntoLocal } from '../../../utils/StorageUtils';
import { collectErrorLogs } from '../../CollectErrorLogs';
import { checkNetworkConnectivity,dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF } from '../../../utils/CommonUtils';

class Brands extends PureComponent {
    constructor() {
        super()
        this.state = {
            defaultIamge: true
        }
    }

     flagAction(payload) {
        return {
            type: Constant.BACKGROUND_FLAG,
            payload
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

    dispatchAPIAsync(apiObj) {
        return {
            type: apiObj.type,
            payload: apiObj.getPayload()
        }
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

        const { loginData, dispatch } = this.props;

 

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



    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: 100, width: 100 }} source={this.props.Image ?  { uri: this.props.Image } : this.props.Image1}
                                 />
                        </View>
                        <View>
                            <Text style={styles.welcometext}>{this.props.appName ? this.props.appName : <Text>Saral Ocr App</Text>}</Text>
                        </View>

                        <View style={styles.btnContainer}>
                            <ButtonComponent
                                customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: this.props.themeColor ? this.props.themeColor : AppTheme.BLUE }]}
                                btnText={Strings.get_start}
                                onPress={this.props.onPress}
                            />
                        </View>
                    </View>
                </View>
            </View>

        )
    }

}

const styles = {

    btnContainer: {
        paddingVertical: '5%'
    },
    welcometext: { textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#00000033', fontWeight: 'bold',fontFamily:monospace_FF },
    nxtBtnStyle: {
        width: 250,
        marginBottom: 15
    }
}


const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        bgFlag: state.bgFlag,
        minimalFlag: state.minimalFlag
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        bgFlag: bgFlag,
        APITransport: APITransport
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(Brands));