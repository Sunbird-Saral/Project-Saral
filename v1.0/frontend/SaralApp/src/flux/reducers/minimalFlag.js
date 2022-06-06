import C from '../actions/constants';

export default function (state=false, action) {
    switch(action.type) {
        case C.MINIMAL_FLAG:
            return action.payload;
        default:
            return state;
    }
}