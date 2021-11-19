import C from '../actions/constants';

export default function (state={response: {}}, action) {
    switch(action.type) {
        case C.DEFAULT_BRAND:

            return {...state, response: action.payload};
        default:
            return state;
    }
}

