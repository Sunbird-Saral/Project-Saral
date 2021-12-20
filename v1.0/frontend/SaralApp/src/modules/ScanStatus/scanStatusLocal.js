import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, BackHandler, Image, TouchableOpacity,Linking,Alert,Share } from 'react-native';

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
import { Assets } from '../../assets';


const ScanStatusLocal = ({
    loginData,
    filteredData,
    multiBrandingData,
    navigation,
}) => {

    const [unsavedstudentList, setUnsavedstudentList] = useState([])
    const [loacalstutlist, setLoacalstutlist] = useState([])
    const [presentStudentList, setPresentStudentList] = useState([])
    const data = JSON.stringify(loacalstutlist,null,2)


    useEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.goBack('myScan');
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );
   
   
    // const onShare = () => {
    //     const subject = `Saral App v1.0 Marks JSON - SchoolId:${loginData.data.school.schoolId} Exam Id:${filteredData.examTestID}`;
    //     const message = JSON.stringify(loacalstutlist[0],null, 4);
    //     Linking.openURL(`mailto: ?subject=${subject}&body=${message}`)
    //  } 

    
    const onShare = async () => {
        try {
            const result = await Share.share({
                title: `Saral App v1.0 Marks JSON - SchoolId:${loginData.data.school.schoolId} & Exam Id:${filteredData.examTestID}`,
                message:
                    `${(data)}`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                    Alert.alert("Data size limit exceeded,so cant't share it in email.Extract from backend")
                    //  console.log('jjjjj',result)
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
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
                <Text>No Data Available</Text>
            </View>
        )
    }

    useEffect(() => {
        getDataFromLocal()
        getStudentList()
        getPresentStudentList()
    }, [loacalstutlist])

    const getStudentList = async () => {
        let data = await getPresentAbsentStudent()
        if (data != null) {
            setUnsavedstudentList(data)
        }
    }

    const getDataFromLocal = async () => {
        let data = await getScannedDataFromLocal()
        if (data) {
            let filterscandata = data.filter((item) => {
                let findSection = item.studentsMarkInfo.some((item) => item.section == filteredData.section)
                if (filteredData.class == item.classId && filteredData.examDate == item.examDate && filteredData.subject == item.subject && findSection) {
                    return true
                }
            })
            setLoacalstutlist(filterscandata)
        }
    }


    const getPresentStudentList = () => {

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

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                    (loginData && loginData.data)
                    &&
                    <View>
                        <Text
                            style={styles.schoolName}
                        >
                            {Strings.school_name + ' Name : '}
                            <Text style={{ fontWeight: 'normal' }}>{loginData.data.school.name}</Text>
                        </Text>
                        <Text style={[styles.schoolId, { marginLeft: 5 }]}>
                            {Strings.schoolId_text + ' : '}
                            <Text style={{ fontWeight: 'normal', }}>
                                {loginData.data.school.schoolId}
                            </Text>
                        </Text>
                    </View>
                }
                {loacalstutlist[0] ?
                
                    <TouchableOpacity onPress={onShare}>
                        <Image style={{ height: 25, width: 25, marginHorizontal: 15, marginVertical: 20 }} source={Assets.Share} />
                    </TouchableOpacity> 
                    :
                    null}
            </View>

            <Text style={styles.scanStatus}>{Strings.scan_status}</Text>

            <FlatList
                data={loacalstutlist && presentStudentList}
                initialNumToRender={15}
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
