import React, { useState } from 'react'
import { View, Text, TouchableHighlight } from 'react-native';
import AppTheme from '../../../utils/AppTheme';

export const HighlightButton = ({
    onBtnPress,
    btnText
}) => {
    const [pressStatus, setPressStatus] = useState(false);
    return (
        <View
            style={styles.container}
        >
            <TouchableHighlight
                activeOpacity={1}
                style={[styles.btnStyle, pressStatus && styles.btnStylePress]}
                onPress={onBtnPress}
                underlayColor={AppTheme.BLUE}
                onHideUnderlay={() => setPressStatus(false)}
                onShowUnderlay={() => setPressStatus(true)}
            >
                <Text style={[styles.btnTextStyle, pressStatus && styles.btnTextPress]}>{btnText}</Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = {
    container: {
        width: '80%',
        marginVertical: '5%'
    },
    btnStyle: {
        alignItems: 'center',
        backgroundColor: AppTheme.WHITE,
        elevation: 15,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: AppTheme.BLUE
    },
    btnStylePress: {
        backgroundColor: AppTheme.BLUE,
    },
    btnTextStyle: {
        color: AppTheme.BLACK, 
        fontWeight: 'bold', 
        fontSize: AppTheme.FONT_SIZE_LARGE
    },
    btnTextPress: {
        color: AppTheme.WHITE
    },
}