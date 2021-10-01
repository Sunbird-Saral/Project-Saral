import C from '../actions/constants';

export default function (state={}, action) {
    switch(action.type) {
        case C.GET_SCAN_STATUS:
            return action.payload;
        default:
            return state;
    }
}
