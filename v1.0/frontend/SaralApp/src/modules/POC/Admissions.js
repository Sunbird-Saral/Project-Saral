import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {Component} from 'react';
import SaralSDK from '../../../SaralSDK';

import axios from 'axios';
import {roi} from './roi';

export class Admissions extends Component {
  constructor(props) {
    super(props);

    this.state = {PocRoi: null};
  }

  //   componentDidMount() {
  //     axios
  //       .get('https://saral-dev-api.anuvaad.org/pocroi')
  //       .then(function (response) {
  //         // handle success
  //         console.log(response);
  //       })
  //       .catch(function (error) {
  //         // handle error
  //         console.log(error);
  //       });
  //   }

  onScan = async () => {
    if (Platform.OS !== 'ios') {
      const grantedCamera = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (grantedCamera) {
        this.onOpenCameraActivity();
      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
          permRes => {
            if (
              permRes['android.permission.CAMERA'] ===
              PermissionsAndroid.RESULTS.GRANTED
            ) {
              this.onOpenCameraActivity();
            }
          },
        );
      }
    }
  };

  onOpenCameraActivity = () => {
    SaralSDK.startCamera(JSON.stringify(roi), '1', 0, true)
      .then(res => {
        let roisData = JSON.parse(res);
        console.log('=================================', roisData);
        let cells = roisData.layout.cells;
        this.consolidatePrediction(cells, roisData);
      })
      .catch((code, message) => {
        console.log('code', code, message);
      });
  };

  consolidatePrediction = (cells, roisData) => {
    var marks = '';
    let predictionConfidenceArray = [];
    for (let i = 0; i < cells.length; i++) {
      marks = '';
      for (let j = 0; j < cells[i].rois.length; j++) {
        if (cells[i].rois[j].hasOwnProperty('result')) {
          marks = marks + cells[i].rois[j].result.prediction;
          console.log(cells[i].format.name, marks);
        } else {
          let resultProperty = {
            prediction: '0',
            confidence: 0,
          };
          roisData.layout.cells[i].rois[j].result = resultProperty;
        }
      }
    }

    this.props.navigation.navigate('Admissions');
  };

  render() {
    return (
      <View style={style.container}>
        <TouchableOpacity
          style={[style.buttonContainer, {marginBottom: 20}]}
          onPress={() => this.onScan()}>
          <Text style={style.buttonText}>Scan Admission Page 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.buttonContainer, {marginBottom: 20}]}>
          <Text style={style.buttonText}>Scan Admission Page 2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.buttonContainer, {backgroundColor: '#5dbea3'}]}
          disabled={true}>
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
