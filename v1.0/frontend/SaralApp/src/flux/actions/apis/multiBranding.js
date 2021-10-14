import C from '../constants';

export const MultiBrandingDataAction = (data) => {
    return {
        type: C.MULTI_BRANDING,
        payload: data
    };
};