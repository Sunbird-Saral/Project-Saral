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
import APITransport from '../../flux/actions/transport/apitransport';
import { collectErrorLogs } from '../CollectErrorLogs';
import MultibrandLabels from '../common/components/multibrandlabels';

import { ScrollView } from 'react-native-gesture-handler';
import { monospace_FF } from '../../utils/CommonUtils';
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
    const BrandLabel = multiBrandingData && multiBrandingData.screenLabels && multiBrandingData.screenLabels.scanHistory[0]
    //functions
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

            let hasSet = filteredData.hasOwnProperty("set") ?  filteredData.set.length >= 0 ? filteredData.set : '' : null
            if (hasSet != null && hasSet != undefined && hasSet.length >= 0 && filter.length > 0) {
                let findSetStudent = filter.length > 0 ? filter[0].studentsMarkInfo.filter((item) => {
                    if (hasSet.length >= 0) {
                        return item.set == hasSet;
                    }
                })
                :
                []
                filter[0].studentsMarkInfo = findSetStudent
            }

            let len = 0

            filter.forEach((element, index) => {
                element.studentsMarkInfo.forEach((val) => {
                    if ((val.studentAvailability == true) && val.marksInfo.length > 0) {
                        len = len + 1
                    }
                })
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
                 />
            
                 <View>
                 {( BrandLabel) ?
                <MultibrandLabels
                Label1={BrandLabel.School}
                Label2={BrandLabel.SchoolId}
                School ={loginData.data.school.name}
                SchoolId={loginData.data.school.schoolId}
                />:
                    (loginData && loginData.data)
                    &&
                    <View style={{ width:'60%' }}>
                        <Text
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%',fontFamily : monospace_FF }}
                        >
                            {Strings.school_name + ' : '}
                            <Text style={{ fontWeight: 'normal' }}>
                                {loginData.data.school.name}
                            </Text>
                        </Text>
                        <Text
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}>
                                { Strings.schoolId_text + ' : '}
                            <Text style={{ fontWeight: 'normal' }}>
                                {loginData.data.school.schoolId}
                                </Text>
                                </Text>
                    </View>
                }
                </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container1}>
                <Text style={[styles.header1TextStyle, { borderColor: multiBrandingData ? multiBrandingData.themeColor2 : AppTheme.LIGHT_BLUE, backgroundColor: multiBrandingData ? multiBrandingData.themeColor2 : AppTheme.LIGHT_BLUE,fontFamily : monospace_FF }]}>
                    {Strings.ongoing_scan}
                </Text>
            </View>
            {
                apiStatus.unauthorized
                &&
                <Text style={{ color: AppTheme.ERROR_RED, marginLeft: 40, fontWeight: 'bold',fontFamily : monospace_FF }}>Roi Doesn't Exist</Text>
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
            
            <ButtonComponent
                customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                btnText={Strings.Back.toUpperCase()}
                activeOpacity={0.8}
                onPress={() => navigation.push('StudentsList')}
            />
            </ScrollView>


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
        // marginTop:30
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
    nxtBtnStyle:{ marginHorizontal: 40, marginTop: 20, borderRadius: 10, }
});