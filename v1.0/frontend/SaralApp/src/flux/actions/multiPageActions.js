import C from './constants';


export const MultiPageActions = (data) => {
    return {
        type: C.MULTI_PAGE,
        payload: data
    };
};