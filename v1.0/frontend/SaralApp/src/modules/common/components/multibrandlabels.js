import React from 'react';
import { View, TextInput, Image,Text } from 'react-native';
import AppTheme from '../../../utils/AppTheme';
import Strings from '../../../utils/Strings';

const  MultibrandLabels = ({
    School,
    SchoolId,
    Label,
    Label1,
    Label2
}) => {
    return (
        <View style={{ marginTop: 10,width:'62%' }}>
        <Text
            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
        >
            {Label1 ? Label1 + ' : ': Strings.school_name + ' : '}
            <Text style={{ fontWeight: 'normal' }}>
                {School}
            </Text>
        </Text>
        <Text
            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
        >
           {Label2 ? Label2 + ' : ' : Strings.schoolId_text + ' : '}
            <Text style={{ fontWeight: 'normal' }}>
                {SchoolId}
            </Text>
        </Text>
        
    </View>
    );
}

const styles = {
    
    
}

export default MultibrandLabels;
