import apiStatus from './apiStatus/apiStatus';
import OcrLocalResponseReducer from './OcrLocalResponseReducer';
import LoginReducer from './LoginReducer';
import getStudentsAndExamDataReducer from './getStudentsAndExamDataReducer';
import filteredDataReducer from './filteredDataReducer';
import saveScanReducer from './saveScanReducer';
import scanTypeReducer from './scanTypeReducer';
import roiDataReducer from './roiDataReducer';
import scanedDataReducer from './scanedDataReducer'

export default {
    apiStatus: apiStatus,
    ocrLocalResponse: OcrLocalResponseReducer,
    loginData: LoginReducer,
    studentsAndExamData: getStudentsAndExamDataReducer,
    filteredData: filteredDataReducer,
    savedScanData: saveScanReducer,
    scanTypeData: scanTypeReducer,
    roiData: roiDataReducer,
    scanedData: scanedDataReducer
}