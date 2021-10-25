import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ToastAndroid, Alert } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import AppTheme from '../../utils/AppTheme';
import { multipleStudent, neglectData, SCAN_TYPES, student_ID, TABLE_HEADER } from '../../utils/CommonUtils';
import Strings from '../../utils/Strings';


//styles
import { styles } from './ScannedDetailsStyle'

//rois
import MarksHeaderTable from './MarksHeaderTable';

//components
import ButtonComponent from '../common/components/ButtonComponent';
import TextField from '../common/components/TextField';
import { getLoginCred, getPresentAbsentStudent, getScanData, getScannedDataFromLocal, getStudentsExamData, setScanData, setScannedDataIntoLocal } from '../../utils/StorageUtils';
import { NavigationActions, StackActions } from 'react-navigation';
import Spinner from '../common/components/loadingIndicator';
import APITransport from '../../flux/actions/transport/apitransport';
import { bindActionCreators } from 'redux';
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction';


const ScannedDetailsComponent = ({
    navigation,
    filteredData,
    ocrLocalResponse,
    multiBrandingData,
    scanedData
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
    const [checkStdRollDuplicate, setCheckStdRollDuplicate] = useState([])
    const [isDuplicate, setIsDuplicate] = useState(false)

    const inputRef = React.createRef();
    const dispatch = useDispatch()


    useEffect(() => {
        validateStudentId(studentId)
    }, [studentId])

    const validateStudentId = async (value) => {
        let studentsExamData = await getStudentsExamData();
        const filterStudentsData = studentsExamData.filter((e) => {
            if (e.class == filteredData.className && e.section == filteredData.section) {
                return true
            }
        })

        let a = filterStudentsData[0].data.students.filter((e) => {
            if (e.studentId == value) {
                return true
            }
        })

        let absentPresentStudent = await getPresentAbsentStudent()

        let datas = absentPresentStudent.length > 0 ? absentPresentStudent : []

        let absent = datas.filter((item) => item.studentId == studentId & item.studentAvailability == false)


        if (absent.length > 0) {
            setStdErr("Student is Absent")
            setStudentValid(false)
        }
        else if (a.length > 0) {
            setStudentValid(true)
            setStdErr('')
            setStudentDATA(a)
        }
        else {
            setStdErr(Strings.please_correct_student_id)
            setStudentDATA([])
            setStudentValid(false)
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
        let omrMark = false
        for (let i = 0; i < newArrayValue.length; i++) {
            if (newArrayValue[i].consolidatedPrediction === '') {
                validCell = true
            }
            else if (newArrayValue[i].consolidatedPrediction === 0) {
                omrMark = true
            }

        }

        let duplication = false

        const duplicate = checkStdRollDuplicate.some((item) => studentId == item)

        if (duplicate) {
            duplication = true
        } else {
            duplication = false
        }
        if (omrMark) {
            showErrorMessage(Strings.omr_mark_should_be)
        }
        else if (duplication) {
            Alert.alert("Student ID Shouldn't be duplicated")
        }
        else if (disable) {
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
                setCheckStdRollDuplicate([...checkStdRollDuplicate, studentId])
                validCell = false
                setNewArrayValue(structureList[currentIndex + 1].data)
                setStudentID(structureList[currentIndex + 1].RollNo)
                setCurrentIndex(currentIndex + 1)
                setBtnName('Back')
                if (currentIndex + 1 == stdRollArray.length - 1) {
                    setNextBtn(Strings.submit_text)
                }
            } else {
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
                dispatch(OcrLocalResponseAction(JSON.parse(JSON.stringify(ocrLocalResponse))))
                saveMultipleStudentDataSheet()
            }
        }
    }

    const saveMultipleStudentDataSheet = () => {
        if (isMultipleStudent && nextBtn === Strings.submit_text) {
            saveMultiData()
        }
    }

    const saveMultiData = async () => {

        let stdMarkInfo = []

        structureList.forEach((el, index) => {
            let stdTotalMarks = 0
            let stdData = {
                "studentId": '',
                "section": filteredData.section,
                "marksInfo": '',
                "securedMarks": stdTotalMarks,
                "totalMarks": 0,
                "studentAvailability": true
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


        let saveObj = {
            "classId": filteredData.class,
            "examDate": filteredData.examDate,
            "subject": filteredData.subject,
            "studentsMarkInfo": stdMarkInfo
        }

        saveAndFetchFromLocalStorag(saveObj)
    }


    const saveAndFetchFromLocalStorag = async (saveObj) => {
        let getDataFromLocal = await getScannedDataFromLocal();
        let len = 0
        if (getDataFromLocal != null) {

            let filterData = getDataFromLocal.filter((e) => {
                let findSection = false
                findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)

                if (filteredData.class == e.classId && e.examDate == filteredData.examDate && e.subject == filteredData.subject && findSection) {
                    return true
                }
            })


            if (filterData.length > 0) {
                filterData.forEach((element, index) => {
                    len = len + element.studentsMarkInfo.length
                });

                let totalLenOfStudentsMarkInfo = len + saveObj.studentsMarkInfo.length;

                if (totalLenOfStudentsMarkInfo <= 20) {
                    if (filterData) {

                        getDataFromLocal.forEach((e, index) => {

                            let findSection = false
                            findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)

                            if (filteredData.class == e.classId && e.examDate == filteredData.examDate && e.subject == filteredData.subject && findSection) {


                                e.studentsMarkInfo.forEach((element, i) => {

                                    let findStudent = e.studentsMarkInfo.filter(o => {
                                        if (o.studentId == studentId) {
                                            return true;
                                        }
                                    })

                                    if (!isMultipleStudent && findStudent.length > 0) {
                                        getDataFromLocal[index].studentsMarkInfo[i] = saveObj.studentsMarkInfo[0]
                                    }
                                    else if (isMultipleStudent) {


                                        let findMultipleStudent = structureList.filter((item) => {
                                            if (item.RollNo == element.studentId) {
                                                return true
                                            }
                                        })


                                        if (findMultipleStudent.length > 0) {
                                            getDataFromLocal[index].studentsMarkInfo[i] = saveObj.studentsMarkInfo[i]
                                        } else {
                                            getDataFromLocal[index].studentsMarkInfo.push(saveObj.studentsMarkInfo[i])
                                        }
                                    }
                                    else {
                                        getDataFromLocal[index].studentsMarkInfo.push(saveObj.studentsMarkInfo[0])
                                    }

                                });
                            }

                        });
                        setScannedDataIntoLocal(getDataFromLocal)
                        goToMyScanScreen()
                    }
                } else {
                    Alert.alert("You can Save Only 10 Student. In Order to Continue have to save first")
                }

            } else if (saveObj.studentsMarkInfo.length <= 10) {
                let data = getDataFromLocal.push(saveObj)
                setScannedDataIntoLocal(getDataFromLocal)
                goToMyScanScreen()
            }

        } else if (saveObj.studentsMarkInfo.length <= 10) {
            setScannedDataIntoLocal([saveObj])
            goToMyScanScreen()
        } else {
            Alert.alert("You can Save Only 10 Student. In Order to Continue have to save first")
        }
    }


    const goBackFrame = () => {
        if (currentIndex - 1 >= 0) {
            let std = structureList[currentIndex - 1].RollNo
            const index = checkStdRollDuplicate.indexOf(std);
            if (index > -1) {
                checkStdRollDuplicate.splice(index, 1);
            }
            setCheckStdRollDuplicate(checkStdRollDuplicate)

            setNewArrayValue(structureList[currentIndex - 1].data)
            setStudentID(structureList[currentIndex - 1].RollNo)
            setCurrentIndex(currentIndex - 1)
            if (currentIndex == 1) {
                setBtnName('cancel')
            }
            setNextBtn(Strings.next_text)
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
            <View style={{flex:1}}> 
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
                            <Text style={styles.nameTextStyle}>{Strings.Exam} : {filteredData.subject} {filteredData.examDate} ({filteredData.examTestID})</Text>

                            <Text style={styles.nameTextStyle}>{Strings.page_no + ': ' + (currentIndex + 1)}</Text>
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

                <View style={[styles.viewnxtBtnStyle1, { paddingTop: '7%' }]}>
                    <ButtonComponent
                        customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE, marginTop: '5%' }]}
                        btnText={btnName.toUpperCase()}
                        onPress={() => isMultipleStudent ? goBackFrame() : onBackButtonClick()}
                    />
                    <ButtonComponent
                        customBtnStyle={[styles.nxtBtnStyle, { borderColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                        customBtnTextStyle={{ color: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }}
                        btnText={nextBtn.toUpperCase()}
                        onPress={() => isMultipleStudent ? goNextFrame() : onSubmitClick()}
                    />
                </View>

            </ScrollView>
            </View>
        )
    }

    const lengthAccordingSheet = (element) => {
        if (isMultipleStudent) {
            return 1
        } else if (element.format.name === neglectData[2] || element.format.name === neglectData[3]) {
            return 4
        } else {
            return 2
        }
    }


    const handleTextChange = (text, index, array, value) => {

        if (isMultipleStudent) {
            let len = text.length
            setDisabled(len == 0 ? true : false)
            if (text > 1) {
                setValid(true)
            } else {
                setValid(false)
            }

            let newArray = JSON.parse(JSON.stringify(array))
            newArray[index].consolidatedPrediction = text > 1 ? 0 : text
            setNewArrayValue(newArray)

            ocrLocalResponse.layout.cells.forEach(element => {

                if (element.cellId == value.cellId) {
                    structureList.forEach(Datas => {
                        //this'll add into OCRLocal
                        element.consolidatedPrediction = text > 1 ? 0 : text
                        //this'll add in  structurelist
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
                if (e.format.name == neglectData[3]) {
                    setMaxMarksTotal(e.consolidatedPrediction)
                }
                if (e.format.name == neglectData[2]) {
                    setTotalMarkSecured(e.consolidatedPrediction)
                }
            })
        }


    }

    const markBorderOnCell = (element) => {
        if (element.consolidatedPrediction.length == 0) {
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
            showErrorMessage(Strings.please_correct_marks_data)
        }
        else if (!studentValid) {
            showErrorMessage(Strings.please_correct_student_id)
        }
        else {
            if (sumOfObtainedMarks > 0) {
                //with MAX & OBTAINED MARKS
                console.log("sumOfObtainedMarks",sumOfObtainedMarks);
                if (sumOfObtainedMarks != totalMarkSecured) {
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
                    "marksInfo": Studentmarks,
                    "studentAvailability": true
                }
            ]
        }
        saveAndFetchFromLocalStorag(saveObj)
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
        <View style={{flex:1}}>
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
        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse.response,
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanTypeData: state.scanTypeData.response,
        roiData: state.roiData,
        multiBrandingData: state.multiBrandingData.response.data,
        scanedData: state.scanedData.response
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        OcrLocalResponseAction: OcrLocalResponseAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannedDetailsComponent);
