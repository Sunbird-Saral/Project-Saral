import React from 'react';
import { View, TextInput, Image,TouchableOpacity,Dimensions } from 'react-native';
import { Assets } from '../../assets';
import AppTheme from '../../utils/AppTheme';
import { monospace_FF } from '../../utils/CommonUtils';
const { width, height } = Dimensions.get('window')
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
    subject,
    onBlur,
    isBlur=false
}) => {

    const setDataIntoModal = (value) => {
        let filterExam = studentsAndExamData.data.exams.filter((data)=> data.subject === subject)
        
        studentsAndExamData.data.exams.forEach((element) => {
            if (element.subject == subject && element.questions != null) {
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

    let filterExamquesdata = studentsAndExamData && studentsAndExamData.data.exams.filter((data)=> data.subject === subject)
    return (
        <View style={[styles.container, customRowStyle, { borderColor: rowBorderColor }]}>
            {
            icon ?
            <TouchableOpacity
            onPress={() => {
                if(filterExamquesdata &&filterExamquesdata[0].questions!= undefined && filterExamquesdata &&filterExamquesdata[0].questions!= "" ){
                    setDataIntoModal(rowTitle)
                    setIsModalVisible(true)
                }else{
                    setDataIntoModal(rowTitle)
                    setIsModalVisible(false)
                }
                
                 
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
                    onBlur={onBlur}
                    blurOnSubmit={isBlur}
                />
            }
        </View>
    );
}

const styles = {
    container: {
        height:60,
        borderWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        backgroundColor: AppTheme.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleTextStyle: {
        width: '100%',
        height:height/9,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        // letterSpacing: 1,
        fontSize: AppTheme.FONT_SIZE_SMALL,
        textAlign: 'center',
        fontFamily : monospace_FF
    }
}

export default MarksHeaderTable;