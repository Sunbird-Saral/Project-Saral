import React from 'react';
import { View, Text, TextInput } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import Strings from '../../utils/Strings'
import TextField from '../common/components/TextField'
const NumeracyScanCard = ({
    studentIndex,
    rollNumber,
    stdErr,
    onChangeText,
    editable,
    marksData,
    customRowStyle,
    onMarksChangeText,
    rowBorderColor
}) => {
    return(
        <View 
            style={styles.container}
        >       
            <Text style={styles.headerLabelStyle}>{studentIndex+1}</Text>
            <TextField
                labelText={Strings.student_roll}
                errorField={stdErr != '' || isNaN(rollNumber)}
                errorText={stdErr != '' ? stdErr : Strings.please_correct_student_roll}
                onChangeText={onChangeText}
                value={rollNumber}
                editable={editable}
                keyboardType={'numeric'}
                maxLength={7}
            />
            <View style={styles.marksContainer}>
                {marksData && marksData.length > 0 &&
                    marksData.map((data, dataIndex) => {                        
                        return (
                        <View key={dataIndex} style={{ paddingBottom: '1%' }}>
                            {data.levelText &&<Text style={styles.headerLabelStyle}>{data.levelText}</Text>}
                            {data.marks && data.marks.length > 0 &&
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                            {data.marks.map((marks, index) => {
                                let width = data.marks.length == 3 ? 33 : data.marks.length == 4 ? 24.5 : data.marks.length == 5 ? 19 : data.marks.length == 6 ? 16 : 0
                                return (
                                
                                    <View style={[styles.marksDataContainer, customRowStyle, { width: `${width}%` } ]} key={index}>
                                        <TextInput
                                            style={[styles.titleTextStyle, { borderColor: rowBorderColor, borderBottomWidth: .8, color: AppTheme.GREY_TEXT } ]}
                                            value={marks.learning}
                                            multiline={true}
                                            editable={false}
                                        />
                                        <TextInput
                                            style={[styles.titleTextStyle, { borderColor: marks.mark.length == 0 ? AppTheme.ERROR_RED : rowBorderColor, borderTopWidth: .8  } ]}
                                            value={String(marks.mark)}
                                            multiline={true}
                                            onChangeText={(text) => onMarksChangeText(text, index, dataIndex)}
                                            keyboardType={'numeric'}
                                        />
                                    </View>
                                )
                            })}
                            </View>}
                        </View>
                        )
                    })  
                }
            </View>
        </View>
    );
}

const styles = {
    container: {
        width: '90%',
        backgroundColor: AppTheme.WHITE,
        elevation: 4,
        borderRadius: 4,
        marginHorizontal: '5%',
        marginTop: '5%',
        padding: '5%',
    },
    marksContainer: {
        marginHorizontal: '2%'
    },
    marksDataContainer: {
        backgroundColor: AppTheme.WHITE,
        marginHorizontal: '.5%'
    }, 
    titleTextStyle: {
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        padding: 5,
        // lineHeight: 22,
        // letterSpacing: 1,
        borderWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        fontSize: AppTheme.FONT_SIZE_SMALL,
        textAlign: 'center'
    },
    headerLabelStyle: {
        lineHeight: 25,
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        fontWeight: 'bold',
        color: AppTheme.BLACK,
        letterSpacing: 1
    },
    
};

export default NumeracyScanCard;