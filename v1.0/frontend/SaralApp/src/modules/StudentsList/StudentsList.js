import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, Alert, ScrollView } from 'react-native';

//redux
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import APITransport from '../../flux/actions/transport/apitransport'

//storage
import { getLoginCred, getStudentsExamData, setAbsentStudentDataIntoAsync, setTotalStudent } from '../../utils/StorageUtils';
import ButtonComponent from '../common/components/ButtonComponent';
import StudentsDataComponent from './StudentsDataComponent';

//style
import { styles } from './StudentsDataStyle';

//header
import HeaderComponent from '../common/components/HeaderComponent';

//action

//constant
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import { apkVersion } from '../../configs/config';
import { ROIAction } from './ROIAction';

//npm
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//components
import { scanStatusDataAction } from '../../modules/ScanStatus/scanStatusDataAction';
import Spinner from '../common/components/loadingIndicator';
import { cryptoText, validateToken } from '../../utils/CommonUtils';
import { SaveAbsentDataAction } from '../../flux/actions/apis/saveAbsentDataAction';
import { LoginAction } from '../../flux/actions/apis/LoginAction';
import { MultiBrandingAction } from '../../flux/actions/apis/multiBranding';

const StudentsList = ({
    filteredData,
    loginData,
    navigation,
    scanTypeData,
    saveAbsentStudent,
    multiBrandingData,
    absentStudentDataResponse,
    roiData,
    apiStatus
}) => {


    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    //hooks
    const [allStudentData, setAllStudentData] = useState([])
    const [absentStudentsData, setAbsentStudentsData] = useState([]);
    const [fetchedAbsentList, setFetchedAbsentList] = useState([])
    const [examDataObj, setExamDatabj] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const prevloginResponse = usePrevious(loginData);
    const prevSaveRes = usePrevious(saveAbsentStudent)
    const Theme = navigation.getParam('Theme')
    const themeColor1 = multiBrandingData.themeColor1

    useEffect(() => {
        studentData()
        // getRoi()
        // callScanStatusData()
    }, []);

    useEffect(() => {
        if (prevloginResponse && loginData && prevloginResponse != loginData) {
            setIsLoading(false);
            if (loginData && loginData.data && loginData.status == 200) {
                onNextClick(loginData.data.jwtToken)
            } else if (loginData && loginData.data && loginData.status != 200) {
                Alert.alert(Strings.message_text, Strings.process_failed_try_again, [
                    { 'text': Strings.cancel_text, style: Strings.cancel_text },
                    { 'text': Strings.retry_text, onPress: () => loginAgain() }
                ])
            }
        }

        if (prevSaveRes && saveAbsentStudent && prevSaveRes != saveAbsentStudent) {
            setIsLoading(false)
            if (saveAbsentStudent && saveAbsentStudent.data && saveAbsentStudent.status == 200) {
                navigation.navigate('scanHistory')
            } else if (saveAbsentStudent && saveAbsentStudent.data && saveAbsentStudent.status != 200) {
                Alert.alert(Strings.message_text, Strings.process_failed_try_again, [
                    { 'text': Strings.ok_text, style: Strings.cancel_text }
                ])
            }
        }
    }, [saveAbsentStudent, loginData])

    const dispatch = useDispatch();

    //function


    const callScanStatusData = async () => {
        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.class,
            "subject": filteredData.subject,
            "fromDate": filteredData.examDate,
            "schoolId": loginCred.schoolId,
            "page": 0,
            "downloadRes": true
        }
        // console.log("data",dataPayload);
        let apiObj = new scanStatusDataAction(dataPayload);
        FetchSavedScannedData(apiObj, loginCred.schoolId, loginCred.password)
    }

    const FetchSavedScannedData = (api, uname, pass) => {
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
                    apiResponse = res
                    clearTimeout(id)
                    api.processResponse(res)
                    dispatch(dispatchAPIAsync(api));
                })
                .catch(function (err) {
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

    const studentData = async () => {
        let studentsExamData = await getStudentsExamData();
        const filterStudentsData = studentsExamData.filter((e) => {
            if (e.class == filteredData.className && e.section == filteredData.section) {
                return true
            }
        })
        setTotalStudent(filterStudentsData[0].data ? filterStudentsData[0].data.students : []);
        setAllStudentData(filterStudentsData[0].data.students)
        setIsLoading(false)
        callScanStatusData()
        getRoi()
    
    }

    const onMarkPresentAbsent = (data) => {
        let createdTime = new Date()
        let obj = {
            // examId: examDataObj.examId,
            // examCode: examDataObj.examCode,
            schoolId: data.schoolId,
            aadhaarUID: data.aadhaarUID,
            studyingClass: data.studyingClass,
            section: data.section.trim().toUpperCase(),
            createdOn: createdTime,
        }
        let isAlreadyMarkedAbsent = _.find(fetchedAbsentList, (o) => o.AadhaarUID == data.aadhaarUID)

        let scanedData = JSON.parse(getScanStatusData.data);
        if (data.isAbsent) {
            data.isAbsent = false
            if (isAlreadyMarkedAbsent) {
                obj.isAbsent = 0
                let absentStudentsDataArr = JSON.parse(JSON.stringify(absentStudentsData))
                absentStudentsDataArr.push(obj)
                setAbsentStudentsData(absentStudentsDataArr)
            } else {
                const modified = _.filter(absentStudentsData, (o) => o.aadhaarUID != data.aadhaarUID)
                setAbsentStudentsData((modified))
            }
        } else if (!data.isAbsent) {
            const checkIsScanned = scanedData[0].EntryCompletedStudents.filter((o) => o.AadhaarUID === data.aadhaarUID);
            if (checkIsScanned.length > 0) {
                Alert.alert("student can't be mark as absent once scanned !")
            }
            else {
                data.isAbsent = true
                if (isAlreadyMarkedAbsent) {
                    const modified = _.filter(absentStudentsData, (o) => o.aadhaarUID != data.aadhaarUID)
                    setAbsentStudentsData((modified))

                } else {
                    obj.isAbsent = 1
                    let absentStudentsDataArr = JSON.parse(JSON.stringify(absentStudentsData))
                    absentStudentsDataArr.push(obj)
                    setAbsentStudentsData(absentStudentsDataArr)
                }
            }
        }
    }


    const renderStudentData = ({ item }) => {
        const themeColor1 = multiBrandingData.themeColor1
        return (
            <StudentsDataComponent
            
                themeColor1 ={themeColor1}
                item={item}
                onBtnClick={onMarkPresentAbsent}
            />
        )
    }

    const renderEmptyList = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>No Students Available</Text>
            </View>
        )
    }

    const saveAbsentDetails = (token) => {
        setIsLoading(true)
        let apiObj = new SaveAbsentDataAction(absentStudentsData, token)
        APITransport(apiObj);
    }

    const navigateToNext = () => {
        navigation.navigate('ScanHistory');
    }

    const loginAgain = async () => {
        let loginCred = await getLoginCred()
        if (loginCred) {
            setIsLoading(true)
            let encPass = cryptoText(loginCred.password)
            let apiObj = new LoginAction(loginCred.username, encPass);
            APITransport(apiObj);
        }
        else {
            Alert.alert(Strings.message_text, Strings.please_try_again, [
                { 'text': Strings.ok_text, onPress: () => loginAgain() }
            ])
        }
    }

    const onLogoutClick = async () => {
        Alert.alert(Strings.message_text, Strings.are_you_sure_you_want_to_logout, [
            { 'text': Strings.no_text, style: 'cancel' },
            {
                'text': Strings.yes_text, onPress: async () => {
                    await AsyncStorage.clear();
                    navigation.navigate('auth');
                }
            }
        ])
    }

    const getRoi = () => {

        let payload =
        {
            "examId": filteredData.examTestID,
        }
        let token = loginData.data.token
        let apiObj = new ROIAction(payload, token);
        dispatch(APITransport(apiObj))
    }
  console.log('Themem',Theme)

    return (
        <ScrollView>
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            {(loginData && loginData.data) &&
                <View>
                    <Text
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingTop: '4%' }}
                    >
                        {Strings.school_name + ' : '}
                        <Text style={{ fontWeight: 'normal' }}>
                            {loginData.data.school.name}
                        </Text>
                    </Text>
                    <Text
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '1%' }}
                    >
                        {Strings.schoolId_text + ' : '}
                        <Text style={{ fontWeight: 'normal' }}>
                            {loginData.data.school.schoolId}
                        </Text>
                    </Text>
                </View>

            }
            <Text
                style={{ fontSize: AppTheme.FONT_SIZE_REGULAR - 3, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', marginBottom: '4%' }}
            >
                {Strings.version_text + ' : '}
                <Text style={{ fontWeight: 'normal' }}>
                    {apkVersion}
                </Text>
            </Text>
            <View style={{backgroundColor:themeColor1 ?themeColor1 :AppTheme.BLUE}}>
            <FlatList
                data={allStudentData}
                renderItem={renderStudentData}
                background ={themeColor1}
                ListEmptyComponent={renderEmptyList}
                keyExtractor={(item) => item.studentId.toString()}
                contentContainerStyle={styles.flatlistCon}
                showsVerticalScrollIndicator={false}
            /></View>

            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle,{backgroundColor:themeColor1 ? themeColor1: AppTheme.BLUE}]}
                btnText={Strings.next_text.toUpperCase()}
                activeOpacity={0.8}
                // onPress={() => navigateToNext(loginData.data.jwtToken)}
                onPress={navigateToNext}
            />

            {
                isLoading &&
                <Spinner
                    animating={isLoading}
                    customContainer={{ opacity: 0.4, elevation: 15 }}
                />
            }

        </View>
        </ScrollView>
    );
}

const mapStateToProps = (state) => {
    return {
        filteredData: state.filteredData.response,
        loginData: state.loginData,
        roiData: state.roiData,
        scanTypeData: state.scanTypeData.response,
        saveAbsentStudent: state.saveAbsentStudent,
        absentStudentDataResponse: state.absentStudentDataResponse,
        apiStatus: state.apiStatus,
        multiBrandingData: state.multiBrandingData.response.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);
