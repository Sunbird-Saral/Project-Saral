import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Strings from '../../../utils/Strings';
import AppTheme from '../../../utils/AppTheme';
import { Assets } from '../../../assets/index'
import ButtonComponent from './ButtonComponent';
// import HomeScreen from '../../myScanScreens/Homescreen'
import { MultiBrandingAction } from '../../../flux/actions/apis/multiBranding';
import APITransport from '../../../flux/actions/transport/apitransport';
class Brands extends PureComponent {
    constructor() {
        super()
        this.state = {
            defaultIamge: true
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: 100, width: 100 }} source={this.state.defaultIamge ? Assets.AppLogo : this.props.Image ? { uri: this.props.Image } : Assets.AppLogo}
                                onLoad={() => this.setState({ defaultIamge: false })} />
                        </View>
                        <View>
                            <Text style={styles.welcometext}>{this.props.Appname ? this.props.Appname : <Text>Saral Ocr App</Text>}</Text>
                        </View>

                        <View style={styles.btnContainer}>
                            <ButtonComponent
                                customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: this.props.themeColor ? this.props.themeColor : AppTheme.BLUE }]}
                                btnText={Strings.get_start}
                                onPress={this.props.onPress}
                                icon={"arrowright"}
                            />
                        </View>
                    </View>
                </View>
            </View>

        )
    }

}

const styles = {

    btnContainer: {
        paddingVertical: '5%'
    },
    welcometext: { textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#00000033', fontWeight: 'bold' },
    nxtBtnStyle: {
        width: 250,
        marginBottom: 15
    }
}
const mapStateToProps = (state) => {
    return {
        // ocrLocalResponse: state.ocrLocalResponse,
        loginData: state.loginData,
        studentsAndExamData: state.studentsAndExamData,
        scanTypeData: state.scanTypeData.response,
        apiStatus: state.apiStatus,
        roiData: state.roiData,
        absentStudentDataResponse: state.absentStudentDataResponse,
        getScanStatusData: state.getScanStatusData,
        multiBrandingData: state.multiBrandingData.response.data
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Brands);