import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ToastAndroid, Alert, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import AppTheme from '../../utils/AppTheme';
import { CELL_OMR, extractionMethod, multipleStudent, MULTIPLE_TAG_DATAS, neglectData, SCAN_TYPES, studentLimitSaveInLocal, student_ID, TABLE_HEADER, TABLE_HEADER_WITH_TAG } from '../../utils/CommonUtils';
import Strings from '../../utils/Strings';
import ShareComponent from '../common/components/Share';


//styles
import { styles } from './ScannedDetailsStyle'

//rois
import MarksHeaderTable from './MarksHeaderTable';

//components
import ButtonComponent from '../common/components/ButtonComponent';
import TextField from '../common/components/TextField';
import { getLoginCred, getErrorMessage, getPresentAbsentStudent, getScanData, getScannedDataFromLocal, getStudentsExamData, setScanData, setScannedDataIntoLocal } from '../../utils/StorageUtils';
import { NavigationActions, StackActions } from 'react-navigation';
import Spinner from '../common/components/loadingIndicator';
import APITransport from '../../flux/actions/transport/apitransport';
import { bindActionCreators } from 'redux';
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction';
import { collectErrorLogs } from '../CollectErrorLogs';
import { MultiPageActions } from '../../flux/actions/multiPageActions'

import { Assets } from '../../assets';
import SaralSDK from '../../../SaralSDK'
//npm
import CheckBox from '@react-native-community/checkbox';
import TaggingModal from '../common/TaggingModal';


const ScannedDetailsComponent = ({
    navigation,
    filteredData,
    ocrLocalResponse,
    multiBrandingData,
    scanedData,
    loginData,
    bgFlag,
    roiData,
    studentsAndExamData
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
    const [isStudentValid, setIsStudentValid] = useState(false);
    const [multiPageStdId, setMultipageStdId] = useState();

    const [nextBtn, setNextBtn] = useState('SUBMIT')
    const [checkStdRollDuplicate, setCheckStdRollDuplicate] = useState([])
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [logmessage, setLogmessage] = useState()
    const [multiPage, setMultiPage] = useState(0)
    const [isModalVisible ,setIsModalVisible] = useState(false)
    const [tagData ,setTagData] = useState([])
    const [questionIdData ,setQuestionIdData] = useState()

    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.scannedDetailComponent[0]



    const inputRef = React.createRef();
    const dispatch = useDispatch()

    useEffect(async () => {
        let message = await getErrorMessage()
        setLogmessage(message)
    }, []);


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

        if(studentId == 0 && studentId != ''){
            setToggleCheckBox(true)
        }
        if (absent.length > 0) {
            setStdErr("Student is Absent")
            setStudentValid(false)
        }
        else if (ocrLocalResponse.layout.pages > 0) {
            if (a.length > 0 && a[0].studentId != multiPageStdId) {
                setIsStudentValid(true)
                setStdErr(Strings.student_id_should_be_same)
                setStudentDATA([])
            }   else if (a.length == 0) {
                setIsStudentValid(true)
                setStdErr(Strings.please_correct_student_id)
            } else {
                setIsStudentValid(false)
                setStudentValid(true)
                setStdErr('')
                setStudentDATA(a)
                //set student Id
                ocrLocalResponse.layout.cells.forEach((element) => {
                    student_ID.forEach((e) => {
                        if (element.format.name == e) {
                            element.consolidatedPrediction = value
                            setMultipageStdId(element.consolidatedPrediction)
                        }
                    })
                })
            }
        }
        else if (a.length > 0 && !toggleCheckBox) {
            setStudentValid(true)
            setStdErr('')
            setStudentDATA(a)
            if (!isMultipleStudent) {
                //set student Id
                ocrLocalResponse.layout.cells.forEach((element) => {
                    student_ID.forEach((e) => {
                        if (element.format.name == e) {
                            element.consolidatedPrediction = value
                            setMultipageStdId(element.consolidatedPrediction)
                        }
                    })
                })
            }
        }
        else if (!toggleCheckBox) {
            setStdErr(Strings.please_correct_student_id)
            setStudentDATA([])
            setStudentValid(false)
        } else {
            setStudentDATA([])
        }

    }

    useEffect(() => {
        let checkIsStudentMultipleSingle = ocrLocalResponse.layout.cells.filter((e) => {
            let withNoDigits = e.format.name.replace(/[0-9]/g, '');
            let wordLen = withNoDigits.length;
            let multiple = 0
            if (wordLen === multipleStudent[0].length  && withNoDigits === multipleStudent[0]) {
                multiple = multiple + 1
            }
            return multiple
        })
        if (ocrLocalResponse.layout.hasOwnProperty("pages") && ocrLocalResponse.layout.pages > 0) {
            setMultiPage(ocrLocalResponse.layout.pages)
            setNextBtn("SCAN PAGE #2")
        }

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
            if (element.format.name == elements[0] || element.format.name == elements[1] || element.format.name == elements[4] || element.page && element.page != 1) {
                return false
            }
            else {
                if (element.page > 0) {
                    setCurrentIndex(currentIndex + 1)
                }
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
            setNewArrayValue(data)
            setSummOfObtainedMarks(maximum)
        } else {
            //set Data of Other sheet except of marksObtained and maxMarks wala
            setNewArrayValue(data)
        }

        //get student Id
        ocrLocalResponse.layout.cells.filter((element) => {
            student_ID.forEach((e) => {
                if (element.format.name == e) {
                    setStudentID(element.consolidatedPrediction)
                    setMultipageStdId(element.consolidatedPrediction)
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

        let cellOmrValidation = validateCellOMR(true)
        const duplicate = checkStdRollDuplicate.some((item) => studentId == item)

        if (duplicate) {
            duplication = true
        } else {
            duplication = false
        }
        if (omrMark) {
            showErrorMessage(Strings.omr_mark_should_be)
        }
        else if (cellOmrValidation[0]) {
            showErrorMessage(`omr value should be 0 to ${cellOmrValidation[1] + 1}`)
        }
        else if (duplication) {
            Alert.alert(Strings.Student_ID_Shouldnt_be_duplicated)
        }
        else if (disable) {
            showErrorMessage(Strings.please_correct_marks_data)
        }
        else if (validCell) {
            showErrorMessage(Strings.please_correct_marks_data)
        }
        else if (!studentValid && !toggleCheckBox) {
            showErrorMessage(Strings.please_correct_student_id)
            setStdErr(Strings.please_correct_student_id)
        }
        else {
            if (currentIndex + 1 <= stdRollArray.length - 1) {

                let toggle = structureList[currentIndex + 1].hasOwnProperty("isNotAbleToSave") ? structureList[currentIndex + 1].isNotAbleToSave : false
                setToggleCheckBox(toggle)

                //for student validataion

                ocrLocalResponse.layout.cells.forEach(element => {

                    if (element.cellId == stdRollArray[currentIndex].cellId) {
                        element.consolidatedPrediction = studentId

                        structureList.forEach((el, index) => {
                            if (currentIndex == index) {
                                el.RollNo = studentId,
                                    el.isNotAbleToSave = toggleCheckBox ? toggleCheckBox : false
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
                let chkSkip = 0
                ocrLocalResponse.layout.cells.forEach(element => {

                    if (element.cellId == stdRollArray[currentIndex].cellId) {
                        element.consolidatedPrediction = studentId

                        structureList.forEach((el, index) => {
                            if (currentIndex == index) {
                                el.RollNo = studentId
                                el.isNotAbleToSave = toggleCheckBox
                            }
                            if (el.isNotAbleToSave) {
                                chkSkip = chkSkip + 1
                            }
                        });

                    }
                });
                if (chkSkip == structureList.length) {
                    showErrorMessage(Strings.please_select_at_least_one_student)
                } else {
                    dispatch(OcrLocalResponseAction(JSON.parse(JSON.stringify(ocrLocalResponse))))
                    saveMultipleStudentDataSheet()

                }
            }
        }
    }


    const saveMultipleStudentDataSheet = () => {
        if (isMultipleStudent && nextBtn === Strings.submit_text) {
            saveMultiData()
        }
    }

    const callTagArrayData = (formatName) =>{
        let tagArray = []
        studentsAndExamData.data.exams[0].questions.filter((element,i) => {
            element.tags.filter((value)=>{
                if (value.hasOwnProperty("questionId") && value.questionId.trim() == formatName.trim() && value.selected) {
                    tagArray.push(value.tagName)
                    value.selected = false
                }
            })
        });
        return tagArray
    }

    const saveMultiData = async () => {

        let storeTrainingData = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name.slice(0, multipleStudent[0].length) == multipleStudent[0]) {
                return true
            }
        })
        let stdMarkInfo = []


        structureList.forEach((el, index) => {
            if (!el.isNotAbleToSave) {
                let stdTotalMarks = 0
                let stdData = {
                    "studentId": '',
                    "predictedStudentId": loginData.data.school.storeTrainingData ? storeTrainingData[index].studentIdPrediction : '',
                    "predictionConfidence": loginData.data.school.storeTrainingData ? storeTrainingData[index].studentIdPrediction != el.RollNo ? storeTrainingData[index].predictionConfidence : [] : [],
                    "section": filteredData.section,
                    "marksInfo": '',
                    "securedMarks": stdTotalMarks,
                    "totalMarks": 0,
                    "studentAvailability": true
                }

                stdData.studentId = el.RollNo
                let putTrainingData = loginData.data.school.storeTrainingData ? stdData.studentIdTrainingData = storeTrainingData.length > 0 ? el.RollNo != storeTrainingData[index].studentIdPrediction ? storeTrainingData[index].trainingDataSet : [] : [] : ''


                let stdMarks_info = []

                el.data.forEach((value, i) => {

                    let tagArrayData = ''
                    if ( loginData.data.school.hasOwnProperty("tags") && loginData.data.school.tags) {
                         tagArrayData = callTagArrayData(value.format.name)
                    }

                    let marks_data = {
                        "questionId": '',
                        "obtainedMarks": '',
                        "predictedMarks": loginData.data.school.storeTrainingData ? value.predictedMarks : "",
                        "predictionConfidence": loginData.data.school.storeTrainingData ? value.predictionConfidence : "",
                    }
                    if (loginData.data.school.hasOwnProperty("tags") && loginData.data.school.tags) {
                        marks_data.tags = tagArrayData
                    }
                    let putTrainingData = loginData.data.school.storeTrainingData ? marks_data.trainingData = value.consolidatedPrediction != value.predictedMarks ? value.trainingDataSet : [] : ''
                    marks_data.questionId = value.format.name,
                        marks_data.obtainedMarks = value.consolidatedPrediction
                    stdTotalMarks = Number(stdTotalMarks) + Number(value.consolidatedPrediction)
                    stdMarks_info.push(marks_data)

                })

                stdData.securedMarks = stdTotalMarks
                stdData.marksInfo = stdMarks_info
                stdMarkInfo.push(stdData)
            }

        })


        let saveObj = {
            "classId": filteredData.class,
            "examDate": filteredData.examDate,
            "subject": filteredData.subject,
            "studentsMarkInfo": stdMarkInfo
        }
        saveAndFetchFromLocalStorag(saveObj)
    }


    function updateInsertStudentData(array, element, getDataFromLocal, index, i, saveObj, k) { // (1)
        const result = array[0].studentsMarkInfo.findIndex(_element => _element.studentId === element.studentId);
        if (result > -1) {
            getDataFromLocal[index].studentsMarkInfo[result] = element; // (2)
        }
        else {
            getDataFromLocal[index].studentsMarkInfo.push(saveObj.studentsMarkInfo[k])
        }
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

                let result = -1
                if (saveObj.studentsMarkInfo.length > 0 && isMultipleStudent) {
                    saveObj.studentsMarkInfo.forEach((value) => {
                        result = filterData[0].studentsMarkInfo.findIndex(_element => _element.studentId === value.studentId);
                    })
                }


                if (totalLenOfStudentsMarkInfo <= studentLimitSaveInLocal || result > -1) {
                    if (filterData) {

                        getDataFromLocal.forEach((e, index) => {

                            let findSection = false
                            findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)

                            if (filteredData.class == e.classId && e.examDate == filteredData.examDate && e.subject == filteredData.subject && findSection) {


                                e.studentsMarkInfo.forEach((element, i) => {

                                    let findStudent = !isMultipleStudent && e.studentsMarkInfo.filter(o => {
                                        if (i < saveObj.studentsMarkInfo.length) {
                                            if (o.studentId == studentId) {
                                                return true;
                                            }
                                        }
                                    })


                                    if (!isMultipleStudent && findStudent.length > 0 && saveObj.studentsMarkInfo.length > 0) {
                                        getDataFromLocal[index].studentsMarkInfo[i] = saveObj.studentsMarkInfo[0]
                                    }
                                    else if (isMultipleStudent) {

                                        if (saveObj.studentsMarkInfo.length > 0 && i < saveObj.studentsMarkInfo.length) {
                                            saveObj.studentsMarkInfo.forEach((element, k) => {
                                                updateInsertStudentData(filterData, element, getDataFromLocal, index, i, saveObj, k);
                                            })
                                        }
                                    }
                                    else if (saveObj.studentsMarkInfo.length > 0 && i <= 0) {
                                        getDataFromLocal[index].studentsMarkInfo.push(saveObj.studentsMarkInfo[0])
                                    }

                                });
                            }

                        });
                        if (bgFlag) {
                            Alert.alert(Strings.auto_sync_in_progress_please_wait)
                        } else {
                            setScannedDataIntoLocal(getDataFromLocal)
                            goToMyScanScreen()
                        }
                    }
                } else {
                    Alert.alert(Strings.you_can_save_only_limited_student_In_Order_to_continue_have_to_save_first)
                }

            } else if (saveObj.studentsMarkInfo.length <= studentLimitSaveInLocal) {
                let data = getDataFromLocal.push(saveObj)
                setScannedDataIntoLocal(getDataFromLocal)
                goToMyScanScreen()
            }

        } else if (saveObj.studentsMarkInfo.length <= studentLimitSaveInLocal) {
            setScannedDataIntoLocal([saveObj])
            goToMyScanScreen()
        } else {
            Alert.alert(Strings.you_can_save_only_limited_student_In_Order_to_continue_have_to_save_first)
        }
    }


    const goBackFrame = () => {
        if (currentIndex - 1 >= 0) {
            let std = structureList[currentIndex - 1].RollNo
            let toggle = structureList[currentIndex - 1].isNotAbleToSave
            const index = checkStdRollDuplicate.indexOf(std);
            if (index > -1) {
                checkStdRollDuplicate.splice(index, 1);
            }
            setCheckStdRollDuplicate(checkStdRollDuplicate)
            setToggleCheckBox(toggle)
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

    const lengthAccordingSheet = (element) => {
        if (isMultipleStudent) {
            return 2
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

    const validateCellOMR = (isMultiple) => {
        let validationCellOmr = false
        let totalRois = 0
        newArrayValue.forEach((element, index) => {
            element.rois.forEach((data) => {
                if (data.extractionMethod == CELL_OMR) {
                    totalRois = isMultiple ? element.rois.length : element.rois.length - 1
                    if (totalRois < element.consolidatedPrediction) {
                        validationCellOmr = true
                    }
                }
            })
        });
        return [validationCellOmr, totalRois]
    }


    const onSubmitClick = async () => {
        let validCell = false
        for (let i = 0; i < newArrayValue.length; i++) {
            if (newArrayValue[i].consolidatedPrediction === '') {
                validCell = true
            }
        }

        let cellOmrValidation = validateCellOMR(false)


        if (disable || validCell) {
            showErrorMessage(Strings.please_correct_marks_data)
        }
        else if (cellOmrValidation[0]) {
            showErrorMessage(`omr value should be 0 to ${cellOmrValidation[1]}`)
        }
        else if (!studentValid && !toggleCheckBox) {
            showErrorMessage(Strings.please_correct_student_id)
        }
        else if(isStudentValid){
            showErrorMessage(Strings.student_id_should_be_same)
        }
        else {
            if (sumOfObtainedMarks > 0) {

                let elements = neglectData

                //remove maxMark and Obtained marks from the newArrayValue
                let extract_MAX_OBTAINED_MARKS = newArrayValue.filter((e) => {
                    if (e.format.name == elements[2]) {
                        return
                    }
                    if (e.format.name == elements[3]) {
                        return
                    }
                    else {
                        return true
                    }
                })
                //DO summ of all result from extract_MAX_OBTAINED_MARKS except max marks and obtained marks
                let maximum = 0;
                let sum = extract_MAX_OBTAINED_MARKS.forEach((e) => {
                    maximum = parseInt(maximum) + parseInt(e.consolidatedPrediction)
                    return maximum
                });
                console.log("sumOfObtained", maximum);
                if (maximum != totalMarkSecured) {
                    setObtnMarkErr(true)
                    showErrorMessage("Sum Of All obtained marks should be equal to marksObtained")
                }
                else if (maxMarksTotal < maximum) {
                    setObtnMarkErr(false)
                    showErrorMessage("Total mark should be less than or equal to Maximum marks")
                    setMaxMarkErr(true)
                }
                else {
                    setMaxMarkErr(false)
                    setObtnMarkErr(false)
                    if (multiPage > 0) {
                        let isAbleToGoNextPage = currentIndex + 1 <= multiPage;
                        if (isAbleToGoNextPage) {
                            openCameraActivity();
                        } else {
                            saveMultiPageIntoLocalStorage();
                        }
                    } else {
                        saveData(maximum)
                    }
                }
            } else {
                //without MAX & OBTAINED MARKS
                if (multiPage > 0) {
                    let isAbleToGoNextPage = currentIndex + 1 <= multiPage;
                    if (isAbleToGoNextPage) {
                        openCameraActivity();
                    } else {
                        saveMultiPageIntoLocalStorage();
                    }
                } else {
                    saveData(0)
                }
            }
        }
    }

    const goNextPage = () => {
        onSubmitClick()
    }

    const scanNextSheet = (roisData) => {
        const elements = neglectData;

        let filterDataAccordingPage = roisData.layout.cells.filter((element) => {
            if (element.format.name == elements[0] || element.format.name == elements[1] || element.format.name == elements[4] || element.page != currentIndex + 1) {
                return false
            }
            else {
                return true
            }
        })
        if (filterDataAccordingPage.length > 0) {
            setNextBtn(`Scan Page#${currentIndex + 2}`)
            setCurrentIndex(currentIndex + 1)
            setBtnName(Strings.Back)
            setNewArrayValue(filterDataAccordingPage)
            if (currentIndex + 1 == multiPage) {
                setNextBtn(Strings.submit_text)
            }
        }
    }


    const saveMultiPageIntoLocalStorage = () => {
        let totalMarks = 0
        if (sumOfObtainedMarks > 0) {
            totalMarks = sumOfAllObtainedMarks();
        } else {
            totalMarks = 0
        }

        saveData(totalMarks);
    }

    const sumOfAllObtainedMarks = () => {

        const elements = neglectData

        let extract_MAX_OBTAINED_MARKS = ocrLocalResponse.layout.cells.filter((e) => {
            if (e.format.name == elements[0]) {
                return
            }
            if (e.format.name == elements[2]) {
                return
            }
            if (e.format.name == elements[3]) {
                return
            }
            else {
                return true
            }
        })
        //DO summ of all result from extract_MAX_OBTAINED_MARKS except max marks and obtained marks and rollNumber
        let maximum = 0;
        let sum = extract_MAX_OBTAINED_MARKS.forEach((e) => {
            maximum = parseInt(maximum) + parseInt(e.consolidatedPrediction)
            return maximum
        });

        return maximum;
    }

    const goBackPage = () => {
        
        if (currentIndex - 1 >= 1) {
            if (!studentValid && !toggleCheckBox) {
                showErrorMessage(Strings.please_correct_student_id)
            }
            else if (isStudentValid){
                showErrorMessage(Strings.student_id_should_be_same)
            } else {
                setNextBtn(`Scan Page#${currentIndex}`)
                const elements = neglectData;
                let filterDataAccordingPage = ocrLocalResponse.layout.cells.filter((element) => {
                    if (element.format.name == elements[0] || element.format.name == elements[1] || element.format.name == elements[4] || element.page != currentIndex - 1) {
                        return false
                    }
                    else {
                        return true
                    }
                })
                setNewArrayValue(filterDataAccordingPage)
                setCurrentIndex(currentIndex - 1)
                if (currentIndex - 1 == 1) {
                    setBtnName(Strings.cancel_text)
                }
            }
        } else {
            onBackButtonClick()
            dispatch(MultiPageActions([]))
        }
    }


    const saveData = async (sumOfAllMarks) => {
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
            
            let tagArrayData = ''
            if ( loginData.data.school.hasOwnProperty("tags") && loginData.data.school.tags) {
                tagArrayData = callTagArrayData(e.format.name)
            }
            let data = {
                "questionId": e.format.name,
                "obtainedMarks": e.consolidatedPrediction,
                "predictedMarks": loginData.data.school.storeTrainingData ? e.predictedMarks : '',
                "predictionConfidence": loginData.data.school.storeTrainingData ? e.consolidatedPrediction != e.predictedMarks ? e.predictionConfidence : '' : '',
                
            }

            if (loginData.data.school.hasOwnProperty("tags") && loginData.data.school.tags) {
                data.tags = tagArrayData
            }

            if (loginData.data.school.storeTrainingData && e.hasOwnProperty("trainingDataSet")) {
                data.trainingData = e.consolidatedPrediction != e.predictedMarks ? e.trainingDataSet : []
            }
            objects.push(data)
        })

        let storeTrainingData = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name == elements[0]) {
                return true
            }
        })

        let maxObtainedTrainingData = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name === elements[2] || element.format.name === elements[3]) {
                return true
            }
        })

        let Studentmarks = objects;

        let saveObj = {
            "classId": filteredData.class,
            "examDate": filteredData.examDate,
            "subject": filteredData.subject,
            "studentsMarkInfo": [
                {
                    "predictedStudentId": loginData.data.school.storeTrainingData ? storeTrainingData[0].studentIdPrediction : '',
                    "predictionConfidence": loginData.data.school.storeTrainingData ? storeTrainingData[0].studentIdPrediction != studentId ? storeTrainingData[0].predictionConfidence : [] : [],
                    "section": filteredData.section,
                    "studentId": studentId,
                    "securedMarks": sumOfAllMarks > 0 ? sumOfAllMarks : 0,
                    "totalMarks": maxMarksTotal > 0 ? maxMarksTotal : 0,
                    "marksInfo": Studentmarks,
                    "studentAvailability": true
                }
            ]
        }

        if (maxObtainedTrainingData.length > 0 && loginData.data.school.storeTrainingData && maxObtainedTrainingData[0].format.name == elements[3]) {
            saveObj.studentsMarkInfo[0].maxMarksTrainingData = maxObtainedTrainingData[0].predictedMarks != maxMarksTotal ? maxObtainedTrainingData[0].trainingDataSet : []
            saveObj.studentsMarkInfo[0].maxMarksPredicted = maxObtainedTrainingData[0].predictedMarks,
                saveObj.studentsMarkInfo[0].maxMarksConfidence = maxObtainedTrainingData[0].predictedMarks != maxMarksTotal ? maxObtainedTrainingData[0].predictionConfidence : []

        }
        if (maxObtainedTrainingData.length > 0 && loginData.data.school.storeTrainingData && maxObtainedTrainingData[1].format.name == elements[2]) {
            saveObj.studentsMarkInfo[0].obtainedMarksTrainingData = maxObtainedTrainingData[1].predictedMarks != sumOfAllMarks ? maxObtainedTrainingData[1].trainingDataSet : []
            saveObj.studentsMarkInfo[0].obtainedMarksPredicted = maxObtainedTrainingData[1].predictedMarks
            saveObj.studentsMarkInfo[0].obtainedMarksConfidence = maxObtainedTrainingData[1].predictedMarks != sumOfAllMarks ? maxObtainedTrainingData[1].predictionConfidence : []
        }

        let putTrainingData = loginData.data.school.storeTrainingData ? saveObj.studentsMarkInfo[0].studentIdTrainingData = storeTrainingData.length > 0 ? storeTrainingData[0].studentIdPrediction != studentId || (storeTrainingData[0].studentIdPrediction != studentId && multiPage > 0) ? storeTrainingData[0].trainingDataSet : [] : [] : ''
        if (toggleCheckBox) {
            saveObj.studentsMarkInfo = []
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

    const openCameraActivity = async () => {
        try {

            SaralSDK.startCamera(JSON.stringify(ocrLocalResponse), (currentIndex + 1).toString()).then(res => {
                let roisData = JSON.parse(res);
                let cells = roisData.layout.cells;
                consolidatePrediction(cells, roisData)

            }).catch((code, message) => {
            })
        } catch (err) {
        }
    };

    const consolidatePrediction = (cells, roisData) => {
        var marks = "";
        var predictionConfidenceArray = []
        for (let i = 0; i < cells.length; i++) {
            marks = ""
            predictionConfidenceArray = []
            for (let j = 0; j < cells[i].rois.length; j++) {

                marks = marks + cells[i].rois[j].result.prediction,
                    predictionConfidenceArray.push(cells[i].rois[j].result.confidence)
            }
            if (roiData.data.layout.hasOwnProperty("pages") && cells[i].page == currentIndex + 1 || roisData.layout.cells[i].format.value === neglectData[0] || roisData.layout.cells[i].format.name.length - 3 == neglectData[0].length) {
                roisData.layout.cells[i].consolidatedPrediction = marks
            }
            roisData.layout.cells[i].predictionConfidence = predictionConfidenceArray
            if (roisData.layout.cells[i].format.value === neglectData[0] || roisData.layout.cells[i].format.name.length - 3 == neglectData[0].length) {
                roisData.layout.cells[i].studentIdPrediction = marks
            } else {
                roisData.layout.cells[i].predictedMarks = marks
            }
        }

        dispatch(OcrLocalResponseAction(JSON.parse(JSON.stringify(roisData))))
        let rollNumber = roisData.layout.cells[0].consolidatedPrediction
        if (rollNumber != studentId) {
            setStudentID(rollNumber);
            scanNextSheet(roisData);
            setIsStudentValid(true);
        }else {
            setStudentID(rollNumber)
            setStdErr("");
            scanNextSheet(roisData);
            setIsStudentValid(false);
        }
    }

    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ backgroundColor: AppTheme.BACKGROUND_COLOR, paddingBottom: '15%' }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <ShareComponent
                        navigation={navigation}
                        message={logmessage ? JSON.stringify(logmessage, null, 2) : ''}
                    />
                    {
                        !summary &&
                        <View>
                            <View style={styles.container1}>
                                <Text style={styles.header1TextStyle}>
                                    {Strings.complete_these_steps_submit_marks}
                                </Text>
                            </View>
                            <View style={styles.container2}>
                                <View style={{ flex: 1 }}>
                                    <ScrollView contentContainerStyle={{ backgroundColor: AppTheme.WHITE, paddingBottom: '15%' }} keyboardShouldPersistTaps={'handled'}>
                                        <Text style={styles.studentDetailsTxtStyle}>{BrandLabel && BrandLabel.StudentDetail ? BrandLabel.StudentDetail : Strings.student_details}</Text>
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
                                                        labelText={BrandLabel && BrandLabel.StudentId ? BrandLabel.StudentId : Strings.student_id}
                                                        errorField={stdErr != '' || isNaN(studentId)}
                                                        // errorText={BrandLabel && BrandLabel.CorrectId ? stdErr != '' ? stdErr : BrandLabel.CorrectId : stdErr != '' ? stdErr : Strings.please_correct_student_id}
                                                        errorText={ stdErr != '' ? stdErr : Strings.please_correct_student_id}
                                                        onChangeText={(text) => {
                                                            setStudentID(text)
                                                            if (currentIndex == 1 && multiPage > 0) {
                                                                setMultipageStdId(text)
                                                            }
                                                        }}
                                                        value={studentId}
                                                        editable={edit}
                                                        keyboardType={'numeric'}
                                                    />
                                                    <Text style={styles.nameTextStyle}>{BrandLabel && BrandLabel.Exam ? BrandLabel.Exam : Strings.Exam} : {filteredData.subject} {filteredData.examDate} ({filteredData.examTestID})</Text>
                                                    {
                                                        isMultipleStudent
                                                            ?
                                                            <Text style={styles.nameTextStyle}>{Strings.page_no + ': ' + (currentIndex + 1)}</Text>
                                                            :
                                                            ocrLocalResponse.layout.pages > 0
                                                                ?
                                                                <Text style={styles.nameTextStyle}>{Strings.page_no + ': ' + (currentIndex)}</Text>
                                                                :
                                                                null
                                                    }
                                                    {
                                                        isMultipleStudent
                                                        &&
                                                        <View style={styles.row}>
                                                            <Text style={styles.nameTextStyle}>{Strings.skip}</Text>
                                                            <CheckBox
                                                                tintColors={{ true: '#000', false: '#000' }}
                                                                disabled={false}
                                                                value={toggleCheckBox}
                                                                onValueChange={(newValue) => {
                                                                    if (newValue) {
                                                                        setStdErr('')
                                                                    } else {
                                                                        validateStudentId(studentId)
                                                                    }
                                                                    setToggleCheckBox(newValue)
                                                                }}
                                                            />
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>


                                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                                {
                                                    BrandLabel && BrandLabel.ListTableHeading[0] ?
                                                        BrandLabel.ListTableHeading.map((data) => {
                                                            return (
                                                                <MarksHeaderTable
                                                                    customRowStyle={{ width: '30%', backgroundColor: AppTheme.TABLE_HEADER }}
                                                                    key={data}
                                                                    rowTitle={data}
                                                                    rowBorderColor={AppTheme.TAB_BORDER}
                                                                    editable={false}
                                                                />
                                                            )
                                                        })
                                                        :
                                                        loginData.data.school.tags
                                                        ?
                                                        TABLE_HEADER_WITH_TAG.map((data) => {
                                                            return (
                                                                <MarksHeaderTable
                                                                    customRowStyle={{ width: '25%', backgroundColor: AppTheme.TABLE_HEADER }}
                                                                    key={data}
                                                                    rowTitle={data}
                                                                    rowBorderColor={AppTheme.TAB_BORDER}
                                                                    editable={false}
                                                                />
                                                            )
                                                        })
                                                        : 
                                                        TABLE_HEADER.map((data) => {
                                                            return (
                                                                <MarksHeaderTable
                                                                    customRowStyle={{ width: '30%', backgroundColor: AppTheme.TABLE_HEADER }}
                                                                    key={data}
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
                                                        <View element={element} key={index} style={{ flexDirection: 'row' }}>

                                                            <MarksHeaderTable
                                                                customRowStyle={{ width: loginData.data.school.tags ? '25%' : '30%', }}
                                                                rowTitle={renderSRNo(element, index)}
                                                                rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                                                editable={false}
                                                                keyboardType={'number-pad'}
                                                            />
                                                            <MarksHeaderTable
                                                                customRowStyle={{ width: loginData.data.school.tags ? '25%' : '30%', }}
                                                                rowTitle={element.format.value}
                                                                rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                                                editable={false}
                                                                keyboardType={'number-pad'}
                                                            />
                                                            <MarksHeaderTable
                                                                customRowStyle={{ width: loginData.data.school.tags ? '25%' : '30%', }}
                                                                rowTitle={element.consolidatedPrediction}
                                                                rowBorderColor={markBorderOnCell(element)}
                                                                editable={true}
                                                                keyboardType={'number-pad'}
                                                                maxLength={lengthAccordingSheet(element)}
                                                                onChangeText={(text) => {
                                                                    handleTextChange(text.trim(), index, newArrayValue, element)
                                                                }}

                                                            />
                                                        {
                                                            loginData.data.school.tags
                                                            &&
                                                            <MarksHeaderTable
                                                                customRowStyle={{ width: '25%', }}
                                                                rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                                                editable={false}
                                                                icon={true}
                                                                setIsModalVisible={setIsModalVisible}
                                                                setTagData={setTagData}
                                                                index={index}
                                                                rowTitle={element.format.name}
                                                                studentsAndExamData={studentsAndExamData}
                                                                setQuestionIdData={setQuestionIdData}
                                                            />
                                                        }

                                                        </View>
                                                    )
                                                    // }
                                                })
                                            }

                                            <View style={[styles.viewnxtBtnStyle1, { paddingTop: '7%' }]}>
                                                <ButtonComponent
                                                    customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE, marginTop: '5%' }]}
                                                    btnText={btnName.toUpperCase()}
                                                    onPress={() => isMultipleStudent ? goBackFrame() : multiPage > 0 ? goBackPage() : onBackButtonClick()}
                                                />
                                                <ButtonComponent
                                                    customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE, marginTop: '5%' }]}
                                                    btnText={nextBtn.toUpperCase()}
                                                    onPress={() => isMultipleStudent ? goNextFrame() : multiPage > 0 ? goNextPage() : onSubmitClick()}
                                                />
                                            </View>
                                    </ScrollView>
                                </View>

                            </View>
                        </View>
                    }



                    {isLoading && <Spinner animating={isLoading} iconShow={false} />}
                    <TaggingModal 
                        setIsModalVisible={setIsModalVisible} 
                        isModalVisible={isModalVisible} 
                        tagData={tagData} 
                        setTagData={setTagData}
                        studentsAndExamData={studentsAndExamData}
                        bgColor={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
                        questionIdData={questionIdData}
                    />
                </ScrollView>
            </View>
        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse.response,
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanTypeData: state.scanTypeData.response,
        roiData: state.roiData.response,
        multiBrandingData: state.multiBrandingData.response.data,
        scanedData: state.scanedData.response,
        bgFlag: state.bgFlag,
        multiPageReducer: state.multiPage.response,
        studentsAndExamData: state.studentsAndExamData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        OcrLocalResponseAction: OcrLocalResponseAction,
        MultiPageActions: MultiPageActions
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannedDetailsComponent);
