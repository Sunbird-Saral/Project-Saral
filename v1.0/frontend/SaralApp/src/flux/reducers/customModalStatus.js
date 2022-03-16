import C from '../actions/constants';

export default function (state=false, action) {
    switch(action.type) {
        case C.CUSTOM_MODAL_STATUS:
            return action.payload;
        default:
            return state;
    }
}