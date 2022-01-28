import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { getScannedDataFromLocal } from '../../utils/StorageUtils';
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
    apiStatus
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
        let isStudentScannedInLocal = ''

        if (stdData != null) {
            let filterStdData = stdData.filter((e, i) => {

                let findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)

                if (e.classId === filteredData.class && e.subject === filteredData.subject && findSection) {
                    return e
                }
            })

            if (filterStdData.length > 0) {
                isStudentScannedInLocal = filterStdData[0].studentsMarkInfo.filter((o) => o.studentId == data.studentId)
            }
        }

        if (isStudentPresent) {
            const isSheetScanned = typeof (scanedData) === 'object' && scanedData.data.length > 0 && scanedData.data.filter((o) => o.studentId == data.studentId && o.studentAvailability === true && o.marksInfo.length > 0)

            if (isSheetScanned.length > 0 || isStudentScannedInLocal.length > 0) {
                Alert.alert(Strings.student_cant_be_mark_as_absent_once_scanned)
            } else {
                data.studentAvailability = false
                setIsPresent(false)
                checkStdAbsPrst(data, chkPresent, filteredData, false)
            }
        } else if (data.studentAvailability == false) {
            data.studentAvailability = true
            setIsPresent(true)
            checkStdAbsPrst(data, chkPresent, filteredData, true)
        }
    }

    const onBtnClick = (data) => {
        let chkPresent = stdArray.some(item => item.studentId == data.studentId)
        setStdMarkAsPrsAbst(data, chkPresent)
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
                            <Text style={[styles.markasAbsent, { backgroundColor: themeColor1 ? themeColor1 : AppTheme.LIGHT_BLUE }]}>Mark as Absent</Text>
                            :
                            <Text style={[styles.markasPresent, { backgroundColor: themeColor2 ? themeColor2 : AppTheme.LIGHT_BLUE }]}>Mark as Present</Text>
                    }
                </TouchableOpacity>

            </View>
        </View>
    );
}
export default (StudentsDataComponent);
