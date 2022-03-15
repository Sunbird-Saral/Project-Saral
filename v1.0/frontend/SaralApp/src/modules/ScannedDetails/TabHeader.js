import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { monospace_FF } from '../../utils/CommonUtils';

const TabHeader = ({
    tabIndex,
    tabLabel1,
    tabLabel2,
    onPressTab1,
    onPressTab2
}) => {
    return(
        <View style={styles.container}>

            <TouchableOpacity 
                style={[styles.tabBtnStyle, tabIndex == 1 ? styles.activeTabBtnStyle1 : styles.inactiveTabBtnStyle1]}
                activeOpacity={.9}
                onPress={onPressTab1}
            >
                {tabIndex == 1 ? <View style={[styles.tabNumberStyle, tabIndex == 1 ? styles.activeTabNumberStyle : styles.inactiveTabNumberStyle]}>
                    <Text style={[styles.tabNumberTextStyle, { color: tabIndex == 1 ? AppTheme.BLUE_BORDER : AppTheme.INACTIVE_BTN_TEXT,fontFamily : monospace_FF}]}>
                        {'1'}
                    </Text>
                </View> : 
                <Image 
                    source={require('../../assets/images/check.png')}
                    style={{ width: 30, height: 25}}
                    resizeMode={'contain'}
                />
                }
                <Text style={[styles.tabLabelStyle, {color: tabIndex == 1 ? AppTheme.BLACK : AppTheme.GREEN,fontFamily : monospace_FF}]}>
                    {tabLabel1}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.tabBtnStyle, tabIndex == 2 ? styles.activeTabBtnStyle2 : styles.inactiveTabBtnStyle2]}
                activeOpacity={.9}
                onPress={onPressTab2}
            >
                <View style={[styles.tabNumberStyle, tabIndex == 2 ? styles.activeTabNumberStyle : styles.inactiveTabNumberStyle]}>
                    <Text style={[styles.tabNumberTextStyle, { color: tabIndex == 2 ? AppTheme.BLUE_BORDER : AppTheme.INACTIVE_BTN_TEXT,fontFamily : monospace_FF}]}>
                        {'2'}
                    </Text>
                </View>
                <Text style={[styles.tabLabelStyle, {color: tabIndex == 2 ? AppTheme.BLACK : AppTheme.INACTIVE_BTN_TEXT,fontFamily : monospace_FF}]}>
                    {tabLabel2}
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = {
    container: {
        height: 85,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBtnStyle: {
        height: '100%',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabBtnStyle1: {
        backgroundColor: AppTheme.WHITE,
        borderTopLeftRadius: 4,
    },
    inactiveTabBtnStyle1: {
        backgroundColor: AppTheme.GREY_DISABLED,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        borderTopLeftRadius: 4,
    },
    activeTabBtnStyle2: {
        backgroundColor: AppTheme.WHITE,
        borderTopEndRadius: 4
    },
    inactiveTabBtnStyle2: {
        backgroundColor: AppTheme.GREY_DISABLED,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        borderTopEndRadius: 4
    },
    tabNumberStyle: {
        width: 25,
        height: 25, 
        borderRadius: 25,
        borderWidth: 2,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    activeTabNumberStyle: {
        borderColor: AppTheme.BLUE_BORDER,
    },
    inactiveTabNumberStyle: {
        borderColor: AppTheme.INACTIVE_BTN_TEXT,
    },  
    tabNumberTextStyle: {
        fontSize: AppTheme.FONT_SIZE_SMALL,
        fontWeight: 'bold'
    },  
    tabLabelStyle: {
        fontWeight: 'bold',
        fontSize: AppTheme.FONT_SIZE_MEDIUM_SMALL,
        lineHeight: 25
    }
};

export default TabHeader;