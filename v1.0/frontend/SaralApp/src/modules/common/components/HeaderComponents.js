import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Share, Switch } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Assets } from '../../../assets';
import constants from '../../../flux/actions/constants';
import { storeFactory } from '../../../flux/store/store';
import AppTheme from '../../../utils/AppTheme';
import { dispatchCustomModalMessage, dispatchCustomModalStatus, monospace_FF } from '../../../utils/CommonUtils';
import { removeAllCache, removeMinimalUserCache, removeRegularUserCache } from '../../../utils/offlineStorageUtils';
import { setMinimalValue } from '../../../utils/StorageUtils';
import Strings from '../../../utils/Strings';


class HeaderComponents extends Component {
    constructor(props) {
        super(props);
    }
       
    render() {
        const {
            title,
            customHeaderContainer,
            customHeaderTextStyle,
            headerButton,
            customBtnStyle,
            titletextstyle,
            btnIcon,
            btnText,
            onPress,
            logoutHeaderText,
            onLogoutClick,
            customLogoutTextStyle,
            versionText,
            supportTeamText,
            onSupportClick,
            aboutMenu,
            helpMenu,
            minimalFlag,
            multiBrandingData,
            navigation,
            loginData
        } = this.props

        async function changeMinimalMode() {
            storeFactory.dispatch(minimalFlagAction(!minimalFlag));
            let saved = await setMinimalValue(!minimalFlag);
            console.log("saved",saved);
            goToMyScanScreen();
        }

        function minimalFlagAction (payload) {
            return {
                type: constants.MINIMAL_FLAG,
                payload
            }
        }

        function goToMyScanScreen() {
            console.log("navigation",navigation);
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
            });
            navigation.dispatch(resetAction);
            return true
        }

        async function removeLocalCache() {
            if (minimalFlag) {
                await removeMinimalUserCache(loginData.data.school.schoolId);
            } else {
                await removeRegularUserCache(loginData.data.school.schoolId);
            }
            navigation.navigate('auth');
        }

        async function removeGlobalCache(){
            await removeAllCache();
            navigation.navigate('auth')
        }

        const callCustomModal = (title, message, isAvailable, doLogout, cancel) => {
            let data = {
              title: title,
              message: message,
              isOkAvailable: isAvailable,
              okFunc: doLogout,
              isCancel: cancel
            }
            storeFactory.dispatch(dispatchCustomModalStatus(true));
            storeFactory.dispatch(dispatchCustomModalMessage(data));
          }

        return (
            <View style={{flex:1,marginTop: '10%',marginRight:'5%'}}>
                <View style={styles.imageViewContainer}>
                    <View style={[styles.imageContainerStyle,{height: loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode ? 240 : 180}]}>
                        
                        <TouchableOpacity
                        style={[styles.imageContainerViewstyle,{marginTop:10}]}
                        onPress={onSupportClick}
                        > 
                         <Image style={{width:15,height:15,top:5}}  source={Assets.Support}/>
                            <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle]}>{supportTeamText}</Text>
                        </TouchableOpacity>
                       
                        {logoutHeaderText && logoutHeaderText.length > 0 &&
                            <TouchableOpacity
                               style={styles.imageContainerViewstyle}
                                onPress={onLogoutClick}
                            >
                                 <Image style={{width:15,height:25}}  source={Assets.Logout}/>
                                <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle]}>{logoutHeaderText}</Text>
                            </TouchableOpacity>}

                        <TouchableOpacity
                        style={styles.imageContainerViewstyle}
                        onPress={aboutMenu}
                        > 
                         <Image style={{width:15,height:15,top:5}}  source={Assets.About}/>
                            <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle]}>{Strings.about_menu}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                        style={[styles.imageContainerViewstyle]}
                        onPress={helpMenu}
                        > 
                         <Image style={{width:15,height:15,top:5}}  source={Assets.Help}/>
                            <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle]}>{Strings.help_menu}</Text>
                        </TouchableOpacity>

                        {
                            loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode 
                            &&
                            <TouchableOpacity
                               style={styles.imageContainerViewstyle}
                                onPress={()=>{
                                    callCustomModal(Strings.message_text, Strings.are_you_sure_you_want_to_clear_local_cache, true, removeLocalCache, true)
                                }}
                                >
                                 <Image style={{width:10,height:20}}  source={Assets.delete}/>
                                <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle]}>{Strings.clear_local_cache}</Text>
                            </TouchableOpacity>
                        }
                            
                        {
                            loginData.data.school.hasOwnProperty("offlineMode") && loginData.data.school.offlineMode 
                            &&
                            <TouchableOpacity
                            style={styles.imageContainerViewstyle}
                            onPress={()=>{
                                callCustomModal(Strings.message_text, Strings.are_you_sure_you_want_to_clear_global_cache, true, removeGlobalCache, true)
                            }}
                            >
                                 <Image style={{width:10,height:20}}  source={Assets.delete}/>
                                <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle]}>{Strings.clear_global_cache}</Text>
                            </TouchableOpacity>
                        }
                            
                        
                        <View 
                        style={{flexDirection: 'row', marginBottom: 10}}
                        >
                            <Switch
                            trackColor={{ true: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE, false: '#000' }}
                            thumbColor={ !minimalFlag ? multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE: AppTheme.GREY}
                            value={!minimalFlag}
                            onValueChange={async()=>  await changeMinimalMode() }
                            />
                            
                        <TouchableOpacity
                        style={{marginHorizontal:"0%",marginBottom: 8}}
                        activeOpacity={1}
                        > 
                        {
                            minimalFlag
                            ?
                            <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle,{color: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE,fontWeight: 'bold'}]}>{Strings.minimal_mode}</Text>
                            :
                            <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle,{color: multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE,fontWeight: 'bold'}]}>{Strings.regular_mode}</Text>
                        }
                        </TouchableOpacity>

                        
                        
                        </View>
                    </View>
                </View>

                {versionText && versionText.length > 0 &&
                    <Text style={[styles.versionTxtStyle]}>{`${Strings.version_text}: ${versionText}`}</Text>}
                {headerButton && <TouchableOpacity
                    style={[styles.btnStyle, customBtnStyle]}
                    onPress={onPress}
                >
                    <Image 
                        source={btnIcon}
                        style={styles.btnIconStyle}
                        resizeMode={'contain'}
                    />
                    <Text style={styles.btnTextStyle}>{btnText}</Text>
                </TouchableOpacity>}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        minimalFlag: state.minimalFlag,
        multiBrandingData: state.multiBrandingData.response.data,
        loginData: state.loginData,
    }
  }

const styles = {
    mainHeaderContainerStyle: {
        height: 60, 
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    headerTitleTextStyle: {
        paddingHorizontal: '5%',
        color: AppTheme.BLUE,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily : monospace_FF
    },
    btnStyle: {
        height: 36,
        width: 101,
        borderRadius: 4,
        marginRight: '4%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: AppTheme.GREEN
    },
    btnIconStyle: {
        height: 20,
        width: 20
    },
    btnTextStyle: {
        fontSize: AppTheme.FONT_SIZE_LARGE,
        color: AppTheme.WHITE,
        textAlign: 'left',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily : monospace_FF
    },
    versionTxtStyle: {
        // paddingHorizontal: '5%',
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        textAlign: 'left',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily : monospace_FF
    },
    imageViewContainer: {
       
        marginRight: 5,
        alignItems: 'flex-end',
       
    },
    imageContainerStyle: {
        padding: 10,
        marginRight: 10,
        height: 140,
        elevation: 10,
        justifyContent: 'center',
        backgroundColor: AppTheme.WHITE
    },
    imageContainerViewstyle:{
        flexDirection:'row',
        marginVertical:2,
        marginBottom: 10
    }
}



export default (connect(mapStateToProps, null)(HeaderComponents));