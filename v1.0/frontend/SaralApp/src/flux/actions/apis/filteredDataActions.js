import C from '../constants';


export const FilteredDataAction = (data) => {
    return {
        type: C.FILTERED_SCAN_DATA,
        payload: data
    };
};