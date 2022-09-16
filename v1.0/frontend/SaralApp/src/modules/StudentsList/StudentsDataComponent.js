import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { checkNetworkConnectivity, dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF } from '../../utils/CommonUtils';
import { getScannedDataFromLocal, setScannedDataIntoLocal } from '../../utils/StorageUtils';
import Strings from '../../utils/Strings';
import { styles } from './StudentsDataStyle';

const StudentsDataComponent = ({
    item,
    themeColor1,
    themeColor2,
    pabsent,
    stdArray,
    scanedData,
    setStdArray,
    filteredData,
    dispatch,
    loginData
}) => {
    const [isPresent, setIsPresent] = useState(pabsent)

    const checkStdAbsPrst = (data, chkPresent, filteredData, valid) => {
        if (chkPresent) {
            stdArray.forEach(element => {
                if (data.studentId == element.studentId) {
                    element.studentAvailability = valid
                }
            });
        }
        else {
            setStdArray([...stdArray,
            {
                studentAvailability: valid,
                studentId: data.studentId,
                section: filteredData.section
            }
            ])
        }
    }

    const setStdMarkAsPrsAbst = async (data, chkPresent) => {

        let isStudentPresent = data.studentAvailability

        let stdData = await getScannedDataFromLocal()
        const hasNetwork = await checkNetworkConnectivity()
        let isStudentScannedInLocal = ''
        let filterStdData           = ''

        if (stdData != null) {
             filterStdData = stdData.filter((e, i) => {

                let findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)

                if (e.classId === filteredData.class && e.subject === filteredData.subject && findSection) {
                    return e
                }
            })

            if (filterStdData.length > 0) {
                isStudentScannedInLocal = filterStdData[0].studentsMarkInfo.filter((o) => o.studentId == data.studentId && o.studentAvailability === true && o.marksInfo.length > 0)
            }
        }

        if (isStudentPresent) {
            const isSheetScanned = typeof (scanedData) === 'object' && scanedData.data.length > 0 && scanedData.data.filter((o) => o.studentId == data.studentId && o.studentAvailability === true && o.marksInfo.length > 0)

            if (isSheetScanned.length > 0 || isStudentScannedInLocal.length > 0) {
                let data = {
                    title : Strings.message_text,
                    message : Strings.student_cant_be_mark_as_absent_once_scanned,
                    isOkAvailable : false
                }
                dispatch(dispatchCustomModalStatus(true));
                dispatch(dispatchCustomModalMessage(data));
            } else {
                data.studentAvailability = false
                setIsPresent(false)
                checkStdAbsPrst(data, chkPresent, filteredData, false)
            }
            if (loginData.data.school.hasOwnProperty("offline") && loginData.data.school.offline && !hasNetwork & (isSheetScanned.length == 0 || isStudentScannedInLocal.length == 0)) {
                saveStudentIntoLocalStorage(data.studentId, isStudentPresent, filterStdData, stdData)
            } 
        } else if (data.studentAvailability == false) {
            data.studentAvailability = true
            setIsPresent(true)
            checkStdAbsPrst(data, chkPresent, filteredData, true)
            if (loginData.data.school.hasOwnProperty("offline") && loginData.data.school.offline && !hasNetwork & (isSheetScanned.length == 0 || isStudentScannedInLocal.length == 0)) {
                saveStudentIntoLocalStorage(data.studentId, false, filterStdData, stdData)
            } 
        }
    }

    const onBtnClick = (data) => {
        let chkPresent = stdArray.some(item => item.studentId == data.studentId)
        setStdMarkAsPrsAbst(data, chkPresent)
    }

    const saveStudentIntoLocalStorage = async(studentId, studentAvailability, filterStdData, localStdData) => {
        let stdObj = {
            "studentId": studentId,
            "predictedStudentId": '',
            "predictionConfidence": [],
            "section": filteredData.section,
            "marksInfo": [],
            "securedMarks": 0,
            "totalMarks": 0,
            "studentAvailability": !studentAvailability
        }
        if (filterStdData.length > 0) {
            let chkStdPresent = filterStdData[0].studentsMarkInfo.findIndex((val) => val.studentId == studentId && val.marksInfo.length == 0);
            if (chkStdPresent > -1) {
                filterStdData[0].studentsMarkInfo[chkStdPresent] = stdObj;
            } 
            else {
                filterStdData[0].studentsMarkInfo.push(stdData);
            }
            
            let findIndex = localStdData.findIndex((el)=> {
                let findSection = el.studentsMarkInfo.some((item) => item.section == filteredData.section)
                if (el.classId === filteredData.class && el.subject === filteredData.subject && findSection) {
                    return true
                }
            });
            localStdData[findIndex].studentsMarkInfo = filterStdData[0].studentsMarkInfo;
            await setScannedDataIntoLocal(localStdData)

        } else if(localStdData == null || filterStdData.length == 0){
            let saveObj = {
                "classId": filteredData.class,
                "examDate": filteredData.examDate,
                "subject": filteredData.subject,
                "studentsMarkInfo": stdObj,
                "examId": filteredData.examTestID,
            }
            await setScannedDataIntoLocal([saveObj])
        }
    }

    return (
        <View style={[styles.cardCon, { backgroundColor: themeColor1 ? themeColor1 : AppTheme.BLUE }]}>
            <View style={[styles.cardChildCon, { backgroundColor: "#ffffffED" }]}>

                <Text style={styles.aadhar}>{item.studentId}</Text>
                <View style={styles.line} />
                <Text style={styles.aadhar}>{item.name}</Text>
                <View style={styles.line} />

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onBtnClick(item)}
                >
                    {
                        isPresent
                            ?
                            <Text style={[styles.markasAbsent, { backgroundColor: themeColor1 ? themeColor1 : AppTheme.LIGHT_BLUE,fontFamily : monospace_FF }]}>Mark as Absent</Text>
                            :
                            <Text style={[styles.markasPresent, { backgroundColor: themeColor2 ? themeColor2 : AppTheme.LIGHT_BLUE,fontFamily : monospace_FF }]}>Mark as Present</Text>
                    }
                </TouchableOpacity>

            </View>
        </View>
    );
}
export default (StudentsDataComponent);
