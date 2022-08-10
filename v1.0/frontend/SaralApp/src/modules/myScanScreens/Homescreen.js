import React, { Component } from 'react';
import { View,Text, BackHandler } from 'react-native';
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
import { monospace_FF } from '../../utils/CommonUtils';
import Spinner from '../common/components/loadingIndicator';
import { storeFactory } from '../../flux/store/store';
import constants from '../../flux/actions/constants';
import { GetStudentsAndExamData } from '../../flux/actions/apis/getStudentsAndExamData';
import { getMinimalValue } from '../../utils/StorageUtils';

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
        this.onBack = this.onBack.bind(this)
    }
    componentDidMount() {
        const { navigation } = this.props;
        if (this.props.minimalFlag) {
            navigation.addListener('willFocus', async payload => {
                BackHandler.addEventListener('hardwareBackPress', this.onBack)
            })
            this.willBlur = navigation.addListener('willBlur', payload =>
                BackHandler.removeEventListener('hardwareBackPress', this.onBack)
            );
        }
        
        this.callMultiBrandingActiondata()
    }

   async componentDidUpdate(prevProps) {
        const { studentsAndExamData, multiBranding }  = this.props;

        const { loginData: { data: { school } } } = this.props;
        
        if (multiBranding && prevProps.multiBranding != multiBranding) {
            if (multiBranding.status && multiBranding.status == 200) {

                //set minimal Flag
                let isMinimalMode = await getMinimalValue();
                storeFactory.dispatch(this.minimalFlagAction( isMinimalMode == null ? false : isMinimalMode));

                //calling students and exam api if minimal mode true
                if (isMinimalMode) {
                    this.callStudentsData(this.props.loginData.data.token)
                } else {
                    this.setState({isLoading : false})
                }
                
            }
            
        }

        if (studentsAndExamData &&  prevProps.studentsAndExamData != studentsAndExamData ) {
            if (studentsAndExamData.status && studentsAndExamData.status == 200) {
                this.setState({isLoading : false})
            }
        }
    }
    

    callStudentsData = (token) => {

        let dataPayload = {
           "classId": "0",
           "section": "0"
         }
         this.setState({
               isLoading: true,
         })
           let apiObj = new GetStudentsAndExamData(dataPayload, token);
           this.props.APITransport(apiObj)
   }

   minimalFlagAction (payload){
    return {
        type: constants.MINIMAL_FLAG,
        payload
    }
}

    callMultiBrandingActiondata() {
        let payload = this.props.multiBrandingData
        let token = this.props.loginData.data.token
        let apiObj = new MultiBrandingAction(payload, token);
        this.props.APITransport(apiObj)

    }

    onBack = () => {
        const { navigation } = this.props;
        BackHandler.exitApp()
        // navigation.goBack();
        return true
    }

    render() {
        const { isLoading } = this.state;
       const isMinimalModedata = this.props.loginData&&this.props.loginData.data.school.isMinimalMode
       const  Mode = isMinimalModedata ? !this.props.minimalFlag : this.props.minimalFlag
       if(this.props.multiBrandingData === undefined || this.props.multiBrandingData === null || this.state.isLoading){
           
            return <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
            {

                this.state.isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', fontFamily : monospace_FF }}>Loading Branding ...</Text>
                    </View> :
                        <Brands
                            Image1={Assets.AppLogo}
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
                                onPress={() => Mode ? this.props.navigation.navigate("myScan") : this.props.navigation.navigate('selectDetails')}
                            />
                            {
                    isLoading
                    &&
                    <Spinner
                        animating={isLoading}
                        customContainer={{ opacity: 0.6, elevation: 15 }}
                    />
                }
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        multiBrandingData: state.multiBrandingData.response.data,
        multiBranding: state.multiBrandingData.response,
        minimalFlag: state.minimalFlag,
        studentsAndExamData: state.studentsAndExamData
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        LogoutAction: LogoutAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
