import C from '../actions/constants';

export default function (state = {}, action) {
  switch (action.type) {
    case C.GET_STUDENT_DATA:
      return action.payload;
    default:
      return state;
  }
}
