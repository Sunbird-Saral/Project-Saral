import C from '../actions/constants';

export default function (state={}, action) {
    switch(action.type) {
        case C.LOGIN_PROCESS:
            console.log('action.payload',action.payload)
            return action.payload;
        default:
            return state;
    }
}
