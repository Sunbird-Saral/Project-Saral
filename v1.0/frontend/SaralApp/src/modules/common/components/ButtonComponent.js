import React from 'react';
import { TouchableOpacity, Text } from 'react-native'
import AppTheme from '../../../utils/AppTheme';


const ButtonComponent = ({
    onPress,
    customBtnStyle,
    disabled,
    activeOpacity,
    customBtnTextStyle,
    btnText
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.btnStyle, customBtnStyle]}
            disabled={disabled}
            activeOpacity={activeOpacity}
        >
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
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: AppTheme.BLUE
    },
    btnTextStyle: {
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_LARGE,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: AppTheme.WHITE
    }
}
export default ButtonComponent;