import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ToastAndroid } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import AppTheme from '../../utils/AppTheme';
import { neglectData, SCAN_TYPES, TABLE_HEADER } from '../../utils/CommonUtils';
import Strings from '../../utils/Strings';


//styles
import { styles } from './ScannedDetailsStyle'
import TabHeader from './TabHeader';

//rois
import MarksHeaderTable from './MarksHeaderTable';

//components
import ButtonWithIcon from '../common/components/ButtonWithIcon';
import ButtonComponent from '../common/components/ButtonComponent';
import DropDownMenu from '../common/components/DropDownComponent';
import TextField from '../common/components/TextField';
import { getScanData, getStudentsExamData, setScanData } from '../../utils/StorageUtils';
import { NavigationActions, StackActions } from 'react-navigation';
import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction';
import Spinner from '../common/components/loadingIndicator';

import APITransport from '../../flux/actions/transport/apitransport';

import { bindActionCreators } from 'redux';
import axios from 'axios';


const ScannedDetailsComponent = ({
    loginData,
    navigation,
    filteredData,
    scanTypeData,
    ocrLocalResponse
}) => {


    //Hookes
    const [tabIndex, setTabIndex] = useState(1)
    const [nextBtnClick, setNextBtnClick] = useState(false)
    const [summary, setSummary] = useState(false)
    const [examTakenAtArr, setExamTakenArr] = useState(['SCHOOL', 'HOME'])
    const [testIdIndex, setTestIdIndex] = useState(-1)
    const [errTestId, setErrTestID] = useState('')
    const [testId, setTestID] = useState(123456)
    const [testDate, setTestDate] = useState(filteredData.examDate)
    const [nextValue, setNextValue] = useState(5)
    const [preValue, setPreValue] = useState(0)
    const [newArrayValue, setNewArrayValue] = useState([])
    const [isNextExist, setNextExist] = useState(false)
    const [btnName, setBtnName] = useState('Cancel')
    const [maxMarks, setMaxMarks] = useState(0)
    const [obtainedMarks, setObtainedMarks] = useState(0)
    const [saveDataObj, setSaveDataObj] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [number, onChangeNumber] = useState(0);
    const [securedMarks, onSecuredMarks] = useState(0);
    const [examTakenAtIndex, setExamTakenAtIndex] = useState(-1);
    const [examTakenAt, setExamTakenAt] = useState("");
    const [errExamTakenAt, setErrExamTakenAt] = useState("");
    const [defaultSelected, setDefaultSelected] = useState(Strings.select_text);
    const [studentId, setStudentID] = useState();
    const [stdErr, setStdErr] = useState("");
    const [edit, setEditValue] = useState(true)
    const [studentValid, setStudentValid] = useState()
    const [studentData, setStudentDATA] = useState()


    const inputRef = React.createRef();

    //function
    const onTabClick = (value) => {
        tabClicked(value)
    }

    const tabClicked = (value) => {
        setTabIndex(value)
        setNextBtnClick(false)
    }

    const setExamTakenAtPlace = (index, value) => {
        setExamTakenAtIndex(index)
        setExamTakenAt(value)
        setErrExamTakenAt("")
    }

    const onDropDownSelect = (idx, value, type) => {
        if (type == 'testId') {
            setTestIds(value)
            setTestIdIndex(Number(idx))
        }
        else if (type == 'examTakenAt') {
            setExamTakenAtPlace(Number(idx), value)
        }
    }

    useEffect(() => {
        validateStudentId(studentId)
    }, [studentId])

    const validateStudentId = async (value) => {
        let studentsExamData = await getStudentsExamData();

        let a = studentsExamData[0].data.students.filter((e) => {
            if (e.studentId == value) {
                return true
            }
        })

        if (a.length > 0) {
            setStudentValid(true)
            setStdErr('')
            setStudentDATA(a)
        } else {
            setStdErr(Strings.please_correct_student_id)
        }

    }

    const setTestIds = (value) => {
        setTestId(value)
        setErrTestID('')
    }

    const renderTabFirst = () => {
        return (
            <View>
                {
                    // scanTypeData.scanType == SCAN_TYPES.SAT_TYPE
                    // &&
                    // loginData
                    // &&
                    // loginData.data
                    // &&
                    <View style={styles.fieldContainerStyle}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.labelTextStyle]}>{Strings.exam_taken_at}</Text>
                            {errExamTakenAt != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '60%', textAlign: 'right', fontWeight: 'normal' }]}>{errExamTakenAt}</Text>}
                        </View>
                        <DropDownMenu
                            disabled={examTakenAtArr.length <= 1}
                            options={examTakenAtArr && examTakenAtArr}
                            onSelect={(idx, value) => onDropDownSelect(idx, value, 'examTakenAt')}
                            defaultData={defaultSelected}
                            defaultIndex={examTakenAtIndex}
                            selectedData={examTakenAt}
                            icon={examTakenAtArr.length == 1 ? null : require('../../assets/images/Arrow_Right.png')}
                        />
                    </View>}
                <TextField
                    labelText={Strings.student_id}
                    errorField={stdErr != '' || isNaN(studentId)}
                    errorText={stdErr != '' ? stdErr : Strings.please_correct_student_id}
                    onChangeText={(text) => {
                        setStudentID(text)
                    }
                    }
                    value={studentId}
                    editable={edit}
                    keyboardType={'numeric'}
                />
                {/* <View style={styles.fieldContainerStyle}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.labelTextStyle]}>{Strings.test_id}</Text>
                        {
                            errTestId != ''
                            &&
                            <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '60%', textAlign: 'right', fontWeight: 'normal' }]}>{errTestId}</Text>}
                    </View>
                    <DropDownMenu
                        // disabled={testIds.length <= 1}
                        options={testId && testId}
                        // onSelect={(idx, value) => this.onDropDownSelect(idx, value, 'testId')}
                        // defaultData={testIds.length >= 1 ? testIds[0] : defaultSelected}
                        // defaultIndex={testIdIndex}
                        selectedData={testId}
                        icon={testId.length == 1 ? null : require('../../assets/images/Arrow_Right.png')}
                    />
                </View> */}
                <TextField
                    labelText={Strings.test_date}
                    ref={inputRef}
                    value={testDate}
                    editable={false}
                />

                <View style={[styles.container3, { paddingBottom: '5%', }]}>
                    <ButtonComponent
                        customBtnStyle={[styles.cancelBtnStyle, { width: '35%' }]}
                        customBtnTextStyle={styles.editBtnTextStyle}
                        btnText={Strings.cancel_text_caps}
                    // onPress={() => this.props.onCancelFirstTab()}
                    />
                    <ButtonComponent
                        customBtnStyle={styles.nxtBtnStyle}
                        customBtnTextStyle={styles.nxtBtnTextStyle}
                        btnText={Strings.next_text.toUpperCase()}
                        onPress={onNextClick}
                        disabled={!studentValid}
                    />
                </View>

            </View>
        )
    }
    const onNextClick = () => {
        if (examTakenAtIndex == -1) {
            setErrExamTakenAt(Strings.please_select_exam_taken_at)
        } else if (!studentValid) {
            setStdErr(Strings.please_correct_student_id)
        }
        else {
            setTabIndex(2)
        }
    }

    useEffect(() => {
        let data = ''
        let elements = neglectData;
        data = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name == elements[0] || element.format.name == elements[1] || element.format.name == elements[2] || element.format.name == elements[3]) {
            }
            else {
                return true
            }
        })
        let len = data.length
        setNewArrayValue(data)

        ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name == "ROLLNUMBER" || element.format.name == "STUDENTID") {
                setStudentID(element.consolidatedPrediction)
            }
        })

    }, [])

    useEffect(() => {
        let elements = neglectData;
        let data = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name == "ROLLNUMBER" || element.format.name == "STUDENTID") {
                return false
            }
            else if (element.format.name == elements[2] || element.format.name == elements[3]) {
                return true

            } else {
                return true
            }
        })
        console.log("data", data);

        data.filter((e) => {
            var maximum = 0;
            if (e.format.name == elements[2]) {
                setObtainedMarks(e.consolidatedPrediction)
            } else if (e.format.name == elements[3]) {
                setMaxMarks(e.consolidatedPrediction)
            }
            // else {
            //     maximum = maximum + Number(e.consolidatedPrediction)
            //     return maximum
            // }
        })

    }, [])

    const renderTabSecond = () => {
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: AppTheme.WHITE, paddingBottom: '15%' }} keyboardShouldPersistTaps={'handled'}>
                <Text style={styles.studentDetailsTxtStyle}>{Strings.student_details}</Text>
                <View style={styles.studentContainer}>
                    <View style={styles.imageViewContainer}>
                        <View style={styles.imageContainerStyle}>
                            <Text style={{ textAlign: 'center', fontSize: AppTheme.HEADER_FONT_SIZE_LARGE }}>{studentData[0].name.charAt(0)}</Text>
                            {/* <Text style={{ textAlign: 'center', fontSize: AppTheme.HEADER_FONT_SIZE_LARGE }}>A</Text> */}
                        </View>
                    </View>
                    <View style={styles.deatilsViewContainer}>
                        <View style={styles.detailsSubContainerStyle}>
                            <Text style={[styles.nameTextStyle, { fontWeight: 'bold', color: AppTheme.BLACK, fontSize: AppTheme.FONT_SIZE_LARGE }]}>{studentData[0].name}</Text>
                            <Text style={styles.nameTextStyle}>{Strings.student_id + ': ' + studentId}</Text>
                            {/* <Text style={styles.nameTextStyle}>{Strings.test_id + ': ' + testId}</Text> */}
                            {/* <Text style={styles.nameTextStyle}>{Strings.student_id + ': ' + "12345"}</Text> */}
                            <Text style={styles.nameTextStyle}>{Strings.test_id + ': ' + filteredData.examTestID}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    {
                        TABLE_HEADER.map((data, index) => {
                            return (
                                <MarksHeaderTable
                                    customRowStyle={{ width: '30%', backgroundColor: AppTheme.TABLE_HEADER }}
                                    key={index}
                                    rowTitle={data}
                                    rowBorderColor={AppTheme.TAB_BORDER}
                                    editable={false}
                                />
                            )
                        })
                    }
                </View>
                {
                    newArrayValue.map((element, index) => {
                        return (
                            <View style={{ flexDirection: 'row' }}>

                                <MarksHeaderTable
                                    customRowStyle={{ width: '30%', }}
                                    key={`Questions${index}`}
                                    // icon={key == 'pass'}
                                    rowTitle={`${element.render.index - 1}`}
                                    rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                    // editable={key == 'earned' ? edit : false}
                                    keyboardType={'number-pad'}
                                // onChangeText={(text) => {
                                //     this.handleTextChange(text.trim(), indexNumber, marksdetails)
                                // }}
                                />
                                <MarksHeaderTable
                                    customRowStyle={{ width: '30%', }}
                                    key={`MaxMarks${index}`}
                                    // icon={key == 'pass'}
                                    rowTitle={element.format.value}
                                    rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                    // editable={key == 'earned' ? edit : false}
                                    keyboardType={'number-pad'}
                                // onChangeText={(text) => {
                                //     this.handleTextChange(text.trim(), indexNumber, marksdetails)
                                // }}
                                />
                                <MarksHeaderTable
                                    customRowStyle={{ width: '30%', }}
                                    key={`ObtainedMarks${index}`}
                                    // icon={key == 'pass'}
                                    rowTitle={element.consolidatedPrediction}
                                    rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                    // editable={key == 'earned' ? edit : false}
                                    keyboardType={'number-pad'}
                                // onChangeText={(text) => {
                                //     this.handleTextChange(text.trim(), indexNumber, marksdetails)
                                // }}

                                />

                            </View>
                        )
                        // }
                    })
                }

                <View style={{ flexDirection: 'row', }}>
                    <Text style={[styles.studentDetailsTxtStyle, { paddingTop: '4%', paddingBottom: 0 }]}>{Strings.total_marks + ':'}</Text>
                    <TextField
                        customInputStyle={{ paddingTop: '-4%', color: AppTheme.GREY_TITLE, fontWeight: 'bold', paddingHorizontal: 0, width: 100, paddingLeft: 5 }}
                        onChangeText={setMaxMarks}
                        value={maxMarks}
                        maxLength={5}
                        // placeholder="Max Marks"
                        keyboardType="numeric"
                    />
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={[styles.studentDetailsTxtStyle, { paddingTop: 0 }]}>{Strings.total_marks_secured + ':'}</Text>
                    <TextField
                        customInputStyle={{ paddingTop: '-8%', color: AppTheme.GREY_TITLE, fontWeight: 'bold', paddingHorizontal: 0, width: 100, paddingLeft: 5 }}
                        onChangeText={setObtainedMarks}
                        value={obtainedMarks}
                        maxLength={5}
                        // placeholder="Secured Marks"
                        keyboardType="numeric"
                    />
                </View>


                <View style={[styles.container3, { paddingTop: '7%' }]}>
                    <ButtonComponent
                        customBtnStyle={[styles.cancelBtnStyle, { width: '35%' }]}
                        customBtnTextStyle={styles.editBtnTextStyle}
                        btnText={btnName.toUpperCase()}
                        onPress={() => onBackButtonClick()}
                    />
                    <ButtonComponent
                        customBtnStyle={styles.nxtBtnStyle}
                        customBtnTextStyle={styles.nxtBtnTextStyle}
                        btnText={Strings.submit_text.toUpperCase()}
                        onPress={() => onSubmitClick()}
                    />
                </View>

            </ScrollView>
        )
    }

    const onNextButtonClick = () => {
    }

    const onBackButtonClick = () => {
        onTabClick(1)
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'cameraActivity', params: { from_screen: 'myScan' } })],
        // });
        // navigation.dispatch(resetAction);
    }

    const onSummaryCancel = () => {
        setSummary(false)
    }

    const dispatch = useDispatch()

    const onSubmitClick = async () => {
        let elements = neglectData;
        let data = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name == elements[0] || element.format.name == elements[1] || element.format.name == elements[2] || element.format.name == elements[3]) {
            }
            else {
                return true
            }
        })

        let objects = []

        data.map((e) => {
            let data = {
                "questionId": e.format.name,
                "obtainedMarks": e.consolidatedPrediction
            }
            objects.push(data)
        })

        let Studentmarks = objects;

        let saveObj = {
            "classId": filteredData.class,
            "examDate": filteredData.examDate,
            "subject": filteredData.subject,
            "studentsMarkInfo": [
                {
                    "section": filteredData.section,
                    "studentId": studentId,
                    "securedMarks": obtainedMarks,
                    "totalMarks": maxMarks,
                    "marksInfo": Studentmarks
                }
            ]
        }

        setIsLoading(true)
        let apiObj = new SaveScanData(saveObj, loginData.data.token);
        dispatch(APITransport(apiObj))
        setIsLoading(false)

        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'myScan', params: { from_screen: 'cameraActivity' } })],
        // });
        // navigation.dispatch(resetAction);
        // return true
    }

    const FetchSavedScannedData = (api) => {
        if (api.method === 'POST') {
            let apiResponse = null
            const source = axios.CancelToken.source()
            const id = setTimeout(() => {
                if (apiResponse === null) {
                    source.cancel('The request timed out.');
                }
            }, 60000);
            axios.post(api.apiEndPoint(), api.getBody())
                .then(function (res) {
                    console.log("RES", res);
                    apiResponse = res
                    clearTimeout(id)
                    api.processResponse(res)
                    dispatch(dispatchAPIAsync(api));
                })
                .catch(function (err) {
                    console.log("Err", err.response);
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

    return (
        <ScrollView
            contentContainerStyle={{ backgroundColor: AppTheme.BACKGROUND_COLOR, paddingBottom: '15%' }}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps={'handled'}
        >
            {
                !summary &&
                <View>
                    <View style={styles.container1}>
                        <Text style={styles.header1TextStyle}>
                            {Strings.complete_these_steps_submit_marks}
                        </Text>
                    </View>
                    <View style={styles.container2}>
                        <TabHeader
                            tabIndex={tabIndex}
                            onPressTab1={() => onTabClick(1)}
                            tabLabel1={Strings.verify_subject_details}
                            tabLabel2={Strings.verify_marks_subject}
                        />
                        {
                            tabIndex == 1
                                ?
                                renderTabFirst()
                                :
                                renderTabSecond()
                        }
                    </View>
                </View>
            }

            {
                summary
                &&
                <View style={{ backgroundColor: AppTheme.WHITE, paddingBottom: '10%' }}>
                    <Text style={styles.studentDetailsTxtStyle}>{Strings.student_details}</Text>
                    <View style={styles.studentContainer}>
                        <View style={styles.imageViewContainer}>
                            <View style={styles.imageContainerStyle}>
                                {/* <Text style={{ textAlign: 'center', fontSize: AppTheme.HEADER_FONT_SIZE_LARGE }}>{studentName.charAt(0)}</Text> */}
                                <Text style={{ textAlign: 'center', fontSize: AppTheme.HEADER_FONT_SIZE_LARGE }}>A</Text>
                            </View>
                        </View>
                        <View style={styles.deatilsViewContainer}>
                            <View style={styles.detailsSubContainerStyle}>
                                {/* <Text style={[styles.nameTextStyle, { fontWeight: 'bold', color: AppTheme.BLACK, fontSize: AppTheme.FONT_SIZE_LARGE }]}>{studentName}</Text> */}
                                <Text style={[styles.nameTextStyle, { fontWeight: 'bold', color: AppTheme.BLACK, fontSize: AppTheme.FONT_SIZE_LARGE }]}>Anil kumar</Text>
                                <Text style={styles.nameTextStyle}>{Strings.student_id + ': ' + 1}</Text>
                                <Text style={styles.nameTextStyle}>{Strings.test_id + ': ' + 1}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: '5%' }}>
                        <Text style={[styles.studentDetailsTxtStyle, { paddingTop: '4%', paddingBottom: 0 }]}>{Strings.total_marks + ':'}</Text>
                        <Text style={[styles.studentDetailsTxtStyle, { paddingTop: '4%', color: AppTheme.BLACK, paddingHorizontal: 0 }]}>150</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: '5%' }}>
                        <Text style={[styles.studentDetailsTxtStyle, { paddingTop: 0 }]}>{Strings.total_marks_secured + ':'}</Text>
                        <Text style={[styles.studentDetailsTxtStyle, { paddingTop: 0, color: AppTheme.BLACK, paddingHorizontal: 0 }]}>100</Text>
                    </View>

                    <View style={[styles.container3, { paddingTop: '7%' }]}>
                        <ButtonWithIcon
                            customBtnStyle={styles.editBtnStyle}
                            customBtnTextStyle={styles.editBtnTextStyle}
                            bgColor={AppTheme.TAB_BORDER}
                            // btnIcon={require('../../../assets/images/editIcon.png')}
                            btnText={Strings.edit_text.toUpperCase()}
                            onPress={() => onSummaryCancel()}

                        />
                        <ButtonComponent
                            customBtnStyle={styles.submitBtnStyle}
                            btnText={Strings.submit_text.toUpperCase()}
                            onPress={onSubmitClick}
                        />
                    </View>
                </View>
            }
            {isLoading && <Spinner animating={isLoading} />}
        </ScrollView>
    );
}
const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse.response,
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanTypeData: state.scanTypeData.response,
        roiData: state.roiData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannedDetailsComponent);
