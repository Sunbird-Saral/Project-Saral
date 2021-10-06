import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, Alert } from 'react-native';

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

const StudentsList = ({
    filteredData,
    loginData,
    navigation,
    scanTypeData,
    saveAbsentStudent,
    absentStudentDataResponse
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

    useEffect(() => {
        studentData()
        getRoi()
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
            "page": 3,
            "downloadRes": true
        }
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
            if (e.class == filteredData.response.className && e.section == filteredData.response.section) {
                return true
            }
        })
        setTotalStudent(filterStudentsData[0].data ? filterStudentsData[0].data.students : []);
        // let examId = ''

        // _.forEach(filterStudentsData[0].data.examInfo, (o) => {
        //     if (o.examCode == filteredData.response.examCode) {
        //         examId = o.examId
        //     }
        // })

        // let examCode = filteredData.response.examCode

        // setExamDatabj({
        //     examCode,
        //     examId: examId
        // })

        // let studentsList = JSON.parse(JSON.stringify(filterStudentsData[0].data.students))
        // console.log("studentsList", studentsList);
        // let absentStudentlist = absentStudentDataResponse && absentStudentDataResponse.data.length > 0 ? JSON.parse(absentStudentDataResponse.data[0])[0].AbsentStudents : [];
        // console.log("absentStudentlist", absentStudentlist);
        // studentsList.forEach((element) => {
        //     element.isAbsent = false
        //     absentStudentlist.forEach(o => {
        //         if (o.AadhaarUID == element.aadhaarUID) {
        //             element.isAbsent = true;
        //         }
        //     })
        // });

        // setFetchedAbsentList(absentStudentlist)
        setAllStudentData(filterStudentsData[0].data.students)
        setIsLoading(false)
        callScanStatusData()
        // console.log("setFetchedAbsentList", absentStudentlist);
        // console.log("setFetchedAbsentList", studentsList);
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
        return (
            <StudentsDataComponent
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
        console.log("absentStudentDataResponse", absentStudentsData);
        let apiObj = new SaveAbsentDataAction(absentStudentsData, token)
        APITransport(apiObj);
    }

    const navigateToNext = () => {
        // if (absentStudentsData.length > 0) {
        //     let isTokenValid = validateToken(token)
        //     if (isTokenValid) {
        //         let absentList = _.filter(allStudentData, (o) => o.isAbsent);
        //         saveAbsentDetails(token);
        //         setAbsentStudentDataIntoAsync(absentList);
        //     }
        //     else if (!isTokenValid) {
        //         loginAgain()
        //     }
        // } else {
        //     let absentList = _.filter(allStudentData, (o) => o.isAbsent);
        //     setAbsentStudentDataIntoAsync(absentList);
            navigation.navigate('ScanHistory');
        // }
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
            "examId": filteredData.response.examTestID,
            "type": scanTypeData.scanType
        }

        let apiObj = new ROIAction(payload);
        APITransport(apiObj)
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            {/* <HeaderComponent
                title={Strings.up_saralData}
                logoutHeaderText={Strings.logout_text}
                customLogoutTextStyle={{ color: AppTheme.GREY }}
                onLogoutClick={onLogoutClick}
            /> */}
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

            <FlatList
                data={allStudentData}
                renderItem={renderStudentData}
                ListEmptyComponent={renderEmptyList}
                keyExtractor={(item) => item.studentId.toString()}
                contentContainerStyle={styles.flatlistCon}
                showsVerticalScrollIndicator={false}
            />

            <ButtonComponent
                customBtnStyle={styles.nxtBtnStyle}
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
    );
}

const mapStateToProps = (state) => {
    return {
        filteredData: state.filteredData,
        loginData: state.loginData,
        roiData: state.roiData,
        scanTypeData: state.scanTypeData.response,
        saveAbsentStudent: state.saveAbsentStudent,
        absentStudentDataResponse: state.absentStudentDataResponse
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);
