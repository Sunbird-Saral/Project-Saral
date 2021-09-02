import C from '../actions/constants';

export default function (state={ response: []}, action) {
    switch(action.type) {
        case C.OCR_LOCAL_RESPONSE:
            return {...state, response: action.payload};
        default:
            return state;
    }
}
