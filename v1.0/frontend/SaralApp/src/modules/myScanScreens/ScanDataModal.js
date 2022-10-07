import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View ,TouchableOpacity,Image,Share} from 'react-native';
import AppTheme from '../../utils/AppTheme';
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
import { dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF } from '../../utils/CommonUtils';
import { ScrollView } from 'react-native-gesture-handler';
import ButtonComponent from '../common/components/ButtonComponent';

const ScanDataModal = ({
    bgColor,
    minimalFlag,
    modalVisible,
    savingStatus,
    setModalVisible,
    localstutlist,
    multiBrandingData,
    loginData,
    navigation,
    filteredData
}) => {

    //Hooks
    const [presentStudentList, setPresentStudentList] = useState([]);
    const [unsavedstudentList, setUnsavedstudentList] = useState([]);
    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.myScan[0]
   
    const data =(JSON.stringify(presentStudentList,null, 2))
    const dispatch = useDispatch()
    useEffect(() => {

        if (savingStatus == 'scan') {
            getPresentStudentList(localstutlist)
            getStudentList()
        } else {
            let hasSet = filteredData.hasOwnProperty("set") ?   filteredData.set.length > 0 ? filteredData.set : '' : ''
            if (hasSet.length > 0) {
                getPresentStudentList(localstutlist)
            } else {
                setPresentStudentList(localstutlist)
            }
        }
    }, [localstutlist])

    //functions
    const getPresentStudentList = (loacalstutlist) => {
        let hasSet = filteredData.hasOwnProperty("set") ?  filteredData.set.length > 0 ? filteredData.set : '' : ''
        let data = typeof (loacalstutlist) === "object"
            ?
            loacalstutlist[0]
                ?
                loacalstutlist[0].studentsMarkInfo.filter((o, index) => {
                    let stdCondition = hasSet.length > 0 ? o.studentAvailability && o.marksInfo.length > 0 && o.set == hasSet : o.studentAvailability && o.marksInfo.length > 0
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

    const callCustomModal = (title, message, isAvailable, func, cancel) => {
        let data = {
            title: title,
            message: message,
            isOkAvailable: isAvailable,
            okFunc: func,
            isCancel : cancel
        }
        dispatch(dispatchCustomModalStatus(true));
        dispatch(dispatchCustomModalMessage(data));
    }

    const onShare = async () => {
        try {
          const result = await Share.share({
            title: `Saral App v1.0 Marks JSON - Organization Id : ${loginData.data.school.schoolId} `,
            message:
                 `${(data ? data : '')}`
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
            console.log(error.message);
            callCustomModal(Strings.message_text,Strings.shareDataExceed,false);
        //   alert(error.message);
        }
      };
   

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
                // setModalVisible()
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

          {presentStudentList.length > 0 && savingStatus == 'scan' &&
            <View>
            <TouchableOpacity onPress={()=>onShare()} style={{width:40,height:40,marginRight:20,marginTop:10}}>
                    <Image style={{ height: 25, width: 25, marginHorizontal: 15, marginVertical: 20 }} source={Assets.Share} />
                </TouchableOpacity>
                 
                  </View>
                }
            </View>
            {
            savingStatus == 'scan' ?
            <Text style={styles.scanStatus}>{Strings.scan_data}</Text>:
            <Text style={styles.scanStatus}>{Strings.saved_data}</Text>}
              <ScrollView showsVerticalScrollIndicator ={false} >
                    <FlatList
                        data={presentStudentList}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmptyList}
                        contentContainerStyle={{ marginTop: 30, flex: 1,bottom:30 }}
                    />
                </ScrollView>

                <View style={{alignItems:'center'}}>
            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.close.toUpperCase()}
                activeOpacity={0.8}
                onPress={()=> setModalVisible()}
                />
                </View>

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
    },
    scanStatus: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center',
        paddingBottom: 10,
        fontFamily : monospace_FF
    },
    nxtBtnStyle1: {
        width:'90%',
        borderRadius: 10,
        marginBottom: 50
    }
});
