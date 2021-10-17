import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import AppTheme from '../../utils/AppTheme';
import Strings from '../../utils/Strings';

//styles
import { styles } from './ScanHistoryStyles';


const ScanHistoryCard = ({
    showButtons = true,
    navigation,
    filteredData,
    scanedData,
    Theme
}) => {


    const onPressContinue = () => {
        navigation.navigate('myScan')
    }

    const onPressStatus = () => {
        navigation.navigate('ScanStatus')
    }

    
    return (
        <TouchableOpacity
            style={[styles.container,{backgroundColor:Theme ? Theme : AppTheme.BLUE}]}
            disabled

        >
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingTop: '3%', paddingLeft: '1%', paddingRight: '1%', paddingBottom: '5%' }}>
                <View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.class_text}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.className}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.section}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.section}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.exam_date}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.examDate}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.subject}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.subject}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.exam_id}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.examTestID}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle,]}>
                            <Text>{Strings.scan_status}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle,]}>
                            <Text>{0}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle, { borderBottomWidth: 1 }]}>
                            <Text>{Strings.save_status}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle, { borderBottomWidth: 1 }]}>
                            <Text>{scanedData ? scanedData.length :0}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ marginBottom: '3%', width: '100%', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                    {
                        // scanStatusShow
                        showButtons
                        &&
                        <TouchableOpacity
                            style={{
                                backgroundColor: AppTheme.WHITE, borderRadius: 4,
                                // width: showButtons ? '45%' : '80%',
                                width: true ? '45%' : '80%',
                                alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4,
                                marginLeft: 5,
                                marginRight: 5
                            }}
                            onPress={onPressStatus}
                        >
                            <Text>{Strings.scan_status}</Text>
                        </TouchableOpacity>
                    }
                    {
                        showButtons
                        &&
                        <TouchableOpacity
                            style={{
                                backgroundColor: AppTheme.WHITE, borderRadius: 4, width: '45%',
                                alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4,
                                marginLeft: 5,
                                marginRight: 5
                            }}
                        // onPress={onPressSave}
                        >
                            <Text style={{ color: AppTheme.BLACK }}>{Strings.save_scan}</Text>
                        </TouchableOpacity>}
                </View>
            </View>

            {
                showButtons
                &&
                <View style={{ marginBottom: '5%', marginTop: '2%', width: '100%', alignItems: 'center' }}>
                    {/* // showContinueBtn
                    // &&
                    // scanStatus != 'Completed' && */}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: AppTheme.GREY, borderRadius: 4, width: '80%', alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4 }}
                            onPress={onPressContinue}
                        >
                            <Text style={{ color: AppTheme.WHITE }}>{Strings.continue_scan}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

        </TouchableOpacity>
    );
}
const mapStateToProps = (state) => {
    return {
        filteredData: state.filteredData,
        scanedData: state.scanedData.response.data
    }
}


export default connect(mapStateToProps, null)(memo(ScanHistoryCard));