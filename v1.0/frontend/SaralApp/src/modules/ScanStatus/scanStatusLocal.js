import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, BackHandler } from 'react-native';

//redux
import { connect } from 'react-redux';

//constant
import Strings from '../../utils/Strings';

//components
import ScanStatusLocalList from './ScanStatusLocalList';

//styles
import { styles } from './ScanStatusStyle';

//Redux
import { bindActionCreators } from 'redux';

//api
import APITransport from '../../flux/actions/transport/apitransport'
import AppTheme from '../../utils/AppTheme';
import { getPresentAbsentStudent, getScannedDataFromLocal } from '../../utils/StorageUtils';


const ScanStatusLocal = ({
    loginData,
    filteredData,
    multiBrandingData,
    navigation,
}) => {

    const [unsavedstudentList, setUnsavedstudentList] = useState([])
    const [loacalstutlist, setLoacalstutlist] = useState([])
    const [presentStudentList, setPresentStudentList] = useState([])



useEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            navigation.navigate('ScanHistory');
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
);
useEffect(() => {
       getPresentStudentList()
        getStudentList()
        getDataFromLocal()
}, [])



    const renderItem = ({ item, index }) => {
        console.log('item',item.studentId)
        return <ScanStatusLocalList
        id={item.studentId}
                loacalstutlist={unsavedstudentList}
                themeColor1={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
            />
        
    }

    const renderEmptyData = ({ item }) => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text>No Data Available</Text>
            </View>
        )
    }


    const getDataFromLocal = async () => {
        let data = await getPresentAbsentStudent()
        if (data != null) {
            setUnsavedstudentList(data)
             let students = data.studentsMarkInfo
            //  const students = data
           
        }
    }

    const getStudentList = async () => {
        let data = await getScannedDataFromLocal()
        if (data != null) {
          let filterscandata =  data.filter((item)=>{
                if( filteredData.class == item.classId &&  filteredData.examDate == item.examDate){
                    return true
                }
                setLoacalstutlist(filterscandata)
            })
            setLoacalstutlist(filterscandata)
        }
    }


    const getPresentStudentList = ()=>{
        let data = typeof (loacalstutlist[0]) === "object"
       
            ?
            loacalstutlist[0].studentsMarkInfo.filter((o, index) => {
                if (o.studentAvailability && o.marksInfo.length > 0) {
                    return true
                }
            })
            :
            []  
        setPresentStudentList(data)
        
    }

    return (
        <View style={styles.container}>
            {
                (loginData && loginData.data)
                &&
                <View style={styles.schoolCon}>
                    <Text
                        style={styles.schoolName}
                    >
                        {Strings.school_name + ' Name : '}
                        <Text style={{ fontWeight: 'normal' }}>{loginData.data.school.name}</Text>
                    </Text>
                    <Text style={styles.schoolId}>
                        {Strings.schoolId_text + ' : '}
                        <Text style={{ fontWeight: 'normal' }}>
                            {loginData.data.school.schoolId}
                        </Text>
                    </Text>
                </View>
            }

            <Text style={styles.scanStatus}>{Strings.scan_status}</Text>
        
            <FlatList
                data={ loacalstutlist && presentStudentList}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyData}
            keyExtractor={(item, index) => `${index.toString()}`}
            contentContainerStyle={styles.content}
            />

        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanedData: state.scanedData.response,
        multiBrandingData: state.multiBrandingData.response.data,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanStatusLocal);
