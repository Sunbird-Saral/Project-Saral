import React, { Component } from 'react';
import { View, ScrollView, Text, BackHandler, Alert, TouchableOpacity, Share } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash'
import DateTimePicker from '@react-native-community/datetimepicker'
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import Spinner from '../common/components/loadingIndicator';
import { apkVersion } from '../../configs/config';
import HeaderComponents from '../common/components/HeaderComponents';
import DropDownMenu from '../common/components/DropDownComponent';
import ButtonComponent from '../common/components/ButtonComponent';
import { getLoginData, setStudentsExamData, getStudentsExamData, getLoginCred, setLoginData, getErrorMessage, eraseErrorLogs } from '../../utils/StorageUtils'
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction'
import { GetStudentsAndExamData } from '../../flux/actions/apis/getStudentsAndExamData';
import { FilteredDataAction } from '../../flux/actions/apis/filteredDataActions';
import APITransport from '../../flux/actions/transport/apitransport';
import { cryptoText, SCAN_TYPES, validateToken } from '../../utils/CommonUtils';
import { ROIAction } from '../StudentsList/ROIAction';
import { GetAbsentStudentData } from '../../flux/actions/apis/getAbsentStudentData';
import { LoginAction } from '../../flux/actions/apis/LoginAction';
import { LogoutAction } from '../../flux/actions/apis/LogoutAction';
import { getScannedDataFromLocal } from '../../utils/StorageUtils';
import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction';
import C from '../../flux/actions/constants';
import ShareComponent from '../common/components/Share';
import MultibrandLabels from '../common/components/multibrandlabels';
import ModalView from '../common/components/ModalView';

const clearState = {
    defaultSelected: Strings.select_text,
    classesArr: [],
    classList: [],
    classListIndex: -1,
    selectedClass: '',
    sectionList: [],
    sectionListIndex: -1,
    selectedSection: '',
    pickerDate: new Date(),
    selectedDate: '',
    subArr: [],
    examTestID: [],
    subIndex: -1,
    selectedSubject: '',
    errClass: '',
    errSub: '',
    errDate: '',
    errSection: '',
    selectedClassId: '',
    calledStudentsData: false,
    sectionValid: false,
    username: '',
    password: '',
    dataPayload: null,
    calledLogin: false,
    callApi: '',
    dateVisible: false,
    examDate: [],
    calledAbsentStatus: false,
    calledScanStaus: false,
    absentStatusPayload: null,
    subjectsData: []
}

class SelectDetailsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            loginDetails: null,
            defaultSelected: Strings.select_text,
            classesArr: [],
            classList: [],
            classListIndex: -1,
            selectedClass: '',
            sectionList: [],
            sectionListIndex: -1,
            selectedSection: '',
            pickerDate: new Date(),
            selectedDate: '',
            subArr: [],
            examTestID: [],
            subIndex: -1,
            selectedSubject: '',
            errClass: '',
            errSub: '',
            errDate: '',
            errSection: '',
            selectedClassId: '',
            calledStudentsData: false,
            sectionValid: false,
            username: '',
            password: '',
            dataPayload: null,
            calledLogin: false,
            callApi: '',
            dateVisible: false,
            scanType: SCAN_TYPES.PAT_TYPE,
            examDate: [],
            calledAbsentStatus: false,
            absentStatusPayload: null,
            subjectsData: [],
            filterdataid: [],
            isHidden: false,
        }
        this.onPress = this.onPress.bind(this);
        this.onBack = this.onBack.bind(this)
    }

    onPress() {
        this.setState({isHidden: !this.state.isHidden})
      }

    componentDidMount() {
        const { navigation, scanTypeData } = this.props
        navigation.addListener('willFocus', async payload => {
            BackHandler.addEventListener('hardwareBackPress', this.onBack)

            this.setState(clearState)

            if (scanTypeData && scanTypeData.scanType) {
                this.setState({
                    scanType: scanTypeData.scanType
                })
            }

            let loginDetails = await getLoginData()
            if (loginDetails) {
                let classesArr = [...loginDetails.classes]
                let classes = []
                _.forEach(classesArr, (data, index) => {
                    classes.push(data.className)
                })

                this.setState({
                    classList: classes,
                    classesArr: classesArr,
                    loginDetails: loginDetails
                })
            }
        })
        this.willBlur = navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBack)
        );
    }

    onBack = () => {
        const { navigation } = this.props;
        BackHandler.exitApp()
        // navigation.goBack();
        return true
    }



    loader = (flag) => {
        this.setState({
            isLoading: flag
        })
    }

    onDropDownSelect = (index, value, type) => {
        const { loginDetails, classesArr, selectedClass, selectedClassId, selectedSection, selectedSubject } = this.state
        if (type == 'class') {
            if (value != selectedClass) {
                const sections = [...classesArr[index].sections]
                let sectionListArr = []
                _.forEach(sections, (sectionData) => sectionListArr.push(sectionData.section))
                this.setState({
                    sectionList: sectionListArr,
                    sectionListIndex: 0,
                    selectedSection: sectionListArr[0],
                    subIndex: -1,
                    selectedSubject: '',
                    selectedDate: '',
                    pickerDate: new Date()
                }, () => {
                    if (loginDetails) {
                        let payload = {
                            classId: classesArr[index].classId,
                            section: sectionListArr[0],
                        }

                        this.loader(true)
                        this.setState({
                            dataPayload: payload
                        }, () => {

                            // let isTokenValid = validateToken(loginDetails.expiresOn)                                 
                            // if(isTokenValid) {
                            this.callStudentsData(loginDetails.token)

                        })
                    }
                })
            }
            this.setState({
                errClass: '',
                errSection: '',
                errSub: '',
                errDate: '',
                classListIndex: Number(index),
                selectedClass: value,
                selectedClassId: classesArr[index].classId
            })
        }

        else if (type == 'section') {
            if (value != selectedSection) {
                this.setState({
                    subIndex: -1,
                    selectedSubject: '',
                    selectedDate: '',
                    pickerDate: new Date(),
                    sectionValid: false,
                    errClass: '',
                    errSection: '',
                    errSub: '',
                    errDate: '',
                })
            }
            this.setState({
                sectionListIndex: Number(index),
                selectedSection: value,
            }, () => {
                if (loginDetails) {
                    let payload = {
                        classId: selectedClassId,
                        section: value
                    }
                    if (value == 'All') {
                        payload.section = 0
                    }
                    this.loader(true)
                    this.setState({
                        dataPayload: payload
                    }, () => {

                        this.callStudentsData(loginDetails.token)
                    })
                }
            })
        }
        else if (type == 'sub') {
            if (value != selectedSubject) {
                this.setState({
                    pickerDate: new Date(),
                    selectedDate: ''
                })
            }
            this.setState({
                errClass: '',
                errSection: '',
                errSub: '',
                errDate: '',
                subIndex: Number(index),
                selectedSubject: value
            })
        }
    }

    callStudentsData = (token) => {
        const { dataPayload } = this.state
        this.setState({
            calledStudentsData: true,
        }, () => {
            let apiObj = new GetStudentsAndExamData(dataPayload, token);
            this.props.APITransport(apiObj)

        })
    }

    validateAbsentStatusApi = () => {
        const { selectedClassId, selectedExam, selectedSection, loginDetails } = this.state
        let schoolId = loginDetails.school.schoolId
        let payload = {
            schoolId: schoolId,
            classId: selectedClassId,
            section: selectedSection == 'All' ? 0 : selectedSection,
        }

        this.setState({
            absentStatusPayload: payload
        }, () => {

            this.callAbsentStatus(payload, loginDetails.jwtToken)

        })
    }

    loginAgain = async () => {
        let loginCred = await getLoginCred()
        if (loginCred) {
            this.setState({
                isLoading: true,
                username: loginCred.schoolId,
                password: loginCred.password
            }, () => {

                this.callLogin()

            })
        }
        else {
            Alert.alert(Strings.message_text, Strings.please_try_again, [
                { 'text': Strings.ok_text, onPress: () => this.loginAgain() }
            ])
        }
    }

    callLogin = () => {
        this.setState({
            isLoading: true,
            calledLogin: true
        }, () => {
            let encPass = cryptoText(this.state.password)
            let loginObj = {
                "schoolId": this.state.username,
                "password": this.state.password
            }
            let apiObj = new LoginAction(loginObj);
            this.props.APITransport(apiObj);

        })
    }

    callAbsentStatus = (payload, token) => {
        this.setState({
            isLoading: true,
            calledAbsentStatus: true
        }, () => {
            let apiObj = new GetAbsentStudentData(payload, token);
            this.props.APITransport(apiObj)
        })
    }

    validateScanStatusApi = () => {
        const { selectedClassId, selectedExam, selectedSection } = this.state
        const { loginDetails } = this.props
        let schoolId = loginDetails.schoolInfo.schoolCode
        let payload = {
            schoolId: schoolId,
            standardId: selectedClassId,
            section: selectedSection == 'All' ? 0 : selectedSection,
            examCode: selectedExam
        }

        this.setState({
            scanStatusPayload: payload
        }, () => {
            let isTokenValid = validateToken(loginDetails.expiresOn)

            if (isTokenValid) {
                this.callScanStatus(payload, loginDetails.jwtToken)
            }
            else if (!isTokenValid) {
                this.setState({
                    callApi: 'callScanStatus'
                })
                this.loginAgain()
            }
        })
    }

    callScanStatus = (payload, token) => {
        this.setState({
            isLoading: true,
            calledScanStaus: true
        }, () => {
            let apiObj = new GetScanStatusAction(payload, token);
            this.props.APITransport(apiObj)
        })
    }

    setLoginDataLocally = (data) => {
        this.setState({
            loginData: data
        })
    }


    async componentDidUpdate(prevProps) {
        if (prevProps != this.props) {

            const { apiStatus, studentsAndExamData, absentStudentDataResponse, getScanStatusData, loginData } = this.props
            const { calledStudentsData, calledAbsentStatus, selectedClass, selectedSection, selectedClassId, calledScanStaus, calledLogin, callApi, absentStatusPayload } = this.state
            if (apiStatus && prevProps.apiStatus != apiStatus && apiStatus.error) {
                if (calledStudentsData) {
                    this.loader(false)
                    this.setState({
                        calledStudentsData: false,
                        sectionValid: false,
                        subIndex: -1,
                        selectedSubject: '',
                        selectedDate: '',
                        pickerDate: new Date()
                    }, () => {
                        if (apiStatus && apiStatus.message) {
                            Alert.alert(Strings.message_text, apiStatus.message, [{
                                text: Strings.ok_text
                            }])
                        } else {
                            Alert.alert(Strings.message_text, Strings.please_try_again, [{
                                text: Strings.ok_text
                            }])
                        }
                    })
                }
            }

            if (calledStudentsData) {
                if (studentsAndExamData && prevProps.studentsAndExamData != studentsAndExamData) {
                    this.loader(false)
                    this.setState({
                        calledStudentsData: false, callApi: ''
                    }, async () => {
                        if (studentsAndExamData.status && studentsAndExamData.status == 200) {
                            if (studentsAndExamData.data.students && studentsAndExamData.data.students.length > 0) {
                                let obj = {
                                    class: selectedClass,
                                    classId: selectedClassId,
                                    section: selectedSection,
                                    data: studentsAndExamData.data
                                }

                                let studentsAndExamArr = await getStudentsExamData()
                                let finalStudentsAndExamArr = []
                                if (studentsAndExamArr != null) {
                                    studentsAndExamArr.forEach(element => {
                                        finalStudentsAndExamArr.push(element)
                                    });
                                }
                                finalStudentsAndExamArr.forEach((data, index) => {
                                    if (data && data.class == obj.class && studentsAndExamData.data) {
                                        data.data = studentsAndExamData.data
                                    }
                                    if (data.class == obj.class && data.section == obj.section) {
                                        finalStudentsAndExamArr.splice(index, 1)
                                    }
                                })
                                finalStudentsAndExamArr.push(obj)
                                let studentsExamDataSaved = await setStudentsExamData(finalStudentsAndExamArr)
                                if (studentsExamDataSaved) {
                                    let subArr = []
                                    let testID = []
                                    let examDates = []
                                    let subjects = []
                                    _.filter(studentsAndExamData.data.exams, function (o) {
                                        subArr.push(o.subject + " " + o.examDate)
                                        testID.push(o.examId)
                                        examDates.push(o.examDate)
                                        subjects.push(o.subject)
                                    })
                                    this.setState({
                                        errSection: '',
                                        sectionValid: true,
                                        subArr: subArr,
                                        examTestID: testID,
                                        examDate: examDates,
                                        subjectsData: subjects

                                    })
                                }
                            }
                            else {
                                this.setState({
                                    errSection: Strings.please_select_valid_section,
                                    sectionValid: false,
                                    subIndex: -1,
                                    selectedSubject: '',
                                    selectedDate: '',
                                    pickerDate: new Date()
                                })
                            }

                        }
                        else {
                            this.setState({
                                errSection: Strings.process_failed_try_again,
                                sectionValid: false,
                                subIndex: -1,
                                selectedSubject: '',
                                selectedDate: '',
                                pickerDate: new Date()
                            })
                        }
                    })
                }
            }
            if (calledLogin) {
                if (loginData && prevProps.loginData != loginData) {
                    this.setState({
                        isLoading: false,
                        calledLogin: false
                    }, async () => {
                        if (loginData.status && loginData.status == 200) {
                            let loginSaved = await setLoginData(loginData.data)
                            this.setLoginDataLocally(loginData.data)
                            if (loginSaved) {
                                if (callApi == 'callScanStatus') {
                                    this.callScanStatus(scanStatusPayload, loginData.data.jwtToken)
                                }
                                else if (callApi == 'callStudentsData') {
                                    this.callStudentsData(loginData.data.jwtToken)
                                } else if (callApi == 'callAbsentStatus') {

                                    this.callAbsentStatus(absentStatusPayload, loginData.data.jwtToken)
                                }
                            }
                            else {
                                Alert.alert(Strings.message_text, Strings.process_failed_try_again, [
                                    { 'text': Strings.cancel_text, style: Strings.cancel_text, onPress: () => loader(false) },
                                    { 'text': Strings.retry_text, onPress: () => this.callLogin() }

                                ])
                            }
                        }
                        else {
                            Alert.alert(Strings.message_text, Strings.process_failed_try_again, [
                                { 'text': Strings.cancel_text, style: Strings.cancel_text, onPress: () => loader(false) },
                                { 'text': Strings.retry_text, onPress: () => this.callLogin() }

                            ])
                        }
                    })
                }
            }

            if (calledScanStaus) {
                if (getScanStatusData && prevProps.getScanStatusData != getScanStatusData) {
                    this.setState({ calledScanStaus: false, callApi: '' })
                    if (getScanStatusData.status && getScanStatusData.status == 200) {
                        this.validateAbsentStatusApi()
                    }
                    else {
                        this.setState({
                            isLoading: false
                        }, () => {
                            Alert.alert(Strings.message_text, Strings.please_try_again, [{
                                text: Strings.ok_text, onPress: () => {
                                    this.validateScanStatusApi()
                                }
                            }])
                        })
                    }
                }
            }

            if (calledAbsentStatus) {
                if (absentStudentDataResponse && prevProps.absentStudentDataResponse != absentStudentDataResponse) {
                    this.setState({ calledAbsentStatus: false, callApi: '' })
                    if (absentStudentDataResponse.status && absentStudentDataResponse.status == 200) {
                        this.props.navigation.navigate('AbsentUi')
                    }
                    else {
                        this.setState({
                            isLoading: false
                        }, () => {
                            Alert.alert(Strings.message_text, Strings.please_try_again, [{
                                text: Strings.ok_text, onPress: () => {
                                    this.validateAbsentStatusApi()
                                }
                            }])
                        })
                    }
                }
            }
        }
    }

    validateFields = () => {
        const { classListIndex, subIndex, sectionListIndex, sectionValid } = this.state
        const { scanTypeData } = this.props
        if (classListIndex == -1) {
            this.setState({
                errClass: Strings.please_select_class,
                errSection: '',
                errSub: '',
                errDate: '',
                isLoading: false
            })
            return false
        }
        else if (sectionListIndex == -1) {
            this.setState({
                errClass: '',
                errSection: Strings.please_select_section,
                errSub: '',
                errDate: ''
            })
            return false
        }
        else if (!sectionValid) {
            this.setState({
                errClass: '',
                errSection: Strings.please_select_valid_section,
                errSub: '',
                errDate: ''
            })
            return false
        }
        if (subIndex == -1) {
            this.setState({
                errClass: '',
                errSection: '',
                errSub: Strings.please_select_sub,
                errDate: ''
            })
            return false
        }

        return true
    }

    onSubmitClick = () => {
        const { selectedClass, selectedClassId, selectedSection, examTestID, subIndex, examDate, subjectsData } = this.state
        const { loginData } = this.props
        this.setState({
            errClass: '',
            errSub: '',
            errSection: '',
            errSub: '',
            isLoading: true
        }, () => {
            let valid = this.validateFields()
            if (valid) {
                let obj = {
                    className: selectedClass,
                    class: selectedClassId,
                    examDate: examDate[subIndex],
                    section: selectedSection,
                    subject: subjectsData[subIndex],
                    examTestID: examTestID[subIndex],
                }
                this.props.FilteredDataAction(obj)
                let payload = {
                    "examId": examTestID[subIndex],
                }
                this.callROIData(payload, loginData.data.token)
            } else {
                this.setState({
                    isLoading: false
                })
            }
        })
    }

    callROIData = (dataPayload, token) => {
        const { apiStatus } = this.props;
        let apiObj = new ROIAction(dataPayload, token);
        this.props.APITransport(apiObj)
        this.setState({
            isLoading: false
        })
        this.props.navigation.push('StudentsList')
    }

    setDate = date => {
        var dateData = new Date(date)
        this.setState({
            minimumDate: dateData
        })
        let monthData = dateData.getMonth() + 1
        let currentDate =
            dateData.getDate().toString().length < 2
                ? '0' + dateData.getDate()
                : dateData.getDate()
        let month =
            String(monthData).length < 2 ? '0' + monthData : monthData
        let year = dateData.getFullYear()

        this.setState({
            selectedDate: year + '-' + month + '-' + currentDate,
            pickerDate: date,
            dateVisible: false
        })
    }

    onDateChange = (event, date) => {
        if (event.type == 'set') {
            const currentDate = date || this.state.pickerDate;
            this.setDate(currentDate);
        }
        else {
            this.setState({ dateVisible: false })
        }
    }


    render() {
        const { navigation, isLoading, defaultSelected, classList, classListIndex, selectedClass, sectionList, sectionListIndex, selectedSection, pickerDate, selectedDate, subArr, selectedSubject, subIndex, errClass, errSub, errDate, errSection, sectionValid, dateVisible, examTestID } = this.state
        const { loginData, multiBrandingData, modalStatus, modalMessage } = this.props
        const BrandLabel = multiBrandingData&&multiBrandingData.screenLabels&&multiBrandingData.screenLabels.selectDetails[0]
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <ShareComponent
                    navigation={this.props.navigation}
                    message={this.state.logmessage ? JSON.stringify(this.state.logmessage, null, 2) : ''}

                />
                {BrandLabel?
                    <MultibrandLabels
                         Label1={BrandLabel.School}
                         Label2={BrandLabel.SchoolId}
                         School={loginData.data.school.name}
                         SchoolId={loginData.data.school.schoolId}
                    />

                    :

                    (loginData && loginData.data) &&
                    <View style={{ marginTop: 20, width: '60%' }}>
                        <Text
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
                        >
                            {Strings.school_name + ' : '}
                            <Text style={{ fontWeight: 'normal' }}>
                                {loginData.data.school.name}
                            </Text>
                        </Text>
                        <Text
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
                        >
                            {Strings.schoolId_text + ' : '}
                            <Text style={{ fontWeight: 'normal' }}>
                                {loginData.data.school.schoolId}
                            </Text>
                        </Text>
                        <Text
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR - 3, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', marginBottom: '4%' }}
                        >
                            {Strings.version_text + ' : '}
                            <Text style={{ fontWeight: 'normal' }}>
                                {apkVersion}
                            </Text>
                        </Text>
                    </View>}

                <ScrollView
                    contentContainerStyle={{ paddingTop: '5%', paddingBottom: '35%' }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View style={styles.container1}>
                        <Text style={styles.header1TextStyle}>
                            {Strings.please_select_below_details}
                        </Text>
                        <View style={{ backgroundColor: 'white', paddingHorizontal: '5%', minWidth: '100%', paddingVertical: '10%', borderRadius: 4 }}>
                            <View style={[styles.fieldContainerStyle, { paddingBottom: classListIndex != -1 ? 0 : '10%' }]}>
                                <View style={{ flexDirection: 'row' }}>
                                   
                                        <Text style={[styles.labelTextStyle]}>{BrandLabel&&BrandLabel.Class ? BrandLabel.Class : Strings.class_text }</Text> 
                                       
                                    {errClass != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '60%', textAlign: 'right', fontWeight: 'normal' }]}>{errClass}</Text>}
                                </View>
                                <DropDownMenu
                                    options={classList && classList}
                                    onSelect={(idx, value) => this.onDropDownSelect(idx, value, 'class')}
                                    defaultData={defaultSelected}
                                    defaultIndex={classListIndex}
                                    selectedData={selectedClass}
                                    icon={require('../../assets/images/arrow_down.png')}
                                />
                            </View>
                            {classListIndex != -1 &&
                                <View style={[styles.fieldContainerStyle, { paddingBottom: sectionListIndex != -1 && sectionValid ? 0 : '10%' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                       
                                            <Text style={[styles.labelTextStyle]}>{BrandLabel && BrandLabel.Section ? BrandLabel.Section:Strings.section}</Text> 
                                        
                                        {errSection != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '60%', textAlign: 'right', fontWeight: 'normal' }]}>{errSection}</Text>}
                                    </View>
                                    <DropDownMenu
                                        options={sectionList && sectionList}
                                        onSelect={(idx, value) => this.onDropDownSelect(idx, value, 'section')}
                                        defaultData={defaultSelected}
                                        defaultIndex={sectionListIndex}
                                        selectedData={selectedSection}
                                        icon={require('../../assets/images/arrow_down.png')}
                                    />
                                </View>}
                            {
                                sectionListIndex != -1 && sectionValid &&
                                <View style={[styles.fieldContainerStyle, { paddingBottom: subIndex != -1 ? '10%' : '10%' }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.labelTextStyle]}>{BrandLabel && BrandLabel.Subject ? BrandLabel.Subject:Strings.subject}</Text> 
                                        {errSub != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '50%', textAlign: 'right', fontWeight: 'normal' }]}>{errSub}</Text>}
                                    </View>
                                    <DropDownMenu
                                        options={subArr && subArr}
                                        onSelect={(idx, value) => this.onDropDownSelect(idx, value, 'sub')}
                                        defaultData={defaultSelected}
                                        defaultIndex={subIndex}
                                        selectedData={selectedSubject}
                                        icon={require('../../assets/images/arrow_down.png')}
                                    />
                                </View>
                            }

                        </View>

                    </View>

                </ScrollView>
                <View style={styles.btnContainer}>
                    <ButtonComponent
                        customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: this.props.multiBrandingData ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                        btnText={Strings.submit_text}
                        onPress={this.onSubmitClick}
                    />
                </View>
                {dateVisible && (
                    <DateTimePicker
                        display="default"
                        maximumDate={new Date()}
                        value={pickerDate}
                        mode={'date'}
                        onChange={(e, selectedDate) => this.onDateChange(e, selectedDate)}
                    />
                )}
                {isLoading && <Spinner animating={isLoading} />}
                <ModalView modalVisible={modalStatus} modalMessage={modalMessage} />
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
    btnContainer: {
        paddingVertical: '15%',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    header1TextStyle: {
        lineHeight: 40,
        borderRadius: 4,
        borderColor: AppTheme.LIGHT_GREY,
        width: '100%',
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL + 2,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        marginBottom: '5%'
    },
    fieldContainerStyle: {
        paddingVertical: '2.5%'
    },
    labelTextStyle: {
        width: '40%',
        fontSize: AppTheme.FONT_SIZE_MEDIUM,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        letterSpacing: 1,
        lineHeight: 35
    },
    nxtBtnStyle: {
    },
    imageViewContainer: {

        alignItems: 'flex-end',
        backgroundColor: '#fff'
        // justifyContent:'center'
    },
    imageContainerStyle: {
        padding: 5,
        marginRight: 10,
        height: 50,
        width: 50,
        borderRadius: 45,
        borderWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        justifyContent: 'center',
        backgroundColor: AppTheme.TAB_BORDER
    },
}

const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse,
        loginData: state.loginData,
        studentsAndExamData: state.studentsAndExamData,
        scanTypeData: state.scanTypeData.response,
        apiStatus: state.apiStatus,
        roiData: state.roiData,
        absentStudentDataResponse: state.absentStudentDataResponse,
        getScanStatusData: state.getScanStatusData,
        multiBrandingData: state.multiBrandingData.response.data,
        bgFlag: state.bgFlag,
        modalStatus: state.modalStatus,
        modalMessage: state.modalMessage
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        OcrLocalResponseAction: OcrLocalResponseAction,
        FilteredDataAction: FilteredDataAction,
        LogoutAction: LogoutAction
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(SelectDetailsComponent));