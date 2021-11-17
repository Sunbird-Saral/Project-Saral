import React, { Component } from 'react';
import { View,Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash'
import AppTheme from '../../utils/AppTheme';
import { MultiBrandingAction } from '../../flux/actions/apis/multiBranding';
import { LogoutAction } from '../../flux/actions/apis/LogoutAction';
import APITransport from '../../flux/actions/transport/apitransport';
import Brands from '../common/components/Brands';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Assets } from '../../assets';

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
    }
    componentDidMount() {
        setTimeout(
            () => this.setState(prevState => ({ test: !prevState.isLoading })),
            5000,
        );
        
        this.callMultiBrandingActiondata()
    }

    callMultiBrandingActiondata() {
        let payload = this.props.multiBrandingData
        let token = this.props.loginData.data.token
        let apiObj = new MultiBrandingAction(payload, token);
        this.props.APITransport(apiObj)

    }

    render() {
        if(this.props.multiBrandingData === undefined || this.props.multiBrandingData === null){
           
            return <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
            {

                this.state.isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', fontFamily: 'sans-serif-condensed' }}>Loading Branding ...</Text>
                    </View> :
                        <Brands
                            Image={Assets.AppLogo}
                            appName={'Saral OCR App'}
                            themeColor={AppTheme.BLUE}
                            onPress={() => this.props.navigation.navigate('selectDetails')}
                        />
            }
        </View>

        }
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                            <Brands
                                Image={this.props.multiBrandingData && 'data:image/png;base64,' + this.props.multiBrandingData.logoImage}
                                appName={this.props.multiBrandingData && this.props.multiBrandingData.appName}
                                themeColor={this.props.multiBrandingData && this.props.multiBrandingData.themeColor1}
                                onPress={() => this.props.navigation.navigate('selectDetails')}
                            /> 
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        multiBrandingData: state.multiBrandingData.response.data
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        LogoutAction: LogoutAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
