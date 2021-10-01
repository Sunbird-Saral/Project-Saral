import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import AppTheme from '../../utils/AppTheme';
import { neglectData, SCAN_TYPES, TABLE_HEADER } from '../../utils/CommonUtils';
import Strings from '../../utils/Strings';
import ButtonComponent from '../common/components/ButtonComponent';
import DropDownMenu from '../common/components/DropDownComponent';
import TextField from '../common/components/TextField';

//styles
import { styles } from './ScannedDetailsStyle'
import TabHeader from './TabHeader';

//rois
import MarksHeaderTable from './MarksHeaderTable';

const ScannedDetailsComponent = ({
    params,
    filteredData,
    loginData,
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
    const [testDate, setTestDate] = useState('30/09/2021')
    const [nextValue, setNextValue] = useState(5)
    const [preValue, setPreValue] = useState(0)
    const [newArrayValue, setNewArrayValue] = useState([])
    const [isNextExist, setNextExist] = useState(false)
    const [btnName, setBtnName] = useState('Cancel')

    const inputRef = React.createRef();

    //function
    const onTabClick = (value) => {
        tabClicked(value)
    }

    const tabClicked = (value) => {
        setTabIndex(value)
        setNextBtnClick(false)
    }

    const onDropDownSelect = (idx, value, type) => {
        if (type == 'testId') {

            setTestIds(value)
            setTestIdIndex(Number(idx))

        }
        else if (type == 'examTakenAt') {
            setExamTakenArr(Number(idx), value)
        }
    }

    const setTestIds = (value) => {
        setTestId(value)
        setErrTestID('')
    }

    const renderTabFirst = () => {
        // const { testIdIndex, defaultSelected } = this.state
        // const { edit, studentId, testDate, stdErr, testIds, testId, testDateErr, errTestId, errExamTakenAt, examTakenAtIndex, examTakenAtArr, examTakenAt, scanType, loginDataRes } = this.props
        return (
            <View>
                {
                    scanTypeData.scanType == SCAN_TYPES.SAT_TYPE
                    &&
                    loginData
                    &&
                    loginData.data
                    &&
                    <View style={styles.fieldContainerStyle}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.labelTextStyle]}>{Strings.exam_taken_at}</Text>
                            {/* {errExamTakenAt != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '60%', textAlign: 'right', fontWeight: 'normal' }]}>{errExamTakenAt}</Text>} */}
                        </View>
                        <DropDownMenu
                            disabled={examTakenAtArr.length <= 1}
                            options={examTakenAtArr && examTakenAtArr}
                            // onSelect={(idx, value) => onDropDownSelect(idx, value, 'examTakenAt')}
                            // defaultData={defaultSelected}
                            // defaultIndex={examTakenAtIndex}
                            // selectedData={examTakenAt}
                            icon={examTakenAtArr.length == 1 ? null : require('../../assets/images/Arrow_Right.png')}
                        />
                    </View>}
                <TextField
                    labelText={Strings.student_id}
                    // errorField={stdErr != '' || isNaN(studentId)}
                    // errorText={stdErr != '' ? stdErr : Strings.please_correct_student_id}
                    // onChangeText={(text) => this.onDetailsChange(text.trim(), 'studentId')}
                    // value={studentId}
                    // editable={edit}
                    keyboardType={'numeric'}
                />
                <View style={styles.fieldContainerStyle}>
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
                </View>
                <TextField
                    labelText={Strings.test_date}
                    ref={inputRef}
                    // errorField={testDateErr != ''}
                    // errorText={testDateErr}
                    // ref={this.inputRef}
                    // // onChangeText={(text) => this.onDetailsChange(text.trim(), 'testDate')}
                    value={testDate}
                    editable={false}
                // onEndEditing={() => this.props.getExamID(testDate)}
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
                    />
                </View>

            </View>
        )
    }

    const onNextClick = () => {

        if (inputRef.current.isFocused()) {
            inputRef.current.blur();
        }
        // onNext()
        setTabIndex(2)
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
        // console.log("DATA=================>", data);

        let len = data.length
        console.log("PRevValue", preValue, nextValue, "length", len);
        let newArray = data.slice(preValue, nextValue);
        setNewArrayValue([...newArray])
        if (newArray.length < 5 || len == nextValue) {
            setNextExist(true)
        }

    }, [nextValue])

    const renderTabSecond = () => {
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: AppTheme.WHITE, paddingBottom: '15%' }} keyboardShouldPersistTaps={'handled'}>
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
                            <Text style={[styles.nameTextStyle, { fontWeight: 'bold', color: AppTheme.BLACK, fontSize: AppTheme.FONT_SIZE_LARGE }]}>Ansari Arman</Text>
                            {/* <Text style={styles.nameTextStyle}>{Strings.student_id + ': ' + studentId}</Text>
                            <Text style={styles.nameTextStyle}>{Strings.test_id + ': ' + testId}</Text> */}
                            <Text style={styles.nameTextStyle}>{Strings.student_id + ': ' + "12345"}</Text>
                            <Text style={styles.nameTextStyle}>{Strings.test_id + ': ' + '123456852'}</Text>
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

                    // ocrLocalResponse.layout.cells.slice(preValue, nextValue)
                    newArrayValue.map((element, index) => {
                        // if (element.format.name == `QUESTION${element.render.index - 1}`) {
                        return (
                            <View style={{ flexDirection: 'row' }}>

                                <MarksHeaderTable
                                    customRowStyle={{ width: '30%', }}
                                    key={`Questions${index}`}
                                    // icon={key == 'pass'}
                                    rowTitle={element.format.name}
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
                                    rowTitle={"10"}
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
                                    rowTitle={element.consolidatePrediction}
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
                        btnText={Strings.next_text.toUpperCase()}
                        onPress={onNextButtonClick}
                    />
                </View>

            </ScrollView>
        )
    }

    const onNextButtonClick = () => {
        if (isNextExist) {
            ToastAndroid.show("no more data", ToastAndroid.SHORT);
        } else {
            setBtnName('Back')
            setPreValue(nextValue)
            setNextValue(nextValue + 5)
        }
    }

    const onBackButtonClick = () => {
        console.log("onBackButtonClick outside", preValue);
        if (preValue == 0) {
            console.log("onBackButtonClick", preValue);
            // ToastAndroid.show("proceed further", ToastAndroid.SHORT)
            setBtnName('Cancel')
        } else {
            setBtnName('back')
            setNextExist(false)
            setPreValue(preValue - 5)
            setNextValue(nextValue - 5)
        }
        if (preValue == 5) {
            setBtnName('cancel')
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
                            </View>
                        </View>
                        <View style={styles.deatilsViewContainer}>
                            <View style={styles.detailsSubContainerStyle}>
                                {/* <Text style={[styles.nameTextStyle, { fontWeight: 'bold', color: AppTheme.BLACK, fontSize: AppTheme.FONT_SIZE_LARGE }]}>{studentName}</Text> */}
                                {/* <Text style={styles.nameTextStyle}>{Strings.student_id + ': ' + studentId}</Text>
                                <Text style={styles.nameTextStyle}>{Strings.test_id + ': ' + testId}</Text> */}
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: '5%' }}>
                        <Text style={[styles.studentDetailsTxtStyle, { paddingTop: '4%', paddingBottom: 0 }]}>{Strings.total_marks + ':'}</Text>
                        {/* <Text style={[styles.studentDetailsTxtStyle, { paddingTop: '4%', color: AppTheme.BLACK, paddingHorizontal: 0 }]}>{totalMarks}</Text> */}
                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: '5%' }}>
                        <Text style={[styles.studentDetailsTxtStyle, { paddingTop: 0 }]}>{Strings.total_marks_secured + ':'}</Text>
                        {/* <Text style={[styles.studentDetailsTxtStyle, { paddingTop: 0, color: AppTheme.BLACK, paddingHorizontal: 0 }]}>{securedMarks}</Text> */}
                    </View>

                    <View style={[styles.container3, { paddingTop: '7%' }]}>
                        <ButtonWithIcon
                            customBtnStyle={styles.editBtnStyle}
                            customBtnTextStyle={styles.editBtnTextStyle}
                            bgColor={AppTheme.TAB_BORDER}
                            // btnIcon={require('../../../assets/images/editIcon.png')}
                            btnText={Strings.edit_text.toUpperCase()}
                        // onPress={() => onSummaryCancel()}

                        />
                        <ButtonComponent
                            customBtnStyle={styles.submitBtnStyle}
                            btnText={Strings.submit_text.toUpperCase()}
                        // onPress={onSubmitClick}
                        />
                    </View>
                </View>
            }
        </ScrollView>
    );
}
const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse.response,
        loginData: state.loginData,
        filteredData: state.filteredData,
        scanTypeData: state.scanTypeData.response,
        roiData: state.roiData
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({
//         OcrLocalResponseAction: OcrLocalResponseAction,
//     }, dispatch)
// }

export default (connect(mapStateToProps, null)(ScannedDetailsComponent));
