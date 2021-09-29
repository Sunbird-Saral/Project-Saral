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
import StudentsSummaryCard from './StudentsSummaryCard';
import APITransport from '../../flux/actions/transport/apitransport';
import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction';
import { SCAN_TYPES } from '../../utils/CommonUtils';
import DataCard from './DataCard';
import TextField from '../common/components/TextField';

class SatScanDetailsComponent extends Component {
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
            satRollNo: '',
            rollErr: ''
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
                if(data.scannerType == SCAN_TYPES.SAT_TYPE) {
                    this.processSatData(data)
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

    processSatData = (data) => {
        const { filteredData } = this.props
        let filteredDataResponse = filteredData.response
        let selectedSection = filteredDataResponse.section
        let selectedClass = filteredDataResponse.class
        let examDate = filteredDataResponse.examDate
        let studentRoll = data.studentRoll
        let marksData = data.marksData

        this.setState({
            satRollNo: studentRoll,
            studentClass: selectedClass,
            section: selectedSection,
            studentsScanData: marksData
        })        
    }

    onSatRollChange = (text) => {
        this.setState({
            satRollNo: text
        })
    }

    handleSatMarksChange = (value, questionType, markIndex, subjectIndex, array) => {
        let newArray = JSON.parse(JSON.stringify(array))
        let dataType = questionType == 'objective' ? ['objectiveMarks'] : ['subjectiveMarks']
        newArray[subjectIndex][dataType][markIndex].mark = questionType == 'objective' ? (value == 0 || value == 1) ? value : 0 : value        
        this.setState({ studentsScanData: newArray })
    }

    validateData = (data) => {
        const { satRollNo } =  this.state
        let valid = true
        if(satRollNo.length != 3) {
            this.setState({ rollErr: Strings.student_roll_length_error })
            valid = false
            return
        }
        else{
            this.setState({
                rollErr: ''
            })
        }

        //     for(let j = 0; j< data[i].marksData.length; j++) {
        //         for(let k=0; k<data[i].marksData[j].marks.length; k++) {
        //             if(data[i].marksData[j].marks[k].mark === '' || data[i].marksData[j].marks[k].mark.toString().length === 0) {
        //                 valid = false
        //                 return
        //             }
        //         }
        //     }
        // }
        return valid
    }

    onSatSummaryClick = () => {
        const { studentsScanData, studentClass, section } = this.state
        const { filteredData } = this.props
        let valid = this.validateData(studentsScanData)        
        if (valid) {
            // let filteredDataResponse = filteredData.response
            // // let selectedSubject = filteredDataResponse.subject
            // let examDate = filteredDataResponse.examDate
            // let saveObj = {
            //     "classId": studentClass,
            //     // "subject": selectedSubject,
            //     "examDate": examDate
            // }
            // let saveStudentsMarkInfo = []
            // _.forEach(studentsScanData, (studentsData) => {
            //     let saveStudentObj = {
            //         "section": section.toUpperCase() == 'ALL' ? 'A' : section.toUpperCase(),
            //         "studentId": studentsData.rollNumber
            //     }
            //     let saveMarksInfo = []
            //     let totalMarks = 0
            //     let securedMarks = 0
            //     _.forEach(studentsData.marksData, (marksData) => {
            //         _.forEach(marksData.marks, (marksObj, marksIndex) => {                        
            //             let mark = marksObj.mark && marksObj.mark.toString().length > 0 ? parseInt(marksObj.mark) : 0
                        
            //             totalMarks++
            //             securedMarks += mark
            //             let saveMarksObj = {
            //                 "questionId": marksObj.learning,
            //                 "obtainedMarks": marksObj.mark
            //             }
            //             saveMarksInfo.push(saveMarksObj)
            //         })
            //     })

            //     saveStudentObj.marksInfo = saveMarksInfo
            //     saveStudentObj.totalMarks = totalMarks
            //     saveStudentObj.securedMarks = securedMarks
            //     saveStudentsMarkInfo.push(saveStudentObj)
            // })
            // saveObj.studentsMarkInfo = saveStudentsMarkInfo
        
            // this.setState({
            //     saveObj,
            //     summary: true
            // })

            Alert.alert(Strings.message_text, Strings.saved_successfully, [{
                text: Strings.ok_text, onPress: () => { this.goToDashBoard() }
            }])
        }
        else {
            Alert.alert(Strings.message_text, Strings.please_correct_marks_data)
        }
    }

    onSummaryCancel = () => {
        this.setState({ summary: false })
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
            const { savedScanData } = this.props
            if(calledSavedData) {
                if (savedScanData && prevProps.savedScanData !== savedScanData) {                    
                    this.setState({ isLoading: false, calledSavedData: false })
                    if (savedScanData.status && savedScanData.status == 200) {
                            
                        Alert.alert(Strings.message_text, Strings.saved_successfully, [{
                            text: Strings.ok_text, onPress: () => { this.goToDashBoard() }
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

    renderSatSummary = () => {
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

    
    renderSatData = () => {
        const { studentsScanData, satRollNo, rollErr } = this.state

        return (
            <View style={{ marginTop: '5%', marginBottom: '5%', width: '100%' }}>
                <View style={{ width: '90%', backgroundColor: AppTheme.WHITE, marginHorizontal: '5%', elevation: 4, borderRadius: 4, }}>
                    <TextField
                        labelText={Strings.student_roll}
                        errorField={rollErr != '' || isNaN(satRollNo)}
                        errorText={rollErr != '' ? rollErr : Strings.please_correct_student_roll}
                        // errorField={isNaN(satRollNo)}
                        // errorText={Strings.please_correct_student_roll}
                        onChangeText={this.onSatRollChange}
                        value={satRollNo}
                        editable={true}
                        keyboardType={'numeric'}
                        maxLength={3}
                    />
                </View>
                {studentsScanData.map((data, index) => {
                    return (
                        <DataCard
                            key={index}
                            subject={data.subject}
                            objectiveMarks={data.objectiveMarks}
                            subjectiveMarks={data.subjectiveMarks}
                            onMarksChangeText={(text, questionType, marksIndex,  ) => this.handleSatMarksChange(text, questionType, marksIndex, index, studentsScanData)}
                        />
                    )
                })}
            </View>
        )
    }

    render() {
        const { isLoading, studentsScanData, studentClass, section, summary, saveObj, examDate } = this.state;
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
                                {this.renderSatData()}
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
                                        onPress={this.onSatSummaryClick}
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

                            {saveObj && saveObj.studentsMarkInfo && saveObj.studentsMarkInfo.length > 0 && this.renderSatSummary()}
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
        APITransport: APITransport
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(SatScanDetailsComponent));