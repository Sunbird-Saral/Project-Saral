import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ToastAndroid, Alert } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import AppTheme from '../../utils/AppTheme';
import { neglectData, SCAN_TYPES, student_ID, TABLE_HEADER } from '../../utils/CommonUtils';
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


    const inputRef = React.createRef();
    const dispatch = useDispatch()


    //function


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




    const onNextClick = () => {
        if (!studentValid) {
            setStdErr(Strings.please_correct_student_id)
        }
    }

    useEffect(() => {
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

    }, [])



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
                                    key={`Questions${element.cellId}`}
                                    rowTitle={`${element.render.index - 1}`}
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
                                    onChangeText={(text) => {
                                        handleTextChange(text.trim(), index, newArrayValue)
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


    const handleTextChange = (text, index, array) => {
        let len = text.length
        setDisabled(len == 0 ? true : false)
        let newArray = JSON.parse(JSON.stringify(array))
        newArray[index].consolidatedPrediction = text
        setNewArrayValue(newArray)

        newArray.map((e) => {
            if (e.format.name == "MAX_MARK") {
                setMaxMarksTotal(e.consolidatedPrediction)
            }
            if (e.format.name == "MARKS_OBTAINED") {
                setTotalMarkSecured(e.consolidatedPrediction)
            }
        })
        // dispatch(OcrLocalResponseAction(ocrData))


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
            showErrorMessage("Please fill marks")
        }
        else {
            if (sumOfObtainedMarks > 0) {
                //with MAX & OBTAINED MARKS
                if (sumOfObtainedMarks != totalMarkSecured) {
                    console.log("SUMOFOBTAINEMARKS", sumOfObtainedMarks);
                    setObtnMarkErr(true)
                    showErrorMessage("Sum Of All obtained marks should be equal to marksObtained")
                }
                else if (maxMarksTotal <= sumOfObtainedMarks) {
                    setObtnMarkErr(true)
                    showErrorMessage("Max mark should be less than and equal to Sum of All obtained")
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
        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.class,
            "subject": filteredData.subject,
            "fromDate": filteredData.examDate,
            "page": 1,
            "downloadRes": true
        }
        let apiObj = new scanStatusDataAction(dataPayload);
        FetchSavedScannedData(apiObj, loginCred.schoolId, loginCred.password)
        goToMyScanScreen()
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
                    apiResponse = res
                    clearTimeout(id)
                    api.processResponse(res)
                    dispatch(dispatchAPIAsync(api));
                })
                .catch(function (err) {
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
        OcrLocalResponseAction: OcrLocalResponseAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannedDetailsComponent);
