import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View ,TouchableOpacity,Image,Platform} from 'react-native';
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
import Share from "react-native-share";

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
    filteredData,
    saveData
}) => {

    //Hooks
    const [presentStudentList, setPresentStudentList] = useState([]);
    const [unsavedstudentList, setUnsavedstudentList] = useState([]);
    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.myScan[0]
    const OsVer = Platform.constants['Release'];
    const dataForShare =(`${JSON.stringify(localstutlist[0],null, 2)}`)

    const dispatch = useDispatch()
    useEffect(() => {

        if (savingStatus == 'scan') {
            getPresentStudentList(localstutlist)
            getStudentList()
        } else {
            let hasSet = filteredData ? filteredData.hasOwnProperty("set") ? filteredData.set.length >= 0 ? filteredData.set : "" : null : ""
            if (hasSet != null && hasSet.length >= 0) {
                getPresentStudentList(localstutlist)
            } else {
                setPresentStudentList(localstutlist)
            }
        }
    }, [localstutlist])

    //functions
    const getPresentStudentList = (loacalstutlist) => {
        let hasSet = filteredData ? filteredData.hasOwnProperty("set") ? filteredData.set.length >= 0 ? filteredData.set : "" : null : ""
        let dataList = savingStatus == 'scan' ? typeof(loacalstutlist) === "object" ? localstutlist[0] ? loacalstutlist[0].studentsMarkInfo : [] : [] : loacalstutlist;
        let data = typeof(loacalstutlist) === "object"
            ?
            loacalstutlist[0]
                ?
                dataList.filter((o, index) => {
                    let stdCondition = hasSet != null && hasSet.length >= 0 ? o.studentAvailability && o.marksInfo.length > 0 && o.set == hasSet : o.studentAvailability && o.marksInfo.length > 0
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
    const subject = `Saral App v1.0 Marks JSON - SchoolId:${loginData.data.school.schoolId} & Exam Id:${filteredData.examTestID}`
    const message = `${(dataForShare ? dataForShare : '')}`;

   
    const options = {
        message,
        subject,
    };
      
    const onShare = async (customOptions = options) => {
        if(presentStudentList.length <= 25 && OsVer > 10){
         try {
             await Share.open(customOptions);
         } catch (err) {
             console.log(err);
         }
 
        }else if(presentStudentList.length < 8 && OsVer <=10 ){
         try {
             await Share.open(customOptions);
         } catch (err) {
             console.log(err);
         }
        }else{
         callCustomModal(Strings.message_text,Strings.shareDataExceed,false);
        }
         
     };
   

    const renderItem = ({ item, index }) => {
        return <ScanStatusLocalList
            scanitemdata={item} 
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
                <View style={{width:'60%'}}>
                <Text
                    style={styles.schoolName}
                >
                    {Strings.school_name + '  : '}
                    <Text style={{ fontWeight: 'normal',fontFamily : monospace_FF }}>{loginData.data.school.name}</Text>
                </Text>
                <Text style={styles.schoolName}>
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

                <View style={{alignItems:'center',flexDirection:'row',justifyContent: 'space-between'}}>
                    
            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.close}
                activeOpacity={0.8}
                onPress={()=> setModalVisible()}
                />
                { 
                savingStatus == 'scan' &&
                <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}]}
                btnText={Strings.save_scan}
                activeOpacity={0.8}
                onPress={()=> {
                    setModalVisible()
                    saveData()
                } }
                />
}
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
        flex: 1,
        borderRadius: 10,
        marginBottom: 50,
        marginHorizontal: 10
    },
    schoolName: {
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        paddingHorizontal: '5%',
        paddingVertical: '2%',
        fontFamily : monospace_FF
    },
});
