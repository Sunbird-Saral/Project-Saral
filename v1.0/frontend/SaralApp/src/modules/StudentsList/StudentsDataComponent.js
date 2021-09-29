import React from 'react';
import { Text, View } from 'react-native';
import AppTheme from '../../utils/AppTheme';

import { styles } from './StudentsDataStyle';

const StudentsDataComponent = ({
    params,
    item
}) => {
    return (
        <View style={[styles.cardCon, { backgroundColor: AppTheme.BLUE  }]}>
            <View style={[styles.cardChildCon, { backgroundColor:  "#ffffffED" }]}>

                <Text style={styles.aadhar}>{item.studentId}</Text>
                <View style={styles.line} />
                <Text style={styles.aadhar}>{item.name}</Text>

            </View>
        </View>
    );
}
export default StudentsDataComponent;
