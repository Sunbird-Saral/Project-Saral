import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

//redux
import { connect } from 'react-redux';

//constant
import Strings from '../../utils/Strings';

//components
import ScanStatusList from './ScanStatusList';

//styles
import { styles } from './ScanStatusStyle';

//Redux
import { bindActionCreators } from 'redux';

//api
import APITransport from '../../flux/actions/transport/apitransport'
import AppTheme from '../../utils/AppTheme';
import { getPresentAbsentStudent, getScannedDataFromLocal } from '../../utils/StorageUtils';
import ShareComponent from '../common/components/Share';
import MultibrandLabels from '../common/components/multibrandlabels';
import { monospace_FF } from '../../utils/CommonUtils';
import ButtonComponent from '../common/components/ButtonComponent';


const ScanStatus = ({
    loginData,
    scanedData,
    multiBrandingData,
    navigation,
    filteredData
}) => {

    const [studentList, setStudentList] = useState([])
    const [presentStudentList, setPresentStudentList] = useState([])
    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.scanStatus[0]

    //function
    const renderItem = ({ item, index }) => {
        return (
            <ScanStatusList
                themeColor1={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
                scanitemdata={item} 
                index ={index}
                id={item.studentId}
                subject={item.subject}
                studentList={studentList}
                BrandLabel={BrandLabel}
            />
        )
    }

    const renderEmptyData = ({ item }) => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={{fontFamily : monospace_FF}}>No Data Available</Text>
            </View>
        )
    }

    const onBackPress = () => {
        navigation.push('myScan');
    };

        useEffect(() => {
            getDataFromLocal()
            getStudentList()
            getPresentStudentList()
        }, [])

    const getStudentList = async () => {
        let data = await getPresentAbsentStudent()
        if (data != null) {
            setStudentList(data)
        }
    }

    const getDataFromLocal = async () => {
        let data = await getScannedDataFromLocal();
        if (data != null) {
            let students = data.studentsMarkInfo
        }
    }

    const getPresentStudentList = ()=>{
        let hasSet = filteredData.hasOwnProperty("set") ? filteredData.set.length >= 0 ? filteredData.set : '' : null
        let data = typeof (scanedData) === "object"
        ?
        scanedData.data
            ?
            scanedData.data.filter((o, index) => {
                let stdCondition = hasSet==null ?
                 o.studentAvailability && o.marksInfo.length > 0 & o.examDate == filteredData.examDate 
                 : hasSet.length >= 0 ? o.studentAvailability && o.marksInfo.length > 0 && hasSet == o.set 
                 : false
                if (stdCondition) {
                    return true
                }
            })
            :
            []
        :
        []
        setPresentStudentList(data)
        
    }

    return (
        <View style={[styles.container,{ flex: 1, backgroundColor:multiBrandingData.themeColor2 ? multiBrandingData.themeColor2 : 'white' }]}>

           <View style={{marginTop:30}}>
            <Text style={styles.scanStatus}>{Strings.save_status}</Text>

            <FlatList
                data={scanedData && presentStudentList}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyData}
                keyExtractor={(item, index) => `${index.toString()}`}
                contentContainerStyle={styles.content}
            />

           <View style={{alignItems:'center'}}>
            <ButtonComponent
               customBtnStyle={[styles.nxtBtnStyle1, {flex:0, width: '90%', backgroundColor: multiBrandingData.themeColor1 ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.close.toUpperCase()}
                activeOpacity={0.8}
                onPress={()=> onBackPress()}
                />
                </View>
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScanStatus);
