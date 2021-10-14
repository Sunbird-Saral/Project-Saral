import React, { Component } from 'react';
import { View, ScrollView, Text, BackHandler, Alert, TouchableOpacity, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/FontAwesome';
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import { Assets } from '../../assets/index'
import Spinner from '../common/components/loadingIndicator';
import { apkVersion } from '../../configs/config';
import HeaderComponent from '../common/components/HeaderComponent';
import DropDownMenu from '../common/components/DropDownComponent';
import TextField from '../common/components/TextField';
import ButtonComponent from '../common/components/ButtonComponent';
import { getLoginData, setStudentsExamData, getStudentsExamData, getLoginCred, setLoginData } from '../../utils/StorageUtils'
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction'
import { GetStudentsAndExamData } from '../../flux/actions/apis/getStudentsAndExamData';
import { FilteredDataAction } from '../../flux/actions/apis/filteredDataActions';
import APITransport from '../../flux/actions/transport/apitransport';
import { cryptoText, SCAN_TYPES, validateToken } from '../../utils/CommonUtils';
import { StackActions, NavigationActions } from 'react-navigation';
import { ROIAction } from '../StudentsList/ROIAction';
import { GetAbsentStudentData } from '../../flux/actions/apis/getAbsentStudentData';
import { LoginAction } from '../../flux/actions/apis/LoginAction';
import JsonData from '../../../multi-tenant-branding.json'


const clearState = {
    defaultSelected: Strings.select_text,
    classesArr: [],
    classList: [],
    classListIndex: -1,
    selectedClass: '',
    sectionList: [],
    sectionListIndex: -1,
    selectedSection: '',
    pickerDate: new Date(),
    selectedDate: '',
    subArr: [],
    examTestID: [],
    subIndex: -1,
    selectedSubject: '',
    errClass: '',
    errSub: '',
    errDate: '',
    errSection: '',
    selectedClassId: '',
    calledStudentsData: false,
    sectionValid: false,
    username: '',
    password: '',
    dataPayload: null,
    calledLogin: false,
    callApi: '',
    dateVisible: false,
    examDate: [],
    calledAbsentStatus: false,
    calledScanStaus: false,
    absentStatusPayload: null,
    subjectsData: [],

}

class HomeComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            logindataid: this.props.loginData.data.school.state,
            filterdataid: [],
        }
    }

    componentDidMount() {
        this.dataShow();
    }
    dataShow() {
        var data = JsonData.multiTenantConfig.filter((item => {
            if (item.state == this.state.logindataid) {
                return true

            } else {
                return false
            }
        }))
        // console.log('datataaa',data.Theme)
        this.setState({ filterdataid: data })

    }
    render() {
        const { loginData } = this.props
        const Logindataid = loginData.data.school.state
        console.log(Logindataid)


        return (

            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    
                    {
                        this.state.filterdataid.map((item) => {
                            return (
                                <View>
                                    <View key={item.schoolId} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        {item.logoImage ? <Image style={{ height: 100, width: 100 }} source={{ uri: 'data:image/png;base64,' + item.logoImage }} /> :
                                            <Image style={{ height: 100, width: 100 }} source={Assets.AppLogo} />}
                                    </View>
                                    <View>
                                        {/* <Text style={styles.welcometext}>{Strings.welcome_up}</Text> */}
                                        <Text style={styles.welcometext}>{Strings.welcome_up}</Text>
                                    </View>

                                    <View style={styles.btnContainer}>
                                        <ButtonComponent
                                            customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: item.Theme ? item.Theme : AppTheme.BLUE }]}
                                            btnText={Strings.get_start}
                                            onPress={() => this.props.navigation.navigate('selectDetails', { Theme: item.Theme })}
                                            icon={"arrowright"}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                </View>
                {/* </ScrollView> */}
            </View>
        );
    }
}

const styles = {
    container1: {
        flex: 1,
        marginHorizontal: '6%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    btnContainer: {
        paddingVertical: '5%'
    },
    welcometext: { textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#00000033', fontWeight: 'bold' },
    header1TextStyle: {
        // backgroundColor: AppTheme.WHITE_OPACITY,
        lineHeight: 40,
        borderRadius: 4,
        // borderWidth: 1,
        borderColor: AppTheme.LIGHT_GREY,
        width: '100%',
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL + 2,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        marginBottom: '5%'
    },
    fieldContainerStyle: {
        paddingVertical: '2.5%'
    },
    labelTextStyle: {
        width: '40%',
        fontSize: AppTheme.FONT_SIZE_MEDIUM,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        letterSpacing: 1,
        lineHeight: 35
    },
    nxtBtnStyle: {
        width: 250,
        marginBottom: 15
    }
}

const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse,
        loginData: state.loginData,
        studentsAndExamData: state.studentsAndExamData,
        scanTypeData: state.scanTypeData.response,
        apiStatus: state.apiStatus,
        roiData: state.roiData,
        absentStudentDataResponse: state.absentStudentDataResponse,
        getScanStatusData: state.getScanStatusData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        OcrLocalResponseAction: OcrLocalResponseAction,
        FilteredDataAction: FilteredDataAction
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(HomeComponent));