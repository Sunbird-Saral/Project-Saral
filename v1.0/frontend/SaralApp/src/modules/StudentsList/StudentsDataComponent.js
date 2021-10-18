import React, { memo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { getScannedDataFromLocal } from '../../utils/StorageUtils';

import { styles } from './StudentsDataStyle';

const StudentsDataComponent = ({
    item,
    pabsent,
    stdArray,
    scanedData,
    setStdArray,
    filteredData
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

                // console.log("eeeeeeeeee", e, findSection, "filter", filteredData.section);
                // console.log("wwwwwwww", e.classId, filteredData.class, e.subject, filteredData.subject, findSection);

                if (e.classId === filteredData.class && e.subject === filteredData.subject && findSection) {
                    return e
                }
            })

            // console.log("filterStdData", filterStdData);

            if (filterStdData.length > 0) {
                // console.log("filterStdDataaaaaaa", filterStdData);
                isStudentScannedInLocal = filterStdData[0].studentsMarkInfo.filter((o) => o.studentId == data.studentId)
            }
        }


        if (isStudentPresent) {
            let scannedDATa = scanedData.data.length > 0 ? scanedData.data : []
            // console.log("scannedDATa", scannedDATa);
            const isSheetScanned = scannedDATa.filter((o) => o.studentId == data.studentId)
            // console.log("isStudentPresent", scanedData, isSheetScanned);

            if (isSheetScanned.length > 0 || isStudentScannedInLocal.length > 0) {
                Alert.alert("student can't be mark as absent once scanned !")
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
        <View style={[styles.cardCon, { backgroundColor: isPresent ? AppTheme.BLUE : AppTheme.LIGHT_BLUE }]}>
            <View style={[styles.cardChildCon, { backgroundColor: "#ffffffED" }]}>

                <Text style={styles.aadhar}>{item.studentId}</Text>
                <View style={styles.line} />
                <Text style={styles.aadhar}>{item.name}</Text>
                <View style={styles.line} />

                <TouchableOpacity
                    style={[styles.btnCon, { backgroundColor: isPresent ? AppTheme.BLUE : AppTheme.LIGHT_BLUE }]}
                    activeOpacity={0.7}
                    onPress={() => onBtnClick(item)}
                >
                    {
                        isPresent
                            ?
                            <Text style={styles.markasAbsent}>Mark as Absent</Text>
                            :
                            <Text style={styles.markasAbsent}>Mark as Present</Text>
                    }
                </TouchableOpacity>

            </View>
        </View>
    );
}
export default (StudentsDataComponent);
