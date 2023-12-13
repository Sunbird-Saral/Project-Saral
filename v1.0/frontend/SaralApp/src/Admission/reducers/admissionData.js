import {
  CLEAR_CACHE,
  FORMS_SUBMITTED,
  GET_PAGE_NO,
  SET_DATA,
} from '../constants';

const initialState = {
  formData: [],
  pageNo: 0,
  noOfFormsSubmitted: 0,
};

const admissionDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        formData: action.data,
      };
    case GET_PAGE_NO:
      return {
        ...state,
        pageNo: action.pageNo,
      };
    case CLEAR_CACHE: {
      return {
        ...state,
        formData: [],
        pageNo: 0,
      };
    }
    case FORMS_SUBMITTED: {
      return {
        ...state,
        noOfFormsSubmitted: action.data,
      };
    }
    default:
      return state;
  }
};

export default admissionDataReducer;
