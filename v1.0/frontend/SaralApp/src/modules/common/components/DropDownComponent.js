import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import AppTheme from '../../../utils/AppTheme';
import { monospace_FF } from '../../../utils/CommonUtils';


const DropDownMenu = ({
    options,
    onSelect,
    selectedData,
    icon,
    defaultIndex,
    defaultData,
    disabled,
    customDropContainer,
    customDropDownStyle
}) => {    
    const dropDownHeight = options.length < 5 ? (46 + StyleSheet.hairlineWidth) * options.length : (33 + StyleSheet.hairlineWidth) * 5
    return(
        
            <ModalDropdown 
                style={[styles.dropDownContainerStyle, customDropContainer]}
                dropdownStyle={[styles.dropDownStyle, { height: dropDownHeight }, customDropDownStyle]}
                dropdownTextStyle={styles.dropDownTextStyle}
                dropdownTextHighlightStyle={styles.dropDownSelectedTextStyle}
                options={options}
                disabled={disabled}
                onSelect={onSelect}
                defaultIndex={defaultIndex}
                showsVerticalScrollIndicator={false}
            
            >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={[styles.dropDownTextLabelStyle, {color: defaultIndex == -1 && !disabled ? AppTheme.BLACK_OPACITY_30: AppTheme.BLACK,fontFamily : monospace_FF}]}>
                        {defaultIndex == -1 ? defaultData: selectedData}
                    </Text>
                    {icon &&
                    <Image 
                        style={{width: 10, height: 10}}
                        source={icon}
                        resizeMode='contain'
                    />}
              </View>
            </ModalDropdown>
    )
}

const styles = {
    dropDownContainerStyle: {
        borderWidth: 1, 
        borderRadius: 4, 
        borderColor: AppTheme.LIGHT_GREY, 
        paddingVertical: '3%', 
        paddingHorizontal: '3%',
    },
    dropDownStyle: {
        width: '75%',
        elevation: 5
    },
    dropDownTextStyle: {
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.GREY,
        lineHeight: 25,
        fontFamily : monospace_FF
    },
    dropDownSelectedTextStyle: {
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        paddingVertical: '4%'
    },
    dropDownTextLabelStyle: {
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        fontWeight: '600',
        fontFamily : monospace_FF
    },
}
export default DropDownMenu;