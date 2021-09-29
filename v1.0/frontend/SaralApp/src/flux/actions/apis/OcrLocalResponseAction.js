import C from '../constants';


export const OcrLocalResponseAction = (data) => {
    return {
        type: C.OCR_LOCAL_RESPONSE,
        payload: data
    };
};