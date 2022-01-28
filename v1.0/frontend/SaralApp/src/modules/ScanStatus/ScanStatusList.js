import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppTheme from '../../utils/AppTheme';

const ScanStatusList = ({
    themeColor1,
    id,
    studentList
}) => {

    let studentName = studentList.filter((e) => {
        if (id == e.studentId) {
            return true
        }
    })
    
    return (
        <View style={[styles.container, { backgroundColor: themeColor1 ? themeColor1 : AppTheme.GREEN }]}>
            <View style={styles.childCon}>
                <Text style={styles.align}>{studentName.length > 0 && studentName[0].name}</Text>
                <View style={styles.line} />
                <Text style={styles.align}>{id}</Text>
                <View style={styles.line} />
                <Text style={styles.align}>{`Saved`}</Text>
            </View>
        </View>
    );
}
export default ScanStatusList;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 40,
        padding: 15,
        borderRadius: 10
    },
    childCon: {
        backgroundColor: 'white',
        borderWidth: 1
    },
    align: {
        textAlign: 'center',
        padding: 8
    },
    line: {
        height: 1,
        backgroundColor: AppTheme.BLACK
    }
});