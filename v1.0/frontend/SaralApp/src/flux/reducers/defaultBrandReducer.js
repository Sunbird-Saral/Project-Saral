import C from '../actions/constants';

export default function (state={response: {}}, action) {
    console.log('action.payload',action.payload)
    switch(action.type) {
        case C.DEFAULT_BRAND:

            return {...state, response: action.payload};
        default:
            return state;
    }
}

