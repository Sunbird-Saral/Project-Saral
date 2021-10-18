import React, { Component } from 'react';
import { View, Text, Image,  } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash'
import AppTheme from '../../utils/AppTheme';
import { MultiBrandingAction } from '../../flux/actions/apis/multiBranding';
import APITransport from '../../flux/actions/transport/apitransport';
import Brands from '../common/components/Brands';

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            logindataid: this.props.loginData.data.school.state,     
        }   
    }
    componentDidMount(){
        this.callMultiBrandingActiondata()
    }
    callMultiBrandingActiondata (){
        let payload = this.props.multiBrandingData
        let token = this.props.loginData.data.token
        let apiObj = new MultiBrandingAction(payload, token);
        this.props.APITransport(apiObj)
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                 {this.props.multiBrandingData  ?
                 <Brands 
                 Image = {'data:image/png;base64,' + this.props.multiBrandingData.logoImage }
                 Appname ={this.props.multiBrandingData.Appname}
                 themeColor={this.props.multiBrandingData.themeColor1}
                 onPress ={()=>this.props.navigation.navigate('selectDetails')} 
                 />
                :  
                <Brands 
                Appname ={'Saral OCR App'}
                themeColor={AppTheme.BLUE}
                onPress ={()=>this.props.navigation.navigate('selectDetails')} 
                />
                }
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
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);