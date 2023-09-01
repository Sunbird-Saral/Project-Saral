import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SaveScanData} from '../../flux/actions/apis/saveScanDataAction';
import AppTheme from '../../utils/AppTheme';
import {
  getLoginCred,
  getPresentAbsentStudent,
  getScannedDataFromLocal,
  setScannedDataIntoLocal,
  setStudentsExamData,
  getStudentsExamData,
} from '../../utils/StorageUtils';
import {
  checkAppVersion,
  checkNetworkConnectivity,
  dispatchCustomModalMessage,
  dispatchCustomModalStatus,
  Exam_QuestionHeader,
  monospace_FF,
} from '../../utils/CommonUtils';
import ExamDetailsPopup from '../common/components/ExamDetailsPopup';
import ButtonComponent from '../common/components/ButtonComponent';
import Strings from '../../utils/Strings';
//api
import APITransport from '../../flux/actions/transport/apitransport';
//styles
import {styles} from './ScanHistoryStyles';
import {scanStatusDataAction} from '../ScanStatus/scanStatusDataAction';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {collectErrorLogs} from '../CollectErrorLogs';
import Constant from '../../flux/actions/constants';
import DeviceInfo from 'react-native-device-info';
import {SaveInDbEvent, ReviewScan} from '../../utils/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const HEIGHT_MODAL = 150;
const ScanHistoryCard = ({
  showButtons = true,
  showButtons1 = true,
  scanstatusbutton = true,
  navigation,
  filteredData,
  scanedData,
  loginData,
  setIsLoading,
  scanStatusData,
  setScanStatusData,
  themeColor1,
  studentsAndExamData,
  apiStatus,
  bgFlag,
  multiBrandingData,
  scanFun,
}) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [studentCount, setStudentCount] = useState({
    absentCount: 0,
    totalCount: 0,
  });
  const [disableButton, setDisableButton] = useState(
    scanStatusData > 0 ? true : false,
  );
  const BrandLabel =
    multiBrandingData &&
    multiBrandingData.screenLabels &&
    multiBrandingData.screenLabels.scanHistoryCard[0];
  const ExamDetaildata =
    multiBrandingData &&
    multiBrandingData.screenLabels &&
    multiBrandingData.screenLabels.examDetailsPopup;

  useEffect(() => {
    setTimeout(() => {
      setLoading(!loading);
    }, 3000);
    getSaveCount();
    getStudentList();
  }, []);

  useEffect(() => {
    setDisableButton(scanStatusData > 0 ? true : false);
  }, [scanStatusData]);

  const getSaveCount = () => {
    let hasSet = filteredData.response.hasOwnProperty('set')
      ? filteredData.response.set.length >= 0
        ? filteredData.response.set
        : ''
      : null;

    let data =
      typeof scanedData.response === 'object'
        ? scanedData.response.data
          ? scanedData.response.data.filter((o, index) => {
              let stdCondition =
                hasSet == null
                  ? o.studentAvailability &&
                    o.marksInfo.length > 0 &&
                    o.examDate == filteredData.response.examDate
                  : hasSet.length >= 0
                  ? o.studentAvailability &&
                    o.marksInfo.length > 0 &&
                    hasSet == o.set
                  : false;

              if (stdCondition) {
                return true;
              }
            })
          : []
        : [];

    return data.length;
  };

  const onPressContinue = () => {
    navigation.push('myScan');
  };

  const onPressStatus = () => {
    navigation.push('ScanStatus', {scanFun: scanFun});
  };

  const onPressScanStatus = () => {
    navigation.push('ScanStatusLocal');
    ReviewScan(loginData.data.school.schoolId);
  };
  const dispatch = useDispatch();

  const callCustomModal = (title, message, isAvailable, func, cancel) => {
    let data = {
      title: title,
      message: message,
      isOkAvailable: isAvailable,
      okFunc: func,
      isCancel: cancel,
    };
    dispatch(dispatchCustomModalStatus(true));
    dispatch(dispatchCustomModalMessage(data));
  };

  const onPressSaveInDB = async () => {
    const data = await getScannedDataFromLocal();
    const hasNetwork = await checkNetworkConnectivity();
    let hasUpdate = await checkAppVersion();
    const deviceUniqId = await DeviceInfo.getUniqueId();
    const {subject, examDate} = filteredData.response;

    if (!hasUpdate) {
      if (hasNetwork) {
        if (data) {
          if (!bgFlag) {
            const filterData = data.filter(e => {
              let findSection = e.studentsMarkInfo.some(
                item => item.section == filteredData.response.section,
              );
              if (
                e.classId == filteredData.response.class &&
                e.subject == subject &&
                e.examDate == examDate &&
                findSection
              ) {
                return true;
              } else {
                return false;
              }
            });
            setIsLoading(true);
            let filterDataLen = 0;
            let setIntolocalAfterFilter = '';
            if (filterData.length != 0) {
              filterData.filter(f => {
                let findSection = f.studentsMarkInfo.some(
                  item => item.section == filteredData.response.section,
                );
                setIntolocalAfterFilter = data.filter(e => {
                  if (
                    e.classId == f.classId &&
                    e.subject == f.subject &&
                    e.examDate == f.examDate &&
                    findSection
                  ) {
                    return false;
                  } else {
                    return true;
                  }
                });
              });
              let apiObj = new SaveScanData(
                filterData[0],
                loginData.data.token,
                deviceUniqId,
              );

              //update cache
              let studentsAndExamArr = await getStudentsExamData();

              let finalStudentsAndExamArr = [];
              if (studentsAndExamArr != null) {
                studentsAndExamArr.forEach(element => {
                  finalStudentsAndExamArr.push(element);
                });
              }

              finalStudentsAndExamArr.forEach((data, index) => {
                if (data && data.classId == filterData[0].classId) {
                  filterData[0].studentsMarkInfo.forEach((student, index) => {
                    let tempIndex = data.data.students.findIndex(
                      element =>
                        student.studentId == element.studentId &&
                        student.studentAvailability !=
                          element.studentAvailability,
                    );

                    data.data.students.splice(tempIndex);
                    data.data.students[tempIndex] =
                      filterData[0].studentsMarkInfo[index];
                  });
                }
              });

              await setStudentsExamData(finalStudentsAndExamArr);

              saveScanData(apiObj, filterDataLen, setIntolocalAfterFilter);
            } else {
              callCustomModal(
                Strings.message_text,
                Strings.there_is_no_data,
                false,
              );
              setIsLoading(false);
            }
          } else {
            callCustomModal(
              Strings.message_text,
              Strings.auto_sync_in_progress_please_wait,
              false,
            );
          }
        } else {
          setIsLoading(false);
          callCustomModal(
            Strings.message_text,
            Strings.there_is_no_data,
            false,
          );
        }
      } else {
        callCustomModal(
          Strings.message_text,
          Strings.please_try_again_later_network_is_not_available,
          false,
          true,
        );
      }
    }
  };

  const saveScanData = async (api, filteredDatalen, localScanData) => {
    if (api.method === 'PUT') {
      let apiResponse = null;
      const source = axios.CancelToken.source();
      const id = setTimeout(() => {
        if (apiResponse === null) {
          source.cancel('The request timed out.');
        }
      }, 60000);
      axios
        .put(api.apiEndPoint(), api.getBody(), {
          headers: api.getHeaders(),
          cancelToken: source.token,
        })
        .then(function (res) {
          apiResponse = res;
          clearTimeout(id);
          let hasMessage = res
            ? typeof res.data == 'string' || typeof res.data.message == 'string'
              ? true
              : false
            : false;
          if (hasMessage) {
            api.processResponse(res);
            callScanStatusData(filteredDatalen, localScanData);
          } else {
            dispatch(dispatchAPIAsync(res.data));
            setScanStatusData(filteredDatalen);
            setScannedDataIntoLocal(localScanData);
            callCustomModal(
              Strings.message_text,
              Strings.saved_successfully,
              false,
            );
            SaveInDbEvent(loginData.data.school.schoolId);
            setIsLoading(false);
          }
        })
        .catch(function (err) {
          collectErrorLogs(
            'ScanHistoryCard.js',
            'saveScanData',
            api.apiEndPoint(),
            err,
            false,
          );
          callCustomModal(
            Strings.message_text,
            err && err.response && err.response.data && err.response.data.error
              ? err.response.data.error
              : Strings.contactAdmin,
            false,
          );
          clearTimeout(id);
          setIsLoading(false);
        });
    }
  };

  const callScanStatusData = async (filteredDatalen, localScanData) => {
    const deviceUniqId = await DeviceInfo.getUniqueId();
    let token = loginData.data.token;
    let loginCred = await getLoginCred();

    let dataPayload = {
      classId: filteredData.response.class,
      subject: filteredData.response.subject,
      section: filteredData.response.section,
      fromDate: filteredData.response.examDate,
      set: filteredData.response.set,
      page: 0,
      schoolId: loginData.data.school.schoolId,
      downloadRes: false,
    };
    if (filteredData.response.hasOwnProperty('set')) {
      dataPayload.set = filteredData.response.set;
    }
    let apiObj = new scanStatusDataAction(dataPayload, token, deviceUniqId);
    FetchSavedScannedData(
      apiObj,
      loginCred.schoolId,
      loginCred.password,
      filteredDatalen,
      localScanData,
    );
  };

  const FetchSavedScannedData = async (
    api,
    uname,
    pass,
    filterDataLen,
    localScanData,
  ) => {
    if (api.method === 'POST') {
      let apiResponse = null;
      const source = axios.CancelToken.source();
      const id = setTimeout(() => {
        if (apiResponse === null) {
          source.cancel('The request timed out.');
        }
      }, 60000);
      axios
        .post(api.apiEndPoint(), api.getBody(), {
          headers: api.getHeaders(),
          cancelToken: source.token,
        })
        .then(function (res) {
          callCustomModal(
            Strings.message_text,
            Strings.saved_successfully,
            false,
          );
          apiResponse = res;
          clearTimeout(id);
          api.processResponse(res);
          dispatch(dispatchAPIAsyncSavedData(api));
          setScanStatusData(filterDataLen);
          setScannedDataIntoLocal(localScanData);
          setIsLoading(false);
        })
        .catch(function (err) {
          collectErrorLogs(
            'ScanHistoryCard.js',
            'FetchSavedScannedData',
            api.apiEndPoint(),
            err,
            false,
          );
          console.warn('Error', err);
          console.warn('Error', err.response);
          callCustomModal(
            Strings.message_text,
            Strings.something_went_wrong_please_try_again,
            false,
          );
          setIsLoading(false);
          clearTimeout(id);
        });
    }
  };

  function dispatchAPIAsync(res) {
    return {
      type: Constant.SCANNED_DATA,
      payload: res,
    };
  }

  function dispatchAPIAsyncSavedData(api) {
    return {
      type: api.type,
      payload: api.getPayload(),
    };
  }

  const getStudentList = async () => {
    let studentList = await getPresentAbsentStudent();
    let absentStudent =
      studentList != null
        ? studentList.filter(item => {
            if (item.studentAvailability == false) {
              return true;
            }
          })
        : [];
    setStudentCount({
      absentCount: absentStudent.length,
      totalCount: studentList != null ? studentList.length : 0,
    });
  };

  // for exam type
  let Examtypedata = studentsAndExamData.data && studentsAndExamData.data.exams;
  Examtypedata =
    studentsAndExamData.data &&
    studentsAndExamData.data.exams
      .filter(function (item) {
        return (
          item.subject == filteredData.response.subject &&
          item.examId == filteredData.response.examTestID
        );
      })
      .map(({type}) => ({type}));

  let ExamQuesDetail =
    studentsAndExamData.data && studentsAndExamData.data.exams;
  ExamQuesDetail =
    studentsAndExamData.data &&
    studentsAndExamData.data.exams.filter(function (item) {
      return (
        item.subject == filteredData.response.subject &&
        item.examId == filteredData.response.examTestID
      );
    });
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          {backgroundColor: themeColor1 ? themeColor1 : AppTheme.BLUE},
        ]}
        disabled>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            paddingTop: 40,
            paddingLeft: '1%',
            paddingRight: '1%',
            marginBottom: 20,
          }}>
          <View>
            <View style={styles.scanCardStyle}>
              <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                <Text style={{}}>
                  {BrandLabel && BrandLabel.TotalStudent
                    ? BrandLabel.TotalStudent
                    : 'Total Students'}
                </Text>
              </View>
              <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                <Text style={{fontFamily: monospace_FF, fontWeight: 'bold'}}>
                  {studentCount.totalCount}
                </Text>
              </View>
            </View>

            <View style={styles.scanCardStyle}>
              <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                <Text style={{}}>
                  {BrandLabel && BrandLabel.PresentStudents
                    ? BrandLabel.PresentStudents
                    : 'Present Students'}
                </Text>
              </View>
              <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                <Text style={{fontFamily: monospace_FF, fontWeight: 'bold'}}>
                  {studentCount.totalCount - studentCount.absentCount}
                </Text>
              </View>
            </View>

            <View style={styles.scanCardStyle}>
              <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                <Text style={{}}>
                  {BrandLabel && BrandLabel.ScanNotSubmitedYet
                    ? BrandLabel.ScanNotSubmitedYet
                    : 'Scans not submitted yet'}
                </Text>
              </View>
              <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                <Text
                  style={{
                    fontFamily: monospace_FF,
                    color: 'red',
                    fontWeight: 'bold',
                  }}>
                  {scanStatusData}
                </Text>
              </View>
            </View>

            <View style={styles.scanCardStyle}>
              <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                <Text style={{}}>
                  {BrandLabel && BrandLabel.TotalScanSubmited
                    ? BrandLabel.TotalScanSubmited
                    : 'Total scans submitted'}
                </Text>
              </View>
              <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                <Text style={{fontFamily: monospace_FF, fontWeight: 'bold'}}>
                  {getSaveCount()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{marginBottom: '3%', width: '100%', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            {showButtons && (
              <TouchableOpacity
                style={{
                  backgroundColor: AppTheme.WHITE,
                  borderRadius: 4,

                  width: true ? '45%' : '80%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 8,
                  paddingVertical: 4,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={onPressStatus}>
                <Text style={{fontFamily: monospace_FF}}>
                  {Strings.save_status}
                </Text>
              </TouchableOpacity>
            )}
            {showButtons && (
              <TouchableOpacity
                style={{
                  backgroundColor: AppTheme.WHITE,
                  borderRadius: 4,
                  width: '45%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 8,
                  paddingVertical: 4,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={onPressSaveInDB}>
                <Text style={{fontFamily: monospace_FF, color: AppTheme.BLACK}}>
                  {Strings.save_scan}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {showButtons && (
          <View
            style={{
              marginBottom: '5%',
              marginTop: '2%',
              width: '100%',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: AppTheme.WHITE,
                  borderRadius: 4,

                  width: true ? '45%' : '80%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 8,
                  paddingVertical: 4,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={onPressContinue}>
                <Text style={{fontFamily: monospace_FF, color: AppTheme.BLACK}}>
                  {Strings.continue_scan}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{marginBottom: '8%', width: '100%', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            {disableButton && (
              <TouchableOpacity
                style={{
                  backgroundColor: AppTheme.WHITE,
                  borderRadius: 4,

                  width: true ? '45%' : '80%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 8,
                  paddingVertical: 4,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={onPressScanStatus}>
                <Text style={{fontFamily: monospace_FF, color: AppTheme.BLACK}}>
                  {BrandLabel && BrandLabel.ReviewScanText
                    ? BrandLabel.ReviewScanText
                    : 'Review scan'}
                </Text>
              </TouchableOpacity>
            )}
            {disableButton && (
              <TouchableOpacity
                style={{
                  backgroundColor: AppTheme.WHITE,
                  borderRadius: 4,
                  width: '45%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 8,
                  paddingVertical: 4,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={onPressSaveInDB}>
                <Text style={{fontFamily: monospace_FF, color: AppTheme.BLACK}}>
                  {BrandLabel && BrandLabel.SubmitAllScan
                    ? BrandLabel.SubmitAllScan
                    : 'Submit all scans'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* {
                            scanstatusbutton
                            &&
                            <View style={{  marginTop: '5%', width: '100%', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: AppTheme.WHITE, borderRadius: 4,

                                    width: true ? '45%' : '80%',
                                    alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4,
                                    marginLeft: 5,
                                    marginRight: 5,
                                    
                                }}
                                onPress={onPressStatus}
                            >
                                <Text  style={{fontFamily : monospace_FF}}>{Strings.save_status}</Text>
                            </TouchableOpacity>
                            </View>
                        
                        } */}
        </View>
      </TouchableOpacity>

      <Modal transparent={true} animationType="fade" visible={isModalVisible}>
        <View style={{backgroundColor: '#fff', flex: 1}}>
          <ScrollView scrollEnabled showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles1.container1,
                {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                },
              ]}>
              {ExamDetaildata && ExamDetaildata.length > 0
                ? ExamDetaildata.map(data => {
                    return (
                      <ExamDetailsPopup
                        customRowStyle={{
                          width: '30%',
                          backgroundColor: AppTheme.TABLE_HEADER,
                        }}
                        key={data}
                        rowTitle={data}
                        rowBorderColor={AppTheme.TAB_BORDER}
                      />
                    );
                  })
                : Exam_QuestionHeader.map(data => {
                    return (
                      <ExamDetailsPopup
                        customRowStyle={{
                          width: '30%',
                          backgroundColor: AppTheme.TABLE_HEADER,
                        }}
                        key={data}
                        rowTitle={data}
                        rowBorderColor={AppTheme.TAB_BORDER}
                      />
                    );
                  })}
            </View>
            <View style={styles1.container1}>
              {ExamQuesDetail &&
              ExamQuesDetail[0] &&
              ExamQuesDetail[0].questions != undefined &&
              ExamQuesDetail[0].questions != '' ? (
                ExamQuesDetail[0] &&
                ExamQuesDetail[0].questions.map(stu => {
                  return (
                    <View
                      key={stu}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ExamDetailsPopup
                        customRowStyle={{width: '30%'}}
                        rowTitle={stu.questionId}
                        rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                      />
                      <ExamDetailsPopup
                        customRowStyle={{width: '30%'}}
                        rowTitle={stu.indicatorTitle}
                        rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                      />
                      <ExamDetailsPopup
                        customRowStyle={{width: '30%'}}
                        rowTitle={stu.questionMarks}
                        rowBorderColor={AppTheme.INACTIVE_BTN_TEXT}
                      />
                    </View>
                  );
                })
              ) : (
                <View style={{alignItems: 'center', marginTop: 80}}>
                  <Text>Data not found</Text>
                </View>
              )}
            </View>
          </ScrollView>
          <View>
            <ButtonComponent
              customBtnStyle={[
                styles1.nxtBtnStyle,
                {backgroundColor: themeColor1 ? themeColor1 : AppTheme.BLUE},
              ]}
              btnText={Strings.close.toUpperCase()}
              activeOpacity={0.8}
              onPress={() => setIsModalVisible(!isModalVisible)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    filteredData: state.filteredData,
    scanedData: state.scanedData,
    loginData: state.loginData,
    studentsAndExamData: state.studentsAndExamData,
    apiStatus: state.apiStatus,
    bgFlag: state.bgFlag,
    multiBrandingData: state.multiBrandingData.response.data,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      APITransport: APITransport,
    },
    dispatch,
  );
};
const styles1 = StyleSheet.create({
  container1: {flex: 1, backgroundColor: '#fff'},
  container: {
    top: -40,
    padding: 25,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  nxtBtnStyle: {
    marginTop: 10,
    marginHorizontal: 40,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(ScanHistoryCard));
