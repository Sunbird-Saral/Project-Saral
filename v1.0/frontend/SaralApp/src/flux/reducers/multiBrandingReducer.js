import C from '../actions/constants';

export default function (state={ response: []}, action) {
    switch(action.type) {
        case C.MULTI_BRANDING:
            return {...state, response: action.payload};
        default:
            return state;
    }
}