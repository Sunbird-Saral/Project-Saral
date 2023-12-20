import axios from 'axios';

import BASE_URL from '../../configs/config';
import {FORMS_SUBMITTED} from '../constants';

export const setAdmissionData = (formData, token) => {
  let reformatedObj = {};

  for (let i = 0; i < formData.length; i++) {
    reformatedObj = {...reformatedObj, [formData[i].key]: formData[i].value};
  }

  console.log('......formDataformData', reformatedObj);

  return dispatch => {
    axios
      .put(`${BASE_URL.BASE_URL}/admissions`, reformatedObj, {
        headers: {
          Authorization: `${token}`,
          origin: BASE_URL.BASE_URL,
        },
      })
      .then(response => {
        console.log('SUBMITTED', response, response.data.totalScannedDocument);
        console.log(
          'response.data.totalScannedDocument',
          response.data.totalScannedDocument,
        );
        //         let res = JSON.parse(response);
        //         noOfForms = res.data.totalScannedDocument;
        //  console.log('res.data.totalScannedDocument', res.data.totalScannedDocument);
        dispatch({
          type: FORMS_SUBMITTED,
          noOfFormsSubmitted: response.data.totalScannedDocument,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
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
