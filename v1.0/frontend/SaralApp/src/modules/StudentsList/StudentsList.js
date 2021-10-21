import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, Alert, SafeAreaView,BackHandler } from 'react-native';

//redux
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import APITransport from '../../flux/actions/transport/apitransport'

//storage
import { getLoginCred, getStudentsExamData, setAbsentStudentDataIntoAsync, setPresentAbsentStudent, setTotalStudent } from '../../utils/StorageUtils';
import ButtonComponent from '../common/components/ButtonComponent';
import StudentsDataComponent from './StudentsDataComponent';

//style
import { styles } from './StudentsDataStyle';



//action

//constant
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import { apkVersion } from '../../configs/config';
import { ROIAction } from './ROIAction';

//npm

import axios from 'axios';

//components
import { scanStatusDataAction } from '../../modules/ScanStatus/scanStatusDataAction';
import Spinner from '../common/components/loadingIndicator';
import { cryptoText, validateToken } from '../../utils/CommonUtils';
import { LoginAction } from '../../flux/actions/apis/LoginAction';

import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction'


const StudentsList = ({
    filteredData,
    loginData,
    navigation,
    saveAbsentStudent,
    multiBrandingData,
    scanedData,
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
    const [isLoading, setIsLoading] = useState(false)
    const [stdArray, setStdArray] = useState([])
    const prevloginResponse = usePrevious(loginData);
    const prevSaveRes = usePrevious(saveAbsentStudent)


    useEffect(() => {
        studentData()

    }, []);

     useEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
      );


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




    const renderStudentData = ({ item }) => {
        return (
            <StudentsDataComponent
                themeColor1={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
                themeColor2={multiBrandingData ? multiBrandingData.themeColor2 : AppTheme.LIGHT_BLUE}
                item={item}
                pabsent={item.studentAvailability}
                scanedData={scanedData}
                filteredData={filteredData}
                setStdArray={setStdArray}
                stdArray={stdArray}
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

    const saveAbsentPresentDetails = (token) => {

        let stdPstAbsArray = []

        let absentPresentStatus = {
            "classId": filteredData.class,
            "examDate": filteredData.examDate,
            "subject": filteredData.subject,
            "studentsMarkInfo": stdPstAbsArray
        }

        stdArray.forEach((element, index) => {

            let stdPstAbs = {
                "section": filteredData.section,
                "studentId": 0,
                "studentAvailability": true,
                "securedMarks": 0,
                "totalMarks": 0
            }

            stdPstAbs.studentAvailability = element.studentAvailability
            stdPstAbs.studentId = element.studentId
            stdPstAbsArray.push(stdPstAbs)
        });

        absentPresentStatus.studentsMarkInfo = stdPstAbsArray

        // setIsLoading(true)
        let dataPayload = absentPresentStatus
        let apiObj = new SaveScanData(dataPayload, token)
        dispatch(APITransport(apiObj));
        setPresentAbsentStudent(allStudentData)
        navigation.navigate('ScanHistory');
    }

    const navigateToNext = () => {
        if (allStudentData.length > 0) {
            saveAbsentPresentDetails(loginData.data.token)
        }
    }
    const navigateToBack =()=> {
        navigation.navigate('selectDetails')
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

    const getRoi = () => {

        let payload =
        {
            "examId": filteredData.examTestID,
        }
        let token = loginData.data.token
        let apiObj = new ROIAction(payload, token);
        dispatch(APITransport(apiObj))
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
                background={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
                ListEmptyComponent={renderEmptyList}
                keyExtractor={(item) => item.studentId.toString()}
                contentContainerStyle={styles.flatlistCon}
                showsVerticalScrollIndicator={false}
            />


           <View style={styles.viewnxtBtnStyle1}>
            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.Back.toUpperCase()}
                activeOpacity={0.8}
                onPress={navigateToBack}
            />

            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.next_text.toUpperCase()}
                activeOpacity={0.8}
                onPress={navigateToNext}
            />
            </View>

            {
                isLoading &&
                <Spinner
                    animating={isLoading}
                    customContainer={{ opacity: 0.4, elevation: 15 }}
                />
            }
        </SafeAreaView>
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
        multiBrandingData: state.multiBrandingData.response.data,
        scanedData: state.scanedData.response
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);
