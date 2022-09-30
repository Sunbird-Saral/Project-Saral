import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, BackHandler, Image, TouchableOpacity, Linking, Share, Alert} from 'react-native';

//redux
import { connect, useDispatch } from 'react-redux';

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
import { getPresentAbsentStudent, getScannedDataFromLocal,getErrorMessage } from '../../utils/StorageUtils';
import { Assets } from '../../assets';
import ShareComponent from '../common/components/Share';
import MultibrandLabels from '../common/components/multibrandlabels';
import { dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF } from '../../utils/CommonUtils';
import ButtonComponent from '../common/components/ButtonComponent';


const ScanStatusLocal = ({
    loginData,
    filteredData,
    multiBrandingData,
    navigation,
}) => {

    const [unsavedstudentList, setUnsavedstudentList] = useState([])
    const [loacalstutlist, setLoacalstutlist] = useState([])
    const [presentStudentList, setPresentStudentList] = useState([])
    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.scanHistory[0]
    
    const data =(JSON.stringify(presentStudentList[0],null, 2))
    const dispatch = useDispatch()


// useEffect(
//     React.useCallback(() => {
//         BackHandler.addEventListener('hardwareBackPress', onBackPress);
//         return () =>
//         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, []),
//     );

    const onBackPress = () => {
        navigation.navigate('myScan');
        return true;
    };

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
                title: `Saral App v1.0 Marks JSON - SchoolId:${loginData.data.school.schoolId} & Exam Id:${filteredData.examTestID}`,
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
            // alert(error.message);
        }
    };
    

    const renderItem = ({ item, index }) => {
        return <ScanStatusLocalList
            id={item.studentId}
            loacalstutlist={unsavedstudentList}
            themeColor1={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
        />

    }

    const renderEmptyData = ({ item }) => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={{fontFamily : monospace_FF}}>No Data Available</Text>
            </View>
        )
    }

    useEffect(() => {
        getDataFromLocal()
        getStudentList()
    },[])
    
    const getStudentList = async () => {
        let data = await getPresentAbsentStudent()
        if (data != null) {
            setUnsavedstudentList(data)
        }
    }

    const getDataFromLocal = async () => {
        let data = await getScannedDataFromLocal()
        if (data) {
          let filterscandata =  data.filter((item)=>{
            let findSection = item.studentsMarkInfo.some((item) => item.section == filteredData.section)
                if( filteredData.class == item.classId &&  filteredData.examDate == item.examDate &&  filteredData.subject == item.subject && filteredData.examTestID==item.examId && findSection   ){
                    return true
                }   
            })

            let hasSet = filteredData.hasOwnProperty("set") & filteredData.set.length > 0 ? filteredData.set : ''
            if (hasSet.length > 0) {
                let findSetStudent = filterscandata.length > 0 ? filterscandata[0].studentsMarkInfo.filter((item) => {
                    if (hasSet.length > 0) {
                        return item.set == hasSet;
                    }
                })
                :
                []
                filterscandata[0].studentsMarkInfo = findSetStudent
            }

            getPresentStudentList(filterscandata)
        }
    }


    const getPresentStudentList = (loacalstutlist)=>{
      
        let data =typeof (loacalstutlist) === "object"
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

    return (
        <View style={styles.container}>
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
            {presentStudentList.length > 0 &&
            
            <TouchableOpacity onPress={()=>onShare()} style={{width:40,height:40,marginRight:20,marginTop:10}}>
                    <Image style={{ height: 25, width: 25, marginHorizontal: 15, marginVertical: 20 }} source={Assets.Share} />
                </TouchableOpacity>
                }
            </View>

            <Text style={styles.scanStatus}>{Strings.scan_status}</Text>
        
            <FlatList
                data={ presentStudentList && presentStudentList}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyData}
            keyExtractor={(item, index) => `${index.toString()}`}
            contentContainerStyle={styles.content}
            />

          <View style={{alignItems:'center'}}>
            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle1, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.close.toUpperCase()}
                activeOpacity={0.8}
                onPress={()=> onBackPress()}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(ScanStatusLocal);
