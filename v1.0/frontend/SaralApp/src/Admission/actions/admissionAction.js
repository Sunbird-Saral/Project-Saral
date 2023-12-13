import axios from 'axios';

import BASE_URL from '../../configs/config';
import {FORMS_SUBMITTED} from '../constants';

export const setAdmissionData = formData => {
  console.log();
  return dispatch => {
    axios.post(BASE_URL + '', formData).then(response => {
      console.log(response);
    });
  };
};
