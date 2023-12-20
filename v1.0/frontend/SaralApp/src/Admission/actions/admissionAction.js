import axios from 'axios';

import BASE_URL from '../../configs/config';
import {FORMS_SUBMITTED} from '../constants';

export const setAdmissionData = (formData, token) => {
  console.log();
  return dispatch => {
    axios
      .put(`${BASE_URL.BASE_URL}/admissions`, formData, {
        headers: {
          Authorization: `${token}`,
          origin: BASE_URL.BASE_URL,
        },
      })
      .then(response => {
        console.log('SUBMITTED', response);

        dispatch({
          type: FORMS_SUBMITTED,
          noOfFormsSubmitted: res.data.totalScannedDocument,
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
        console.log(
          'res.data.totalScannedDocument',
          res.data.totalScannedDocument,
        );

        dispatch({
          type: FORMS_SUBMITTED,
          noOfFormsSubmitted: res.data.totalScannedDocument,
        });
      })
      .catch(err => console.log(err));
  };
};
