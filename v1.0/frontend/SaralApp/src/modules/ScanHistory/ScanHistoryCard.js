import React, { memo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction';
import AppTheme from '../../utils/AppTheme';
import { getLoginCred, getScannedDataFromLocal, setScannedDataIntoLocal } from '../../utils/StorageUtils';
import Strings from '../../utils/Strings';

//api
import APITransport from '../../flux/actions/transport/apitransport'

//styles
import { styles } from './ScanHistoryStyles';
import { scanStatusDataAction } from '../ScanStatus/scanStatusDataAction';
import axios from 'axios';

const ScanHistoryCard = ({
    showButtons = true,
    navigation,
    filteredData,
    scanedData,
    loginData,
    setIsLoading,
    scanStatusData,
    setScanStatusData,
    themeColor1,
    studentsAndExamData
}) => {

    const SAVED_SCANNED_DATA_INTO_LOCAL = 'saved_scanned_data_into_local'
    const onPressContinue = () => {
        navigation.navigate('myScan')
    }

    const onPressStatus = () => {
        navigation.push('ScanStatus')
    }

    const dispatch = useDispatch()

    const onPressSaveInDB = async () => {
        const data = await getScannedDataFromLocal();
        const { subject, examDate } = filteredData.response

        if (data) {
            const filterData = data.filter((e) => {

                let findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.response.section)

                if (e.classId == filteredData.response.class && e.subject == subject && e.examDate == examDate && findSection) {
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

                    let findSection = f.studentsMarkInfo.some((item) => item.section == filteredData.response.section)

                    setIntolocalAfterFilter = data.filter((e) => {
                        if (e.classId == f.classId && e.subject == f.subject && e.examDate == f.examDate && findSection) {
                            return false
                        } else {
                            return true
                        }
                    })
                })

                    let apiObj = new SaveScanData(filterData[0], loginData.data.token);
                    dispatch(APITransport(apiObj))

                setTimeout(function () {
                    callScanStatusData(filterDataLen, setIntolocalAfterFilter)
                }, 2000);

            } else {
                Alert.alert('There is no data!')
                setIsLoading(false)
            }

        }
        else {
            setIsLoading(false)
            Alert.alert('There is no data!')
        }
    }

    const callScanStatusData = async (filteredDatalen, localScanData) => {
        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.response.class,
            "subject": filteredData.response.subject,
            "fromDate": filteredData.response.examDate,
            "page": 0,
            "schoolId": loginCred.schoolId,
            "downloadRes": true
        }
        let apiObj = new scanStatusDataAction(dataPayload);
        FetchSavedScannedData(apiObj, loginCred.schoolId, loginCred.password, filteredDatalen, localScanData)
    }

    const FetchSavedScannedData = (api, uname, pass, filterDataLen, localScanData) => {
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
                    setIsLoading(false)
                    Alert.alert(Strings.message_text, Strings.saved_successfully, [{
                        text: Strings.ok_text, onPress: () => {
                        }
                    }])
                    apiResponse = res
                    clearTimeout(id)
                    api.processResponse(res)
                    dispatch(dispatchAPIAsync(api));
                    setScanStatusData(filterDataLen)
                    setScannedDataIntoLocal(localScanData)
                })
                .catch(function (err) {
                    console.warn("Error", err);
                    console.warn("Error", err.response);
                    Alert.alert("Something Went Wrong")
                    setIsLoading(false)
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

    // for exam type
    let Examtypedata = studentsAndExamData.data.exams
    Examtypedata = studentsAndExamData.data.exams.filter(function (item) {
        return item.subject == filteredData.response.subject;
    }).map(({type}) => ({type}));


    return (
        <View>
            <TouchableOpacity
                style={[styles.container, { backgroundColor: themeColor1 ? themeColor1 : AppTheme.BLUE }]}
                disabled

            >
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingTop: '3%', paddingLeft: '1%', paddingRight: '1%', paddingBottom: '5%' }}>
                    <View>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                                <Text>{Strings.class_text}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                                <Text>{filteredData.response.className}</Text>
                            </View>
                        </View>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                                <Text>{Strings.section}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                                <Text>{filteredData.response.section}</Text>
                            </View>
                        </View>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                                <Text>{Strings.exam_date}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                                <Text>{filteredData.response.examDate}</Text>
                            </View>
                        </View>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                                <Text>{Strings.subject}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                                <Text>{filteredData.response.subject}</Text>
                            </View>
                        </View>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle,]}>
                                <Text>{Strings.Exam_Type}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle,]}>
                                {Examtypedata.map((item) =>
                                    <Text>{item.type}</Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                                <Text>{Strings.exam_id}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                                <Text>{filteredData.response.examTestID}</Text>
                            </View>
                        </View>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle,]}>
                                <Text>{Strings.scan_status}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle,]}>
                                <Text>{scanStatusData}</Text>
                            </View>
                        </View>
                        <View style={styles.scanCardStyle}>
                            <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle, { borderBottomWidth: 1 }]}>
                                <Text>{Strings.save_status}</Text>
                            </View>
                            <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle, { borderBottomWidth: 1 }]}>
                                <Text>{scanedData ? scanedData.length : 0}</Text>
                            </View>
                    </View>
                </View>
            </View>

            <View style={{ marginBottom: '3%', width: '100%', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                    {
                        showButtons
                        &&
                        <TouchableOpacity
                            style={{
                                backgroundColor: AppTheme.WHITE, borderRadius: 4,

                                width: true ? '45%' : '80%',
                                alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4,
                                marginLeft: 5,
                                marginRight: 5
                            }}
                            onPress={onPressStatus}
                        >
                            <Text>{Strings.save_status}</Text>
                        </TouchableOpacity>
                    }
                    {
                        showButtons
                        &&
                        <TouchableOpacity
                            style={{
                                backgroundColor: AppTheme.WHITE, borderRadius: 4, width: '45%',
                                alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4,
                                marginLeft: 5,
                                marginRight: 5
                            }}
                            onPress={onPressSaveInDB}
                        >
                            <Text style={{ color: AppTheme.BLACK }}>{Strings.save_scan}</Text>
                        </TouchableOpacity>}
                </View>
            </View>

            {
                showButtons
                &&
                <View style={{ marginBottom: '5%', marginTop: '2%', width: '100%', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: AppTheme.GREY, borderRadius: 4, width: '80%', alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4 }}
                            onPress={onPressContinue}
                        >
                            <Text style={{ color: AppTheme.WHITE }}>{Strings.continue_scan}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

        </TouchableOpacity>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        filteredData: state.filteredData,
        scanedData: state.scanedData.response.data,
        loginData: state.loginData,
        studentsAndExamData: state.studentsAndExamData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(memo(ScanHistoryCard));