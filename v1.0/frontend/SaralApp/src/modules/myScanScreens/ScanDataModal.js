import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View ,TouchableOpacity,Image} from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { monospace_FF } from '../../utils/CommonUtils';
import { Assets } from '../../assets';
import { getPresentAbsentStudent } from '../../utils/StorageUtils';
import ScanStatusLocalList from '../ScanStatus/ScanStatusLocalList';
import MultibrandLabels from '../common/components/multibrandlabels';
import ShareComponent from '../common/components/Share';
//constant
import Strings from '../../utils/Strings';
//redux
import { connect, useDispatch } from 'react-redux';

//Redux
import { bindActionCreators } from 'redux';
import APITransport from '../../flux/actions/transport/apitransport'

const ScanDataModal = ({
    bgColor,
    minimalFlag,
    modalVisible,
    savingStatus,
    setModalVisible,
    localstutlist,
    multiBrandingData,
    loginData,
    navigation
}) => {

    //Hooks
    const [presentStudentList, setPresentStudentList] = useState([]);
    const [unsavedstudentList, setUnsavedstudentList] = useState([]);
    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.myScan[0]

    useEffect(() => {

        if (savingStatus == 'scan') {
            getPresentStudentList(localstutlist)
            getStudentList()
        } else {
            setPresentStudentList(localstutlist)
        }
    }, [localstutlist])

    //functions
    const getPresentStudentList = (loacalstutlist) => {
        let data = typeof (loacalstutlist) === "object"
            ?
            loacalstutlist[0]
                ?
                loacalstutlist[0].studentsMarkInfo.filter((o, index) => {
                    if (o.studentAvailability && o.marksInfo.length > 0) {
                        return true
                    }
                })
                :
                []
            :
            []
        setPresentStudentList(data)
    }


    const renderItem = ({ item, index }) => {
        return <ScanStatusLocalList
            id={item.studentId}
            loacalstutlist={unsavedstudentList}
            themeColor1={bgColor}
            status={savingStatus == 'scan' ? `Scanned` : `Saved`}
            minimalFlag={minimalFlag}
        />

    }

    const getStudentList = async () => {
        let data = await getPresentAbsentStudent()
        if (data != null) {
            setUnsavedstudentList(data)
        }
    }

    const renderEmptyList = () => { 
        return(
            <View style={{justifyContent: 'center', alignItems:'center',flexGrow:1}}>
                <Text>No Data Available</Text>
            </View>
        )
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible()
            }}
            statusBarTranslucent={true}
        >
            <View style={styles.mainContainer}>
            <ShareComponent
                 navigation={navigation}
                 />
            <View style={{ flexDirection:'row',justifyContent: 'space-between' }}>
            {(multiBrandingData && BrandLabel) ?
                <MultibrandLabels
                Label1={BrandLabel.School}
                Label2={BrandLabel.SchoolId}
                School ={loginData.data.school.name}
                SchoolId={loginData.data.school.schoolId}
                />
                     :
                (loginData && loginData.data)
                &&
                <View>
                    <Text
                        style={styles.schoolName}
                    >
                        {Strings.school_name + ' Name : '}
                        <Text style={{ fontWeight: 'normal',fontFamily : monospace_FF }}>{loginData.data.school.name}</Text>
                    </Text>
                    <Text style={[styles.schoolId, { marginLeft: 5 }]}>
                        {Strings.schoolId_text + ' : '}
                        <Text style={{ fontWeight: 'normal',fontFamily : monospace_FF }}>
                            {loginData.data.school.schoolId}
                        </Text>
                    </Text>
                </View>
            }
           
            </View>
                
                    <FlatList
                        data={presentStudentList}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmptyList}
                        contentContainerStyle={{ marginTop: 30, flex: 1 }}
                    />
                

            </View>

        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScanDataModal);
// export default ScanDataModal;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        top:30
    }
});
