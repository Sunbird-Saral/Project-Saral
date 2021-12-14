import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,BackHandler } from 'react-native';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//constant
import AppTheme from '../../utils/AppTheme';
import { getScannedDataFromLocal,getErrorMessage } from '../../utils/StorageUtils';
import Strings from '../../utils/Strings';

//component
import Spinner from '../common/components/loadingIndicator';
import ScanHistoryCard from './ScanHistoryCard';
import ButtonComponent from '../common/components/ButtonComponent';
import ShareComponent from '../common/components/Share';
import { collectErrorLogs } from '../CollectErrorLogs';

import { ScrollView } from 'react-native-gesture-handler';
const ScanHistory = ({
    loginData,
    navigation,
    apiStatus,
    multiBrandingData,
    filteredData
}) => {

    //Hooks
    const [isLoading, setIsLoading] = useState(false)
    const [scanStatusData, setScanStatusData] = useState(false)
    const [logmessage,setLogmessage] = useState()
    //functions

    useEffect(async() => {
        let message = await getErrorMessage()
        setLogmessage(message[0])
    }, []);
    useEffect(() => {
        sumOfLocalData()
    }, [])

    const sumOfLocalData = async () => {
        const data = await getScannedDataFromLocal()

        if (data != null) {
            let filter = data.filter((e) => {
                let findSection = false
                findSection = e.studentsMarkInfo.some((item) => item.section == filteredData.section)

                if (filteredData.class == e.classId && e.examDate == filteredData.examDate && e.subject == filteredData.subject && findSection) {
                    return true
                } else {
                    return false
                }
            })


            let len = 0

            filter.forEach((element, index) => {
                len = len + element.studentsMarkInfo.length
            });
            setScanStatusData(len)
        } else {
            setScanStatusData(0)
        }
    }

    useEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('');
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );

    return (
        <View style={styles.container}>
              <ShareComponent
                 navigation={navigation}
                 message={JSON.stringify(logmessage, null, 2)}
                 />
                 {/* <ScrollView> */}
            <ScrollView style={{marginTop:45}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                       
            {
                (loginData && loginData.data)
                &&
                <View style={{ width:'60%' }}>
                    <Text
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}>
                        {Strings.school_name + '  : '}
                        <Text style={{ fontWeight: 'normal' }}>
                            {loginData.data.school.name}
                        </Text>
                    </Text>
                </View>
            }
            <View style={styles.container1}>
                <Text style={[styles.header1TextStyle, { borderColor: multiBrandingData ? multiBrandingData.themeColor2 : AppTheme.LIGHT_BLUE, backgroundColor: multiBrandingData ? multiBrandingData.themeColor2 : AppTheme.LIGHT_BLUE }]}>
                    {Strings.ongoing_scan}
                </Text>
            </View>
            {
                apiStatus.unauthorized
                &&
                <Text style={{ color: AppTheme.ERROR_RED, marginLeft: 40, fontWeight: 'bold' }}>Roi Doesn't Exist</Text>
            }

            <ScanHistoryCard
                showButtons={apiStatus.unauthorized ? false : true}
                scanstatusbutton={false}
                navigation={navigation}
                themeColor1={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                scanStatusData={scanStatusData}
                setScanStatusData={setScanStatusData}
            />
            </ScrollView>

            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.Back.toUpperCase()}
                activeOpacity={0.8}
                onPress={() => navigation.push('StudentsList')}
            />

            {isLoading && <Spinner animating={isLoading} />}

        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        filteredData: state.filteredData.response,
        loginData: state.loginData,
        apiStatus: state.apiStatus,
        roiData: state.roiData.response,
        multiBrandingData: state.multiBrandingData.response.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        collectErrorLogs: collectErrorLogs
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanHistory);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.WHITE_OPACITY
    },
    container1: {
        marginHorizontal: '4%',
        alignItems: 'center',
        marginTop:13,
        // paddingVertical: '4%'
    },
    header1TextStyle: {
        backgroundColor: AppTheme.LIGHT_BLUE,
        lineHeight: 40,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: AppTheme.LIGHT_BLUE,
        width: '100%',
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        letterSpacing: 1
    },
    nxtBtnStyle:{ marginHorizontal: 40, marginBottom: 20, borderRadius: 10, }
});