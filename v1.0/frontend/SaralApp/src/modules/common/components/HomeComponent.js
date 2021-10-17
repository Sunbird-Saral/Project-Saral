import React from 'react'
import {View,Text} from 'react-native'
// import HomeScreen from '../../myScanScreens/Homescreen'
import { MultiBrandingAction } from '../../../flux/actions/apis/multiBranding';
import APITransport from '../../../flux/actions/transport/apitransport';
 function HomeCompo (params) {
     
   function callMultiBrandingActiondata (props){
        let payload = this.props.multiBrandingData
        let token = this.props.loginData.data.token
        let apiObj = new MultiBrandingAction(payload, token);
        this.props.APITransport(apiObj)
     
    }
     return(
         <View>
         {/* <HomeScreen data ={props.callMultiBrandingActiondata()} /> */}
         </View>

     )
    
}


const mapStateToProps = (state) => {
    return {
        // ocrLocalResponse: state.ocrLocalResponse,
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
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeCompo);