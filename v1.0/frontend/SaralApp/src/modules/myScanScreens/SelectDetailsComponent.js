import React, { Component } from 'react';
import { View, ScrollView, Text, BackHandler, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash'
import DateTimePicker from '@react-native-community/datetimepicker'
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import Spinner from '../common/components/loadingIndicator';
import { apkVersion } from '../../configs/config';
import HeaderComponent from '../common/components/HeaderComponent';
import DropDownMenu from '../common/components/DropDownComponent';
import TextField from '../common/components/TextField';
import ButtonComponent from '../common/components/ButtonComponent';
import { getLoginData, setStudentsExamData, getStudentsExamData, getLoginCred, setLoginData } from '../../utils/StorageUtils'
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction'
import { GetStudentsAndExamData } from '../../flux/actions/apis/getStudentsAndExamData';
import { FilteredDataAction } from '../../flux/actions/apis/filteredDataActions';
import APITransport from '../../flux/actions/transport/apitransport';
import { SCAN_TYPES } from '../../utils/CommonUtils';
import { StackActions, NavigationActions } from 'react-navigation';


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
    dateVisible: false
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
            scanType: SCAN_TYPES.PAT_TYPE
        }
        this.onBack = this.onBack.bind(this)
    }

    componentDidMount() {
        const { navigation, scanTypeData } = this.props

        navigation.addListener('willFocus', async payload => {
            BackHandler.addEventListener('hardwareBackPress', this.onBack)

            this.setState(clearState)
            
            if(scanTypeData && scanTypeData.scanType) {
                this.setState({ 
                    scanType: scanTypeData.scanType
                 })
            }

            let loginDetails = await getLoginData() 
            if(loginDetails) {                
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
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'dashboard' })],
        });
        this.props.navigation.dispatch(resetAction);
        return true
    }

    onLogoutClick = async () => {
        Alert.alert(Strings.message_text, Strings.are_you_sure_you_want_to_logout, [
            { 'text': Strings.no_text, style: 'cancel' },
            {
                'text': Strings.yes_text, onPress: async () => {
                    await AsyncStorage.clear();
                    this.props.navigation.navigate('auth')
                }
            }
        ])
    }

    loader = (flag) => {
        this.setState({
            isLoading: flag
        })
    }

    onDropDownSelect = (index, value, type) => {
        const { loginDetails, classesArr, selectedClass, selectedClassId, selectedSection, selectedSubject } = this.state
        if(type == 'class') {
            if(value != selectedClass) {
                const sections = [...classesArr[index].sections]
                // let sectionListArr = ['All']
                let sectionListArr = []
                _.forEach(sections, (sectionData) => sectionListArr.push(sectionData.section))
                // sectionListArr.push('NA')
                this.setState({
                    sectionList: sectionListArr,
                    sectionListIndex: 0,
                    selectedSection: sectionListArr[0],
                    subIndex: -1,
                    selectedSubject: '',
                    selectedDate: '',
                    pickerDate: new Date()
                }, () => {
                    if(loginDetails) {
                        let payload = {
                            classId: classesArr[index].classId,
                            section: sectionListArr[0],
                        }
                        // if(sectionListArr[0] == 'All') {
                        //     payload.section = "0"
                        // }
                        this.loader(true)
                        this.setState({
                            dataPayload: payload
                        }, () => {
                            // let isTokenValid = validateToken(loginDetails.expiresOn)                                 
                            // if(isTokenValid) {
                                this.callStudentsData(loginDetails.token)
                            // }
                            // else if(!isTokenValid) {
                            //     this.setState({
                            //         callApi: 'callStudentsData'
                            //     }, () => this.loginAgain())
                            // }
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

        else if(type == 'section') {
            if(value != selectedSection) {
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
                if(loginDetails) {
                    let payload = {
                        classId: selectedClassId,
                        section: value
                    }
                    if(value == 'All') {
                        payload.section = 0
                    }
                    this.loader(true)
                    this.setState({
                        dataPayload: payload
                    }, () => {
                        // let isTokenValid = validateToken(loginDetails.expiresOn)     
                        // if(isTokenValid) {
                            this.callStudentsData(loginDetails.token)
                        // }
                        // else if(!isTokenValid) {
                        //     this.setState({
                        //         callApi: 'callStudentsData'
                        //     }, () =>  this.loginAgain())
                        // }
                    })
                }
            })
        }
        else if(type == 'sub') {
            if(value != selectedSubject) {
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

    async componentDidUpdate(prevProps) {
        if(prevProps != this.props) {
            const { apiStatus, studentsAndExamData } = this.props
            const { calledStudentsData, selectedClass, selectedSection, selectedClassId } = this.state
            if (apiStatus && prevProps.apiStatus != apiStatus && apiStatus.error) {
                if(calledStudentsData) {                    
                    this.loader(false)
                    this.setState({ 
                        calledStudentsData: false, 
                        sectionValid: false, 
                        subIndex: -1,
                        selectedSubject: '',
                        selectedDate: '',
                        pickerDate: new Date()
                    }, () => {
                        if(apiStatus && apiStatus.message) {
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

            if(calledStudentsData) {
                if(studentsAndExamData && prevProps.studentsAndExamData != studentsAndExamData) {
                    this.loader(false)
                    this.setState({
                        calledStudentsData: false, callApi: ''
                    }, async () => {
                        if(studentsAndExamData.status && studentsAndExamData.status == 200) {
                            if(studentsAndExamData.data.students && studentsAndExamData.data.students.length > 0) {
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
                                    if(data && data.class == obj.class && studentsAndExamData.data) {
                                        data.data = studentsAndExamData.data
                                    }
                                    if (data.class == obj.class && data.section == obj.section) {
                                        finalStudentsAndExamArr.splice(index, 1)
                                    }
                                })
                                finalStudentsAndExamArr.push(obj)                                
                                let studentsExamDataSaved = await setStudentsExamData(finalStudentsAndExamArr)
                                if(studentsExamDataSaved) {
                                    let subArr = []
                                    _.filter(studentsAndExamData.data.exams, function(o) {
                                        subArr.push(o.examName)
                                    })
                                    this.setState({
                                        errSection: '',
                                        sectionValid: true,
                                        subArr: subArr,
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
        }
    }

    validateFields = () => {
        const { classListIndex, subIndex, sectionListIndex, sectionValid, selectedDate } = this.state
        const { scanTypeData } = this.props
        if(classListIndex == -1) {
            this.setState({
                errClass: Strings.please_select_class,
                errSection: '',
                errSub: '',
                errDate: ''
            })
            return false
        }
        else if(sectionListIndex == -1) {
            this.setState({
                errClass: '',
                errSection: Strings.please_select_section,
                errSub: '',
                errDate: ''
            })
            return false
        }
        else if(!sectionValid) {
            this.setState({
                errClass: '',
                errSection: Strings.please_select_valid_section,
                errSub: '',
                errDate: ''
            })
            return false
        }
        else if(scanTypeData.scanType == SCAN_TYPES.PAT_TYPE) {
            if(subIndex == -1) {
                this.setState({
                    errClass: '',
                    errSection: '',
                    errSub: Strings.please_select_sub,
                    errDate: ''
                })
                return false
            }
            else if(selectedDate.length == 0) {
                this.setState({
                    errClass: '',
                    errSection: '',
                    errSub: '',
                    errDate: Strings.please_select_date
                })
                return false
            }
            return true
        }
        return true
    }

    onSubmitClick = () => {
        const { selectedClass, selectedClassId, selectedDate, selectedSection, selectedSubject } = this.state
        this.setState({
            errClass: '',
            errSub: '',
            errSection: '',
            errSub: ''
        }, () => {
            let valid = this.validateFields()
            if(valid) {
                let obj = {
                    className: selectedClass,
                    class: selectedClassId,
                    examDate: selectedDate,
                    section: selectedSection,
                    subject: selectedSubject,
                }
                this.props.FilteredDataAction(obj)
                this.props.navigation.navigate('myScan')
            }
        })
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
        if(event.type == 'set') {
            const currentDate = date || this.state.pickerDate;
            this.setDate(currentDate);
        }
        else {
            this.setState({ dateVisible: false })
        }
    }

    render() {
        const { isLoading, defaultSelected, classList, classListIndex, selectedClass, sectionList, sectionListIndex, selectedSection, pickerDate, selectedDate, subArr, selectedSubject, subIndex, errClass, errSub, errDate, errSection, sectionValid, dateVisible } = this.state
        const { loginData, scanTypeData } = this.props
        return (

            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <HeaderComponent
                    title={Strings.up_saralData}
                    logoutHeaderText={Strings.logout_text}
                    customLogoutTextStyle={{ color: AppTheme.GREY }}
                    onLogoutClick={this.onLogoutClick}
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
                    <View style={styles.container1}>
                        <Text style={styles.header1TextStyle}>
                            {Strings.please_select_below_details}
                        </Text>
                        <View style={{ backgroundColor: 'white', paddingHorizontal: '5%', minWidth: '100%', paddingVertical: '10%', borderRadius: 4 }}>
                            <View style={[styles.fieldContainerStyle, { paddingBottom: classListIndex != -1 ? 0 : '10%'}]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.labelTextStyle]}>{Strings.class_text}</Text>
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
                            <View style={[styles.fieldContainerStyle, { paddingBottom: sectionListIndex != -1 && sectionValid ? 0 : '10%'}]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.labelTextStyle]}>{Strings.section}</Text>
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
                            {scanTypeData.scanType == SCAN_TYPES.PAT_TYPE && sectionListIndex != -1 && sectionValid &&
                            <View style={[styles.fieldContainerStyle, { paddingBottom: subIndex != -1 ? 0 : '10%'}]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[[styles.labelTextStyle, { width: '50%' }]]}>{Strings.exam_sub}</Text>
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
                            </View>}
                            {((scanTypeData.scanType == SCAN_TYPES.PAT_TYPE && subIndex != -1) || (sectionListIndex != -1 && scanTypeData.scanType == SCAN_TYPES.SAT_TYPE && sectionValid)) &&
                            <TouchableOpacity
                                onPress={() => this.setState({ dateVisible: true })}
                                style={styles.fieldContainerStyle}
                            >
                                <TextField
                                    customContainerStyle={{ marginHorizontal: 0, paddingBottom: '10%', paddingVertical: '0%',}}
                                    labelText={Strings.exam_date}
                                    errorField={errDate != ''}
                                    errorText={errDate}
                                    value={selectedDate}
                                    editable={false}
                                    placeholder={Strings.please_select_date}
                                />
                            </TouchableOpacity>}
                            <ButtonComponent
                                customBtnStyle={styles.nxtBtnStyle}
                                btnText={Strings.submit_text}
                                onPress={this.onSubmitClick}
                            />
                        </View>
                    </View>
                </ScrollView>
                {dateVisible && (
                    <DateTimePicker
                        display="default"
                        maximumDate={new Date()}
                        value={pickerDate}
                        mode={'date'}
                        onChange={(e, selectedDate) =>this.onDateChange(e, selectedDate)}
                    />
                )}
                {isLoading && <Spinner animating={isLoading} />}
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
    header1TextStyle: {
        // backgroundColor: AppTheme.WHITE_OPACITY,
        lineHeight: 40,
        borderRadius: 4,
        // borderWidth: 1,
        borderColor: AppTheme.LIGHT_GREY,
        width: '100%',
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL+2,
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
        marginHorizontal: '10%',
    }
}

const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse,
        loginData: state.loginData,
        studentsAndExamData: state.studentsAndExamData,
        scanTypeData: state.scanTypeData.response
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        OcrLocalResponseAction: OcrLocalResponseAction,
        FilteredDataAction: FilteredDataAction
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(SelectDetailsComponent));