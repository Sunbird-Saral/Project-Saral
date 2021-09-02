import C from '../constants';


export const ScantypeAction = (data) => {
    return {
        type: C.SCAN_TYPE_DATA,
        payload: data
    };
};