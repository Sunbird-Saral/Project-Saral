import React, { Component } from 'react';
import { View, Text, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash'
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import { apkVersion } from '../../configs/config';
import HeaderComponent from '../common/components/HeaderComponent';
import { HighlightButton } from '../common/components/HighlightButton';
import { SCAN_TYPES } from '../../utils/CommonUtils';
import { ScantypeAction } from '../../flux/actions/apis/scanTypeAction'

class DashboardComponent extends Component {
    constructor(props) {
        super(props);

        this.onBack = this.onBack.bind(this)
    }

    componentDidMount() {
        const { navigation } = this.props

        navigation.addListener('willFocus', async payload => {
            BackHandler.addEventListener('hardwareBackPress', this.onBack)
        })

        this.willBlur = navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBack)
        );
    }

    onBack = () => {
        BackHandler.exitApp()
        return true
    }

    onLogoutClick = async () => {
        Alert.alert(Strings.message_text, Strings.are_you_sure_you_want_to_logout, [
            { 'text': Strings.no_text, style: 'cancel' },
            {
                'text': Strings.yes_text, onPress: async () => {
                    await AsyncStorage.clear();
                    this.props.navigation.navigate('auth')
                }
            }
        ])
    }

    onNextClick = (type) => {
        const { ScantypeAction, navigation } = this.props
        ScantypeAction({ scanType: type })
        // if(type == SCAN_TYPES.SAT_TYPE) {
        //     this.props.navigation.navigate('myScan')
        // }
        // else {
            navigation.navigate('selectDetails')
        // }
    }

    render() {
        const { loginData } = this.props
        return (

            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <HeaderComponent
                    title={Strings.up_saralData}
                    logoutHeaderText={Strings.logout_text}
                    customLogoutTextStyle={{ color: AppTheme.GREY }}
                    onLogoutClick={this.onLogoutClick}
                />
                 {(loginData && loginData.data) && 
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text 
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold',  paddingHorizontal: '5%', paddingVertical: '2%' }}
                        >
                            {Strings.school_name+' : '}
                            <Text style={{ fontWeight: 'normal'}}>
                                {loginData.data.school.name}
                            </Text>
                        </Text>
                        <Text 
                            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
                        >
                            {Strings.schoolId_text+' : '}
                            <Text style={{ fontWeight: 'normal'}}>
                                {loginData.data.school.schoolId}
                            </Text>
                        </Text>
                    </View>}
                    <Text 
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR-3, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', marginBottom: '4%' }}
                    >
                        {Strings.version_text+' : '}
                        <Text style={{ fontWeight: 'normal'}}>
                            {apkVersion}
                        </Text>
                    </Text>
                    <View style={styles.container1}>
                        <View style={{ backgroundColor: AppTheme.WHITE, width: '100%', alignItems: 'center', paddingVertical: '15%', 
                        borderRadius: 8, borderWidth: 1, borderColor: AppTheme.BLUE  }}>
                        <HighlightButton 
                            btnText={Strings.sat_string}
                            onBtnPress={() => this.onNextClick(SCAN_TYPES.SAT_TYPE)}
                        />
                        <HighlightButton 
                            btnText={Strings.pat_string}
                            onBtnPress={() => this.onNextClick(SCAN_TYPES.PAT_TYPE)}
                        />
                        </View>
                    </View>

            </View>
        );
    }
}

const styles = {
    container1: {
        flex: .8,
        marginHorizontal: '6%',
        alignItems: 'center',
        justifyContent: 'center'
    }
}

const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        ScantypeAction: ScantypeAction
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(DashboardComponent));