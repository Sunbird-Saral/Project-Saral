import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Button from './commonComponents/Button';
import AppTheme from '../utils/AppTheme';
import {monospace_FF} from '../utils/CommonUtils';
import {CLEAR_CACHE} from './constants';

export class AdmissionLanding extends Component {
  constructor(props) {
    super(props);
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
          label={'CANCLE'}
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
          Total Forms{`\n`} Scanned & Subbmitted:
        </Text>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearCache: () => dispatch({type: CLEAR_CACHE}),
  };
};

const mapStateToProps = state => {
  return {
    multiBrandingData: state.multiBrandingData.response.data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdmissionLanding);
