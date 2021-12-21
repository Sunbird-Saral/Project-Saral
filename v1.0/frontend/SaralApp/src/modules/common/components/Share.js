import React, { Component, useCallback, useState,useEffect } from 'react';
import { Share, Alert,View,TouchableOpacity,Text } from 'react-native';
import Strings from '../../../utils/Strings';
import AppTheme from '../../../utils/AppTheme';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderComponents from './HeaderComponents';
import { SaveScanData } from '../../../flux/actions/apis/saveScanDataAction';
import APITransport from '../../../flux/actions/transport/apitransport';
import { LogoutAction } from '../../../flux/actions/apis/LogoutAction';
import { getScannedDataFromLocal,eraseErrorLogs,getErrorMessage } from '../../../utils/StorageUtils';

const ShareComponent = ({
  loginData,
  message,
  navigation,
  multiBrandingData
}) => {
  const [ishidden, setIshidden] = useState(false)
  const dispatch = useDispatch()
  
 
  const Logoutcall = async () => {
    let data = await getScannedDataFromLocal();
    if (data != null) {
      for (const value of data) {
        let apiObj = new SaveScanData(value, loginData.data.token);
        dispatch(APITransport(apiObj))
      }
    }
    Alert.alert(Strings.message_text, Strings.are_you_sure_you_want_to_logout, [
      { 'text': Strings.no_text, style: 'cancel' },
      {
        'text': Strings.yes_text, onPress: async () => {
            dispatch(LogoutAction())
            eraseErrorLogs() 
            navigation.navigate('auth')
            
        }
      }
    ])
  }

  const ShareCompo = async () => {
  const  errorMessage = await getErrorMessage()

    console.log('errorMessage',errorMessage)
    try {
      const result = await Share.share({
        title: `Saral App v1.0 logs collection`,
        message:
          `${JSON.stringify(errorMessage ? errorMessage : null)}`

      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
         
        } else {
          console.log('>>>>>>>>>',JSON.stringify(errorMessage))
          // shared
        }
      }
    } catch (error) {
      alert(error.message);
    }
  }
      
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: `Saral App v1.0 logs collection`,
        message:
          `${JSON.stringify(errorMessage)}`
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
                Alert.alert(Strings.shareDataExceed)
                //  console.log('jjjjj',result)
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        Alert.alert(Strings.shareDataExceed)
    }
};
  return (
    <View style={{width:'-10%'}}>
      <View style={styles.imageViewContainer}>
      <TouchableOpacity onPress={()=>setIshidden(!ishidden)}>
        <View style={[styles.imageContainerStyle,{backgroundColor: multiBrandingData ? multiBrandingData.themeColor2 : AppTheme.LIGHT_BLUE}]}>
          <Text style={{ textAlign: 'center', fontSize: AppTheme.HEADER_FONT_SIZE_LARGE }}>{loginData.data.school.name.charAt(0)}</Text>
        </View>
      </TouchableOpacity>
      </View>
     { ishidden ?
      <HeaderComponents
        supportTeamText={'Support'}
        logoutHeaderText={Strings.logout_text}
        customLogoutTextStyle={{ color: AppTheme.BLACK, }}
        onSupportClick={ShareCompo}
        onLogoutClick={Logoutcall}
      /> 
      :null}
        </View>
      )
  }


const mapStateToProps = (state) => {
  return {
    ocrLocalResponse: state.ocrLocalResponse,
    loginData: state.loginData,
    studentsAndExamData: state.studentsAndExamData,
    scanTypeData: state.scanTypeData.response,
    apiStatus: state.apiStatus,
    roiData: state.roiData,
    absentStudentDataResponse: state.absentStudentDataResponse,
    getScanStatusData: state.getScanStatusData,
    multiBrandingData: state.multiBrandingData.response.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    APITransport: APITransport,
    LogoutAction: LogoutAction
  }, dispatch)
}

const styles = {

  imageViewContainer: {

      alignItems: 'flex-end',
      backgroundColor: '#fff'
      // justifyContent:'center'
  },
  imageContainerStyle: {
      padding: 5,
      marginRight: 10,
      height: 50,
      width: 50,
      borderRadius: 45,
      borderWidth: 1,
      borderColor: AppTheme.TAB_BORDER,
      justifyContent: 'center',
      backgroundColor: AppTheme.TAB_BORDER
  },
}

export default (connect(mapStateToProps, mapDispatchToProps)(ShareComponent));