import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, Switch } from 'react-native';
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
    loginData,
    index
}) => {
    const [isPresent, setIsPresent] = useState(pabsent)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
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
        let hasSet = filteredData.hasOwnProperty("set") ? filteredData.set.length >= 0 ? filteredData.set : '' : null
        if (stdData != null) {
             filterStdData = stdData.filter((e, i) => {

                let findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)

                if (e.classId === filteredData.class && e.subject === filteredData.subject && findSection && e.examDate == filteredData.examDate) {
                    return e
                }
            })

            if (filterStdData.length > 0) {
                isStudentScannedInLocal = filterStdData[0].studentsMarkInfo.filter((o) => {
                    if (hasSet != null && hasSet.length >= 0) {
                        return o.studentId == data.studentId && o.studentAvailability === true && o.marksInfo.length > 0 && hasSet == o.set
                    } else {
                        return o.studentId == data.studentId && o.studentAvailability === true && o.marksInfo.length > 0 
                    }
                })
            }
        }

        const isSheetScanned = typeof (scanedData) === 'object' && scanedData.hasOwnProperty("data") ? scanedData.data.length > 0 && scanedData.data.filter((o) => {
            if (hasSet != null && hasSet.length >= 0) {
                return o.studentId == data.studentId && o.studentAvailability === true && o.marksInfo.length > 0 && hasSet == o.set
            } else {
                return o.studentId == data.studentId && o.studentAvailability === true && o.marksInfo.length > 0 
            }
        })
        :
         []
        
        if (isStudentPresent) {
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
            if (loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode && (isSheetScanned.length == 0 && isStudentScannedInLocal.length == 0)) {
                saveStudentIntoLocalStorage(data.studentId, isStudentPresent, filterStdData, stdData)
            } 
        } else if (data.studentAvailability == false) {
            data.studentAvailability = true
            setIsPresent(true)
            checkStdAbsPrst(data, chkPresent, filteredData, true)
            if (loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode && (isSheetScanned.length == 0 && isStudentScannedInLocal.length == 0)) {
                saveStudentIntoLocalStorage(data.studentId, false, filterStdData, stdData)
            } 
        }
    }

    const onBtnClick = (data) => {
        console.log('isPresent>>>>>',isPresent);
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

        let hasSet = filteredData.hasOwnProperty("set") ? filteredData.set.length >= 0 ? filteredData.set : '' : '' 
        if(hasSet != null && hasSet.length >= 0){
            stdObj.set = hasSet
        }

        if (filterStdData.length > 0) {
            let chkStdPresent = filterStdData[0].studentsMarkInfo.findIndex((val) => val.studentId == studentId && val.marksInfo.length == 0);
            if (chkStdPresent > -1) {
                filterStdData[0].studentsMarkInfo[chkStdPresent] = stdObj;
            } 
            else {
                filterStdData[0].studentsMarkInfo.push(stdObj);
            }
            let findIndex = localStdData.findIndex((el)=> {
                let findSection = el.studentsMarkInfo.some((item) => item.section == filteredData.section )
                if (el.classId === filteredData.class && el.subject === filteredData.subject && findSection && el.examDate == filteredData.examDate && el.examId == filteredData.examTestID) {
                    return true
                }
            });
            localStdData[findIndex].studentsMarkInfo = filterStdData[0].studentsMarkInfo;
            await setScannedDataIntoLocal(localStdData)

        } else {
            let saveObj = {
                "classId": filteredData.class,
                "examDate": filteredData.examDate,
                "subject": filteredData.subject,
                "studentsMarkInfo": [stdObj],
                "examId": filteredData.examTestID,
                "userId": loginData.data.school.schoolId
            }
            if (filterStdData.length == 0 && localStdData != null) {
                localStdData.push(saveObj);
                await setScannedDataIntoLocal(localStdData);
            } else if(localStdData == null){
                await setScannedDataIntoLocal([saveObj]);
            }
        }
    }

    return (
        <View style={{flexDirection:'row',margin:5,justifyContent:'center', alignItems:'center'}}>
             <View style={{width:'15%',height:50,borderWidth:0.5,border:10,justifyContent:'center',alignItems:'center',backgroundColor:AppTheme.WHITE}}>
            {/* <View style={[styles.cardChildCon, { backgroundColor: "#ffffffED" }]}> */}
             <Text>{index + 1}</Text>
             {/* </View> */}
             </View>
             <View style={{width:'60%',backgroundColor:AppTheme.WHITE}}>
             <View style={{height:25,borderWidth:0.5,border:10,justifyContent:'center'}}>
             <Text style={{marginLeft:10}}>{item.studentId}</Text>
             </View>
             <View style={{height:25,borderWidth:0.5,border:10,justifyContent:'center'}}>
             <Text style={{marginLeft:10}}>{item.name}</Text>
             </View>
             </View>
             <View style={{}}>
             <Switch
                                        trackColor={{ true: 'green', false: 'red' }}
                                        // thumbColor={isPresent ? AppTheme.GREEN : 'red'}
                                        // style={{ transform:[{ scaleX: .7 }, { scaleY: .7 }] }}
                                        value={isPresent}
                                        onValueChange={(value) => onBtnClick(item)}/>
                                        {
                        !isPresent
                            ?
                            <Text style={{color:AppTheme.BLACK,fontWeight:'bold',marginLeft:5}}>{'Absent'}</Text>
                            :
                            <Text style={{color:AppTheme.BLACK,fontWeight:'bold',marginLeft:5}}>{'Present'}</Text>
                    }
                    </View>
                                       
             {/* <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onBtnClick(item)}
                    style={{width:'20%'}}
                >
                    {
                        isPresent
                            ?
                            <Text style={[ { backgroundColor: themeColor1 ? themeColor1 : AppTheme.LIGHT_BLUE,fontFamily : monospace_FF }]}>{Strings.Mark_Absent}</Text>
                            :
                            <Text style={[ { backgroundColor: themeColor2 ? themeColor2 : AppTheme.LIGHT_BLUE,fontFamily : monospace_FF }]}>{Strings.Mark_Present}</Text>
                    }
                </TouchableOpacity> */}
           
           
           {/* <View style={{width:'80%'}}>
            <View style={[styles.cardChildCon, { backgroundColor: "#ffffffED" }]}>
             <Text style={styles.aadhar}>{item.studentId}</Text>
             <View style={styles.line} />
             </View>
             </View> */}
        
            {/* <View style={[styles.cardChildCon, { backgroundColor: "#ffffffED" }]}>
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
                            <Text style={[styles.markasAbsent, { backgroundColor: themeColor1 ? themeColor1 : AppTheme.LIGHT_BLUE,fontFamily : monospace_FF }]}>{Strings.Mark_Absent}</Text>
                            :
                            <Text style={[styles.markasPresent, { backgroundColor: themeColor2 ? themeColor2 : AppTheme.LIGHT_BLUE,fontFamily : monospace_FF }]}>{Strings.Mark_Present}</Text>
                    }
                </TouchableOpacity>

            </View> */}
        </View>
    );
}
export default (StudentsDataComponent);
