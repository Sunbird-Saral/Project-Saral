import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, AppState, ActivityIndicator, Switch,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import ButtonComponent from '../common/components/ButtonComponent'
import Spinner from '../common/components/loadingIndicator';
import APITransport from '../../flux/actions/transport/apitransport';
import { LoginAction } from '../../flux/actions/apis/LoginAction';
import { DefaultBrandAction } from '../../flux/actions/apis/defaultBrandAction';
import {
    setLoginData, setLoginCred, getLoginCred, setRememberUser, getRememberedUser, forgetUser, setRememberPassword, getRememberedPassword, forgetUserpass, getLoginData
} from '../../utils/StorageUtils'
import { Assets } from '../../assets/index'
import { checkNetworkConnectivity, monospace_FF } from '../../utils/CommonUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBrandingDataApi, getLoginApi, setLoginApi,setBrandingDataApi } from '../../utils/offlineStorageUtils';
import { storeFactory } from '../../flux/store/store';
import constants from '../../flux/actions/constants';

class LoginComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Loading: true,
            isLoading: true,
            errUsername: '',
            errPassword: '',
            errCommon: '',
            schoolId: '',
            password: '',
            calledLogin: false,
            appState: AppState.currentState,
            text: '',
            rememberMe: false,
            rememberMe1: false,
            hidePassword:true


        }
    }

    setPasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
      }
    async componentDidMount() {
        const schollId = await this.rememberMeSchoolId();
        const password = await this.rememberMePassword();
        this.setState({
            schoolId: schollId || "" ,
            password: password || "" ,
            rememberMe: schollId && password ? true : false,
            isLoading:false,
          
        });

        let hasNetwork = await checkNetworkConnectivity();
        let hasCacheData = await getBrandingDataApi();

        this.timerState = setTimeout(() => { this.setState({ Loading: false }) }, 5000)
        if (hasCacheData) {
            await this.callBrandingCache(schollId, "schoolId")
        } else if (hasNetwork) {
            this.callDefaultbrandingData()
        }
        this.props.navigation.addListener('willFocus', async payload => {
            AppState.addEventListener('change', this.handleAppStateChange);
            this.componentMountCall()
        })
    }

    async callBrandingCache(key, type) {
        let hasCacheData = await getBrandingDataApi();
        let hasNetwork = await checkNetworkConnectivity();
        
        let cacheFilterData = hasCacheData != null
        ?
         hasCacheData.filter((element) => {
            if (element.key == "global") {
                return true
            }
        })
        :
        []

        if (hasCacheData &&  type == 'schoolId' && cacheFilterData.length > 0) {
            storeFactory.dispatch(this.dispatchBrandingDataApi(cacheFilterData.length > 0 ? cacheFilterData[0].data : []))
            this.setState({
                errCommon: '',
                isLoading: false
            })
        } else if (hasNetwork) {
            this.callDefaultbrandingData()
        } else if(type == "schoolId" && key != undefined && key.length > 0 ) {
            storeFactory.dispatch(this.dispatchBrandingDataApi({}))
            this.setState({
                errCommon: Strings.you_dont_have_cache,
                isLoading: false
            })
        }
    }

    dispatchBrandingDataApi(payload) {
        return {
            type: constants.DEFAULT_BRAND,
            payload
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timerState)
    }

    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.componentMountCall()
        }
        this.setState({ appState: nextAppState });
    }

    componentMountCall = async () => {

        this.loginUser()

    }


    callDefaultbrandingData() {
        let payload = this.props.defaultBrandingdata
        let apiObj = new DefaultBrandAction(payload);
        this.props.APITransport(apiObj)
    }

    loginUser = async () => {
        let loginCred = await getLoginCred()
        if (loginCred) {
            this.setState({
                isLoading: true,
                schoolId: loginCred.schoolId,
                password: loginCred.password
            }, () => {
                this.callLogin()
            })
        }
        else {
            this.setState({
                isLoading: false
            })
        }
    }

    callLogin = async () => {
        const { schoolId, password } = this.state
        const { loginData } = this.props

        let hasNetwork = await checkNetworkConnectivity();



        
        let hasCacheData = await getLoginApi();
        
        let cacheFilterData = hasCacheData != null
            ?
            hasCacheData.filter((element)=>{
                let userId = JSON.parse(element.data.config.data)
                if (userId.schoolId == schoolId) {
                    return true
                }
            })
            :
            []
        
        if (hasCacheData != null && cacheFilterData.length > 0) {
            if (cacheFilterData.length > 0) {
                storeFactory.dispatch(this.dispatchLoginData(cacheFilterData[0].data))
                this.props.navigation.navigate('mainMenu')
            }
        } else if (hasNetwork){
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
        } else if(!hasNetwork && schoolId.length > 0) {
            this.setState({
                errCommon: Strings.you_dont_have_cache,
                isLoading: false
            })    
        }
         else {
            this.setState({
                errCommon: Strings.you_seem_to_be_offline_please_check_your_internet_connection,
                isLoading: false
            })            
        }
    }

    dispatchLoginData(payload) {
        return {
            type: constants.LOGIN_PROCESS,
            payload
        }
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

    toggleRememberMe = (value) => {
        this.setState({ rememberMe: value })
        if (value === true) {
            //user wants to be remembered.
            this.rememberUserfunction();
        } else {
            this.forgetUserfunction();
        }
    }

    onLoginDetailsChange = (text, type,value) => {
         this.callBrandingCache(text, type)
        this.setState({ [type]: text })
         this.toggleRememberMe()
    }

    rememberUserfunction = async () => {
        try {
            await setRememberUser(this.state.schoolId)
            await setRememberPassword(this.state.password)
        } catch (error) {
            alert('error setItem', error)
        }
    };

    rememberMeSchoolId = async () => {
        try {
            const schoolId = await getRememberedUser()
            if (schoolId !== null) {
                return schoolId;
            }
        } catch (error) {
        }
    };

    rememberMePassword = async () => {
        try {
            const password = await getRememberedPassword()
            if (password !== null) {
                return password;
            }
        } catch (error) {
        }
    };

    forgetUserfunction = async () => {
        // await forgetUser()
        try {
            await forgetUser('Longtail-user')
            await forgetUserpass('Longtail-user')
        } catch (error) {
            // Error removing
        }
    };


   async componentDidUpdate(prevProps) {
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
                        let hasNetwork = await checkNetworkConnectivity();
                        if (loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode && hasNetwork) {
                            let getLoginCache = await getLoginApi();
                            let loginCred = await getLoginCred();
                            let loginUser = `${loginCred.schoolId}`
                            if (getLoginCache != null) {

                                const result = getLoginCache.filter(_element => _element.key === loginUser);

                                if (result.length > 0) {
                                    for (let element of getLoginCache) {
                                        if (element.key == result[0].key) {
                                            element.data = loginData
                                            break;
                                        }
                                    };
                                } else {
                                    let payload = {
                                        key: `${loginUser}`,
                                        data: loginData
                                    }
                                    getLoginCache.push(payload);
                                }
                                await setLoginApi(getLoginCache);
                                
                            } else {
                                let payload = {
                                    key: `${loginUser}`,
                                    data: loginData
                                }
                                await setLoginApi([payload])
                            }
                        }
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
        let hasNetwork = await checkNetworkConnectivity();
        if (this.props.defaultBrandingApidata && this.props.defaultBrandingApidata.status&& this.props.defaultBrandingApidata.status == 200 &&  hasNetwork) {
           const {defaultBrandingApidata} = this.props
            let getBrandingCache = await getBrandingDataApi();
            
            if (getBrandingCache != null) {

                let data = getBrandingCache.filter((e)=> {
                    if (e.key == 'global') {
                        return true
                    }
                });

                    if (data.length > 0) {
                        for (let element of getBrandingCache) {
                            if (element.key == data[0].key) {
                                element.data = defaultBrandingApidata
                                break;
                            }
                        };
                    } else {
                        let payload = {
                            key: `global`,
                            data: defaultBrandingApidata
                        }
                        getBrandingCache.push(payload);
                    }
                await setBrandingDataApi(getBrandingCache);
            } else {
                let payload = {
                    key: `global`,
                    data: defaultBrandingApidata
                }
                await setBrandingDataApi([payload])
            }
        }
    }



  

    render() {
        const { password, isLoading, Loading, errUsername, errPassword, errCommon } = this.state;
        const { defaultBrandingdata } = this.props
        if (defaultBrandingdata === undefined || defaultBrandingdata === null) {
            return <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    {Loading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold',fontFamily : monospace_FF }}>Loading Branding ...</Text>
                        </View> :

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 100, height: 100 }} source={Assets.AppLogo} />
                        </View>

                    }

                    <View style={styles.container2}>
                        <View style={styles.loginContainer}>
                            <Text style={[styles.header1TextStyle, { paddingTop: '5%',fontFamily : monospace_FF }]}>
                                {Strings.login_text.toUpperCase()}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {errCommon != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 2, width: '100%', fontWeight: 'normal', textAlign: 'center',fontFamily : monospace_FF }]}>{errCommon}</Text>}
                            </View>
                            <View style={styles.fieldContainerStyle}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.labelTextStyle, { width: errUsername != '' ? '55%' : '100%',fontFamily : monospace_FF }]}>{Strings.enter_username}</Text>
                                    {errUsername != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '45%', textAlign: 'right', fontWeight: 'normal',fontFamily : monospace_FF }]}>{errUsername}</Text>}
                                </View>
                                <TextInput
                                    ref="schoolId"
                                    style={styles.inputStyle}
                                    onChangeText={(text) => {
                                        this.onLoginDetailsChange(text, 'schoolId')
                                    }}
                                    value={this.state.schoolId}
                                    placeholder={Strings.userId_text}
                                    placeholderTextColor={AppTheme.BLACK_OPACITY_30}
                                    autoCapitalize={'none'}
                                    importantForAutofill="yes"
                                />

                            </View>
                            <View style={styles.fieldContainerStyle}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.labelTextStyle, { width: errPassword != '' ? '50%' : '100%',fontFamily : monospace_FF }]}>{Strings.enter_password}</Text>
                                    {errPassword != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '50%', textAlign: 'right', fontWeight: 'normal',fontFamily : monospace_FF }]}>{errPassword}</Text>}
                                </View>
                                <View style={styles.textBoxContainer}>
                                    <TextInput
                                        ref="password"
                                        style={styles.inputStyle}
                                        onChangeText={(text) => this.onLoginDetailsChange(text, 'password')}
                                        value={password}
                                        placeholder={Strings.password_text}
                                        placeholderTextColor={AppTheme.BLACK_OPACITY_30}
                                        secureTextEntry={this.state.hidePassword}
                                    />
                                    <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility}>
                                        <Image source={(this.state.hidePassword) ? Assets.closeEye : Assets.openEye} style={styles.buttonImage} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.btnContainer}>
                                    {Loading ?
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold', fontFamily : monospace_FF }}>Loading Branding ...</Text>
                                        </View> :
                                        <View>
                                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                <Switch
                                                    trackColor={{ true: '#111', false: '#111' }}
                                                    thumbColor={AppTheme.GREY}
                                                    value={this.state.rememberMe}
                                                    onValueChange={(value) => this.toggleRememberMe(value)} />
                                                <Text>Remember Me</Text>
                                            </View>
                                            <View style={styles.btnContainer}>
                                            <ButtonComponent
                                                btnText={Strings.login_text.toUpperCase()}
                                                onPress={this.onSubmit}
                                                themeColor1={{ backgroundColor: AppTheme.BLUE }}
                                            /></View></View>}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {isLoading && <Spinner animating={isLoading} />}
            </View>
        }
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                >

                    <View style={styles.container1}>
                        <Image style={{ width: 100, height: 100 }} source={{ uri: defaultBrandingdata && 'data:image/png;base64,' + this.props.defaultBrandingdata.logoImage }} />
                    </View>


                    <View style={styles.container2}>
                        <View style={styles.loginContainer}>
                            <Text style={[styles.header1TextStyle, { paddingTop: '5%',fontFamily : monospace_FF }]}>
                                {Strings.login_text.toUpperCase()}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {errCommon != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 2, width: '100%', fontWeight: 'normal', textAlign: 'center',fontFamily : monospace_FF }]}>{errCommon}</Text>}
                            </View>
                            <View style={styles.fieldContainerStyle}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.labelTextStyle, { width: errUsername != '' ? '55%' : '100%',fontFamily : monospace_FF }]}>{Strings.enter_username}</Text>
                                    {errUsername != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '45%', textAlign: 'right', fontWeight: 'normal',fontFamily : monospace_FF }]}>{errUsername}</Text>}
                                </View>
                                <TextInput
                                    ref="schoolId"
                                    style={styles.inputStyle}
                                    onChangeText={(text) => {
                                        this.onLoginDetailsChange(text, 'schoolId')
                                    }}
                                    value={this.state.schoolId}
                                    placeholder={Strings.userId_text}
                                    placeholderTextColor={AppTheme.BLACK_OPACITY_30}
                                    autoCapitalize={'none'}
                                />

                            </View>
                            <View style={styles.fieldContainerStyle}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.labelTextStyle, { width: errPassword != '' ? '50%' : '100%',fontFamily : monospace_FF }]}>{Strings.enter_password}</Text>
                                    {errPassword != '' && <Text style={[styles.labelTextStyle, { color: AppTheme.ERROR_RED, fontSize: AppTheme.FONT_SIZE_TINY + 1, width: '50%', textAlign: 'right', fontWeight: 'normal',fontFamily : monospace_FF }]}>{errPassword}</Text>}
                                </View>
                                <View style={styles.textBoxContainer}>
                                    <TextInput
                                        ref="password"
                                        style={styles.inputStyle}
                                        onChangeText={(text) => this.onLoginDetailsChange(text, 'password')}
                                        value={password}
                                        placeholder={Strings.password_text}
                                        placeholderTextColor={AppTheme.BLACK_OPACITY_30}
                                        secureTextEntry={this.state.hidePassword}
                                    />
                                    <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility}>
                                        <Image source={(this.state.hidePassword) ? Assets.closeEye : Assets.openEye} style={styles.buttonImage} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <Switch
                                        trackColor={{ true: '#111', false: '#111' }}
                                        thumbColor={defaultBrandingdata && defaultBrandingdata.themeColor1}
                                        value={this.state.rememberMe}
                                        onValueChange={(value) => this.toggleRememberMe(value)} />
                                    <Text>Remember Me</Text>
                                </View>
                                <View style={styles.btnContainer}>
                                    <ButtonComponent
                                        btnText={Strings.login_text.toUpperCase()}
                                        onPress={this.onSubmit}
                                        themeColor1={{ backgroundColor: defaultBrandingdata && defaultBrandingdata.themeColor1 }}
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
    },
    img: {
        width: 100,
        height: 100
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
    },
    buttonImage: {
        width: 30, height: 30
    },
    textBoxContainer: {
        position: 'relative',
        alignSelf: 'stretch',
        justifyContent: 'center',

    },
  
    touachableButton: {
        position: 'absolute',
        right: 3,
        height: 40,
        width: 35,
        padding: 2
    },
}


const mapStateToProps = (state) => {
    return {
        apiStatus: state.apiStatus,
        loginData: state.loginData,
        defaultBrandingApidata: state.defaultBrandingdata.response,
        defaultBrandingdata: state.defaultBrandingdata.response.data,
        multiBrandingData: state.multiBrandingData.response.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(LoginComponent));