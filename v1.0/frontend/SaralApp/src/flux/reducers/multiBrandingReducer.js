import C from '../actions/constants';

export default function (state = { response: [] }, action) {
    switch (action.type) {
        case C.MULTI_BRANDING:
            return { ...state, response: action.payload };
        case C.MULTI_BRANDING_CLEANUP:
            return { ...state, response: '' };
        default:
            return state;
    }
}