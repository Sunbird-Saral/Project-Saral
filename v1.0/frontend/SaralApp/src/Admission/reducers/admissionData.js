const initialState = {
  formData: [],
  pageNo: 0,
};

const admissionDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        formData: action.data,
      };
    case 'PAGE_NO':
      return {
        ...state,
        pageNo: action.pageNo,
      };
    case 'CLEAR_CACHE': {
      return {
        ...state,
        formData: [],
        pageNo: 0,
      };
    }
    default:
      return state;
  }
};

export default admissionDataReducer;
