import C from '../actions/constants';

export default function (state=false, action) {
    switch(action.type) {
        case C.BACKGROUND_FLAG:
            return action.payload;
        default:
            return state;
    }
}