import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AppTheme from '../../../utils/AppTheme';
import Strings from '../../../utils/Strings';


class HeaderComponent extends Component {
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
            btnIcon,
            btnText,
            onPress,
            logoutHeaderText,
            onLogoutClick,
            customLogoutTextStyle,
            versionText
        } = this.props
        return (
            <View style={[styles.mainHeaderContainerStyle, customHeaderContainer]}>
                <Text style={[styles.headerTitleTextStyle, customHeaderTextStyle]}>{title}</Text>
                {logoutHeaderText && logoutHeaderText.length > 0 && 
                <TouchableOpacity
                    onPress={onLogoutClick}
                >
                    <Text style={[styles.headerTitleTextStyle, customLogoutTextStyle]}>{logoutHeaderText}</Text>
                </TouchableOpacity>}
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
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitleTextStyle: {
        paddingHorizontal: '5%',
        fontSize: AppTheme.FONT_SIZE_LARGE,
        color: AppTheme.BLUE,
        textAlign: 'left',
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
        paddingHorizontal: '5%',
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        textAlign: 'left',
        fontWeight: 'bold',
        letterSpacing: 1
    }
}
export default HeaderComponent;