import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Share } from 'react-native';
import { Assets } from '../../../assets';
import AppTheme from '../../../utils/AppTheme';
import { monospace_FF } from '../../../utils/CommonUtils';
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
            helpMenu
        } = this.props
        return (
            <View style={{flex:1,marginTop: '10%',marginRight:'5%'}}>
                <View style={styles.imageViewContainer}>
                    <View style={styles.imageContainerStyle}>
                        
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
export default HeaderComponents;