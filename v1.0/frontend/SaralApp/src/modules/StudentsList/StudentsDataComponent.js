import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, Switch, Dimensions } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { checkNetworkConnectivity, dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF } from '../../utils/CommonUtils';
import { getScannedDataFromLocal, setScannedDataIntoLocal } from '../../utils/StorageUtils';
import Strings from '../../utils/Strings';
import { styles } from './StudentsDataStyle';
import MarksHeaderTable from '../ScannedDetails/MarksHeaderTable';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
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
        <View style={{flex:1, flexDirection:'row',margin:5,justifyContent:'center', alignItems:'center'}}>
            <View style={{flexDirection:"row",width:292,height:50}}>
             <View style={{width:AppTheme.WIDTH_15,borderWidth:0.5,justifyContent:'center',alignItems:'center',backgroundColor:AppTheme.WHITE}}>
             <Text>{index + 1}</Text>

             </View>
             <View style={{width:AppTheme.WIDTH_60 ,backgroundColor:AppTheme.WHITE}}>
             <View style={{borderWidth:0.5,height:item.name.length > 50 ?40 : 25,justifyContent:'center'}}>
             <Text style={{marginLeft:10}}>{`${item.name}${item.fatherName ? '/' + item.fatherName : ''}`}</Text>
             </View>
             <View style={{borderWidth:0.5,height:25,justifyContent:'center'}}>
             <Text style={{marginLeft:10}}>{item.studentId}</Text>
             </View>
             </View>
             </View>
             <View style={{width:AppTheme.WIDTH_15}}>
             
                            <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onBtnClick(item)}
                    // style={{width:'20%'}}
                >
                  
{
                        !isPresent
                            ?
                            <View style={{backgroundColor: '#e5b6b3',width:54,height:24,borderRadius:10}}>
                            <View style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
                             <View style={{backgroundColor:'red',width:22,height:22,borderRadius:11,top:1}}></View>
                             <Text style={{marginRight:12,color:'red',fontWeight:"bold"}}>{'A'}</Text>
                             </View>
                             </View>
                            
                            :
                            <View style={{backgroundColor:themeColor2 ? '#93CECE' : AppTheme.BLUE,width:54,height:24,borderRadius:10}}>
                           <View style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
                            <Text style={{marginLeft:12,color:themeColor1,fontWeight:'bold'}}>{'P'}</Text>
                            <View style={{backgroundColor:themeColor1,width:22,height:22,borderRadius:11,top:1}}></View>
                            </View>
                            </View>
                           
                    }
                    </TouchableOpacity>
                    </View>            
                                       
            
        </View>
    );
}
export default (StudentsDataComponent);
