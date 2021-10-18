import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

const ScannedDetailsComponent = ({
    ocrLocalResponse
}) => {
    return (
        <View>
            <Text>ScannedDetailsComponent</Text>
        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse,
        loginData: state.loginData,
        filteredData: state.filteredData,
        scanTypeData: state.scanTypeData.response
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({
//         OcrLocalResponseAction: OcrLocalResponseAction,
//     }, dispatch)
// }

export default (connect(mapStateToProps, null)(ScannedDetailsComponent));
