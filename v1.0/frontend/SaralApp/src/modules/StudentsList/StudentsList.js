import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Alert } from 'react-native';

//redux
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import APITransport from '../../flux/actions/transport/apitransport'

//storage
import { getLoginCred, getStudentsExamData } from '../../utils/StorageUtils';
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
import { scanStatusDataAction } from '../../modules/ScanStatus/scanStatusDataAction';

const StudentsList = ({
    filteredData,
    loginData,
    navigation,
    scanTypeData
}) => {

    //hooks

    const [allStudentData, setAllStudentData] = useState([])

    useEffect(() => {
        studentData()
        getRoi()
        callScanStatusData()
    }, []);

    const dispatch = useDispatch();

    //function

    const callScanStatusData = async () => {
        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.class,
            "subject": filteredData.subject,
            "fromDate": filteredData.examDate,
            "page": 1,
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
        setAllStudentData(filterStudentsData[0].data ? filterStudentsData[0].data.students : []);
    }


    const renderStudentData = ({ item }) => {
        return (
            <StudentsDataComponent
                item={item}
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

    const navigateToNext = () => {
        navigation.navigate('ScanHistory')
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
                btnText="NEXT"
                onPress={navigateToNext}
            />

        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        filteredData: state.filteredData,
        loginData: state.loginData,
        roiData: state.roiData,
        scanTypeData: state.scanTypeData.response
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);
