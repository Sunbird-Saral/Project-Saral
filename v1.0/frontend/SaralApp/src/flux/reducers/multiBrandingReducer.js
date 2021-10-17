import C from '../actions/constants';

export default function (state={ response: []}, action) {
    switch(action.type) {
        case C.MULTI_BRANDING:
            // console.log('response++++++',action.payload)
            return {...state, response: action.payload};
        default:
            return state;
    }
}