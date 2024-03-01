import {Text, View, ActivityIndicator} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Button from './commonComponents/Button';
import AppTheme from '../utils/AppTheme';
import {monospace_FF} from '../utils/CommonUtils';
import {API_CALL_COMPLETE, CLEAR_CACHE, GET_ROI_DATA} from './constants';
import {getNoOFFormsSubmitted, getROIdata} from './actions/admissionAction';

export class AdmissionLanding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noOfFormsSubmitted: this.props.noOfForms,
      isLoading: true,
    };
  }

  componentDidMount() {
    let token = this.props.loginData.data.token;
    this.props.noOFormsSubmitted(token);
    this.props.getRoiData(token);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.noOfForms &&
      prevProps.admissionData.noOfFormsSubmitted != this.props.noOfForms
    ) {
      this.setState({
        noOfFormsSubmitted: this.props.noOfForms,
      });
    }
    if (this.state.isLoading == true && this.props.roi) {
      this.setState({isLoading: false});
    }
  }

  render() {
    return this.state.isLoading ? (
      <ActivityIndicator
        size="large"
        color={'black'}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      />
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        {/* {this.state.isLoading && } */}
        <Button
          label={'SCAN NEW FORM'}
          onPress={() => {
            this.props.clearCache();
            this.props.navigation.navigate('AdmissionsScan');
            this.props.apiCallComplete(false);
          }}
          buttonStyle={{
            backgroundColor: this.props.multiBrandingData.themeColor1
              ? this.props.multiBrandingData.themeColor1
              : AppTheme.BLUE,
          }}
        />

        <Button
          label={'CANCEL'}
          onPress={() => this.props.navigation.goBack()}
          buttonStyle={{
            backgroundColor: this.props.multiBrandingData.themeColor1
              ? this.props.multiBrandingData.themeColor1
              : AppTheme.BLUE,
          }}
        />
        <Text
          style={{
            fontFamily: monospace_FF,
            marginVertical: 10,
            fontSize: 15,
            textAlign: 'center',
          }}>
          Total Forms{`\n`} Scanned & Submitted: {this.state.noOfFormsSubmitted}
        </Text>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearCache: () => dispatch({type: CLEAR_CACHE}),
    noOFormsSubmitted: token => dispatch(getNoOFFormsSubmitted(token)),
    apiCallComplete: () =>
      dispatch({type: API_CALL_COMPLETE, apiCallComplete: false}),
    getRoiData: token => dispatch(getROIdata(token)),
  };
};

const mapStateToProps = state => {
  return {
    multiBrandingData: state.multiBrandingData.response.data,
    loginData: state.loginData,
    admissionData: state.admissionData,
    noOfForms: state.admissionData.noOfFormsSubmitted,
    roi: state.admissionData.roi,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdmissionLanding);
