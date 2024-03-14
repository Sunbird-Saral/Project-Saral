import {
  CLEAR_CACHE,
  FORMS_SUBMITTED,
  GET_PAGE_NO,
  SET_DATA_PAGE_1,
  SET_DATA_PAGE_2,
  API_CALL_COMPLETE,
  HANDLE_CANCLE_PAGE_2,
  HANDLE_CANCLE_PAGE_1,
  GET_ROI_DATA,
  SET_PREDICTION_INFO_PAGE_1,
  SET_PREDICTION_INFO_PAGE_2,
} from '../constants';

const initialState = {
  admissionROI: {},
  formDataPage1: [],
  formDataPage2: [],
  pageNo: 0,
  noOfFormsSubmitted: 0,
  dataSubmitted: false,
  apiCallComplete: false,
  roi: {},
  predictionInfoPage1: [],
  predictionInfoPage2: [],
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
        predictionInfoPage1: [],
        predictionInfoPage2: [],
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
        predictionInfoPage1: [],
      };
    }
    case HANDLE_CANCLE_PAGE_2: {
      return {
        ...state,
        formDataPage2: [],
        predictionInfoPage2: [],
      };
    }
    case API_CALL_COMPLETE: {
      return {
        ...state,
        apiCallComplete: action.apiCallComplete,
      };
    }
    case GET_ROI_DATA: {
      return {
        ...state,
        roi: {...action.roiData},
      };
    }
    case SET_PREDICTION_INFO_PAGE_1: {
      return {
        ...state,
        predictionInfoPage1: [...action.data],
      };
    }
    case SET_PREDICTION_INFO_PAGE_2: {
      return {
        ...state,
        predictionInfoPage2: [...action.data],
      };
    }
    default:
      return state;
  }
};

export default admissionDataReducer;
