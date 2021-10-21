import React ,{useEffect} from 'react';
import { FlatList, Text, View ,BackHandler} from 'react-native';

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


const ScanStatus = ({
    loginData,
    scanedData,
    multiBrandingData,
    navigation,
}) => {

    //function
    const renderItem = ({ item, index }) => {
        return (
            <ScanStatusList
                themeColor1 ={multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}
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
