import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import AppTheme from '../utils/AppTheme';
import {monospace_FF} from '../utils/CommonUtils';
import Button from './commonComponents/Button';
import {
  GET_PAGE_NO,
  HANDLE_CANCLE,
  HANDLE_CANCLE_PAGE_1,
  HANDLE_CANCLE_PAGE_2,
  SET_DATA,
  SET_DATA_PAGE_1,
  SET_DATA_PAGE_2,
} from './constants';
import {
  getNoOFFormsSubmitted,
  setAdmissionData,
} from './actions/admissionAction';

class EditAndSave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data:
        this.props.pageNo == 1
          ? [...this.props.formDataPage1]
          : [...this.props.formDataPage2],
    };
  }

  handleBackButton() {
    return true;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
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
        this.props,
      );
      this.props.navigation.navigate('Admissions');
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({item, index}) => {
            return this.renderItem(item, index);
          }}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            marginBottom: 100,
            backgroundColor: 'red',
          }}
          removeClippedSubviews={false}
          onScrollBeginDrag={Keyboard.dismiss}
        />

        <View
          style={{
            position: 'absolute',
            top: '78%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 115,
            marginBottom: 15,
          }}>
          <Button
            buttonStyle={{
              width: 150,
              backgroundColor: this.props.multiBrandingData.themeColor1
                ? this.props.multiBrandingData.themeColor1
                : AppTheme.BLUE,
              opacity: this.isFormFilled() ? 0.7 : 1,
            }}
            onPress={() => {
              if (this.isFormFilled()) {
                Alert.alert(
                  'All fields mandatory!',
                  'Please enter NA if not applicable.',
                );
              } else this.onPressConfirm();
            }}
            label={'CONFIRM'}
          />
          <Button
            buttonStyle={{width: 150, backgroundColor: AppTheme.ERROR_RED}}
            onPress={() => {
              if (this.props.pageNo == 1) this.props.handleCanclePage1();
              else this.props.handleCanclePage2();
              this.props.pageNoFunction(this.props.pageNo - 1);
              this.props.navigation.goBack();
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
    setAdmissionData: (data, token) => dispatch(setAdmissionData(data, token)),
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAndSave);
