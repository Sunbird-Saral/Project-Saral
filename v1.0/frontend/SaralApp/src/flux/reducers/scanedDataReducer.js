import C from '../actions/constants';

export default function (state={ response: []}, action) {
    switch(action.type) {
        case C.SCANNED_DATA:
            return {...state, response: action.payload};
        default:
            return state;
    }
}