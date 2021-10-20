import React from 'react';
import { View, Text } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import Strings from '../../utils/Strings'
const StudentsSummaryCard = ({
    studentRollNumber,
    totalMarks,
    securedMarks
}) => {
    return (
        <View
            style={styles.container}
        >
            <View style={styles.studentContainer}>
                <View style={styles.deatilsViewContainer}>
                    <View style={styles.detailsSubContainerStyle}>
                        <Text style={styles.nameTextStyle}>{Strings.student_roll + ': ' + studentRollNumber}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingLeft: '5%' }}>
                <Text style={[styles.studentDetailsTxtStyle, { paddingTop: '4%', paddingBottom: 0 }]}>{Strings.total_marks + ': '}</Text>
                <Text style={[styles.studentDetailsTxtStyle, { paddingTop: '4%', color: AppTheme.BLACK, paddingHorizontal: 0 }]}>{totalMarks}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingLeft: '5%' }}>
                <Text style={[styles.studentDetailsTxtStyle, { paddingTop: 0 }]}>{Strings.total_marks_secured + ': '}</Text>
                <Text style={[styles.studentDetailsTxtStyle, { paddingTop: 0, color: AppTheme.BLACK, paddingHorizontal: 0 }]}>{securedMarks}</Text>
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
    studentContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: AppTheme.LIGHT_GREY
    },
    imageViewContainer: {
        width: '30%',
        height: '100%',
        marginRight: '1%'
    },
    imageContainerStyle: {
        height: 90,
        width: 90,
        borderRadius: 45,
        borderWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        justifyContent: 'center',
        backgroundColor: AppTheme.TAB_BORDER
    },
    deatilsViewContainer: {
        width: '70%',
        height: '100%',
        paddingLeft: '1%',
    },
    detailsSubContainerStyle: {
        justifyContent: 'space-evenly',
        paddingVertical: '3%'
    },
    nameTextStyle: {
        lineHeight: 25,
        fontSize: AppTheme.FONT_SIZE_SMALL,
        fontWeight: '500',
        color: AppTheme.GREY_TEXT,
        letterSpacing: 1
    }
};

export default StudentsSummaryCard;