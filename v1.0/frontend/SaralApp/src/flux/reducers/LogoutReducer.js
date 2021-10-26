import C from '../actions/constants';

export default function(state = null, action) {
    switch (action.type) {
      case C.LOGOUT_PROCESS:
        return { ...state, };
  
      default:
        return state;
    }
  }