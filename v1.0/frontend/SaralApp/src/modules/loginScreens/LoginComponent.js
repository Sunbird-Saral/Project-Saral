import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, AppState } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import ButtonComponent from '../common/components/ButtonComponent'
import Spinner from '../common/components/loadingIndicator';
import APITransport from '../../flux/actions/transport/apitransport';
import { LoginAction } from '../../flux/actions/apis/LoginAction';
import { setLoginData, setLoginCred, getLoginCred } from '../../utils/StorageUtils'

class LoginComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            errUsername: '',
            errPassword: '',
            errCommon: '',
            schoolId: '',
            password: '',
            calledLogin: false,
            appState: AppState.currentState
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', async payload => {
            AppState.addEventListener('change', this.handleAppStateChange);
            this.componentMountCall()
        })
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.componentMountCall()  
        }
        this.setState({appState: nextAppState});
    }

    componentMountCall = async() => {
        // let updateNeeded = await VersionCheck.needUpdate();
        // if (updateNeeded && updateNeeded.isNeeded) {
        //     this.onAppUpdateCheck()
        // } else {
            this.loginUser()
        // }
    }

    loginUser = async () => {
        let loginCred = await getLoginCred()        
        if(loginCred) {
            this.setState({
                isLoading: true,
                schoolId: loginCred.schoolId,
                password: loginCred.password
            }, () => {                
                this.callLogin()
            })
        }
        else{
           this.setState({
               isLoading: false
           })
        }
    }

    callLogin = () => {
        const { schoolId, password } = this.state
        this.setState({
            isLoading: true,
            calledLogin: true
        }, () => {
            let loginCredObj = {
                "schoolId": schoolId,
                "password": password
            }
            let apiObj = new LoginAction(loginCredObj);
            this.props.APITransport(apiObj);
        })
    }

    onSubmit = () => {
        const { schoolId, password } = this.state
        if (schoolId === '' || schoolId === null) {
            this.setState({
                errUsername: Strings.please_enter_username,
                errPassword: ''
            })
            return;
        }
        if (password === '' || password === null) {
            this.setState({
                errUsername: '',
                errPassword: Strings.please_enter_password
            })
            return;
        }
        else {
            this.setState({
                errUsername: '',
                errPassword: '',
                schoolId: schoolId,
                password: password,
            }, () => {
                this.callLogin()  
            })
        }

    }


    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            
            const { apiStatus, loginData, navigation } = this.props
            const { schoolId, password, calledLogin } = this.state
            if (apiStatus && prevProps.apiStatus != apiStatus && apiStatus.error) {
                if (calledLogin) {
                    this.setState({ isLoading: false, calledLogin: false })
                    if (apiStatus && apiStatus.message) {
                        this.setState({
                            errUsername: '',
                            errPassword: '',
                            errCommon: apiStatus.message
                        })
                    }
                    else {
                        this.setState({
                            errUsername: '',
                            errPassword: '',
                            errCommon: Strings.something_went_wrong_please_try_again
                        })
                    }
                }
            }
            if (calledLogin) {
                if (loginData && prevProps.loginData != loginData) {                    
                    this.setState({
                        isLoading: false,
                        calledLogin: false
                    }, async () => {
                        if (loginData.status && loginData.status == 200) {
                            let loginCredObj = {
                                schoolId: schoolId,
                                password: password
                            }
                            let loginCred = await setLoginCred(loginCredObj)
                            let loginSaved = await setLoginData(loginData.data)
                            if (loginCred && loginSaved) {
                                navigation.navigate('mainMenu')
                            }
                            else {
                                this.setState({
                                    errUsername: '',
                                    errPassword: '',
                                    errCommon: Strings.something_went_wrong_please_try_again
                                })
                            }
                        }
                        else if (loginData.status && loginData.status == 422) {
                            this.setState({
                                errUsername: '',
                                errPassword: '',
                                errCommon: Strings.schoolid_password_doesnot_match
                            })
                        }
                        else {
                            this.setState({
                                errUsername: '',
                                errPassword: '',
                                errCommon: Strings.something_went_wrong_please_try_again
                            })
                        }
                    })
                }
            }
        }
    }

    onLoginDetailsChange = (text, type) => {
        this.setState({ [type]: text })
    }

    render() {
        const { schoolId, password, isLoading, errUsername, errPassword, errCommon } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View style={styles.container1}>
                        <Image 
                            source={require('../../assets/images/logo.jpeg')}
                            style={{ width: 100, height: 100 }}
                        />
                        <Text style={styles.header1TextStyle}>
                            {Strings.up_saralData.toUpperCase()}
                        </Text>
                    </View>

                    <View style={styles.container2}>
                        <View style={styles.loginContainer}>
                        <Text style={[styles.header1TextStyle, { paddingTop: '5%' }]}>
                            {Strings.login_text.toUpperCase()}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            {errCommon != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 2, width: '100%', fontWeight: 'normal', textAlign: 'center' }]}>{errCommon}</Text>}
                        </View>
                        <View style={styles.fieldContainerStyle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.labelTextStyle, { width: errUsername != '' ? '55%' : '100%' }]}>{Strings.enter_username}</Text>
                                {errUsername != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '45%', textAlign: 'right', fontWeight: 'normal', }]}>{errUsername}</Text>}
                            </View>
                            <TextInput
                                ref="schoolId"
                                style={styles.inputStyle}
                                onChangeText={(text) => this.onLoginDetailsChange(text, 'schoolId')}
                                value={schoolId}
                                placeholder={Strings.schoolId_text}
                                placeholderTextColor={AppTheme.BLACK_OPACITY_30}
                                autoCapitalize={'none'}
                            />
                        </View>
                        <View style={styles.fieldContainerStyle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.labelTextStyle, { width: errPassword != '' ? '50%' : '100%' }]}>{Strings.enter_password}</Text>
                                {errPassword != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '50%', textAlign: 'right', fontWeight: 'normal' }]}>{errPassword}</Text>}
                            </View>
                            <TextInput
                                ref="password"
                                style={styles.inputStyle}
                                onChangeText={(text) => this.onLoginDetailsChange(text, 'password')}
                                value={password}
                                placeholder={Strings.password_text}
                                placeholderTextColor={AppTheme.BLACK_OPACITY_30}
                                secureTextEntry
                            />
                            <View style={styles.btnContainer}>
                                <ButtonComponent
                                    btnText={Strings.login_text.toUpperCase()}
                                    onPress={this.onSubmit}
                                />
                            </View>
                        </View>
                        </View>
                    </View>

                    
                </ScrollView>
                {isLoading && <Spinner animating={isLoading} />}
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: AppTheme.GREY_WHITE
    },
    container1: {
        minHeight: 230,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'yellow'
    },
    header1TextStyle: {
        textAlign: 'center',
        fontSize: AppTheme.HEADER_FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        letterSpacing: 1,
        paddingTop: '10%'
    },
    cancelBtnStyle: {
        padding: 0,
        backgroundColor: 'transparent',
        height: 'auto'
    },
    cancelBtnTextStyle: {
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_LARGE,
        fontWeight: '600',
        color: AppTheme.WHITE_OPACITY,
        letterSpacing: 1,
    },
    container2: {
        flex: 1
    },
    loginContainer: {
        marginHorizontal: '5%',
        backgroundColor: AppTheme.WHITE,
        borderRadius: 8,
        padding: '4%',
        elevation: 2
    },
    fieldContainerStyle: {
        paddingVertical: '2.5%',
    },
    labelTextStyle: {
        width: '40%',
        fontSize: AppTheme.FONT_SIZE_MEDIUM,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        letterSpacing: 1,
        lineHeight: 35
    },
    inputStyle: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: AppTheme.LIGHT_GREY,
        paddingVertical: '3%',
        paddingHorizontal: '3%',
        padding: 0,
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
    },
    btnContainer: {
        paddingVertical: '5%'
    }
}

const mapStateToProps = (state) => {
    return {
        apiStatus: state.apiStatus,
        loginData: state.loginData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(LoginComponent));