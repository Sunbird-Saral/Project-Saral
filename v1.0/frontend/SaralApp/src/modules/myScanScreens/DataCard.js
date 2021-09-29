import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AppTheme from '../../utils/AppTheme';

const headerLabelData = [
    {
        questionTitle: 'Question No.',
        loTitle: 'Learning Objective',
        marksTitle: 'Marks'
    }
]

const DataCard = ({
    subject,
    objectiveMarks,
    subjectiveMarks,
    onMarksChangeText,
}) => {
    return (
        <View
            style={styles.container}
        >
            {subject && <Text style={styles.headerLabelStyle}>{`${subject}`}</Text>}
            <View style={styles.subContainer}>                
                <MarkCardContainer 
                    questionType="Objective"
                    marks={objectiveMarks}
                    onMarksChangeText={(text, index) => onMarksChangeText(text, 'objective', index )}
                />
            </View>
            <View style={styles.subContainer}>
                <MarkCardContainer 
                    questionType="Subjective"
                    marks={subjectiveMarks}
                    onMarksChangeText={(text, index) => onMarksChangeText(text, 'subjective', index )}
                />
            </View>

        </View>
    );
}

const MarkCardContainer = ({
    questionType,
    marks,
    onMarksChangeText,
}) => {
    return (
        <View style={{ width: '100%' }}>
            <Text style={styles.nameTextStyle}>{questionType}</Text>
            <View>
                {questionType == 'Objective' &&
                    headerLabelData.map((data, index) => {
                    return (
                        <MarkCard
                        marks={headerLabelData}
                        indexValue={index} 
                        column1Value={data.questionTitle}
                        // column1TextStyle={{ fontWeight: 'bold' }}
                        column2Value={data.loTitle}
                        column3Value={data.marksTitle}
                        column3Editable={false}
                    />
                    )
                })}
                
                {marks && marks.length > 0 &&
                    marks.map((data, index) => {
                        return (
                            <MarkCard
                                marks={marks}
                                indexValue={index} 
                                column1Value={String(data.question + 1)}
                                column2Value={`LO-${index + 1}`}
                                column3Value={String(data.mark)}
                                column3Editable={true}
                                onMarksChangeText={onMarksChangeText}
                                column3Length={1}
                            />
                        )
                    })
                }
            </View>
        </View>
    )
}

const MarkCard = ({
    marks,
    indexValue,
    column1Value,
    column1TextStyle,

    column2Value,
    column2TextStyle,

    column3Value,
    column3TextStyle,
    column3Editable,
    column3Length,

    onMarksChangeText,
    rowBorderColor = AppTheme.TAB_BORDER,
    customRowStyle
}) => {
    return (
        <View style={[styles.marksDataContainer, customRowStyle, { width: '100%' }]} key={indexValue}>
            <TextInput
                style={[styles.titleTextStyle, { borderColor: rowBorderColor, color: AppTheme.GREY_TEXT, borderLeftWidth: 2, borderTopWidth: indexValue == 0  ? 2 : 1, borderBottomWidth: indexValue == marks.length-1 ? 2 : 1 }, column1TextStyle]}
                value={column1Value}
                multiline={true}
                editable={false}
            />
            <TextInput
                style={[styles.titleTextStyle, { borderColor: rowBorderColor,  color: AppTheme.GREY_TEXT, borderTopWidth: indexValue == 0  ? 2 : 1, borderBottomWidth: indexValue == marks.length-1 ? 2 : 1  }, column2TextStyle]}
                value={column2Value}
                multiline={true}
                editable={false}
            />
            <TextInput
                style={[styles.titleTextStyle, { borderColor: column3Value.length == 0 ? AppTheme.ERROR_RED : rowBorderColor, borderRightWidth: column3Value.length == 0 ? 1 : 2, borderTopWidth: (indexValue == 0 && !column3Value.length == 0)  ? 2 : 1, borderBottomWidth: (indexValue == marks.length-1 && !column3Value.length == 0) ? 2 : 1 }, column3TextStyle]}
                value={column3Value}
                multiline={true}
                editable={column3Editable}
                onChangeText={(text) => onMarksChangeText(text, indexValue)}
                keyboardType={'numeric'}
                maxLength={column3Length}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        backgroundColor: AppTheme.WHITE,
        elevation: 4,
        borderRadius: 4,
        marginHorizontal: '5%',
        marginTop: '5%',
        padding: '5%',
    },
    subContainer: {
        paddingBottom: '1%'
    },
    headerLabelStyle: {
        lineHeight: 25,
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        fontWeight: 'bold',
        color: AppTheme.BLACK,
        letterSpacing: 1,
        paddingVertical: '3%'
    },
    nameTextStyle: {
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        fontWeight: '700',
        color: AppTheme.GREY_TEXT,
        letterSpacing: 1,
        textAlign: 'center',
        paddingVertical: '3%'
    },
    marksDataContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    titleTextStyle: {
        width: '30%',
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        padding: 15,
        borderWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        fontSize: AppTheme.FONT_SIZE_SMALL,
        textAlign: 'center'
    },
});

export default DataCard;