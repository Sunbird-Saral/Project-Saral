import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native'
import AppTheme from '../../../utils/AppTheme';


const ButtonWithIcon = ({
    onPress,
    customBtnStyle,
    disabled,
    activeOpacity,
    customBtnTextStyle,
    btnText, 
    bgColor,
    customBtnIconStyle,
    btnIcon
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.btnStyle, customBtnStyle, {backgroundColor: bgColor}]}
            disabled={disabled}
            activeOpacity={activeOpacity}
        >
            <Image 
                style={[styles.btnIconStyle, customBtnIconStyle]}
                source={btnIcon}
                resizeMode={'contain'}
            />
            <Text
                style={[styles.btnTextStyle, customBtnTextStyle]}
            >
                {btnText}
            </Text>
        </TouchableOpacity>
    );
}
const styles = {
    btnStyle: {
        height: 55,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
    },
    btnIconStyle: {
        height: 25,
        width: 25
    },
    btnTextStyle: {
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_LARGE,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: AppTheme.WHITE
    }
}
export default ButtonWithIcon;