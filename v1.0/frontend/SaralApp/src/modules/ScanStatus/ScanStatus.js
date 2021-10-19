import React, { useEffect } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

//redux
import { connect, useDispatch } from 'react-redux';

//constant
import { apkVersion } from '../../configs/config';
import AppTheme from '../../utils/AppTheme';
import Strings from '../../utils/Strings';

//components
import HeaderComponent from '../common/components/HeaderComponent';
import ScanStatusList from './ScanStatusList';

//styles
import { styles } from './ScanStatusStyle';

//Redux
import { bindActionCreators } from 'redux';

//api
import APITransport from '../../flux/actions/transport/apitransport'


const ScanStatus = ({
    loginData,
    scanedData
}) => {

    //function
    const renderItem = ({ item, index }) => {
        return (
            <ScanStatusList
                id={item.studentId}
                subject={item.subject}
            />
        )
    }

    const renderEmptyData = ({ item }) => {
        return (
            <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                <Text>No Data Available</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* <HeaderComponent
                title={Strings.up_saralData}
                customLogoutTextStyle={{ color: AppTheme.GREY }}
                versionText={apkVersion}
            /> */}
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
                data={scanedData && scanedData.data}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyData}
                keyExtractor={(item,index) => `${index.toString()}`}
                contentContainerStyle={styles.content}
            />

        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanedData: state.scanedData.response
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanStatus);
