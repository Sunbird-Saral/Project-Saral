import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ToastAndroid, Alert } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import AppTheme from '../../utils/AppTheme';
import { multipleStudent, neglectData, SCAN_TYPES, student_ID, TABLE_HEADER } from '../../utils/CommonUtils';
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
import { getLoginCred, getScanData, getStudentsExamData, setScanData } from '../../utils/StorageUtils';
import { NavigationActions, StackActions } from 'react-navigation';
import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction';
import Spinner from '../common/components/loadingIndicator';

import APITransport from '../../flux/actions/transport/apitransport';

import { bindActionCreators } from 'redux';
import axios from 'axios';
import { scanStatusDataAction } from '../ScanStatus/scanStatusDataAction';
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction';


const ScannedDetailsComponent = ({
    loginData,
    navigation,
    filteredData,
    scanTypeData,
    ocrLocalResponse
}) => {


    //Hookes
    const [summary, setSummary] = useState(false)
    const [newArrayValue, setNewArrayValue] = useState([])
    const [btnName, setBtnName] = useState('Cancel')
    const [obtainedMarks, setObtainedMarks] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [studentId, setStudentID] = useState();
    const [stdErr, setStdErr] = useState("");
    const [edit, setEditValue] = useState(true)
    const [studentValid, setStudentValid] = useState()
    const [studentData, setStudentDATA] = useState([])
    const [maxMarksTotal, setMaxMarksTotal] = useState(0)
    const [sumOfObtainedMarks, setSummOfObtainedMarks] = useState(0)
    const [totalMarkSecured, setTotalMarkSecured] = useState()
    const [obtnmarkErr, setObtnMarkErr] = useState(false)
    const [maxmarkErr, setMaxMarkErr] = useState(false)
    const [disable, setDisabled] = useState(false)
    const [isMultipleStudent, setIsmultipleStudent] = useState(false)

    const [stdRollArray, setStdRollArray] = useState([])
    const [structureList, setStructureList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [valid, setValid] = useState(false);

    const [nextBtn, setNextBtn] = useState('SUBMIT')

    const inputRef = React.createRef();
    const dispatch = useDispatch()


    //function


    useEffect(() => {
        validateStudentId(studentId)
    }, [studentId])

    const validateStudentId = async (value) => {
        let studentsExamData = await getStudentsExamData();
        let a = studentsExamData[0].data.students.filter((e) => {
            console.log(e.studentId);
            if (e.studentId == value) {
                return true
            }
        })
        console.log("studentData", a);
        if (a.length > 0) {

            setStudentValid(true)
            setStdErr('')
            setStudentDATA(a)
        } else {
            setStdErr(Strings.please_correct_student_id)
            setStudentDATA([])
            setStudentValid(false)
        }

    }




    const onNextClick = () => {
        if (!studentValid) {
            setStdErr(Strings.please_correct_student_id)
        }
    }

    useEffect(() => {
        let checkIsStudentMultipleSingle = ocrLocalResponse.layout.cells.filter((e) => {
            let wordLen = e.format.name.length - 1;
            let multiple = 0
            if (wordLen === multipleStudent[0].length) {
                multiple = multiple + 1
            }
            return multiple
        })

        if (checkIsStudentMultipleSingle.length > 0) {
            setNextBtn("NEXT")
            setStdRollArray(checkIsStudentMultipleSingle)
            setIsmultipleStudent(true)
            callMultipleStudentSheetData(checkIsStudentMultipleSingle)
        } else {
            callSingleStudentSheetData()
        }
    }, []);

    const callMultipleStudentSheetData = (checkIsStudentMultipleSingle) => {

        let marTemp = []
        let dummy = []

        let len = ocrLocalResponse.layout.cells.length;

        ocrLocalResponse.layout.cells.forEach((element, index) => {
            checkIsStudentMultipleSingle.forEach((e, i) => {
                if (element.format.name === e.format.name) {
                    dummy.push(index)
                }
            });
        });
        dummy.push(len)

        dummy.forEach((el, index) => {
            if (dummy.length > index + 1) {
                let data = ocrLocalResponse.layout.cells.slice(dummy[index], dummy[index + 1])
                marTemp.push({
                    RollNo: data[0].consolidatedPrediction,
                    data: data.slice(1, data.length)
                })
            }
        });
        setStudentID(marTemp[0].RollNo)
        setNewArrayValue(marTemp[0].data)
        setStructureList(marTemp)



    }

    const callSingleStudentSheetData = () => {
        let data = ''
        let elements = neglectData;
        data = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name == elements[0] || element.format.name == elements[1] || element.format.name == elements[4]) {
                return false
            }
            else {
                return true
            }
        })

        //check value marksObtained and maxMarks is present in array or not
        let marksObtained = data.some(item => item.format.name === elements[2])
        let maxMarks = data.some(item => item.format.name === elements[3])

        let len = data.length;

        if (maxMarks && marksObtained) {
            //get maxMark and Obtained marks to validate
            let extract_MAX_OBTAINED_MARKS = data.filter((e) => {
                if (e.format.name == elements[2]) {
                    setTotalMarkSecured(e.consolidatedPrediction)
                    return
                }
                if (e.format.name == elements[3]) {
                    setMaxMarksTotal(e.consolidatedPrediction)
                    return
                }
                else {
                    return true
                }
            })
            //extract_MAX_OBTAINED_MARKS return all question data except max marks and obtained marks

            //DO summ of all result from extract_MAX_OBTAINED_MARKS except max marks and obtained marks
            let maximum = 0;
            let sum = extract_MAX_OBTAINED_MARKS.forEach((e) => {
                maximum = parseInt(maximum) + parseInt(e.consolidatedPrediction)
                return maximum
            });
            setSummOfObtainedMarks(maximum)
            setNewArrayValue(data)
        } else {
            //set Data of Other sheet except of marksObtained and maxMarks wala
            setNewArrayValue(data)
        }

        //get student Id
        ocrLocalResponse.layout.cells.filter((element) => {
            student_ID.forEach((e) => {
                if (element.format.name == e) {
                    setStudentID(element.consolidatedPrediction)
                }
            })
        })
    }

    const goNextFrame = () => {

        let validCell = false
        for (let i = 0; i < newArrayValue.length; i++) {
            if (newArrayValue[i].consolidatedPrediction == '') {
                validCell = true
            }

        }
        // console.log("valid", valid);
        // if (valid) {
        //     showErrorMessage(Strings.omr_mark_should_be)
        // }
        if (disable) {
            showErrorMessage(Strings.please_correct_marks_data)
        }
        else if (validCell) {
            showErrorMessage(Strings.please_correct_marks_data)
        }
        else if (!studentValid) {
            showErrorMessage(Strings.please_correct_student_id)
        }
        else {
            if (currentIndex + 1 <= stdRollArray.length - 1) {

                //for student validataion
                console.log("hello", currentIndex);

                ocrLocalResponse.layout.cells.forEach(element => {

                    if (element.cellId == stdRollArray[currentIndex].cellId) {
                        element.consolidatedPrediction = studentId

                        structureList.forEach((el, index) => {
                            if (currentIndex == index) {
                                el.RollNo = studentId
                            }
                        });

                    }
                });
                //save validated student
                dispatch(OcrLocalResponseAction(JSON.parse(JSON.stringify(ocrLocalResponse))))

                validCell = false
                setNewArrayValue(structureList[currentIndex + 1].data)
                setStudentID(structureList[currentIndex + 1].RollNo)
                setCurrentIndex(currentIndex + 1)
                setBtnName('Back')
                if (currentIndex + 1 == stdRollArray.length - 1) {
                    setNextBtn(Strings.submit_text)
                }
            } else {
                saveMultipleStudentDataSheet()
            }
        }
    }

    const saveMultipleStudentDataSheet = () => {
        if (isMultipleStudent && nextBtn === Strings.submit_text) {
            saveMultiData()
        }
    }

    const saveMultiData = () => {

        let stdMarkInfo = []

        structureList.forEach((el, index) => {
            let stdTotalMarks = 0
            let stdData = {
                "studentId": '',
                "section": filteredData.section,
                "marksInfo": '',
                "securedMarks": stdTotalMarks,
                "totalMarks": 0
            }

            stdData.studentId = el.RollNo

            let stdMarks_info = []

            el.data.forEach((value, i) => {
                let marks_data = {
                    "questionId": '',
                    "obtainedMarks": ''
                }
                marks_data.questionId = value.format.name,
                    marks_data.obtainedMarks = value.consolidatedPrediction
                stdTotalMarks = Number(stdTotalMarks) + Number(value.consolidatedPrediction)
                stdMarks_info.push(marks_data)

            })
            stdData.securedMarks = stdTotalMarks
            stdData.marksInfo = stdMarks_info
            stdMarkInfo.push(stdData)

        })
        console.log("stdMarkInfo", stdMarkInfo);


        let saveObj = {
            "classId": filteredData.class,
            "examDate": filteredData.examDate,
            "subject": filteredData.subject,
            "studentsMarkInfo": stdMarkInfo
        }

        setIsLoading(true)
        let apiObj = new SaveScanData(saveObj, loginData.data.token);
        dispatch(APITransport(apiObj))
        setIsLoading(false)

        Alert.alert(Strings.message_text, Strings.saved_successfully, [{
            text: Strings.ok_text, onPress: () => {
                callScanStatusData()
            }
        }])
    }

    const goBackFrame = () => {
        if (currentIndex - 1 >= 0) {
            setNewArrayValue(structureList[currentIndex - 1].data)
            setStudentID(structureList[currentIndex - 1].RollNo)
            setCurrentIndex(currentIndex - 1)
            if (currentIndex == 1) {
                setBtnName('cancel')
            }
        }
        else {
            onBackButtonClick()
        }
    }

    const renderSRNo = (element, index) => {
        if (isMultipleStudent) {
            return `${index + 1}`
        } else {
            return `${element.render.index - 1}`
        }
    }

    const renderTabSecond = () => {
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: AppTheme.WHITE, paddingBottom: '15%' }} keyboardShouldPersistTaps={'handled'}>
                <Text style={styles.studentDetailsTxtStyle}>{Strings.student_details}</Text>
                <View style={styles.studentContainer}>
                    <View style={styles.imageViewContainer}>
                        <View style={styles.imageContainerStyle}>
                            <Text style={{ textAlign: 'center', fontSize: AppTheme.HEADER_FONT_SIZE_LARGE }}>{studentData.length > 0 && studentData[0].name.charAt(0)}</Text>
                        </View>
                    </View>
                    <View style={styles.deatilsViewContainer}>
                        <View style={styles.detailsSubContainerStyle}>
                            <Text style={[styles.nameTextStyle, { fontWeight: 'bold', color: AppTheme.BLACK, fontSize: AppTheme.FONT_SIZE_LARGE }]}>{studentData.length > 0 && studentData[0].name}</Text>
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
                                    key={`TableHeader${index}`}
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
                                    key={`Questions${element.cellId + 10}`}
                                    rowTitle={renderSRNo(element, index)}
                                    rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                    editable={false}
                                    keyboardType={'number-pad'}
                                />
                                <MarksHeaderTable
                                    customRowStyle={{ width: '30%', }}
                                    key={`MaxMarks${element.cellId}`}
                                    rowTitle={element.format.value}
                                    rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                    editable={false}
                                    keyboardType={'number-pad'}
                                />
                                <MarksHeaderTable
                                    customRowStyle={{ width: '30%', }}
                                    key={`ObtainedMarks${element.cellId}`}
                                    rowTitle={element.consolidatedPrediction}
                                    rowBorderColor={markBorderOnCell(element)}
                                    editable={true}
                                    keyboardType={'number-pad'}
                                    maxLength={lengthAccordingSheet(element)}
                                    onChangeText={(text) => {
                                        handleTextChange(text.trim(), index, newArrayValue, element)
                                    }}

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
                        onPress={() => isMultipleStudent ? goBackFrame() : onBackButtonClick()}
                    />
                    <ButtonComponent
                        customBtnStyle={styles.nxtBtnStyle}
                        customBtnTextStyle={styles.nxtBtnTextStyle}
                        btnText={nextBtn}
                        onPress={() => isMultipleStudent ? goNextFrame() : onSubmitClick()}
                    />
                </View>

            </ScrollView>
        )
    }

    const lengthAccordingSheet = (element) => {
        if (isMultipleStudent) {
            return 1
        } else if (element.format.name === neglectData[2] || element.format.name === neglectData[3]) {
            return 3
        } else {
            return 2
        }
    }


    const handleTextChange = (text, index, array, value) => {

        if (isMultipleStudent) {
            let len = text.length
            setDisabled(len == 0 ? true : false)
            // if (text > 1) {
            //     setValid(true)
            // }
            // console.log("text",text);

            let newArray = JSON.parse(JSON.stringify(array))
            newArray[index].consolidatedPrediction = text > 1 ? 0 : text
            setNewArrayValue(newArray)

            ocrLocalResponse.layout.cells.forEach(element => {

                if (element.cellId == value.cellId) {
                    structureList.forEach(Datas => {
                        //this ll add into OCRLocal
                        element.consolidatedPrediction = text > 1 ? 0 : text
                        //this ll add in our structure
                        Datas.data.forEach((el, index) => {
                            if (el.cellId === value.cellId) {
                                el.consolidatedPrediction = text > 1 ? 0 : text
                            }
                        });

                    });
                }
            });
            dispatch(OcrLocalResponseAction(ocrLocalResponse))

        } else {
            let len = text.length
            setDisabled(len == 0 ? true : false)
            let newArray = JSON.parse(JSON.stringify(array))
            newArray[index].consolidatedPrediction = isMultipleStudent ? text > 1 ? 0 : text : text
            setNewArrayValue(newArray)

            ocrLocalResponse.layout.cells.forEach(element => {
                if (element.cellId == value.cellId) {
                    element.consolidatedPrediction = text

                }
            });
            dispatch(OcrLocalResponseAction(ocrLocalResponse))


            newArray.map((e) => {
                if (e.format.name == "MAX_MARKS") {
                    setMaxMarksTotal(e.consolidatedPrediction)
                }
                if (e.format.name == "MARKS_OBTAINED") {
                    setTotalMarkSecured(e.consolidatedPrediction)
                }
            })
        }
        // dispatch(OcrLocalResponseAction(ocrData))


    }

    const markBorderOnCell = (element) => {
        if (element.consolidatedPrediction.length == 0) {
            return AppTheme.ERROR_RED
        } else if (isMultipleStudent && element.consolidatedPrediction > 1) {
            return AppTheme.ERROR_RED
        }
        else if (element.format.name == neglectData[2] && obtnmarkErr) {
            return AppTheme.ERROR_RED
        } else if (element.format.name == neglectData[3] && maxmarkErr) {
            return AppTheme.ERROR_RED
        }
        else {
            return AppTheme.INACTIVE_BTN_TEXT
        }
    }

    const onNextButtonClick = () => {
    }

    const onBackButtonClick = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'myScan', params: { from_screen: 'ScannedDetailsComponent' } })],
        });
        navigation.dispatch(resetAction);
    }


    const showErrorMessage = (message) => {
        Alert.alert(message)
    }

    const onSubmitClick = async () => {
        if (disable) {
            showErrorMessage(Strings.please_fill_cells)
        }
        else if (!studentValid) {
            showErrorMessage(Strings.please_correct_student_id)
        }
        else {
            if (sumOfObtainedMarks > 0) {
                //with MAX & OBTAINED MARKS
                if (sumOfObtainedMarks != totalMarkSecured) {
                    console.log("SUMOFOBTAINEMARKSss", sumOfObtainedMarks);
                    setObtnMarkErr(true)
                    showErrorMessage("Sum Of All obtained marks should be equal to marksObtained")
                }
                else if (maxMarksTotal < sumOfObtainedMarks) {
                    setObtnMarkErr(false)
                    showErrorMessage("Total mark should be less than or equal to Maximum marks")
                    setMaxMarkErr(true)
                }
                else {
                    setMaxMarkErr(false)
                    setObtnMarkErr(false)
                    saveData()
                }
            } else {
                //without MAX & OBTAINED MARKS
                saveData()
            }
        }
    }

    const saveData = async () => {
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
                    "securedMarks": sumOfObtainedMarks > 0 ? sumOfObtainedMarks : 0,
                    "totalMarks": maxMarksTotal > 0 ? maxMarksTotal : 0,
                    "marksInfo": Studentmarks
                }
            ]
        }

        setIsLoading(true)
        let apiObj = new SaveScanData(saveObj, loginData.data.token);
        dispatch(APITransport(apiObj))
        setIsLoading(false)

        Alert.alert(Strings.message_text, Strings.saved_successfully, [{
            text: Strings.ok_text, onPress: () => {
                callScanStatusData()
            }
        }])
    }

    const callScanStatusData = async () => {
        setIsLoading(true)
        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.class,
            "subject": filteredData.subject,
            "fromDate": filteredData.examDate,
            "page": 0,
            "schoolId": loginCred.schoolId,
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
                    console.log("fetch", res);
                    setIsLoading(false)
                    goToMyScanScreen()
                    apiResponse = res
                    clearTimeout(id)
                    api.processResponse(res)
                    dispatch(dispatchAPIAsync(api));
                })
                .catch(function (err) {
                    setIsLoading(false)
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

    const goToMyScanScreen = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'myScan', params: { from_screen: 'cameraActivity' } })],
        });
        navigation.dispatch(resetAction);
        return true
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
                        {
                            renderTabSecond()
                        }
                    </View>
                </View>
            }



            {isLoading && <Spinner animating={isLoading} iconShow={false} />}
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
        OcrLocalResponseAction: OcrLocalResponseAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannedDetailsComponent);
