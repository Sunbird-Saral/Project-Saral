import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, ToastAndroid, Alert, Image, TouchableOpacity, PermissionsAndroid,Dimensions } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import AppTheme from '../../utils/AppTheme';
import { CELL_OMR, extractionMethod, multipleStudent, MULTIPLE_TAG_DATAS,dispatchCustomModalMessage, dispatchCustomModalStatus,monospace_FF , neglectData, SCAN_TYPES, studentLimitSaveInLocal, student_ID, TABLE_HEADER, TABLE_HEADER_WITH_TAG,defaultHeaderTable } from '../../utils/CommonUtils';
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

const { width, height } = Dimensions.get('window')
const ScannedDetailsComponent = ({
    navigation,
    filteredData,
    ocrLocalResponse,
    multiBrandingData,
    scanedData,
    loginData,
    bgFlag,
    roiData,
    studentsAndExamData,
    minimalFlag
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
    const [stdAddRollData, setStdAddRollData] = useState([])
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [logmessage, setLogmessage] = useState()
    const [multiPage, setMultiPage] = useState(0)
    const [isModalVisible ,setIsModalVisible] = useState(false)
    const [tagData ,setTagData] = useState([])
    const [questionIdData ,setQuestionIdData] = useState()
    const [omrResultErr, setOmrResult] = useState()
    const [isOmrOptions, setOmrOptions] = useState(false)
    const [isAlphaNumeric, setIsAlphaNumeric] = useState(false)
    const [filterData, setFilterData] = useState({data: [], len: 0})
    

    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.scannedDetailComponent[0]
    const defaultValidateError = ocrLocalResponse.layout && ocrLocalResponse.layout.resultValidation && ocrLocalResponse.layout.resultValidation.validate.errorMsg
    const defaultValidateExp = ocrLocalResponse.layout && ocrLocalResponse.layout.resultValidation && ocrLocalResponse.layout.resultValidation.validate.regExp
    const studentIdErrorMsg = ocrLocalResponse.layout && ocrLocalResponse.layout.idValidation && ocrLocalResponse.layout.idValidation.validate.errorMsg
    let consolidated =ocrLocalResponse.layout.cells[0]&& ocrLocalResponse.layout.cells[0].consolidatedPrediction.length
    const idValidateExp = ocrLocalResponse.layout && ocrLocalResponse.layout.idValidation && ocrLocalResponse.layout.idValidation.validate.regExp
    const jsonLabels = ocrLocalResponse.layout && ocrLocalResponse.layout.resultScreenLabels
    const listbrandlabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.scannedDetailComponent[0] && multiBrandingData.screenLabels.scannedDetailComponent[0].ListTableHeading[0]
    
    let regexExp = idValidateExp
    let number = studentId;
    let regex = new RegExp(regexExp)
    let result = regex.test(number);

    const studentIdLength = consolidated+1

    const inputRef = React.createRef();
    const dispatch = useDispatch()

    useEffect(async () => {
        let message = await getErrorMessage()
        setLogmessage(message)
    }, []);


    useEffect(() => {
        if (!minimalFlag) {
            validateStudentId(studentId)
        }else{
            setStudentValid(true)
        }
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

        if (result == false && studentId != undefined && studentId.length > consolidated) {
            showErrorMessage(studentIdErrorMsg)

        }

        if(studentId == 0 || studentId == '' && isMultipleStudent){
            setToggleCheckBox(true)
        }else{
            setToggleCheckBox(false)
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
                        if (element.format.name.replace(/[0-9]/g, '') == e) {
                            element.consolidatedPrediction = value
                            setMultipageStdId(element.consolidatedPrediction)
                        }
                    })
                })
            }
        }
        else if (a.length > 0 ) {
            setStudentValid(true)
            setStdErr('')
            setStudentDATA(a)
            if (!isMultipleStudent) {
                //set student Id
                ocrLocalResponse.layout.cells.forEach((element) => {
                    student_ID.forEach((e) => {
                        if (element.format.name.replace(/[0-9]/g, '') == e) {
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
        let checkRoLLNumberExist = ocrLocalResponse.layout.hasOwnProperty("identifierPrefix") ? ocrLocalResponse.layout.identifierPrefix : ocrLocalResponse.layout.cells[0].format.name.replace(/[0-9]/g, '') == multipleStudent[0] ? multipleStudent[0] : neglectData[0]
        let checkIsStudentMultipleSingle = ocrLocalResponse.layout.cells.filter((e) => {
            let withNoDigits = e.format.name.replace(/[0-9]/g, '');
            let wordLen = withNoDigits.length;
            let multiple = 0
            if (wordLen === checkRoLLNumberExist.length && withNoDigits === checkRoLLNumberExist) {
                multiple = multiple + 1
            }
            return multiple
        })

        let filterWithZeroStudentData = ocrLocalResponse.layout.cells.filter((e) => {
            let withNoDigits = e.format.name.replace(/[0-9]/g, '');
            let wordLen = withNoDigits.length;
            let multiple = 0
            if (wordLen === checkRoLLNumberExist.length && withNoDigits === checkRoLLNumberExist) {
                multiple = multiple + 1
            }
            return multiple
        })


        if(ocrLocalResponse.layout.cells[1].rois[0].extractionMethod == "BLOCK_ALPHANUMERIC_CLASSIFICATION"){
            setIsAlphaNumeric(true)
        }
     
        if (ocrLocalResponse.layout.hasOwnProperty("pages") && ocrLocalResponse.layout.pages > 0) {
            setMultiPage(ocrLocalResponse.layout.pages)
            setNextBtn("SCAN PAGE #2")
        }

        if (checkIsStudentMultipleSingle.length > 1) {
            let findNonZeroRollStd = ocrLocalResponse.layout.cells.filter((e) => {
                let withNoDigits = e.format.name.replace(/[0-9]/g, '');
                let wordLen = withNoDigits.length;
                let multiple = 0
                if (wordLen === checkRoLLNumberExist.length && withNoDigits === checkRoLLNumberExist && (e.consolidatedPrediction) != 0) {
                    multiple = multiple + 1
                }
                return multiple
            })

            setNextBtn("NEXT")
            setStdRollArray(findNonZeroRollStd)
            setIsmultipleStudent(true)
            callMultipleStudentSheetData(filterWithZeroStudentData)
        } else {
            let checkIsOmrOption = ocrLocalResponse.layout.cells[1].hasOwnProperty("omrOptions") ? true : false
            setOmrOptions(checkIsOmrOption)
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

       let removeZeroRollStd = marTemp.filter((data, i) => { 
            if ((data.RollNo) != 0) {
                return true
            }
        })

        if (removeZeroRollStd.length != 0) {
            setStudentID(removeZeroRollStd[0].RollNo)
            setNewArrayValue(removeZeroRollStd[0].data)
            setStructureList(removeZeroRollStd)
        } else {
            goToMyScanScreen()
            setTimeout(() => {
                callCustomModal(Strings.message_text, Strings.student_id_should_not_blank,false);
            }, 1000);
        }



    }

    const callCustomModal = (title, message, isAvailable, cancel) => {
        let data = {
            title: title,
            message: message,
            isOkAvailable: isAvailable,
            isCancel : cancel
        }
        dispatch(dispatchCustomModalStatus(true));
        dispatch(dispatchCustomModalMessage(data));
    }

    const callSingleStudentSheetData = () => {
        let data = ''
        let elements = neglectData;
        let indexArray = [];

        let checkRoLLNumberExist = ocrLocalResponse.layout.hasOwnProperty("identifierPrefix") ? ocrLocalResponse.layout.identifierPrefix : ocrLocalResponse.layout.cells[0].format.name.replace(/[0-9]/g, '') == multipleStudent[0] ? multipleStudent[0] : neglectData[0]
        let checkIsStudentMultipleSingle = ocrLocalResponse.layout.cells.filter((e) => {
            let withNoDigits = e.format.name.replace(/[0-9]/g, '');
            let wordLen = withNoDigits.length;
            let multiple = 0
            if (wordLen === checkRoLLNumberExist.length && withNoDigits === checkRoLLNumberExist) {
                multiple = multiple + 1
            }
            return multiple
        });

        if (checkIsStudentMultipleSingle.length == 1) {
            data = ocrLocalResponse.layout.cells.filter((element) => {
                if (element.format.name.replace(/[0-9]/g, '') == checkRoLLNumberExist || element.format.name == elements[1] || element.format.name == elements[4] || element.page && element.page != 1) {
                    return false
                } else {
                if (element.page > 0) {
                    setCurrentIndex(currentIndex + 1)
                }
                return true
            }
        })
        } else {
            var hasNonZeroStdId = false;
            ocrLocalResponse.layout.cells.forEach((element, index) => {
                checkIsStudentMultipleSingle.forEach((e, i) => {
                    if (element.format.name === e.format.name) {
                        if (e.consolidatedPrediction != 0) {
                            hasNonZeroStdId = true
                            indexArray.push(index + 1)
                        } else if (hasNonZeroStdId) {
                            indexArray.push(index)
                            hasNonZeroStdId = false
                        }
                    }
                });
            });
            data = ocrLocalResponse.layout.cells.slice(indexArray[0], indexArray[1])
            setFilterData({ data: data, len: checkIsStudentMultipleSingle.length })
        }

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
        for (const element of ocrLocalResponse.layout.cells) {
            if (element.format.name.replace(/[0-9]/g, '') == checkRoLLNumberExist && element.consolidatedPrediction != 0) {
                setStudentID(element.consolidatedPrediction)
                setMultipageStdId(element.consolidatedPrediction)
                break
            }
        }
    }

    const regxValidation = (cellId) => {
        let result
        let regexErrormsg
        for (let i = 0; i < ocrLocalResponse.layout.cells.length; i++) {
            if (ocrLocalResponse.layout.cells[i].cellId == cellId) {
                let consolidated = ocrLocalResponse.layout.cells[i].consolidatedPrediction
                let ocrcells = ocrLocalResponse.layout.cells[i]
                regexErrormsg = ocrcells && ocrcells.validate && ocrcells.validate.errorMsg
                let regexExp = ocrcells && ocrcells.validate && ocrcells.validate.regExp ? ocrcells.validate.regExp : defaultValidateExp
                let number = consolidated;
                let regex = new RegExp(regexExp)
                result = regex.test(number);
                // setOmrResult(regexErrormsg)
                  setOmrResult(defaultValidateError)
                  

            }
        }
        return [result, regexErrormsg]
    }


    const goNextFrame = () => {  
        let regexvalidate = omrValidation()
    
        const addedStd = stdAddRollData.indexOf(studentId);
        var duplication = false;

        if (addedStd > -1 && !toggleCheckBox) {
            duplication = true
        } else {
            duplication = false
            
        }

        if (!toggleCheckBox &&  regexvalidate[0]) {
            showErrorMessage(regexvalidate[1] ? `${regexvalidate[1]}`: defaultValidateError )
        }
        else if (duplication) {
            callCustomModal(Strings.message_text, Strings.Student_ID_Shouldnt_be_duplicated,false);
        }
       
        else if (!studentValid && !toggleCheckBox) {
            showErrorMessage(Strings.please_correct_student_id)
            setStdErr(Strings.please_correct_student_id)
        }
        else {
            if (currentIndex + 1 <= stdRollArray.length - 1) {

                let toggle = structureList[currentIndex + 1].hasOwnProperty("isNotAbleToSave") ? structureList[currentIndex + 1].isNotAbleToSave : false
                setToggleCheckBox(toggle)
                goToTop()
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
                if (toggleCheckBox == false) {
                    setStdAddRollData([...stdAddRollData, studentId])
                }
                dispatch(OcrLocalResponseAction(JSON.parse(JSON.stringify(ocrLocalResponse))))
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

    const showRegexErrorMessage = (value) => {
            let regexValue = regxValidation(value.cellId)
            ocrLocalResponse.layout.cells.forEach(element => {
                if (element.cellId == value.cellId) {
                    if (!regexValue[0]) {
                        showErrorMessage(regexValue[1] ? regexValue[1] : defaultValidateError )
                    }
                }
            })
    }


    const saveMultipleStudentDataSheet = () => {
        if (isMultipleStudent && nextBtn === Strings.submit_text) {
            saveMultiData()
        }
    }

    const callTagArrayData = (formatName) =>{
        let tagArray = []
        for(const element of studentsAndExamData.data.exams){
            if (filteredData.subject === element.subject && element.questions !=null) {
                for(const _el of element.questions) {
                    _el.tags.filter((value) => {
                        if (value.hasOwnProperty("questionId") && value.questionId.trim() == formatName.trim() && value.selected) {
                            tagArray.push(value.tagName)
                            value.selected = false
                        }
                    })

                }
                break;
                }
            }
        return tagArray
    }

    const saveMultiData = async () => {

        let checkRoLLNumberExist = ocrLocalResponse.layout.hasOwnProperty("identifierPrefix") ? ocrLocalResponse.layout.identifierPrefix : ocrLocalResponse.layout.cells[0].format.name.replace(/[0-9]/g, '') == multipleStudent[0] ? multipleStudent[0] : neglectData[0]
        let storeTrainingData = ocrLocalResponse.layout.cells.filter((element) => {

            if (element.format.name.slice(0, checkRoLLNumberExist.length) == checkRoLLNumberExist && element.consolidatedPrediction != 0) {
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
                    "studentAvailability": true,
                }
                if(filteredData.hasOwnProperty("set")){
                    stdData.set = filteredData.set
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
                    marks_data.obtainedMarks = value.consolidatedPrediction? value.consolidatedPrediction : ""
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
            "studentsMarkInfo": stdMarkInfo,
            "examId": filteredData.examTestID,
            "userId": loginData.data.school.schoolId,
           
        }
        if(filteredData.hasOwnProperty("set")){
            saveObj.set = filteredData.hasOwnProperty("set") ? filteredData.set : ""
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

            var filterData = ''
            if (!minimalFlag) {
                filterData = getDataFromLocal.filter((e) => {
                   let findSection = false
                   findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)
   
                   if (filteredData.class == e.classId && e.examDate == filteredData.examDate && e.subject == filteredData.subject && findSection) {
                       return true
                   }
               })
            } else {
                
                 filterData = getDataFromLocal.filter((e) => {
    
                    //In minimal mode need to find organization id as we kept studentId
                    if (e.roiId == roiData.data.roiId && loginData.data.school.hasOwnProperty("offlineMode") & loginData.data.school.offlineMode) {
                        if (loginData.data.school.schoolId == e.key) {
                            return true
                        } else {
                            return false
                            
                        }
                    } else if (e.roiId == roiData.data.roiId) {
                        return true   
                    }
                })

            }



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

                            //In minimal mode need to find organization id as we kept studentId
                            let findRoiID =  false;
                            if (minimalFlag & loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode) {
                                findRoiID = loginData.data.school.schoolId == e.key && e.roiId == roiData.data.roiId
                            } else {
                                findRoiID = e.roiId == roiData.data.roiId
                            }
                            let checkDataExistence = !minimalFlag ? filteredData.class == e.classId && e.examDate == filteredData.examDate && e.subject == filteredData.subject : false
                            if (checkDataExistence && findSection || findRoiID) {


                                e.studentsMarkInfo.forEach((element, i) => {

                                    let findStudent = !isMultipleStudent && e.studentsMarkInfo.filter(o => {
                                        if (i < saveObj.studentsMarkInfo.length) {
                                            if (o.studentId == studentId) {
                                                return true;
                                            }
                                        }
                                    })
                                    let findIndex = !isMultipleStudent && e.studentsMarkInfo.findIndex((o)=> i < saveObj.studentsMarkInfo.length & o.studentId == studentId)


                                    if (!isMultipleStudent && findStudent.length > 0 && saveObj.studentsMarkInfo.length > 0) {
                                        getDataFromLocal[index].studentsMarkInfo[findIndex] = saveObj.studentsMarkInfo[0]
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
                            callCustomModal(Strings.message_text, Strings.auto_sync_in_progress_please_wait, false,false)
                        } else {
                            setScannedDataIntoLocal(getDataFromLocal)
                            goToMyScanScreen()
                        }
                    }
                } else {
                    callCustomModal(Strings.message_text, Strings.you_can_save_only_limited_student_In_Order_to_continue_have_to_save_first, false,false);
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
            const indexStd = stdAddRollData.indexOf(std);

            if (indexStd > -1 & !toggle) {
                stdAddRollData.splice(indexStd, 1);
            }
            if (!toggle) {
                setStdAddRollData(stdAddRollData)
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
            goToTop()
        }
        else {
            onBackButtonClick()
        }
    }

    const renderSRNo = (element, index) => {
            return `${index + 1}`
    }

    const lengthAccordingSheet = (element) => {
        if (isMultipleStudent) {
            return 2
        } else if (element.format.name === neglectData[2] || element.format.name === neglectData[3]) {
            return 4
        } else {
            return 100
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
            newArray[index].consolidatedPrediction = text.length>0&& text > 1 ? 0 : text
            setNewArrayValue(newArray)

            ocrLocalResponse.layout.cells.forEach(element => {

                if (element.cellId == value.cellId) {
                    structureList.forEach(Datas => {
                        //this'll add into OCRLocal
                        element.consolidatedPrediction = text.length<0&&text < 1 ? 0 : text
                        //this'll add in  structurelist
                        Datas.data.forEach((el, index) => {
                            if (el.cellId === value.cellId) {
                                el.consolidatedPrediction = text.length>0&&text > 1 ? 0 : text
                            }
                        });

                    });
                }
            });
            dispatch(OcrLocalResponseAction(ocrLocalResponse))
            let regexValue = regxValidation(value.cellId)
            ocrLocalResponse.layout.cells.forEach(element => {
                if (element.cellId == value.cellId) {
                    if (!regexValue[0] && text.length > 0) {
                        showErrorMessage(regexValue[1] ? regexValue[1] : defaultValidateError)
                    }

                }
            });

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
        const regexValidate = omrValidation()
        if (element.consolidatedPrediction.length == 0 ) {
            return AppTheme.ERROR_RED
        }
        else if (element.format.name == neglectData[2] && obtnmarkErr) {
            return AppTheme.ERROR_RED
        } else if (element.format.name == neglectData[3] && maxmarkErr) {
            return AppTheme.ERROR_RED
        }else if (element.cellId == regexValidate[2]) {
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
        callCustomModal(Strings.message_text, message, false,false)
    }

    const validateCellOMR = (isMultiple) => {
        let validationCellOmr = false
        let totalRois = 0
        newArrayValue.forEach((element, index) => {
            element.rois.forEach((data) => {
                if (data.extractionMethod == CELL_OMR) {
                    totalRois = isMultiple ? element.rois.length : !isMultipleStudent && element.rois.length == 1 ? element.rois.length : element.rois.length - 1
                    let regexValue = regxValidation(element.cellId)
                    if (totalRois < element.consolidatedPrediction) {
                        validationCellOmr = true
                    }
                }
            })
        });
        return [validationCellOmr, totalRois]
    }

    const omrValidation = () =>{
        var result = false
        var regexErrormsg
        var errorMesaage = ""
        var regextResult = false
        var cellId = ""
            for (let j = 0; j < newArrayValue.length; j++) {
                let filter = ocrLocalResponse.layout.cells.filter((el)=> el.cellId == newArrayValue[j].cellId);
                    let consolidated = filter[0].consolidatedPrediction
                    regexErrormsg = filter && filter[0].validate && filter[0].validate.errorMsg
                    let regexExp = filter[0] && filter[0].validate && filter[0].validate.regExp ? filter[0].validate.regExp : defaultValidateExp
                    let number = consolidated;
                    let regex = new RegExp(regexExp)
                    result = regex.test(number);
                    
                    if (!result) {
                        regextResult = !result
                errorMesaage = regexErrormsg
                cellId = newArrayValue[j].cellId
                break;
                }
        }
        return [regextResult, errorMesaage, cellId]
    }

    const onSubmitClick = async () => {
        let regexvalidate = omrValidation()

        if (!studentValid && !toggleCheckBox) {
            showErrorMessage(Strings.please_correct_student_id)
        }
        else if (isStudentValid) {
            showErrorMessage(Strings.student_id_should_be_same)
        }
        else if (regexvalidate[0]) {
            showErrorMessage(regexvalidate[1] ? `${regexvalidate[1]}`: defaultValidateError )
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
                    let consMark = e.consolidatedPrediction == '' ? 0 : e.consolidatedPrediction
                    maximum = parseInt(maximum) + parseInt(consMark)
                    return maximum
                });
                console.log("sumOfObtained", maximum);
                if (maximum != totalMarkSecured) {
                    setObtnMarkErr(true)
                    showErrorMessage(`Sum of all obtained marks should be equal to marks obtained. \n\nSummation Of Obtained Marks : ${maximum}`)
                }
                else if (maxMarksTotal < maximum) {
                    setObtnMarkErr(false)
                    showErrorMessage("Total Obtained marks should be less than or equal to Maximum marks.")
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
            let checkIdentifierExist = ocrLocalResponse.layout.hasOwnProperty("identifierPrefix") ? ocrLocalResponse.layout.identifierPrefix : ocrLocalResponse.layout.cells[0].format.name.replace(/[0-9]/g, '') == multipleStudent[0] ? multipleStudent[0] : neglectData[0]
            if (element.format.name == checkIdentifierExist || element.format.name == elements[1] || element.format.name == elements[4] || element.page != currentIndex + 1) {
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
            let checkIdentifierExist = ocrLocalResponse.layout.hasOwnProperty("identifierPrefix") ? ocrLocalResponse.layout.identifierPrefix : ocrLocalResponse.layout.cells[0].format.name.replace(/[0-9]/g, '') == multipleStudent[0] ? multipleStudent[0] : neglectData[0]
            if (e.format.name == checkIdentifierExist) {
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
                let checkIdentifierExist = ocrLocalResponse.layout.hasOwnProperty("identifierPrefix") ? ocrLocalResponse.layout.identifierPrefix : ocrLocalResponse.layout.cells[0].format.name.replace(/[0-9]/g, '') == multipleStudent[0] ? multipleStudent[0] : neglectData[0]
                let filterDataAccordingPage = ocrLocalResponse.layout.cells.filter((element) => {
                    if (element.format.name == checkIdentifierExist || element.format.name == elements[1] || element.format.name == elements[4] || element.page != currentIndex - 1) {
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
        let checkIdentifierExist = ocrLocalResponse.layout.hasOwnProperty("identifierPrefix") ? ocrLocalResponse.layout.identifierPrefix : ocrLocalResponse.layout.cells[0].format.name.replace(/[0-9]/g, '') == multipleStudent[0] ? multipleStudent[0] : neglectData[0]
        let data = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name.replace(/[0-9]/g, '') == checkIdentifierExist || element.format.name.replace(/[0-9]/g, '') == elements[1] || element.format.name.replace(/[0-9]/g, '') == elements[2] || element.format.name.replace(/[0-9]/g, '') == elements[3]) {
            }
            else {
                return true
            }
        })

        let objects = []
        data = filterData.len > 0 ? filterData.data : data
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
            if (element.format.name.replace(/[0-9]/g, '') == checkIdentifierExist && element.consolidatedPrediction != 0) {
                return true
            }
        })

        let maxObtainedTrainingData = ocrLocalResponse.layout.cells.filter((element) => {
            if (element.format.name.replace(/[0-9]/g, '') === elements[2] || element.format.name.replace(/[0-9]/g, '') === elements[3]) {
                return true
            }
        })

        let Studentmarks = objects;

        let saveObj = {
            "classId": minimalFlag ? 0 : filteredData.class,
            "examDate": minimalFlag ? null : filteredData.examDate,
            "subject": minimalFlag ? 0 : filteredData.subject,
            "examId": minimalFlag ? 0 : filteredData.examTestID,
            "userId": loginData.data.school.schoolId,
            "studentsMarkInfo": [
                {
                    "predictedStudentId": loginData.data.school.storeTrainingData ? storeTrainingData[0].studentIdPrediction : '',
                    "predictionConfidence": loginData.data.school.storeTrainingData ? storeTrainingData[0].studentIdPrediction != studentId ? storeTrainingData[0].predictionConfidence : [] : [],
                    "section": minimalFlag ? 0 : filteredData.section,
                    "studentId": studentId,
                    "securedMarks": sumOfAllMarks > 0 ? sumOfAllMarks : 0,
                    "totalMarks": maxMarksTotal > 0 ? maxMarksTotal : 0,
                    "marksInfo": Studentmarks,
                    "studentAvailability": true,
                }
                
            ]
            
        }
        if(filteredData.hasOwnProperty("set")){
            saveObj.studentsMarkInfo[0].set = minimalFlag ? "" : filteredData.set
        }

        if (minimalFlag) {
            saveObj.roiId = ocrLocalResponse.roiId
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
        if ((loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode) && minimalFlag) {
            saveObj.key = loginData.data.school.schoolId
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

    const scrollRef = useRef();
    const goToTop = () => {
    scrollRef.current?.scrollTo({
    y: 0,
    animated: true,
    });
   }

    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ backgroundColor: AppTheme.BACKGROUND_COLOR, paddingBottom: '15%' }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                    ref={scrollRef}
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
                                                    <Text style={{ textAlign: 'center', fontSize: AppTheme.HEADER_FONT_SIZE_LARGE,fontFamily:monospace_FF }}>{minimalFlag ? loginData.data.school.name.charAt(0) : studentData.length > 0 && studentData[0].name.charAt(0)}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.deatilsViewContainer}>
                                                <View style={styles.detailsSubContainerStyle}>
                                                    <Text style={[styles.nameTextStyle, { fontWeight: 'bold', color: AppTheme.BLACK, fontSize: AppTheme.FONT_SIZE_LARGE }]}>{minimalFlag ? loginData.data.school.name : studentData.length > 0 && studentData[0].name}</Text>
                                                    <TextField
                                                        labelText={BrandLabel && BrandLabel.StudentId ? BrandLabel.StudentId : Strings.student_id}
                                                        errorField={stdErr != ''}
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
                                
                                                        />
                                                        {
                                                            !minimalFlag
                                                            &&
                                                            <Text style={styles.nameTextStyle}>{BrandLabel && BrandLabel.Exam ? BrandLabel.Exam : Strings.Exam} : {filteredData.subject} {filteredData.examDate} ({filteredData.examTestID})</Text>

                                                        }
                                                    {
                                                        isMultipleStudent
                                                            ?
                                                            <Text style={styles.nameTextStyle}>{BrandLabel && BrandLabel.Record_no ? BrandLabel.Record_no:Strings.Record_no + ': ' + (currentIndex + 1)}</Text>
                                                            :
                                                            ocrLocalResponse.layout.pages > 0
                                                                ?
                                                                <Text style={styles.nameTextStyle}>{BrandLabel && BrandLabel.Record_no ? BrandLabel.Record_no:Strings.Record_no + ': ' + (currentIndex)}</Text>
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
                        jsonLabels || listbrandlabel && defaultHeaderTable ?
                          <View style={{ flexDirection: 'row', width: '100%' }}>
                            <MarksHeaderTable
                              customRowStyle={{ width: loginData.data.school.tags ? '25%' : isAlphaNumeric ? '25%' : '30%', backgroundColor: AppTheme.TABLE_HEADER}}
                              rowTitle={jsonLabels && jsonLabels.sr_no || listbrandlabel && listbrandlabel.sr_no || defaultHeaderTable.sr_no}
                              rowBorderColor={AppTheme.TAB_BORDER}
                              editable={false}
                            />
                            <MarksHeaderTable
                              customRowStyle={{ width: loginData.data.school.tags ? '25%' : isAlphaNumeric ? '25%' : '30%', backgroundColor: AppTheme.TABLE_HEADER}}
                              rowTitle={jsonLabels && jsonLabels.questions || listbrandlabel && listbrandlabel.questions || defaultHeaderTable.questions}
                              rowBorderColor={AppTheme.TAB_BORDER}
                              editable={false}
                            />
                            <MarksHeaderTable
                              customRowStyle={{ width: loginData.data.school.tags ? '25%' : isAlphaNumeric ? '55%' : '30%', backgroundColor: AppTheme.TABLE_HEADER}}
                              rowTitle={jsonLabels && jsonLabels.marks || listbrandlabel && listbrandlabel.marks || defaultHeaderTable.marks}
                              rowBorderColor={AppTheme.TAB_BORDER}
                              editable={false}
                            />
                          </View>
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
                                                                customRowStyle={{height:height/12, width: loginData.data.school.tags ? '25%' : isAlphaNumeric ? '25%' : '30%', }}
                                                                rowTitle={renderSRNo(element, index)}
                                                                rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                                                editable={false}
                                                                keyboardType={'number-pad'}
                                                            />
                                                            <MarksHeaderTable
                                                                customRowStyle={{height:height/12, width: loginData.data.school.tags ? '25%' : isAlphaNumeric ? '25%' : '30%', }}
                                                                rowTitle={element.format.value}
                                                                rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                                                editable={false}
                                                                keyboardType={'number-pad'}
                                                            />
                                                            <MarksHeaderTable
                                                                customRowStyle={{height:height/12, width: loginData.data.school.tags ? '25%' : isAlphaNumeric ? '50%' : '30%', }}
                                                                rowTitle={element.consolidatedPrediction}
                                                                rowBorderColor={markBorderOnCell(element)}
                                                                editable={true}
                                                                keyboardType={element.hasOwnProperty("omrOptions") ?  'name' : 'name'}
                                                                maxLength={lengthAccordingSheet(element)}
                                                                onChangeText={(text) => {
                                                                    handleTextChange(text.trim(), index, newArrayValue, element)
                                                                }}
                                                            onBlur={()=> showRegexErrorMessage(element)}
                                                            isBlur={true}
                                                            />
                                                        {
                                                            loginData.data.school.tags
                                                            &&
                                                            <MarksHeaderTable
                                                                customRowStyle={{height:height/12, width: '25%', }}
                                                                rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                                                                editable={false}
                                                                icon={true}
                                                                setIsModalVisible={setIsModalVisible}
                                                                setTagData={setTagData}
                                                                index={index}
                                                                rowTitle={element.format.name}
                                                                studentsAndExamData={studentsAndExamData}
                                                                setQuestionIdData={setQuestionIdData}
                                                                subject={filteredData.subject}
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
                        subject={filteredData.subject}
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
        studentsAndExamData: state.studentsAndExamData,
        minimalFlag: state.minimalFlag
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