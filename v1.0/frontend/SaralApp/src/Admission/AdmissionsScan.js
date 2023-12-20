import {View, StyleSheet, Platform, PermissionsAndroid} from 'react-native';
import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

import Button from './commonComponents/Button';
import SaralSDK from '../../SaralSDK';
import {roi} from './roi';
import AppTheme from '../utils/AppTheme';
import {GET_PAGE_NO, SET_DATA} from './constants';

export class Admissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      PocRoi: null,
      disblePage1: false,
      disablePage2: true,
      disableShowData: true,
      predictionArray: [...this.props.formData],
    };
  }

  onScan = async pageNo => {
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
      .then(res => {
        let roisData = JSON.parse(res);
        let cells = roisData.layout.cells;
        this.consolidatePrediction(cells, roisData, pageNo);
      })
      .catch((code, message) => {
        console.log('code', code, message);
      });
  };

  consolidatePrediction = (cells, roisData, pageNo) => {
    var marks = '';
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
      'Mobile Number',
      "Mother's Name",
      "Mother's Education",
      "Mother's Occupation",
      'Mobile Number',
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
      for (let j = 0; j < cells[i].rois.length; j++) {
        if (cells[i].rois[j].hasOwnProperty('result')) {
          marks = marks + cells[i].rois[j].result.prediction;
        }
      }

      if (pageNo.toString() == cells[i].page) {
        prediction = {
          key: cells[i].format.name,
          value: marks,
          label: labels[i],
        };
        this.state.predictionArray.push(prediction);
      }
    }

    // let arr = [];

    // for (let i = 0; i < this.state.predictionArray.length; i++) {
    //   let newObj = {...this.state.predictionArray[i], };
    //   arr.push(newObj);
    // }

    this.props.setData(this.state.predictionArray);

    this.props.pageNo(pageNo);

    this.props.navigation.navigate('EditAndSave');
  };

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
          onPress={() => this.onScan(1)}
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
          onPress={() => this.onScan(2)}
          label={'SCAN PAGE 2'}
        />
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
    setData: data => dispatch({type: SET_DATA, data}),
    pageNo: pageNo => dispatch({type: GET_PAGE_NO, pageNo}),
  };
};

const mapStateToProps = state => {
  return {
    multiBrandingData: state.multiBrandingData.response.data,
    pageno: state.admissionData.pageNo,
    formData: state.admissionData.formData,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admissions);
