import React from 'react';
import { View, TextInput, Image,Text } from 'react-native';
import AppTheme from '../../../utils/AppTheme';
import Strings from '../../../utils/Strings';

const  MultibrandLabels = ({
    School,
    SchoolId,
    Label1,
    Label2,
    Class,
    Section
}) => {
    return (
        <View style={{ marginTop: 10,width:'62%' }}>
        <Text
            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
        >
            {Label1 + ' : '}
            <Text style={{ fontWeight: 'normal' }}>
                {School}
            </Text>
        </Text>
        <Text
            style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
        >
           {Label2 ? Label2 + ' : ' : null}
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
