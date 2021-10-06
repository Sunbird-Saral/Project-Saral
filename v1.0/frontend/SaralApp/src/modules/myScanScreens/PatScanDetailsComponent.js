import React, { Component } from 'react';
import { View, ScrollView, Text, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StackActions, NavigationActions } from 'react-navigation';
import SystemSetting from 'react-native-system-setting'
import _ from 'lodash'
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import { apkVersion } from '../../configs/config'
import HeaderComponent from '../common/components/HeaderComponent';
import Spinner from '../common/components/loadingIndicator';
import ButtonComponent from '../common/components/ButtonComponent';
import ButtonWithIcon from '../common/components/ButtonWithIcon';
import NumeracyScanCard from './NumeracyScanCard';
import StudentsSummaryCard from './StudentsSummaryCard';
import APITransport from '../../flux/actions/transport/apitransport';
import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction';
import { SCAN_TYPES } from '../../utils/CommonUtils';
import callScanStatusDataConst from '../callScanStatusDataConst';

class PatScanDetailsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldBrightness: null,
            isLoading: false,
            studentClass: '1',
            section: '1',
            selectedSubject: '',
            examDate: '',
            studentsScanData: [],
            summary: false,
            calledSavedData: false,
            saveObj: {},
        }
        this.onBack = this.onBack.bind(this)
    }

    componentDidMount() {
        const { navigation, ocrLocalResponse } = this.props
        navigation.addListener('willFocus', payload => {
            BackHandler.addEventListener('hardwareBackPress', this.onBack)
            const { params } = navigation.state
            if (params && params.oldBrightness) {
                SystemSetting.setBrightnessForce(params.oldBrightness).then((success) => {
                    if (success) {
                        SystemSetting.saveBrightness();
                    }
                })
            }

            if (ocrLocalResponse && ocrLocalResponse.response) {

                const data = ocrLocalResponse.response;
                if(data.scannerType == SCAN_TYPES.PAT_TYPE) {
                    this.processData(data)
                }
            }
        })
        this.willBlur = navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBack)
        );
    }

    onBack = async () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'myScan', params: { from_screen: 'scanDetails' } })],
        });
        this.props.navigation.dispatch(resetAction);
        return true
    }

    processData = (data) => {
        const { filteredData } = this.props
        let filteredDataResponse = filteredData.response
        let selectedSubject = filteredDataResponse.subject
        let selectedSection = filteredDataResponse.section
        let selectedClass = filteredDataResponse.class
        let examDate = filteredDataResponse.examDate
        let students = data.students
        let studentsArr = []
        students.forEach((studentsData, index) => {
            let obj = {
                rollNumber: studentsData.roll,
                stdErr: ''
            }
            let marksArr = []
            let marks = []
            let sortedMarks = _.sortBy(studentsData.marks, ['question'])
            let totalMarks = 0
            sortedMarks.forEach((marksData, marksIndex) => {
                let marksObj = {}
                let marksDataObj = {}
                totalMarks +=  marksData.mark.length > 0 ? parseInt(marksData.mark) : marksData.mark
                marksDataObj.mark = marksData.mark.length > 0 ? parseInt(marksData.mark) : marksData.mark
                marksDataObj.learning = `LO-${marksIndex + 1}`
                marks.push(marksDataObj)
                
                if (data.scannerCode == 1) {
                    if (marksIndex == 2) {
                        marksObj.levelText = 'स्तर - 1'
                        marksObj.marks = marks.slice(0, 3)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 6) {
                        marksObj.levelText = 'स्तर - 2'
                        marksObj.marks = marks.slice(3, 7)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 12) {
                        marksObj.levelText = 'स्तर - 3'
                        marksObj.marks = marks.slice(7, marks.length)
                        marksArr.push(marksObj)
                    }
                } else if (data.scannerCode == 2) {
                    if (marksIndex == 4) {
                        marksObj.marks = marks.slice(0, 5)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 9) {
                        marksObj.marks = marks.slice(5, 10)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 14) {
                        marksObj.marks = marks.slice(10, 15)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 19) {
                        marksObj.marks = marks.slice(15, marks.length)
                        marksArr.push(marksObj)
                    }
                }
                else if (data.scannerCode == 3) {
                    if (marksIndex == 5) {
                        marksObj.marks = marks.slice(0, 6)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 11) {
                        marksObj.marks = marks.slice(6, 12)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 17) {
                        marksObj.marks = marks.slice(12, 18)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 23) {
                        marksObj.marks = marks.slice(18, 24)
                        marksArr.push(marksObj)
                    }
                    if (marksIndex == 29) {
                        marksObj.marks = marks.slice(24, marks.length)
                        marksArr.push(marksObj)
                    }
                }

            });
            obj.marksData = marksArr
            if(!studentsData.roll.includes('1111111') && totalMarks != 0 && !studentsData.roll.includes('111111') && !studentsData.roll.includes('11111')) {
                studentsArr.push(obj)
            }
        });
        
        if(studentsArr.length == 0) {
            setTimeout(() => {
                Alert.alert(Strings.message_text, Strings.table_image_is_not_proper, [{
                    text: Strings.ok_text, onPress: () => this.onBack()
                }])                
            }, 200);
            return
        }
        this.setState({
            studentsScanData: studentsArr,
            studentClass: selectedClass,
            section: selectedSection,
            selectedSubject,
            examDate
        })
    }

    handlePatRollChange = (value, index, array) => {
        let newArray = JSON.parse(JSON.stringify(array))
        newArray[index].rollNumber = value
        this.setState({ studentsScanData: newArray })
    }

    handlePatMarksChange = (value, marksIndex, labelIndex, studentIndex, array) => {
        let newArray = JSON.parse(JSON.stringify(array))
        newArray[studentIndex].marksData[labelIndex].marks[marksIndex].mark = value.length > 0 ? (value == 0 || value == 1) ? parseInt(value) : 0 : value
        this.setState({ studentsScanData: newArray })
    }

    onSummaryCancel = () => {
        this.setState({ summary: false })
    }

    validateData = (data) => {
        let valid = true
        for(let i = 0; i < data.length; i++) {
            if(data[i].rollNumber.length != 7) {
                data[i].stdErr = Strings.student_roll_length_error
                this.setState({
                    studentsScanData: data
                })
                valid = false
                return    
            } else{
                data[i].stdErr = ''
                this.setState({
                    studentsScanData: data
                })
            }
            for(let j = 0; j< data[i].marksData.length; j++) {
                for(let k=0; k<data[i].marksData[j].marks.length; k++) {
                    if(data[i].marksData[j].marks[k].mark === '' || data[i].marksData[j].marks[k].mark.toString().length === 0) {
                        valid = false
                        return
                    }
                }
            }
        }
        return valid
    }

    onPatSummaryClick = () => {
        const { studentsScanData, studentClass, section } = this.state
        const { filteredData } = this.props
        let valid = this.validateData(studentsScanData)        
        if (valid) {
            let filteredDataResponse = filteredData.response
            let selectedSubject = filteredDataResponse.subject
            let examDate = filteredDataResponse.examDate
            let saveObj = {
                "classId": studentClass,
                "subject": selectedSubject,
                "examDate": examDate
            }
            let saveStudentsMarkInfo = []
            _.forEach(studentsScanData, (studentsData) => {
                let saveStudentObj = {
                    "section": section.toUpperCase() == 'ALL' ? 'A' : section.toUpperCase(),
                    "studentId": studentsData.rollNumber
                }
                let saveMarksInfo = []
                let totalMarks = 0
                let securedMarks = 0
                _.forEach(studentsData.marksData, (marksData) => {
                    _.forEach(marksData.marks, (marksObj, marksIndex) => {                        
                        let mark = marksObj.mark && marksObj.mark.toString().length > 0 ? parseInt(marksObj.mark) : 0
                        
                        totalMarks++
                        securedMarks += mark
                        let saveMarksObj = {
                            "questionId": marksObj.learning,
                            "obtainedMarks": marksObj.mark
                        }
                        saveMarksInfo.push(saveMarksObj)
                    })
                })

                saveStudentObj.marksInfo = saveMarksInfo
                saveStudentObj.totalMarks = totalMarks
                saveStudentObj.securedMarks = securedMarks
                saveStudentsMarkInfo.push(saveStudentObj)
            })
            saveObj.studentsMarkInfo = saveStudentsMarkInfo
        
            this.setState({
                saveObj,
                summary: true
            })
        }
        else {
            Alert.alert(Strings.message_text, Strings.please_correct_marks_data)
        }
    }

    onSubmitClick = () => {
        const { loginData } = this.props
        const { saveObj } = this.state
        this.setState({
            calledSavedData: true,
            isLoading: true
        }, () => {
            let apiObj = new SaveScanData(saveObj, loginData.data.token);
            this.props.APITransport(apiObj)
        })
    }

    goToDashBoard = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'myScan', params: { from_screen: 'cameraActivity' } })],
        });
        this.props.navigation.dispatch(resetAction);
        return true
    }

    componentDidUpdate(prevProps) {
        if(prevProps != this.props) {
            const { calledSavedData } = this.state
            const { savedScanData,filteredData } = this.props
            if(calledSavedData) {
                if (savedScanData && prevProps.savedScanData !== savedScanData) {
                    this.setState({ isLoading: false, calledSavedData: false })
                    if (savedScanData.status && savedScanData.status == 200) {
                        Alert.alert(Strings.message_text, Strings.saved_successfully, [{
                            text: Strings.ok_text, onPress: () => {
                                this.props.callScanStatusDataConst(filteredData)
                                this.goToDashBoard()}
                        }])
    
                    } else {
                        Alert.alert(Strings.message_text, Strings.please_try_again, [{
                            text: Strings.ok_text
                        }])
                    }
                }
            }
        }
    }

    renderPatSummary = () => {
        const { saveObj } = this.state
        return (
            <View style={{ marginTop: '5%', marginBottom: '5%', width: '100%' }}>
                {saveObj.studentsMarkInfo.map((data, index) => {
                    return (
                        <StudentsSummaryCard
                            key={index}
                            studentRollNumber={data.studentId}
                            totalMarks={data.totalMarks}
                            securedMarks={data.securedMarks}
                        />
                    )
                })}
            </View>
        );
    }

    renderPatStudnetsData = () => {
        const { studentsScanData } = this.state

        return (
            <View style={{ marginTop: '5%', marginBottom: '5%', width: '100%' }}>
                {studentsScanData.map((data, index) => {
                    return (
                        <NumeracyScanCard
                            key={index}
                            studentIndex={index}
                            rollNumber={data.rollNumber}
                            stdErr={data.stdErr}
                            onChangeText={(text) => this.handlePatRollChange(text, index, studentsScanData)}
                            editable={true}
                            marksData={data.marksData}
                            // customRowStyle={}
                            onMarksChangeText={(text, marksIndex, labelIndex) => this.handlePatMarksChange(text, marksIndex, labelIndex, index, studentsScanData)}
                        // rowBorderColor={}
                        />
                    )
                })}
            </View>
        );
    }

    render() {
        const { isLoading, studentsScanData, studentClass, section, selectedSubject, summary, saveObj, examDate } = this.state;
        let headerTitle = Strings.up_saralData

        return (

            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <HeaderComponent
                    title={headerTitle}
                    versionText={apkVersion}
                />
                {studentClass.length > 0 && section.length > 0 &&
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={styles.tabLabelStyle}>{`${Strings.class_text}: ${studentClass}`}</Text>
                            <Text style={styles.tabLabelStyle}>{`${Strings.section}: ${section}`}</Text>
                        </View>
                        <Text style={styles.tabLabelStyle}>{`${Strings.exam_sub_date}: ${selectedSubject} - ${examDate}`}</Text>
                    </View>
                }
                {!summary ? <View>
                    <ScrollView
                        contentContainerStyle={{ paddingTop: '5%', paddingBottom: '35%' }}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        {studentsScanData && studentsScanData.length > 0 &&
                            <View style={styles.container1}>
                                {this.renderPatStudnetsData()}
                                <View style={[styles.container3, { paddingTop: '7%', paddingBottom: '7%', width: '100%' }]}>
                                    <ButtonComponent
                                        customBtnStyle={[styles.cancelBtnStyle, { width: '35%', }]}
                                        customBtnTextStyle={styles.editBtnTextStyle}
                                        btnText={Strings.cancel_text}
                                        onPress={this.onBack}
                                    />
                                    <ButtonComponent
                                        customBtnStyle={styles.nxtBtnStyle}
                                        customBtnTextStyle={styles.nxtBtnTextStyle}
                                        btnText={Strings.summary_text}
                                        onPress={this.onPatSummaryClick}
                                    />
                                </View>
                            </View>
                        }
                    </ScrollView>
                </View> :
                    <View style={{ backgroundColor: AppTheme.WHITE_OPACITY }}>
                        <Text style={styles.studentDetailsTxtStyle}>{Strings.summary_scanned_data}</Text>
                        <ScrollView
                            contentContainerStyle={{ backgroundColor: AppTheme.WHITE_OPACITY, paddingBottom: '45%', flexGrow: 1}}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            keyboardShouldPersistTaps={'handled'}
                        >

                            {saveObj && saveObj.studentsMarkInfo && saveObj.studentsMarkInfo.length > 0 && this.renderPatSummary()}
                            <View style={[styles.container3, { paddingTop: '7%', paddingBottom: '7%' }]}>
                                <ButtonWithIcon
                                    customBtnStyle={styles.editBtnStyle}
                                    customBtnTextStyle={styles.editBtnTextStyle}
                                    bgColor={AppTheme.TAB_BORDER}
                                    btnIcon={require('../../assets/images/editIcon.png')}
                                    btnText={Strings.edit_text}
                                    onPress={this.onSummaryCancel}

                                />
                                <ButtonComponent
                                    customBtnStyle={styles.submitBtnStyle}
                                    btnText={Strings.submit_text}
                                    onPress={this.onSubmitClick}
                                />
                            </View>
                        </ScrollView>
                        
                    </View>

                }
                {isLoading && <Spinner animating={isLoading} />}
            </View>
        );
    }
}

const styles = {
    container1: {
        flex: 1,
        alignItems: 'center'
    },
    tabLabelStyle: {
        lineHeight: 30,
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    container3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '4%',
        backgroundColor: AppTheme.WHITE_OPACITY
    },
    cancelBtnStyle: {
        backgroundColor: 'transparent',
        width: '40%',
        borderWidth: 1,
        borderColor: AppTheme.BTN_BORDER_GREY
    },
    cancelBtnTextStyle: {
        color: AppTheme.BLACK
    },
    nxtBtnStyle: {
        backgroundColor: 'transparent',
        width: '55%',
        borderWidth: 1,
        borderColor: AppTheme.BLUE
    },
    nxtBtnTextStyle: {
        color: AppTheme.BLUE
    },
    submitBtnStyle: {
        width: '60%',
    },
    studentDetailsTxtStyle: {
        color: AppTheme.GREY_TITLE,
        fontSize: AppTheme.FONT_SIZE_MEDIUM,
        paddingHorizontal: '5%',
        fontWeight: 'bold',
        letterSpacing: 1,
        lineHeight: 30
    },
    editBtnStyle: {
        width: '35%',
        justifyContent: 'space-evenly'
    },
    editBtnTextStyle: {
        color: AppTheme.BLACK
    }
}

const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        ocrLocalResponse: state.ocrLocalResponse,
        filteredData: state.filteredData,
        savedScanData: state.savedScanData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        callScanStatusDataConst: callScanStatusDataConst
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(PatScanDetailsComponent));