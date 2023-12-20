import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import Button from './commonComponents/Button';
import AppTheme from '../utils/AppTheme';
import {monospace_FF} from '../utils/CommonUtils';
import {CLEAR_CACHE} from './constants';
import {getNoOFFormsSubmitted} from './actions/admissionAction';
import BASE_URL from '../configs/config';

export class AdmissionLanding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noOfFormsSubmitted: this.props.noOfForms,
    };
  }

  componentDidMount() {
    let token = this.props.loginData.data.token;
    this.props.noOFormsSubmitted(token);
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
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Button
          label={'SCAN NEW FORM'}
          onPress={() => {
            this.props.clearCache();
            this.props.navigation.navigate('AdmissionsScan');
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
  };
};

const mapStateToProps = state => {
  return {
    multiBrandingData: state.multiBrandingData.response.data,
    loginData: state.loginData,
    admissionData: state.admissionData,
    noOfForms: state.admissionData.noOfFormsSubmitted,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdmissionLanding);
