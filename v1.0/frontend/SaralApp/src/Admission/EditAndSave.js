import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import AppTheme from '../utils/AppTheme';
import {monospace_FF} from '../utils/CommonUtils';
import Button from './commonComponents/Button';
import {
  GET_PAGE_NO,
  HANDLE_CANCLE_PAGE_1,
  HANDLE_CANCLE_PAGE_2,
  SET_DATA_PAGE_1,
  SET_DATA_PAGE_2,
} from './constants';
import {
  getNoOFFormsSubmitted,
  setAdmissionData,
} from './actions/admissionAction';

import FormItem from './commonComponents/FormItem';

class EditAndSave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data:
        this.props.pageNo == 1
          ? this.props.formDataPage1
          : this.props.formDataPage2,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.apiCallComplete) {
      this.props.navigation.navigate('Admissions');
    }
    if (
      this.props.formDataPage1 != prevProps.formDataPage1 &&
      this.props.pageNo == 1
    ) {
      this.setState({data: this.props.formDataPage1});
    }
    if (
      this.props.formDataPage2 != prevProps.formDataPage2 &&
      this.props.pageNo == 2
    ) {
      this.setState({data: this.props.formDataPage2});
    }
  }

  handleBackButton() {
    return true;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    // this.setState({data: []});
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  isFormFilled() {
    for (let i = 0; i < this.state.data.length; i++) {
      if (!this.state.data[i].value) {
        return true;
      }
    }
    return false;
  }

  checkAllFieldsDisplayed() {
    if (
      (this.state.data.length != 15 && this.props.pageNo == 1) ||
      (this.state.data.length != 18 && this.props.pageNo == 2)
    ) {
      return true;
    }
    return false;
  }

  handleTextChange = (label, modifiedValue, index) => {
    let obj = this.state.data[index];
    obj.value = modifiedValue;
    let arr = this.state.data;
    arr[index] = obj;
    this.setState({data: arr});
  };

  renderItem = (item, index) => {
    return (
      <View
        style={{
          padding: 10,
        }}>
        <Text style={{fontFamily: monospace_FF, fontSize: 15}}>
          <Text style={{color: 'red'}}>* </Text>
          {item.label}:
        </Text>
        <TextInput
          style={{
            fontFamily: monospace_FF,
            fontWeight: 'bold',
            height: 50,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            color: 'black',
            fontSize: 18,
            alignItems: 'center',
          }}
          value={item.value}
          onChangeText={newValue =>
            this.handleTextChange(item.label, newValue, index)
          }
          multiline={true}
          placeholder={'NA'}
        />
      </View>
    );
  };

  onPressConfirm = async () => {
    if (this.props.pageNo == 1) {
      this.props.navigation.goBack();
      this.props.setDataPage1(this.state.data);
    } else {
      let token = this.props.loginData.data.token;
      this.props.setDataPage2(this.state.data);

      this.props.setAdmissionData(
        [...this.props.formDataPage1, ...this.state.data],
        token,
        [...this.props.predictionInfoPage1, ...this.props.predictionInfoPage2],
        this.props,
      );
      // this.props.navigation.navigate('Admissions');
    }
  };

  onPressCancle = () => {
    if (this.props.pageNo == 1 || this.props.pageNo == 0) {
      this.props.handleCanclePage1();
    } else {
      this.props.handleCanclePage2();
    }
    this.state.data = [];
    this.props.pageNoFunction(this.props.pageNo - 1);
    this.props.navigation.goBack();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {this.state.data.map((item, index) => {
            return (
              <FormItem
                item={item}
                handleTextChange={(label, newValue) =>
                  this.handleTextChange(label, newValue, index)
                }
              />
            );
          })}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: 15,
          }}>
          <Button
            buttonStyle={{
              width: 150,
              backgroundColor: this.props.multiBrandingData.themeColor1
                ? this.props.multiBrandingData.themeColor1
                : AppTheme.BLUE,
              opacity:
                this.isFormFilled() || this.checkAllFieldsDisplayed() ? 0.7 : 1,
            }}
            onPress={() => {
              if (this.isFormFilled() || this.checkAllFieldsDisplayed()) {
                Alert.alert(
                  'Wait Till all the fields are loaded.All fields mandatory!',
                  'Please enter NA if not applicable.',
                );
              } else this.onPressConfirm();
            }}
            label={'CONFIRM'}
          />
          <Button
            buttonStyle={{
              width: 150,
              backgroundColor: AppTheme.ERROR_RED,
              opacity: this.checkAllFieldsDisplayed() ? 0.5 : 1,
            }}
            onPress={() => {
              if (this.checkAllFieldsDisplayed()) {
                Alert.alert('Wait Till all the fields are loaded');
              } else this.onPressCancle();
            }}
            label={'CANCEL'}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.WHITE,
    paddingTop: 10,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    // setData: data => dispatch({type: SET_DATA, data}),
    noOFormsSubmitted: token => dispatch(getNoOFFormsSubmitted(token)),
    setAdmissionData: (data, token, predictionInfo) =>
      dispatch(setAdmissionData(data, token, predictionInfo)),
    pageNoFunction: pageNo => dispatch({type: GET_PAGE_NO, pageNo}),
    handleCanclePage1: () => dispatch({type: HANDLE_CANCLE_PAGE_1}),
    handleCanclePage2: () => dispatch({type: HANDLE_CANCLE_PAGE_2}),
    setDataPage1: data => dispatch({type: SET_DATA_PAGE_1, data}),
    setDataPage2: data => dispatch({type: SET_DATA_PAGE_2, data}),
  };
};

const mapStateToProps = state => {
  return {
    formDataPage1: state.admissionData.formDataPage1,
    formDataPage2: state.admissionData.formDataPage2,
    multiBrandingData: state.multiBrandingData.response.data,
    pageNo: state.admissionData.pageNo,
    loginData: state.loginData,
    dataSubmitted: state.dataSubmitted,
    apiCallComplete: state.admissionData.apiCallComplete,
    predictionInfoPage1: state.admissionData.predictionInfoPage1,
    predictionInfoPage2: state.admissionData.predictionInfoPage2,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAndSave);
