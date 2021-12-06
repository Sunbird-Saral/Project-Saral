import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Share } from 'react-native';
import { Assets } from '../../../assets';
import AppTheme from '../../../utils/AppTheme';
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
            onSupportClick
        } = this.props
        return (
            <View style={[customHeaderContainer]}>


                <Text style={[styles.headerTitleTextStyle, customHeaderTextStyle, titletextstyle]}>{title}</Text>
                <View style={styles.imageViewContainer}>
                    <View style={styles.imageContainerStyle}>
                        
                        <TouchableOpacity
                        style={styles.imageContainerViewstyle}
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
        letterSpacing: 1
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
        letterSpacing: 1
    },
    versionTxtStyle: {
        // paddingHorizontal: '5%',
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        textAlign: 'left',
        fontWeight: 'bold',
        letterSpacing: 1
    },
    imageViewContainer: {
        bottom: 18,
        marginRight: 5,
        alignItems: 'flex-end',
        elevation: 20
        // justifyContent:'center'
    },
    imageContainerStyle: {
        padding: 10,
        marginRight: 10,
        // alignItems: "center",
        // justifyContent: 'center',
        width: '40%',
        height:80,
        elevation: 20,
        justifyContent: 'center',
        backgroundColor: AppTheme.WHITE
    },
    imageContainerViewstyle:{
        flexDirection:'row',
        marginVertical:5,
    }
}
export default HeaderComponents;