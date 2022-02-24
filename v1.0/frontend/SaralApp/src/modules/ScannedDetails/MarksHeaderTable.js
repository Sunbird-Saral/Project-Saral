import React from 'react';
import { View, TextInput, Image,TouchableOpacity } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { monospace_FF } from '../../utils/CommonUtils';

const MarksHeaderTable = ({
    customRowStyle,
    rowTitle,
    icon,
    editable,
    onChangeText,
    rowBorderColor,
    keyboardType,
    maxLength,
    setIsModalVisible,
    setTagData,
    studentsAndExamData,
    index,
    setQuestionIdData
}) => {

    const setDataIntoModal = (value) => {
        studentsAndExamData.data.exams[0].questions.forEach((element,i) => {
            if (element.questionId.toString() == value.toString() || index == i) {
                element.tags.forEach((data,i)=>{
                    data.questionId = element.questionId
                })
                setTagData(element.tags)
                setQuestionIdData(element.questionId)
            }
        });
    }

    return (
        <View style={[styles.container, customRowStyle, { borderColor: rowBorderColor }]}>
            {
            icon ?
            <TouchableOpacity
            onPress={() => {
                setDataIntoModal(rowTitle)
                setIsModalVisible(true)
            }}
            >
                <Image style={{width:25,height:25}}  source={Assets.Tagging}/>
                </TouchableOpacity>
                :
                <TextInput
                    style={styles.titleTextStyle}
                    value={rowTitle}
                    multiline={true}
                    editable={editable}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                />
            }
        </View>
    );
}

const styles = {
    container: {
        height: 60,
        borderWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        backgroundColor: AppTheme.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleTextStyle: {
        width: '100%',
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: AppTheme.FONT_SIZE_SMALL,
        textAlign: 'center',
        fontFamily : monospace_FF
    }
}

export default MarksHeaderTable;