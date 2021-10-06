import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AppTheme from '../../utils/AppTheme';

import { styles } from './StudentsDataStyle';

const StudentsDataComponent = ({
    item,
    onBtnClick
}) => {
    return (
        <View style={[styles.cardCon, { backgroundColor: AppTheme.BLUE  }]}>
            <View style={[styles.cardChildCon, { backgroundColor:  "#ffffffED" }]}>

                <Text style={styles.aadhar}>{item.studentId}</Text>
                <View style={styles.line} />
                <Text style={styles.aadhar}>{item.name}</Text>
                <View style={styles.line} />

                <TouchableOpacity
                    style={[styles.btnCon, { backgroundColor: item.isAbsent ? AppTheme.BLUE : AppTheme.BLUE }]}
                    activeOpacity={0.7}
                    onPress={() => onBtnClick(item)}
                >
                    {
                        item.isAbsent
                            ?
                            <Text style={styles.markasAbsent}>Mark as Present</Text>
                            :
                            <Text style={styles.markasAbsent}>Mark as Absent</Text>
                    }
                </TouchableOpacity>

            </View>
        </View>
    );
}
export default StudentsDataComponent;
