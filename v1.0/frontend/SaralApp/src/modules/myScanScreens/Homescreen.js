import React, { Component } from 'react';
import { View, Text, Image,  } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash'
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import { Assets } from '../../assets/index'
import ButtonComponent from '../common/components/ButtonComponent';
import { MultiBrandingAction } from '../../flux/actions/apis/multiBranding';
import APITransport from '../../flux/actions/transport/apitransport';


class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            logindataid: this.props.loginData.data.school.state,
            filterdataid: [],       
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
                 {this.props.multiBrandingData ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {this.props.multiBrandingData.logoImage ? 
                                <Image style={{ height: 100, width: 100 }} source={{ uri: 'data:image/png;base64,' + this.props.multiBrandingData.logoImage }} />:<Image style={{ height: 100, width: 100 }} source={Assets.AppLogo} /> }
                        </View>
                        <View>
                          <Text style={styles.welcometext}>{this.props.multiBrandingData.Appname}</Text>
                        </View>

                        <View style={styles.btnContainer}>
                            <ButtonComponent
                                customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: this.props.multiBrandingData.themeColor1 ? this.props.multiBrandingData.themeColor1 : AppTheme.BLUE }]}
                                btnText={Strings.get_start}
                                  onPress={() => this.props.navigation.navigate('selectDetails')}
                                icon={"arrowright"}
                            />
                        </View>
                    </View>
                </View>:null}
            </View>
        );
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