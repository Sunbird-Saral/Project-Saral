import {
  CLEAR_CACHE,
  FORMS_SUBMITTED,
  GET_PAGE_NO,
  SET_DATA_PAGE_1,
  SET_DATA_PAGE_2,
  API_CALL_COMPLETE,
  HANDLE_CANCLE_PAGE_2,
  HANDLE_CANCLE_PAGE_1,
} from '../constants';

const initialState = {
  admissionROI: {},
  formDataPage1: [],
  formDataPage2: [],
  pageNo: 0,
  noOfFormsSubmitted: 0,
  dataSubmitted: false,
  apiCallComplete: false,
};

const admissionDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA_PAGE_1:
      return {
        ...state,
        formDataPage1: [...action.data],
      };
    case SET_DATA_PAGE_2:
      return {
        ...state,
        formDataPage2: [...action.data],
      };
    case GET_PAGE_NO:
      return {
        ...state,
        pageNo: action.pageNo,
      };
    case CLEAR_CACHE: {
      return {
        ...state,
        formDataPage1: [],
        formDataPage2: [],
        pageNo: 0,
        dataSubmitted: false,
      };
    }
    case FORMS_SUBMITTED: {
      return {
        ...state,
        noOfFormsSubmitted: action.noOfFormsSubmitted,
      };
    }
    case HANDLE_CANCLE_PAGE_1: {
      return {
        ...state,
        formDataPage1: [],
      };
    }
    case HANDLE_CANCLE_PAGE_2: {
      return {
        ...state,
        formDataPage2: [],
      };
    }
    case API_CALL_COMPLETE: {
      return {
        ...state,
        apiCallComplete: action.apiCallComplete,
      };
    }
    default:
      return state;
  }
};

export default admissionDataReducer;
