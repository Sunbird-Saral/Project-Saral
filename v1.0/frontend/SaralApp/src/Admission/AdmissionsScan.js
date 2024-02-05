import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Text,
  DeviceEventEmitter,
  FlatList,
  ListItem,
  TextInput,
} from 'react-native';
import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

import Button from './commonComponents/Button';
import SaralSDK from '../../SaralSDK';
import {roi} from './roi';
import AppTheme from '../utils/AppTheme';
import {GET_PAGE_NO, SET_DATA_PAGE_1, SET_DATA_PAGE_2} from './constants';
import {monospace_FF} from '../utils/CommonUtils';
import {PureComponent} from 'react';

export class Admissions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      PocRoi: null,
      disblePage1: false,
      disablePage2: true,
      disableShowData: true,
      predictionArray: [],
      localPageNo: 0,
    };

    DeviceEventEmitter.addListener('streamReady', eventData => {
      let roisData = JSON.parse(eventData);
      let cells = roisData.layout.cells;
      this.consolidatePrediction(cells, this.props.pageno);
    });
  }

  componentDidUpdate() {
    if (this.props.formDataPage1.length == 0) {
      this.setState({predictionArray: this.props.formDataPage1});
    }
    if (this.props.formDataPage2.length == 0 && this.props.pageno == 2) {
      this.setState({predictionArray: this.props.formDataPage2});
    }
  }

  componentWillUnmount() {
    this.setState({predictionArray: []});
    DeviceEventEmitter.removeAllListeners();
  }

  onScan = async pageNo => {
    //set page number
    this.props.pageNo(pageNo);
    if (Platform.OS !== 'ios') {
      const grantedCamera = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (grantedCamera) {
        this.onOpenCameraActivity(pageNo);
      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
          permRes => {
            if (
              permRes['android.permission.CAMERA'] ===
              PermissionsAndroid.RESULTS.GRANTED
            ) {
              this.onOpenCameraActivity(pageNo);
            }
          },
        );
      }
    }
  };

  onOpenCameraActivity = pageNo => {
    SaralSDK.startCamera(JSON.stringify(roi), pageNo.toString(), 0, true)
      .then(res => {})
      .catch((code, message) => {
        console.log('code', code, message);
      });
  };

  consolidatePrediction = (cells, pageNo) => {
    var marks = ' ';
    let labels = [
      'Admission Number',
      'Date of Admission',
      "Student's Aadhaar No.",
      "Student's First Name",
      "Student's Surname",
      'Date Of Birth',
      'Sex',
      'Address',
      'Block',
      'District',
      'C/O First Name',
      'C/O Surname',
      'C/O Relation',
      "Father's Name",
      "Father's Education",
      "Father's Occupation",
      "Father's Mobile Number 1",
      "Father's Mobile Number 2",
      "Mother's Name",
      "Mother's Education",
      "Mother's Occupation",
      "Mother's Mobile Number 1",
      "Mother's Mobile Number 2",
      'Roll No',
      'Religion',
      'Category',
      'Type of Ration Card',
      'CwSN',
      'Address on Ration Card',
      'Gram Panchayat/Ward',
      'Block',
      'District',
      'Out Of School',
    ];
    for (let i = 0; i < cells.length; i++) {
      marks = '';
      let prediction = {};
      let isResultPresent = false;
      for (let j = 0; j < cells[i].rois.length; j++) {
        if (cells[i].rois[j].hasOwnProperty('result')) {
          isResultPresent = true;
          marks = marks + cells[i].rois[j].result.prediction;
        }
      }
      if (pageNo.toString() == cells[i].page && isResultPresent) {
        if (
          cells[i].format.name == 'dateOfAdmission' ||
          cells[i].format.name == 'studentDateOfBirth'
        ) {
          prediction = {
            key: cells[i].format.name,
            value: marks
              .substring(0, 2)
              .concat('/')
              .concat(
                marks.substring(2, 4).concat('/').concat(marks.substring(4)),
              ),
            label: labels[i],
          };
        } else {
          prediction = {
            key: cells[i].format.name,
            value: marks.trim(),
            label: labels[i],
          };
        }

        this.state.predictionArray.push(prediction);
      }
      // }

      if (pageNo == 1) {
        this.props.setDataPage1(this.state.predictionArray);
      } else {
        this.props.setDataPage2(this.state.predictionArray);
      }

      this.props.pageNo(pageNo);
      this.props.navigation.navigate('EditAndSave');
    }
  };

  checkIsValid(element) {
    if (element && element != null && element != '' && element != undefined)
      return true;
    return false;
  }

  renderItem = ({item}) => (
    <View style={style.container}>
      <Text>{item.label}</Text>
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
      />
    </View>
  );

  render() {
    return (
      <View style={style.container}>
        <Button
          buttonStyle={{
            backgroundColor: this.props.multiBrandingData.themeColor1
              ? this.props.multiBrandingData.themeColor1
              : AppTheme.BLUE,
          }}
          disabled={this.props.pageno == 1 ? true : false}
          onPress={() => {
            this.onScan(1);
            this.setState({localPageNo: 1});
          }}
          label={'SCAN PAGE 1'}
        />
        <Button
          buttonStyle={{
            backgroundColor: this.props.multiBrandingData.themeColor1
              ? this.props.multiBrandingData.themeColor1
              : AppTheme.BLUE,
            marginTop: 10,
          }}
          disabled={this.props.pageno == 0 ? true : false}
          onPress={() => {
            this.onScan(2);
            this.setState({localPageNo: 2});
          }}
          label={'SCAN PAGE 2'}
        />
        {this.checkIsValid(this.props.formDataPage1[1]?.value) && (
          <Text>Admission Number: {this.props.formDataPage1[1].value}</Text>
        )}
        {this.checkIsValid(this.props.formDataPage1[4]?.value) &&
          this.checkIsValid(this.props.formDataPage1[5]?.value) && (
            <Text>
              Name: {this.props.formDataPage1[4].value}{' '}
              {this.props.formDataPage1[5].value}
            </Text>
          )}

        <Button
          buttonStyle={{
            backgroundColor: '#d11a2a',
            marginTop: 50,
          }}
          onPress={() => this.props.navigation.goBack()}
          label={'CANCEL'}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.WHITE,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    setDataPage1: data => dispatch({type: SET_DATA_PAGE_1, data}),
    setDataPage2: data => dispatch({type: SET_DATA_PAGE_2, data}),
    pageNo: pageNo => dispatch({type: GET_PAGE_NO, pageNo}),
  };
};

const mapStateToProps = state => {
  return {
    multiBrandingData: state.multiBrandingData.response.data,
    pageno: state.admissionData.pageNo,
    formDataPage1: state.admissionData.formDataPage1,
    formDataPage2: state.admissionData.formDataPage2,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admissions);
