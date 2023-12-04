import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {Component} from 'react';
import SaralSDK from '../../SaralSDK';

import axios from 'axios';
import {roi} from './roi';

export class Admissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      PocRoi: null,
      disblePage1: false,
      disablePage2: true,
      disableShowData: true,
      predictionArray: [],
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
          label: cells[i].format.name,
          value: marks,
        };
        this.state.predictionArray.push(prediction);
      }
    }
    this.props.navigation.navigate('Admissions');
  };

  render() {
    return (
      <View style={style.container}>
        <TouchableOpacity
          style={[style.buttonContainer, {marginBottom: 20}]}
          onPress={() => this.onScan(1)}>
          <Text style={style.buttonText}>SCAN PAGE 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.buttonContainer, {marginBottom: 20}]}>
          <Text style={style.buttonText} onPress={() => this.onScan(2)}>
            SCAN PAGE 2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.buttonContainer, {backgroundColor: '#5dbea3'}]}
          onPress={() => {
            this.props.navigation.navigate('ShowScannedData', {
              data: this.state.predictionArray,
            });
          }}>
          <Text style={style.buttonText}>Show scanned data</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: '#5783db',
    height: 70,
    width: 250,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontFamily: 'sans-serif-medium',
    fontSize: 20,
    color: 'white',
  },
});

export default Admissions;
