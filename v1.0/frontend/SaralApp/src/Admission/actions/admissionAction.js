import axios from 'axios';
import {Alert} from 'react-native';

import BASE_URL from '../../configs/config';
import {FORMS_SUBMITTED} from '../constants';

export const setAdmissionData = (formData, token) => {
  let reformatedObj = {};

  for (let i = 0; i < formData.length; i++) {
    reformatedObj = {...reformatedObj, [formData[i].key]: formData[i].value};
  }

  let headers = {
    method: 'PUT',
    headers: {
      Authorization: `${token}`,
      origin: BASE_URL.BASE_URL,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reformatedObj),
  };

  return dispatch => {
    fetch(`${BASE_URL.BASE_URL}/admissions`, headers)
      .then(response => {
        console.log('reformatedObj from success', reformatedObj, response);
        Alert.alert('Data submittied successfully');
        dispatch(getNoOFFormsSubmitted(token));
      })
      .catch(error => {
        Alert.alert(error.message);
        console.log('error.....', error);
      });

    // axios
    //   .put(`${BASE_URL.BASE_URL}/admissions`, reformatedObj, {
    //     headers: {
    //       Authorization: `${token}`,
    //       origin: BASE_URL.BASE_URL,
    //       'Content-Type': 'application/json',
    //     },
    //   })
    // .then(response => {
    //   console.log('reformatedObj from success', reformatedObj);
    //   Alert.alert('Data submittied successfully');
    //   dispatch(getNoOFFormsSubmitted(token));
    // })
    // .catch(function (error) {
    //   console.log('reformatedObj from error', reformatedObj);

    //   Alert.alert(error.message);
    //   console.log('error.....', error);
    // });
  };
};

export const getNoOFFormsSubmitted = token => {
  const config = {
    headers: {
      Authorization: `${token}`,
      origin: BASE_URL.BASE_URL,
    },
  };
  return dispatch => {
    axios
      .get(`${BASE_URL.BASE_URL}/admissions?summary=true`, config)
      .then(res => {
        dispatch({
          type: FORMS_SUBMITTED,
          noOfFormsSubmitted: res.data.totalScannedDocument,
        });
      })
      .catch(err => console.log(err));
  };
};
