import React from 'react';
import { View, TextInput, Image } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { Assets } from '../../assets';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    setQuestionIdData,
    subject
}) => {

    const setDataIntoModal = (value) => {
        let filterExam = studentsAndExamData.data.exams.filter((data)=> data.subject === subject)
        
        studentsAndExamData.data.exams.forEach((element) => {
            if (element.subject == subject) {
                element.questions.forEach((_el,i)=>{
                    if (_el.questionId.toString() == value.toString() || index == i) {
                        _el.tags.forEach((data,i)=>{
                            data.questionId = _el.questionId
                        })
                        setTagData(_el.tags)
                        setQuestionIdData(_el.questionId)
                    }
                })

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
        textAlign: 'center'
    }
}

export default MarksHeaderTable;