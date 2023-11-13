import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  BackHandler,
  StyleSheet,
} from 'react-native';

//redux
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import APITransport from '../../flux/actions/transport/apitransport';

//storage
import {
  getErrorMessage,
  getLoginCred,
  getStudentsExamData,
  setAbsentStudentDataIntoAsync,
  setErrorMessage,
  setPresentAbsentStudent,
  setStudentsExamData,
  setTotalStudent,
} from '../../utils/StorageUtils';
import ButtonComponent from '../common/components/ButtonComponent';
import StudentsDataComponent from './StudentsDataComponent';
import ShareComponent from '../common/components/Share';
import MultibrandLabels from '../common/components/multibrandlabels';
//style
import {styles} from './StudentsDataStyle';

//action

//constant
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import {ROIAction} from './ROIAction';

//npm

import axios from 'axios';

//components
import {scanStatusDataAction} from '../../modules/ScanStatus/scanStatusDataAction';
import Spinner from '../common/components/loadingIndicator';
import {
  checkAppVersion,
  checkNetworkConnectivity,
  cryptoText,
  dispatchCustomModalMessage,
  dispatchCustomModalStatus,
  monospace_FF,
  validateToken,
} from '../../utils/CommonUtils';
import {LoginAction} from '../../flux/actions/apis/LoginAction';

import {SaveScanData} from '../../flux/actions/apis/saveScanDataAction';
import {collectErrorLogs} from '../CollectErrorLogs';
import {
  getRegularRoipi,
  getRegularSavedScanpi,
  getRegularStudentExamApi,
  setRegularRoiApi,
  setRegularSavedScanApi,
  setRegularStudentExamApi,
} from '../../utils/offlineStorageUtils';
import constants from '../../flux/actions/constants';
import {storeFactory} from '../../flux/store/store';
import DeviceInfo from 'react-native-device-info';
import {markAttendanceNext} from '../../utils/Analytics';
const StudentsList = ({
  filteredData,
  loginData,
  navigation,
  saveAbsentStudent,
  multiBrandingData,
  scanedData,
  apiStatus,
  roiData,
}) => {
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  //hooks
  const [allStudentData, setAllStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stdArray, setStdArray] = useState([]);
  const prevloginResponse = usePrevious(loginData);
  const prevSaveRes = usePrevious(saveAbsentStudent);
  const BrandLabel =
    multiBrandingData &&
    multiBrandingData.screenLabels &&
    multiBrandingData.screenLabels.studentList[0];

  useEffect(() => {
    getRoi();
    studentData();
  }, []);

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      setIsLoading(true);
      studentData(true);
    });

    return () => {
      focusListener.remove();
    };
  }, [navigation]);

  useEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('selectDetails');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(async () => {
    const hasNetwork = await checkNetworkConnectivity();
    if (roiData && roiData.status && roiData.status == 200) {
      if (
        loginData.data.school.hasOwnProperty('offlineMode') &&
        loginData.data.school.offlineMode &&
        hasNetwork
      ) {
        let getRoiCache = await getRegularRoipi();
        let setValue = filteredData.hasOwnProperty('set')
          ? filteredData.set.length > 0
            ? filteredData.set
            : ''
          : null;

        if (getRoiCache != null) {
          let result = getRoiCache.findIndex(e => {
            return setValue != null && setValue.length > 0
              ? e.key == loginData.data.school.schoolId &&
                  e.examId == filteredData.examTestID &&
                  filteredData.set == e.set
              : e.key == loginData.data.school.schoolId &&
                  e.examId == filteredData.examTestID;
          });

          if (result > -1) {
            getRoiCache[result].data = roiData;
          } else if (setValue != null && setValue.length > 0) {
            let payload = {
              key: `${loginData.data.school.schoolId}`,
              examId: filteredData.examTestID,
              data: roiData,
              set: setValue,
            };
            getRoiCache.push(payload);
          } else {
            let payload = {
              key: `${loginData.data.school.schoolId}`,
              examId: filteredData.examTestID,
              data: roiData,
            };
            if (setValue != null && setValue.length > 0) {
              payload.set = setValue;
            }
            getRoiCache.push(payload);
          }
          await setRegularRoiApi(getRoiCache);
        } else {
          let payload = {
            key: `${loginData.data.school.schoolId}`,
            examId: filteredData.examTestID,
            data: roiData,
          };
          if (setValue != null && setValue.length > 0) {
            payload.set = setValue;
          }
          await setRegularRoiApi([payload]);
        }
      }
    }
  }, [roiData]);

  const dispatch = useDispatch();

  //function

  const getSavedScanApiCache = async savedScanData => {
    let getSavedScanCache = await getRegularSavedScanpi();
    let setValue = filteredData.hasOwnProperty('set')
      ? filteredData.set.length > 0
        ? filteredData.set
        : ''
      : null;

    if (getSavedScanCache != null) {
      let result = getSavedScanCache.findIndex(e => {
        return setValue != null && setValue.length >= 0
          ? e.key == loginData.data.school.schoolId &&
              e.classId == filteredData.class &&
              e.subject == filteredData.subject &&
              e.section == filteredData.section &&
              e.fromDate == filteredData.examDate &&
              filteredData.set == e.set
          : e.key == loginData.data.school.schoolId &&
              e.classId == filteredData.class &&
              e.subject == filteredData.subject &&
              e.section == filteredData.section &&
              e.fromDate == filteredData.examDate;
      });
      if (result > -1) {
        getSavedScanCache[result].data = savedScanData;
        if (setValue != null && setValue.length > 0) {
          getSavedScanCache[result].set = setValue;
        }
      } else {
        let payload = {
          key: `${loginData.data.school.schoolId}`,
          classId: filteredData.class,
          subject: filteredData.subject,
          section: filteredData.section,
          fromDate: filteredData.examDate,
          data: savedScanData,
        };
        if (setValue != null && setValue.length > 0) {
          payload.set = setValue;
        }
        getSavedScanCache.push(payload);
      }
      await setRegularSavedScanApi(getSavedScanCache);
    } else {
      let payload = {
        key: `${loginData.data.school.userId}`,
        classId: filteredData.class,
        subject: filteredData.subject,
        section: filteredData.section,
        fromDate: filteredData.examDate,
        data: savedScanData,
      };
      if (setValue != null && setValue.length > 0) {
        payload.set = setValue;
      }
      await setRegularSavedScanApi([payload]);
    }
  };

  const callScanStatusData = async () => {
    const deviceUniqId = await DeviceInfo.getUniqueId();
    let token = loginData.data.token;
    let hasNetwork = await checkNetworkConnectivity();
    if (!hasNetwork) {
      let hasCacheData = await getRegularSavedScanpi();
      let setValue = filteredData.hasOwnProperty('set')
        ? filteredData.set.length > 0
          ? filteredData.set
          : ''
        : null;
      if (hasCacheData) {
        let cacheFilterData = hasCacheData.filter(element => {
          let conditionSwitch =
            setValue != null && setValue.length >= 0
              ? element.key == loginData.data.school.userId &&
                element.classId == filteredData.class &&
                element.subject == filteredData.subject &&
                element.section == filteredData.section &&
                element.fromDate == filteredData.examDate &&
                filteredData.set == element.set
              : element.key == loginData.data.school.userId &&
                element.classId == filteredData.class &&
                element.subject == filteredData.subject &&
                element.section == filteredData.section &&
                element.fromDate == filteredData.examDate;
          if (conditionSwitch) {
            return true;
          }
        });
        if (cacheFilterData.length > 0) {
          storeFactory.dispatch(dispatchSavedScanData(cacheFilterData[0].data));
        }
      } else {
        //Alert message show message "something went wrong or u don't have cache in local"
      }
    } else {
      setIsLoading(true);
      let loginCred = await getLoginCred();

      let dataPayload = {
        classId: filteredData.class,
        subject: filteredData.subject,
        section: filteredData.section,
        fromDate: filteredData.examDate,
        schoolId: loginData.data.school.schoolId,
        userId: loginData.data.school.userId,
        page: 0,
        downloadRes: false,
      };
      let apiObj = new scanStatusDataAction(dataPayload, token, deviceUniqId);
      FetchSavedScannedData(apiObj, loginCred.schoolId, loginCred.password);
    }
  };

  const FetchSavedScannedData = (api, uname, pass) => {
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
          if (
            loginData.data.school.hasOwnProperty('offlineMode') &&
            loginData.data.school.offlineMode
          ) {
            getSavedScanApiCache(res.data);
          }
          setIsLoading(false);
          apiResponse = res;
          clearTimeout(id);
          api.processResponse(res);
          dispatch(dispatchAPIAsync(api));
        })
        .catch(function (err) {
          setIsLoading(false);
          collectErrorLogs(
            'StudentList.js',
            'FetchSavedScannedData',
            api.apiEndPoint(),
            err,
            false,
          );
          clearTimeout(id);
        });
    }
  };

  const dispatchSavedScanData = payload => {
    return {
      type: constants.SCANNED_DATA,
      payload,
    };
  };

  function dispatchAPIAsync(api) {
    return {
      type: api.type,
      payload: api.getPayload(),
    };
  }

  const studentData = async (isLoading = false) => {
    let studentsExamData = await getStudentsExamData();
    const filterStudentsData = studentsExamData.filter(e => {
      if (
        e.class == filteredData.className &&
        e.section == filteredData.section
      ) {
        return true;
      }
    });
    setTotalStudent(
      filterStudentsData[0].data ? filterStudentsData[0].data.students : [],
    );
    setAllStudentData(filterStudentsData[0].data.students);
    if(isLoading) {
      setIsLoading(false);
    }
  };

  const renderStudentData = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: multiBrandingData.themeColor2
            ? multiBrandingData.themeColor2
            : AppTheme.WHITE,
        }}>
        <StudentsDataComponent
          themeColor1={
            multiBrandingData.themeColor1
              ? multiBrandingData.themeColor1
              : '#52A08D'
          }
          themeColor2={
            multiBrandingData.themeColor2
              ? multiBrandingData.themeColor2
              : AppTheme.LIGHT_BLUE
          }
          themeColor3={
            multiBrandingData.themeColor3
              ? multiBrandingData.themeColor3
              : '#ACCCCE'
          }
          themeColor4={
            multiBrandingData.themeColor4
              ? multiBrandingData.themeColor4
              : '#FF5733'
          }
          themeColor5={
            multiBrandingData.themeColor5
              ? multiBrandingData.themeColor5
              : '#e5b6b3'
          }
          item={item}
          index={index}
          pabsent={item.studentAvailability}
          scanedData={scanedData}
          filteredData={filteredData}
          setStdArray={setStdArray}
          stdArray={stdArray}
          apiStatus={apiStatus}
          dispatch={dispatch}
          loginData={loginData}
        />
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontFamily: monospace_FF}}>No Students Available</Text>
      </View>
    );
  };

  const saveAbsentPresentDetails = async token => {
    let stdPstAbsArray = [];

    let absentPresentStatus = {
      classId: filteredData.class,
      examDate: filteredData.examDate,
      subject: filteredData.subject,
      studentsMarkInfo: stdPstAbsArray,
      userId: loginData.data.school.schoolId,
    };

    stdArray.forEach((element, index) => {
      let stdPstAbs = {
        section: filteredData.section,
        studentId: 0,
        studentAvailability: true,
        securedMarks: 0,
        totalMarks: 0,
      };
      let hasSet = filteredData.hasOwnProperty('set')
        ? filteredData.set.length >= 0
          ? filteredData.set
          : ''
        : '';
      if (hasSet.length >= 0) {
        stdPstAbs.set = hasSet;
      }
      stdPstAbs.studentAvailability = element.studentAvailability;
      stdPstAbs.studentId = element.studentId;
      stdPstAbsArray.push(stdPstAbs);
    });

    absentPresentStatus.studentsMarkInfo = stdPstAbsArray;

    let stud = await getStudentsExamData();
    const hasNetwork = await checkNetworkConnectivity();

    stud.forEach((e, i) => {
      if (
        e.class == filteredData.className &&
        e.section == filteredData.section
      ) {
        e.data.students.forEach(element => {
          const updated = allStudentData.filter(o => {
            if (element.studentId == o.studentId) {
              element.studentAvailability = o.studentAvailability;
            }
          });
        });
      }
    });

    await setStudentsExamData(stud);

    if (absentPresentStatus.studentsMarkInfo.length == 0) {
      setPresentAbsentStudent(allStudentData);
      navigation.push('myScan');
      markAttendanceNext(loginData.data.school.schoolId);
    } else if (absentPresentStatus.studentsMarkInfo.length > 0) {
      await setDataIntoRegularStudentExamApi();
    }
  };

  const setDataIntoRegularStudentExamApi = async () => {
    let getStudentExamCache = await getRegularStudentExamApi();
    if (getStudentExamCache != null) {
      for (const e of getStudentExamCache) {
        if (
          e.class == filteredData.className &&
          e.section == filteredData.section &&
          `${filteredData.subject + ' ' + filteredData.examDate}` ==
            e.subject &&
          e.key == loginData.data.school.schoolId
        ) {
          let studentArrayData =
            e.data.data.students.length > 0 ? e.data.data.students : [];
          for (const element of studentArrayData) {
            allStudentData.forEach(o => {
              if (element.studentId == o.studentId) {
                element.studentAvailability = o.studentAvailability;
              }
            });
          }
          break;
        }
      }
    }
    await setRegularStudentExamApi(getStudentExamCache);
    await setPresentAbsentStudent(allStudentData);
    navigation.push('myScan');
    markAttendanceNext(loginData.data.school.schoolId);
  };

  const saveStudentData = api => {
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
          setIsLoading(false);
          setPresentAbsentStudent(allStudentData);
          navigation.push('myScan');
          markAttendanceNext(loginData.data.school.schoolId);
          setDataIntoRegularStudentExamApi();
          apiResponse = res;
          clearTimeout(id);
          api.processResponse(res);
          dispatch(dispatchAPIAsync(api));
        })
        .catch(function (err) {
          collectErrorLogs(
            'StudentList.js',
            'saveStudentData',
            api.apiEndPoint(),
            err,
            false,
          );
          let data = {
            title: Strings.error_message,
            message: Strings.something_went_wrong_please_try_again,
            isOkAvailable: false,
          };
          dispatch(dispatchCustomModalStatus(true));
          dispatch(dispatchCustomModalMessage(data));
          setIsLoading(false);
          clearTimeout(id);
        });
    }
  };

  const navigateToNext = async () => {
    let hasUpdate = await checkAppVersion();
    if (!hasUpdate) {
      if (allStudentData.length > 0) {
        saveAbsentPresentDetails(loginData.data.token);
      }
    }
  };
  const navigateToBack = () => {
    dispatch(dispatchroiData([]));
    navigation.navigate('selectDetails');
  };

  const loginAgain = async () => {
    let loginCred = await getLoginCred();
    if (loginCred) {
      setIsLoading(true);
      let encPass = cryptoText(loginCred.password);
      let apiObj = new LoginAction(loginCred.username, encPass);
      APITransport(apiObj);
    } else {
      let data = {
        title: Strings.message_text,
        message: Strings.please_try_again,
        isOkAvailable: true,
        okFunc: loginAgain(),
      };
      dispatch(dispatchCustomModalStatus(true));
      dispatch(dispatchCustomModalMessage(data));
    }
  };

  const getRoi = async () => {
    const deviceUniqId = await DeviceInfo.getUniqueId();
    let hasNetwork = await checkNetworkConnectivity();
    let setValue =
      filteredData.hasOwnProperty('set') > 0
        ? filteredData.set.length > 0
          ? filteredData.set
          : ''
        : null;

    let hasCacheData = await getRegularRoipi();

    let cacheFilterData =
      hasCacheData != null
        ? hasCacheData.filter(element => {
            let conditionSwitch =
              setValue != null && setValue.length >= 0
                ? element.key == loginData.data.school.schoolId &&
                  element.examId == filteredData.examTestID &&
                  element.set == filteredData.set
                : element.key == loginData.data.school.schoolId &&
                  element.examId == filteredData.examTestID;
            if (conditionSwitch) {
              return true;
            }
          })
        : [];

    if (cacheFilterData.length > 0) {
      storeFactory.dispatch(dispatchroiData(cacheFilterData[0].data));
      callScanStatusData();
    } else if (hasNetwork) {
      let hasSet = filteredData.hasOwnProperty('set')
        ? filteredData.set.length >= 0
          ? `?set=${filteredData.set}`
          : ''
        : '';
      let payload = {
        examId: filteredData.examTestID,
      };
      if (hasSet.length >= 0) {
        payload.set = hasSet;
      }
      let token = loginData.data.token;
      let apiObj = new ROIAction(payload, token, deviceUniqId);
      dispatch(APITransport(apiObj));
      callScanStatusData();
    } else {
      this.callCustomModal(
        Strings.message_text,
        Strings.roi_cache_not_available,
        false,
      );
    }
  };

  const dispatchroiData = payload => {
    return {
      type: constants.ROI_DATA,
      payload,
    };
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: multiBrandingData.themeColor2
          ? multiBrandingData.themeColor2
          : 'white',
      }}>
      <ShareComponent navigation={navigation} onPress={navigateToBack} />
      <View style={{margin: 5}}>
        {loginData && loginData.data && (
          <View>
            <Text
              style={{
                marginLeft: 5,
                fontSize: AppTheme.FONT_SIZE_MEDIUM,
                letterSpacing: 1,
                fontFamily: monospace_FF,
              }}>
              {`${loginData.data.school.name}${
                loginData.data.school.block
                  ? ', ' + loginData.data.school.block
                  : ''
              }${
                loginData.data.school.district
                  ? ', ' + loginData.data.school.district
                  : ''
              }`}
            </Text>

            <View style={{flexDirection: 'row', marginLeft: 5, marginTop: 5}}>
              <Text style={{fontWeight: 'bold'}}>
                {BrandLabel && BrandLabel.Class
                  ? BrandLabel.Class
                  : Strings.class_text + ' : '}
                <Text style={{fontWeight: 'normal'}}>
                  {`${filteredData.className}, ${
                    filteredData.section ? filteredData.section : ''
                  }`}
                </Text>
              </Text>
              <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                {BrandLabel && BrandLabel.Subject
                  ? BrandLabel.Subject
                  : Strings.subject + ' : '}
                <Text style={{fontWeight: 'normal'}}>
                  {filteredData.subject}{' '}
                  {filteredData.set ? `(Set ${filteredData.set})` : ''}
                </Text>
              </Text>
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          {'Mark Attendance'}
        </Text>
      </View>

      <FlatList
        data={allStudentData}
        renderItem={renderStudentData}
        ListEmptyComponent={renderEmptyList}
        keyExtractor={item => item.studentId.toString()}
        // contentContainerStyle={{backgroundColor:multiBrandingData ? multiBrandingData.themeColor1 : AppTheme.BLUE}}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.viewnxtBtnStyle1}>
        <ButtonComponent
          customBtnStyle={[
            styled.nxtBtnStyle,
            {
              backgroundColor: multiBrandingData.themeColor1
                ? multiBrandingData.themeColor1
                : AppTheme.BLUE,
            },
          ]}
          btnText={Strings.next_text.toUpperCase()}
          activeOpacity={0.8}
          onPress={navigateToNext}
        />
      </View>

      {isLoading && (
        <Spinner
          animating={isLoading}
          customContainer={{opacity: 0.4, elevation: 15}}
        />
      )}
    </SafeAreaView>
  );
};

const styled = StyleSheet.create({
  nxtBtnStyle: {
    marginVertical: 10,
    width: 160,
    height: 43,
  },
});

const mapStateToProps = state => {
  return {
    filteredData: state.filteredData.response,
    loginData: state.loginData,
    roiData: state.roiData.response,
    scanTypeData: state.scanTypeData.response,
    saveAbsentStudent: state.saveAbsentStudent,
    absentStudentDataResponse: state.absentStudentDataResponse,
    apiStatus: state.apiStatus,
    multiBrandingData: state.multiBrandingData.response.data,
    scanedData: state.scanedData.response,
    studentsAndExamData: state.studentsAndExamData,
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);
