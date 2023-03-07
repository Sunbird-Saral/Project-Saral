import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity,Platform } from 'react-native';

//redux
import { connect, useDispatch } from 'react-redux';

//constant
import Strings from '../../utils/Strings';

//components
import ScanStatusLocalList from './ScanStatusLocalList';

//styles
import { styles } from './ScanStatusStyle';

//Redux
import { bindActionCreators } from 'redux';

//api
import APITransport from '../../flux/actions/transport/apitransport'
import AppTheme from '../../utils/AppTheme';
import { getPresentAbsentStudent, getScannedDataFromLocal,getErrorMessage, getLoginCred, setScannedDataIntoLocal } from '../../utils/StorageUtils';
import { Assets } from '../../assets';
import ShareComponent from '../common/components/Share';
import MultibrandLabels from '../common/components/multibrandlabels';
import { checkAppVersion, checkNetworkConnectivity, dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF } from '../../utils/CommonUtils';
import ButtonComponent from '../common/components/ButtonComponent';
import Share from "react-native-share";
import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction';
import axios from 'axios';
import { collectErrorLogs } from '../CollectErrorLogs';
import { scanStatusDataAction } from './scanStatusDataAction';
import Spinner from '../common/components/loadingIndicator';
import constants from '../../flux/actions/constants';


const ScanStatusLocal = ({
    loginData,
    filteredData,
    multiBrandingData,
    navigation,
    bgFlag,
    roiData
}) => {

    const [unsavedstudentList, setUnsavedstudentList] = useState([])
    const [loacalstutlist, setLoacalstutlist] = useState([])
    const [presentStudentList, setPresentStudentList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.scanStatusLocal[0]


    const OsVer = Platform.constants['Release'];

    const dataForShare =(`${JSON.stringify(loacalstutlist[0],null, 2)}`)
    const dispatch = useDispatch()


    const onBackPress = () => {
        navigation.navigate('myScan');
        return true;
    };

const callCustomModal = (title, message, isAvailable, func, cancel) => {
    let data = {
        title: title,
        message: message,
        isOkAvailable: isAvailable,
        okFunc: func,
        isCancel : cancel
    }
    dispatch(dispatchCustomModalStatus(true));
    dispatch(dispatchCustomModalMessage(data));
}


    const subject = `Saral App v1.0 Marks JSON - SchoolId:${loginData.data.school.schoolId} & Exam Id:${filteredData.examTestID}`
    const message = `${(dataForShare ? dataForShare : '')}`;

    const options = {
        message,
        subject,
    };

    const onShare = async (customOptions = options) => {
       if(presentStudentList.length <= 25 && OsVer > 10){
        try {
            await Share.open(customOptions);
        } catch (err) {
            console.log(err);
        }

       }else if(presentStudentList.length < 8 && OsVer <=10 ){
        try {
            await Share.open(customOptions);
        } catch (err) {
            console.log(err);
        }
       }else{
        callCustomModal(Strings.message_text,Strings.shareDataExceed,false);
       }
        
    };
    

    const renderItem = ({ item, index }) => {
        return <ScanStatusLocalList
            scanitemdata={item} 
            id={item.studentId}
            loacalstutlist={unsavedstudentList}
            themeColor1={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
            BrandLabel={BrandLabel}
        />

    }

    const renderEmptyData = ({ item }) => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={{fontFamily : monospace_FF}}>No Data Available</Text>
            </View>
        )
    }

    useEffect(() => {
        getDataFromLocal()
        getStudentList()
    },[])
    
    const getStudentList = async () => {
        let data = await getPresentAbsentStudent()
        if (data != null) {
            setUnsavedstudentList(data)
        }
    }

    const getDataFromLocal = async () => {
        let data = await getScannedDataFromLocal()
        if (data) {
          let filterscandata =  data.filter((item)=>{
            let findSection = item.studentsMarkInfo.some((item) => item.section == filteredData.section)
                if( filteredData.class == item.classId &&  filteredData.examDate == item.examDate &&  filteredData.subject == item.subject && filteredData.examTestID==item.examId && findSection   ){
                    return true
                }   
            })

            let hasSet = filteredData.hasOwnProperty("set") ? filteredData.set.length >= 0 ? filteredData.set : '' : null
            if (hasSet != null && hasSet != undefined &&  hasSet.length >= 0) {
                let findSetStudent = filterscandata.length > 0 ? filterscandata[0].studentsMarkInfo.filter((item) => {
                    if (hasSet.length >= 0) {
                        return item.set == hasSet;
                    }
                })
                :
                []
                filterscandata[0].studentsMarkInfo = findSetStudent
            }

            getPresentStudentList(filterscandata)
        }
    }


    const getPresentStudentList = (loacalstutlist)=>{
      
        let data =typeof (loacalstutlist) === "object"
            ?
            loacalstutlist[0]
            ?
            loacalstutlist[0].studentsMarkInfo.filter((o, index) => {
                if (o.studentAvailability && o.marksInfo.length > 0) {
                    return true
                }
            })
            :
            []
            :
           []
        setPresentStudentList(data)
        setLoacalstutlist(loacalstutlist)
        
    }

    const onPressSaveInDB = async () => {
        const data = await getScannedDataFromLocal();
        const hasNetwork = await checkNetworkConnectivity();
        let hasUpdate = await checkAppVersion();

        if (!hasUpdate) {
            if (hasNetwork) {
                if (data) {
                    if (!bgFlag) {
                        const filterData = data.filter((e) => {
                            let findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)
                            if (e.classId == filteredData.class && e.subject == filteredData.subject && e.examDate == filteredData.examDate &&findSection) {
                                return true
                            } else {
                                return false
                            }
                        })
                        setIsLoading(true)
                        let filterDataLen = 0
                        let setIntolocalAfterFilter = ''
                        if (filterData.length != 0) {
                            filterData.filter((f) => {
                                let findSection = f.studentsMarkInfo.some((item) => item.section == filteredData.section)
                                setIntolocalAfterFilter = data.filter((e) => {
                                    if (e.classId == f.classId && e.subject == f.subject && e.examDate == f.examDate && findSection) {
                                        return false
                                    } else {
                                        return true
                                    }
                                })
                            })
                            let apiObj = new SaveScanData(filterData[0], loginData.data.token);
                            saveScanData(apiObj, filterDataLen, setIntolocalAfterFilter);
                        } else {
                            callCustomModal(Strings.message_text,Strings.there_is_no_data,false);
                            setIsLoading(false)
                        }
                    }else{
                        setIsLoading(false)
                        callCustomModal(Strings.message_text,Strings.auto_sync_in_progress_please_wait,false);
                    }
                }
                else {
                    setIsLoading(false)
                    callCustomModal(Strings.message_text,Strings.there_is_no_data,false);
                }
            } else {
                callCustomModal(Strings.message_text, Strings.please_try_again_later_network_is_not_available, false, true)
            }
        }
    }

  const  saveScanData = async (api, filteredDatalen, localScanData) => {
        if (api.method === 'PUT') {
            let apiResponse = null;
            const source = axios.CancelToken.source();
            const id = setTimeout(() => {
                if (apiResponse === null) {
                    source.cancel('The request timed out.');
                }
            }, 60000);
            axios.put(api.apiEndPoint(), api.getBody(), { headers: api.getHeaders(), cancelToken: source.token },)
                .then(function (res) {
                    apiResponse = res;
                    clearTimeout(id);

                    let hasMessage = res ? typeof res.data == "string" ? true : false : false
                    if (hasMessage) {
                        api.processResponse(res);
                        callScanStatusData(false, filteredDatalen, localScanData)

                    } else {
                        dispatch(dispatchAPIAsyncSavedData(res.data));
                        setScannedDataIntoLocal(localScanData)
                        setIsLoading(false)
                        onBackPress();
                        callCustomModal(Strings.message_text,Strings.saved_successfully,false);
                    }

                })
                .catch(function (err) {
                    if (err && err.response && err.response.status == 500) {
                        callCustomModal(Strings.message_text, Strings.lock_screen, false);
                      }else{
                    collectErrorLogs("scanStatusLocal.js", "saveScanData", api.apiEndPoint(), err, false);
                    callCustomModal(Strings.message_text, Strings.contactAdmin, false);
                    clearTimeout(id);
                    setIsLoading(false)
                }
            });
        }
    }

    const callScanStatusData = async (bool,filteredDatalen, localScanData) => {
        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.class,
            "subject": filteredData.subject,
            "section": filteredData.section,
            "fromDate": filteredData.examDate,
            "page": 0,
            "schoolId": loginData.data.school.schoolId,
            "downloadRes": false
        }
        if (filteredData.hasOwnProperty("set")) {
            dataPayload.set = filteredData.set
        }
        let apiObj = new scanStatusDataAction(dataPayload);
        FetchSavedScannedData(apiObj, loginCred.schoolId, loginCred.password, filteredDatalen, localScanData)
    }

    const FetchSavedScannedData = async(api, uname, pass, filterDataLen, localScanData) => {

        if (api.method === 'POST') {
            let apiResponse = null
            const source = axios.CancelToken.source()
            const id = setTimeout(() => {
                if (apiResponse === null) {
                    source.cancel('The request timed out.');
                }
            }, 60000);
            axios.post(api.apiEndPoint(), api.getBody(), {
                auth: {
                    username: uname,
                    password: pass
                }
            })
                .then(function (res) {
                    callCustomModal(Strings.message_text,Strings.saved_successfully,false);
                    apiResponse = res
                    clearTimeout(id)
                    setIsLoading(false)
                    api.processResponse(res)
                    dispatch(dispatchAPIAsync(api));
                    setScannedDataIntoLocal(localScanData)
                    onBackPress();
                })
                .catch(function (err) {
                    collectErrorLogs("ScanHistoryCard.js","FetchSavedScannedData",api.apiEndPoint(),err,false)
                    callCustomModal(Strings.message_text,Strings.something_went_wrong_please_try_again,false);
                    clearTimeout(id)
                });
        }
    }

    function dispatchAPIAsync(api) {
        return {
            type: api.type,
            payload: api.getPayload()
        }
    }
    
    function dispatchAPIAsyncSavedData(res) {
            return {
                type: constants.SCANNED_DATA,
                payload: res
            }
        }

    return (
        <View style={styles.container}>
             <ShareComponent
                 navigation={navigation}
                 />
            <View style={{ flexDirection:'row',justifyContent: 'space-between' }}>
            {(multiBrandingData && BrandLabel) ?
                <MultibrandLabels
                Label1={BrandLabel.School}
                Label2={BrandLabel.SchoolId}
                School ={loginData.data.school.name}
                SchoolId={loginData.data.school.schoolId}
                />
                     :
                (loginData && loginData.data)
                &&
                <View>
                    <Text
                        style={styles.schoolName}
                    >
                        {Strings.school_name + ' Name : '}
                        <Text style={{ fontWeight: 'normal',fontFamily : monospace_FF }}>{loginData.data.school.name}</Text>
                    </Text>
                    <Text style={[styles.schoolId, { marginLeft: 5 }]}>
                        {Strings.schoolId_text + ' : '}
                        <Text style={{ fontWeight: 'normal',fontFamily : monospace_FF }}>
                            {loginData.data.school.schoolId}
                        </Text>
                    </Text>
                </View>
            }

            {presentStudentList.length > 0 &&
            <TouchableOpacity  onPress={()=>onShare()} style={{width:40,height:40,marginRight:20,marginTop:10}}>
                    <Image style={{ height: 25, width: 25, marginHorizontal: 15, marginVertical: 20 }} source={Assets.Share} />
            </TouchableOpacity> 
            }
            
            </View>

            <Text style={styles.scanStatus}>{Strings.scan_status}</Text>
        
            <FlatList
                data={ presentStudentList && presentStudentList}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyData}
            keyExtractor={(item, index) => `${index.toString()}`}
            contentContainerStyle={styles.content}
            />

          <View style={{justifyContent:'space-between',flexDirection:'row'}}>
          <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.close}
                activeOpacity={0.8}
                onPress={()=> onBackPress()}
                />

            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.save_scan}
                activeOpacity={0.8}
                onPress={()=> onPressSaveInDB()}
                />
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
const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanedData: state.scanedData.response,
        multiBrandingData: state.multiBrandingData.response.data,
        bgFlag: state.bgFlag,
        roiData: state.roiData.response,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanStatusLocal);
