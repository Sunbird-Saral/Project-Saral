import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ToastAndroid } from 'react-native';
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
    const [summary, setSummary] = useState(false)
    const [newArrayValue, setNewArrayValue] = useState([])
    const [btnName, setBtnName] = useState('Cancel')
    const [maxMarks, setMaxMarks] = useState(0)
    const [obtainedMarks, setObtainedMarks] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [studentId, setStudentID] = useState();
    const [stdErr, setStdErr] = useState("");
    const [edit, setEditValue] = useState(true)
    const [studentValid, setStudentValid] = useState()
    const [studentData, setStudentDATA] = useState([])


    const inputRef = React.createRef();

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
        console.log("DATA======>", a);
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
        console.log("ocrLocalResponse.layout.cells",ocrLocalResponse.layout.cells);
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
        console.log(data, data.length);

        //check value is present in array or not
        let marksObtained = data.some(item => item.format.name === elements[2])
        let maxMarks = data.some(item => item.format.name === elements[3])

        let len = data.length;

        if (maxMarks && marksObtained) {
            setNewArrayValue(data)
        } else {
            // let maxMarks = {
            //     cellId: "2212312",
            //     consolidatedPrediction: "0",
            //     format: { name: 'MAX_MARKS', value: 'MAX MARKS' },
            //     render: { index: len + 2 }
            // }
            // let marksObtained = {
            //     cellId: "2312312",
            //     consolidatedPrediction: "0",
            //     format: { name: 'MARKS_OBTAINED', value: 'MARKS OBTAINED' },
            //     render: { index: len + 3 }
            // }
            // data.push(maxMarks)
            // data.push(marksObtained)
            console.log("================>", data);
            setNewArrayValue(data)
        }


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
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScannedDetailsComponent);
