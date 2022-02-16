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
    index
}) => {

    const setDataIntoModal = (value) => {
        studentsAndExamData.data.exams[0].questions.forEach((element,i) => {
            if (element.questionId.toString() == value.toString() || index == i) {
                // console.log("BEFOREelement.questionId",element.questionId ,"rowTitle", value," boolean" , element.questionId == value,"INDEX",index,i );
                element.tags[0].questionId = element.questionId
                setTagData(element.tags)
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