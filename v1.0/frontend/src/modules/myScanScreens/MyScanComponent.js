import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Platform, PermissionsAndroid, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StackActions, NavigationActions } from 'react-navigation';
import SystemSetting from 'react-native-system-setting'
import RNOpenCvCameraModel from '../../utils/RNOpenCvCamera';
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';
import Spinner from '../common/components/loadingIndicator';
import { OcrLocalResponseAction } from '../../flux/actions/apis/OcrLocalResponseAction'
import { apkVersion } from '../../configs/config';
import HeaderComponent from '../common/components/HeaderComponent';
import { SCAN_TYPES } from '../../utils/CommonUtils';

class MyScanComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showFooter: true,
            oldBrightness: null,
            activityOpen: false,
            isLoading: false,
        }
        this.onBack = this.onBack.bind(this)
    }

    componentDidMount() {
        const { navigation } = this.props
        const { params } = navigation.state
        navigation.addListener('willFocus', payload => {
            BackHandler.addEventListener('hardwareBackPress', this.onBack)
            if (params && params.from_screen && params.from_screen == 'scanDetails') {
                this.setState({
                    showFooter: false
                }, () => this.onScanClick())
                
            }
            else {
                this.setState({
                    showFooter: true
                })
            }
        })
        this.willBlur = navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBack)
        );
    }

    onBack = () => {
        if (this.state.activityOpen) {
            this.setState({
                showFooter: true,
                activityOpen: false
            })
            SystemSetting.setBrightnessForce(this.state.oldBrightness).then((success) => {
                if (success) {
                    SystemSetting.saveBrightness();
                }
            })
            RNOpenCvCameraModel.cancelActivity().then(data => {
                if (data) {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'myScan', params: { from_screen: 'cameraActivity' } })],
                    });
                    this.props.navigation.dispatch(resetAction);
                    return true
                }
            })
            return true
        }
        else {
            const { navigation } = this.props
            const { params } = navigation.state
            if (params && params.from_screen && params.from_screen == 'cameraActivity') {
                this.props.navigation.navigate('selectDetails', { from_screen: 'cameraActivity' })
                return true
            }
        }
    }
    

    onScanClick = async () => {
        SystemSetting.getBrightness().then((brightness) => {
            this.setState({ oldBrightness: brightness })
        });

        if (Platform.OS !== 'ios') {
            const grantedRead = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            const grantedWrite = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            const grantedCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            
            if (grantedRead && grantedWrite && grantedCamera) {
                this.openCameraActivity()
            }
            else {
                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA
                    ],
                    {
                        title: Strings.permission_text,
                        message: Strings.app_needs_permission
                    }
                ).then((permRes) => {
                    if (
                        permRes['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                        permRes['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                        permRes['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
                    ) {
                        this.openCameraActivity()
                    } else if(permRes['android.permission.READ_EXTERNAL_STORAGE'] == 'never_ask_again' ||
                        permRes['android.permission.WRITE_EXTERNAL_STORAGE'] == 'never_ask_again' ||
                        permRes['android.permission.CAMERA'] == 'never_ask_again') {
                        Alert.alert(Strings.message_text, Strings.give_permission_from_settings, [
                            { 'text': Strings.ok_text, style: 'cancel' }
                        ]);
                    } else {
                        Alert.alert(Strings.message_text, Strings.please_give_permission_to_use_app, [
                            { 'text': Strings.cancel_text, style: 'cancel' },
                            { 'text': Strings.ok_text, onPress: () => this.onScanClick() }

                        ]);
                    }
                });
            }
        }
    }

    openCameraActivity = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "SaralSDK Demo App Camera Permission",
              message:
                "SaralSDK Demo application require camera to perform scanning operation ",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Camera permission granted, launching now ..");
            SaralSDK.startCamera(JSON.stringify(SaralSpecData)).then(res => {
              console.log(res);
            }).catch((code, message) => {
              console.log(message)
            })
          } else {
            console.log("Camera permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };
    
    // openCameraActivity = () => {
    //     const { scanTypeData } = this.props
    //     SystemSetting.setBrightnessForce(1).then(async (success) => {
    //         if (success) {
    //             SystemSetting.saveBrightness();
    //             this.setState({
    //                 activityOpen: true
    //             })
    //             let uniqStudentsList = ['1234567', '2345678' ]
    //             const scannerType = scanTypeData.scanType ? scanTypeData.scanType : SCAN_TYPES.PAT_TYPE
    //             const scannerCode = this.getScannerType(scannerType)
                
    //             /**
    //              * example of sending ROIs from react-native layer
    //              */
    //             let LiteracyClass2_3_ROIs = "[{\"roiId\": \"777e06e6-c115-4672-97c1-ea7e736cc1b3\", \"roi\": {\"top\": 32, \"left\": 78, \"right\": 98, \"bottom\": 63}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"14bb3796-68c6-48a6-aabb-f4eaf938f82d\", \"roi\": {\"top\": 32, \"left\": 119, \"right\": 139, \"bottom\": 63}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"544f999f-505c-4540-ba1f-b377efe713eb\", \"roi\": {\"top\": 154, \"left\": 184, \"right\": 204, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"90f1095b-5b42-463d-a690-00f263744de8\", \"roi\": {\"top\": 154, \"left\": 218, \"right\": 238, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"4806f25f-a6d5-44bc-b8a7-44f678b1bbd6\", \"roi\": {\"top\": 154, \"left\": 252, \"right\": 272, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"aae3ee48-9224-426e-b327-a865141fb1bf\", \"roi\": {\"top\": 154, \"left\": 286, \"right\": 306, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"f33a8def-8e60-4e0a-ac75-a72eafff44d3\", \"roi\": {\"top\": 154, \"left\": 320, \"right\": 340, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"1f7161a9-1b74-448f-af30-7279cc6df2e2\", \"roi\": {\"top\": 154, \"left\": 354, \"right\": 374, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"cf18dfe5-d9c9-474d-a995-2603c754ffa1\", \"roi\": {\"top\": 154, \"left\": 388, \"right\": 408, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"68fb3791-3d0a-4c09-ae68-f5a6643ba2bc\", \"roi\": {\"top\": 154, \"left\": 422, \"right\": 442, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"873b735c-d9a3-4eab-a7f4-3a6e84f8c9be\", \"roi\": {\"top\": 154, \"left\": 456, \"right\": 476, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"97a92a3f-130f-4148-b375-93d37fb05505\", \"roi\": {\"top\": 154, \"left\": 490, \"right\": 510, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"a220da26-a665-4f56-8d64-9ec5a0082aab\", \"roi\": {\"top\": 154, \"left\": 524, \"right\": 544, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"0cb7a032-afc1-453b-8f73-4237f62114df\", \"roi\": {\"top\": 154, \"left\": 558, \"right\": 578, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"aa5dae2c-aead-47e0-a545-69850de320cd\", \"roi\": {\"top\": 154, \"left\": 592, \"right\": 612, \"bottom\": 174}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"6d0cd4af-0724-4d00-a85d-e6ef1787a361\", \"roi\": {\"top\": 194, \"left\": 184, \"right\": 204, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"a884a9aa-0c67-4d10-bfd2-65d3d118486d\", \"roi\": {\"top\": 194, \"left\": 218, \"right\": 238, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"8c848eae-e48d-47a0-a1a2-35d79a9ee012\", \"roi\": {\"top\": 194, \"left\": 252, \"right\": 272, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"39950594-966a-4e2f-b4fc-96d92ea3cbf8\", \"roi\": {\"top\": 194, \"left\": 286, \"right\": 306, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"4f0d95db-1701-4119-8c2d-672ce004b1ac\", \"roi\": {\"top\": 194, \"left\": 320, \"right\": 340, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"7c26bdad-7cdb-4f35-880a-35461a6b453d\", \"roi\": {\"top\": 194, \"left\": 354, \"right\": 374, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"ff98cf3c-e352-4ad3-9a20-c42431c342ae\", \"roi\": {\"top\": 194, \"left\": 388, \"right\": 408, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"530e9b67-4800-4c64-88b1-64717b5f3edf\", \"roi\": {\"top\": 194, \"left\": 422, \"right\": 442, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"18f8f2d0-4c93-4b43-8e72-ec75377aa434\", \"roi\": {\"top\": 194, \"left\": 456, \"right\": 476, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"e2ccf713-c7d5-49cf-bca3-aecbb92b5971\", \"roi\": {\"top\": 194, \"left\": 490, \"right\": 510, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"b12dcf74-14ac-45b0-a47c-8b4693c9bf69\", \"roi\": {\"top\": 194, \"left\": 524, \"right\": 544, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"a79e992b-d693-4530-9c57-bd46911030a5\", \"roi\": {\"top\": 194, \"left\": 558, \"right\": 578, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"ea11fed4-e2df-4953-8f00-09f068ba25d3\", \"roi\": {\"top\": 194, \"left\": 592, \"right\": 612, \"bottom\": 214}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"24b5e4ac-1e25-479d-a64f-cb6fb3c5587f\", \"roi\": {\"top\": 234, \"left\": 184, \"right\": 204, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"9ce612e2-8d06-4355-9534-90485b8c7126\", \"roi\": {\"top\": 234, \"left\": 218, \"right\": 238, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"07dc6472-32ec-4d1d-90cd-cf57eb36d505\", \"roi\": {\"top\": 234, \"left\": 252, \"right\": 272, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"8836d40d-6a63-4e89-ba22-c099582f79aa\", \"roi\": {\"top\": 234, \"left\": 286, \"right\": 306, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"78364349-065a-4b1a-b180-e56c07a47a9e\", \"roi\": {\"top\": 234, \"left\": 320, \"right\": 340, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"d2e963de-cf04-422e-b27b-416978eb846f\", \"roi\": {\"top\": 234, \"left\": 354, \"right\": 374, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"384b8b65-d8df-41ec-82fd-eb9171b95594\", \"roi\": {\"top\": 234, \"left\": 388, \"right\": 408, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"9fb00eaf-27f4-4987-8a3e-675430a02615\", \"roi\": {\"top\": 234, \"left\": 422, \"right\": 442, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"65c6e0d6-1a8f-4603-b9cd-ba43a494cd68\", \"roi\": {\"top\": 234, \"left\": 456, \"right\": 476, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"75593245-691b-4a3b-969d-f83afc62d411\", \"roi\": {\"top\": 234, \"left\": 490, \"right\": 510, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"9cd78053-c431-4137-aee9-1cf4da52ffc9\", \"roi\": {\"top\": 234, \"left\": 524, \"right\": 544, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"ac322478-fbce-4a82-8a40-43d26c46b099\", \"roi\": {\"top\": 234, \"left\": 558, \"right\": 578, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"9553e76d-34f5-4755-9451-3463af34a01c\", \"roi\": {\"top\": 234, \"left\": 592, \"right\": 612, \"bottom\": 254}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"a4ad7a8b-0206-4c7c-8902-384a5d6c1499\", \"roi\": {\"top\": 274, \"left\": 184, \"right\": 204, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"4fffcc0b-3bed-4101-a686-ea7200df1efe\", \"roi\": {\"top\": 274, \"left\": 218, \"right\": 238, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"0c1534a2-9d20-48c2-8b67-49ff707f3ed6\", \"roi\": {\"top\": 274, \"left\": 252, \"right\": 272, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"851aaf4c-b54b-439d-b21e-5872e8017c33\", \"roi\": {\"top\": 274, \"left\": 286, \"right\": 306, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"d846ad36-7f4e-4b75-a4c1-60e58bdce31b\", \"roi\": {\"top\": 274, \"left\": 320, \"right\": 340, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"8356e7c3-06a6-46b5-8e13-7c1492c2672a\", \"roi\": {\"top\": 274, \"left\": 354, \"right\": 374, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"3c7ded05-8822-4a4d-ba92-f09035ac2a76\", \"roi\": {\"top\": 274, \"left\": 388, \"right\": 408, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"f5dbff8f-ffb0-4b5e-ba78-ea888c93e7f6\", \"roi\": {\"top\": 274, \"left\": 422, \"right\": 442, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"fccac2b4-6971-4de2-9cc9-a4dec9a219d4\", \"roi\": {\"top\": 274, \"left\": 456, \"right\": 476, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"e4b6818e-aef6-43e1-bcdf-de70cfca266d\", \"roi\": {\"top\": 274, \"left\": 490, \"right\": 510, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"8caa30a7-60b3-4d14-be5e-61fa4bb9fb5a\", \"roi\": {\"top\": 274, \"left\": 524, \"right\": 544, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"e9ab0d47-c124-48d1-9eab-2f6f4969c97f\", \"roi\": {\"top\": 274, \"left\": 558, \"right\": 578, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"568f9b14-3970-413a-97a8-79b1e6797a0d\", \"roi\": {\"top\": 274, \"left\": 592, \"right\": 612, \"bottom\": 294}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"10208811-9042-484f-8de7-668fbc27e0e3\", \"roi\": {\"top\": 314, \"left\": 184, \"right\": 204, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"18adf1d9-99b9-4d59-b2e3-23ab5ce81667\", \"roi\": {\"top\": 314, \"left\": 218, \"right\": 238, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"7e26b4cb-868a-42ee-8787-f4369b0fb7a0\", \"roi\": {\"top\": 314, \"left\": 252, \"right\": 272, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"da98f86c-dfd8-4b8c-8645-ceda2f46f6df\", \"roi\": {\"top\": 314, \"left\": 286, \"right\": 306, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"d1c4821d-5a55-46e6-a122-0ac880b13ef9\", \"roi\": {\"top\": 314, \"left\": 320, \"right\": 340, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"1dcbc3d4-d937-4bce-9535-dc04d334e7ad\", \"roi\": {\"top\": 314, \"left\": 354, \"right\": 374, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"75962ac6-529d-4d19-bc09-63bb16c73655\", \"roi\": {\"top\": 314, \"left\": 388, \"right\": 408, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"179a24ae-4739-45dd-adaf-23cbb5253d62\", \"roi\": {\"top\": 314, \"left\": 422, \"right\": 442, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"1ecbf675-64e9-436b-a3a9-d7aac436b213\", \"roi\": {\"top\": 314, \"left\": 456, \"right\": 476, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"88ad3ad6-8621-4790-8d25-fba8769b9677\", \"roi\": {\"top\": 314, \"left\": 490, \"right\": 510, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"95e5eca9-b3ae-4e8a-ab8e-9758d76bd313\", \"roi\": {\"top\": 314, \"left\": 524, \"right\": 544, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"f81e5ad5-d0b0-4a69-84ad-bf860f7accb8\", \"roi\": {\"top\": 314, \"left\": 558, \"right\": 578, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"fc300496-b6b4-4e94-8449-f766991b9ca1\", \"roi\": {\"top\": 314, \"left\": 592, \"right\": 612, \"bottom\": 334}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"c8d9e77c-e9b7-4b13-a3b8-062c803eee2f\", \"roi\": {\"top\": 354, \"left\": 184, \"right\": 204, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"11349103-76b2-4c6b-abd9-3ee13297dc6f\", \"roi\": {\"top\": 354, \"left\": 218, \"right\": 238, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"33cf42ca-0390-478a-aa09-f7cba769a63b\", \"roi\": {\"top\": 354, \"left\": 252, \"right\": 272, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"14b3ff78-6183-43f2-8ba0-fb6289dee4b8\", \"roi\": {\"top\": 354, \"left\": 286, \"right\": 306, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"7e95e856-1a33-44f1-8b3c-d847a22b03ee\", \"roi\": {\"top\": 354, \"left\": 320, \"right\": 340, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"62f92626-dade-457c-9565-4dda42b9f087\", \"roi\": {\"top\": 354, \"left\": 354, \"right\": 374, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"41d00d87-076d-4282-b617-06ba7a4dde1f\", \"roi\": {\"top\": 354, \"left\": 388, \"right\": 408, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"f097a0c3-f99d-48a2-bca7-69f3ecfc01db\", \"roi\": {\"top\": 354, \"left\": 422, \"right\": 442, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"ba0f6c06-0cde-4125-b5ed-b71baf361a49\", \"roi\": {\"top\": 354, \"left\": 456, \"right\": 476, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"bb7bee98-a506-4480-8323-1a8be904d34a\", \"roi\": {\"top\": 354, \"left\": 490, \"right\": 510, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"00c9d953-8512-4c2b-bbf4-2503df64109e\", \"roi\": {\"top\": 354, \"left\": 524, \"right\": 544, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"98e83959-c66c-43ca-90be-5d48d95c0a7d\", \"roi\": {\"top\": 354, \"left\": 558, \"right\": 578, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"97306840-a5a1-4c1e-b7c5-a6abca4f3947\", \"roi\": {\"top\": 354, \"left\": 592, \"right\": 612, \"bottom\": 374}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"8b62d148-f736-47d2-bc86-b0e5a174150b\", \"roi\": {\"top\": 394, \"left\": 184, \"right\": 204, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"0aeab72f-5ebb-40e6-9c51-0b78cfa60798\", \"roi\": {\"top\": 394, \"left\": 218, \"right\": 238, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"1b1af6ed-af3a-4617-b733-fe17895a964d\", \"roi\": {\"top\": 394, \"left\": 252, \"right\": 272, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"cac46754-0639-494f-b83f-5db1fcad35f3\", \"roi\": {\"top\": 394, \"left\": 286, \"right\": 306, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"138df190-2b1c-400f-89ba-fc6ee5722417\", \"roi\": {\"top\": 394, \"left\": 320, \"right\": 340, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"cdf92695-9cf5-48ad-841e-1824e3df9a90\", \"roi\": {\"top\": 394, \"left\": 354, \"right\": 374, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"5e5d91ce-ee0b-4033-8ad1-3267c453ab00\", \"roi\": {\"top\": 394, \"left\": 388, \"right\": 408, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"98a0c588-acf5-40e9-aa53-1aa8dcb2eafc\", \"roi\": {\"top\": 394, \"left\": 422, \"right\": 442, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"3450bb30-735e-4073-b8a9-9f0ed733b8cc\", \"roi\": {\"top\": 394, \"left\": 456, \"right\": 476, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"1b7c558f-0a59-476a-aaf8-f7d3183380d3\", \"roi\": {\"top\": 394, \"left\": 490, \"right\": 510, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"8de0b42a-df63-4915-84cf-9c00788ef38a\", \"roi\": {\"top\": 394, \"left\": 524, \"right\": 544, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"28ed4224-2a3e-436f-95f7-e3fd84794b70\", \"roi\": {\"top\": 394, \"left\": 558, \"right\": 578, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"658d4505-7f12-456e-896b-08b875fc6291\", \"roi\": {\"top\": 394, \"left\": 592, \"right\": 612, \"bottom\": 414}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"7bedf97c-3f84-434c-9c64-b05e9fc2f43b\", \"roi\": {\"top\": 434, \"left\": 184, \"right\": 204, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"d20961c9-5329-4623-8a3c-630b1f55c5dd\", \"roi\": {\"top\": 434, \"left\": 218, \"right\": 238, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"8894b84c-3049-4126-a84c-f24174d91a8f\", \"roi\": {\"top\": 434, \"left\": 252, \"right\": 272, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"c2dcad2e-5ceb-4ffa-ba0c-ab7a9efe4e1f\", \"roi\": {\"top\": 434, \"left\": 286, \"right\": 306, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"16bf7126-281a-4453-86f8-85cb9121501f\", \"roi\": {\"top\": 434, \"left\": 320, \"right\": 340, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"46677803-72c4-4b4a-97d8-8ea09173e084\", \"roi\": {\"top\": 434, \"left\": 354, \"right\": 374, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"3ec6b603-aec3-4aa1-94ff-322041cfca04\", \"roi\": {\"top\": 434, \"left\": 388, \"right\": 408, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"5c8ea399-bc3b-4438-86b0-3f08b5ffae85\", \"roi\": {\"top\": 434, \"left\": 422, \"right\": 442, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"afad0f04-9c9c-48df-bb31-1fb7af64a0ec\", \"roi\": {\"top\": 434, \"left\": 456, \"right\": 476, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"24cd3ca8-764b-4eb8-b328-cb34eb5c98d6\", \"roi\": {\"top\": 434, \"left\": 490, \"right\": 510, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"6b48ec7c-cbf3-4168-a001-38beebc8b241\", \"roi\": {\"top\": 434, \"left\": 524, \"right\": 544, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"7c741401-f3e2-4c5c-a43a-5e6d0d7c6d7c\", \"roi\": {\"top\": 434, \"left\": 558, \"right\": 578, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"6c29fe9a-46d0-4f3f-85b3-f760422d0af0\", \"roi\": {\"top\": 434, \"left\": 592, \"right\": 612, \"bottom\": 454}, \"extractionMethod\": \"CELL_OMR\"}, {\"roiId\": \"2ba4bf36-adaa-4b56-b3c5-da0130dec619\", \"roi\": {\"top\": 150, \"left\": 51, \"right\": 68, \"bottom\": 175}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"ae3031d0-b186-4443-bf5c-c5dcbeda95c0\", \"roi\": {\"top\": 150, \"left\": 68, \"right\": 85, \"bottom\": 175}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"21436d44-5af6-47c0-a6a4-bf3e3f3e2689\", \"roi\": {\"top\": 150, \"left\": 85, \"right\": 102, \"bottom\": 175}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"485fa929-b587-4f32-8af4-f4572ec92817\", \"roi\": {\"top\": 150, \"left\": 102, \"right\": 119, \"bottom\": 175}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"a0d1c6aa-b50e-4d5f-800b-b38b4c451c58\", \"roi\": {\"top\": 150, \"left\": 119, \"right\": 136, \"bottom\": 175}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"6514b0d8-f718-4e37-aed3-81e97401d44b\", \"roi\": {\"top\": 150, \"left\": 136, \"right\": 153, \"bottom\": 175}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"52221d81-ef4e-431d-ba0f-29bdbaf47233\", \"roi\": {\"top\": 150, \"left\": 153, \"right\": 170, \"bottom\": 175}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"5177da82-f193-4006-9ee4-c9e2b205760f\", \"roi\": {\"top\": 190, \"left\": 51, \"right\": 68, \"bottom\": 215}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"d308cd63-6949-42e6-a70f-0ec30eec6d13\", \"roi\": {\"top\": 190, \"left\": 68, \"right\": 85, \"bottom\": 215}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"433cc30e-cd9e-4027-b74b-bd422c609617\", \"roi\": {\"top\": 190, \"left\": 85, \"right\": 102, \"bottom\": 215}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"fe50eb9f-5394-482b-8a5e-f553da66d7d7\", \"roi\": {\"top\": 190, \"left\": 102, \"right\": 119, \"bottom\": 215}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"ebe39855-ace3-44c8-a377-3a4eced93a7c\", \"roi\": {\"top\": 190, \"left\": 119, \"right\": 136, \"bottom\": 215}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"f3e4534e-7060-4cfc-b993-ae9668a0d21f\", \"roi\": {\"top\": 190, \"left\": 136, \"right\": 153, \"bottom\": 215}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"3aa79241-9c21-42ed-8035-23f4cd8f6717\", \"roi\": {\"top\": 190, \"left\": 153, \"right\": 170, \"bottom\": 215}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"5332c17b-95ae-4d5a-8a51-c3160c6e2f45\", \"roi\": {\"top\": 230, \"left\": 51, \"right\": 68, \"bottom\": 255}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"344da202-b239-46c3-9979-8a80014f9f99\", \"roi\": {\"top\": 230, \"left\": 68, \"right\": 85, \"bottom\": 255}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"64d09268-c97e-46f9-a1e2-a81e59a4b4b5\", \"roi\": {\"top\": 230, \"left\": 85, \"right\": 102, \"bottom\": 255}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"7ab9133f-f34d-468e-b02f-369dae53f8ab\", \"roi\": {\"top\": 230, \"left\": 102, \"right\": 119, \"bottom\": 255}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"7c22b775-bc62-4037-bd7b-73ef901fdfe9\", \"roi\": {\"top\": 230, \"left\": 119, \"right\": 136, \"bottom\": 255}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"d436d9d8-688e-4621-8824-f583637a3b0c\", \"roi\": {\"top\": 230, \"left\": 136, \"right\": 153, \"bottom\": 255}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"cd661ea6-3f68-4e7f-9176-d7450e6ab1d0\", \"roi\": {\"top\": 230, \"left\": 153, \"right\": 170, \"bottom\": 255}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"d77f5e51-ad81-4e8d-966b-adf953653542\", \"roi\": {\"top\": 270, \"left\": 51, \"right\": 68, \"bottom\": 295}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"6fdc62a3-9538-4460-8a8b-7244d47a439a\", \"roi\": {\"top\": 270, \"left\": 68, \"right\": 85, \"bottom\": 295}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"2004678e-335a-42bb-b5e4-16235a9a4564\", \"roi\": {\"top\": 270, \"left\": 85, \"right\": 102, \"bottom\": 295}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"5aa5ce5d-103d-4959-b35a-47e108e64cfc\", \"roi\": {\"top\": 270, \"left\": 102, \"right\": 119, \"bottom\": 295}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"bb985961-ec95-4972-9508-851e96129a70\", \"roi\": {\"top\": 270, \"left\": 119, \"right\": 136, \"bottom\": 295}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"dd9913a2-72ba-4439-969b-36b4eec6ec59\", \"roi\": {\"top\": 270, \"left\": 136, \"right\": 153, \"bottom\": 295}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"6ee75ce7-7158-4550-bcb7-cf39d421baa8\", \"roi\": {\"top\": 270, \"left\": 153, \"right\": 170, \"bottom\": 295}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"c15d8753-1cc1-4bf2-834e-95863694e800\", \"roi\": {\"top\": 310, \"left\": 51, \"right\": 68, \"bottom\": 335}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"e4896cbe-4f9b-4bed-9690-7d1defb7875d\", \"roi\": {\"top\": 310, \"left\": 68, \"right\": 85, \"bottom\": 335}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"88a87213-4f63-4a32-91ad-a84094527351\", \"roi\": {\"top\": 310, \"left\": 85, \"right\": 102, \"bottom\": 335}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"caf38b19-199f-4464-ad4b-8c7bb8bfd732\", \"roi\": {\"top\": 310, \"left\": 102, \"right\": 119, \"bottom\": 335}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"a271a3b4-0a93-4da7-8981-f6587caf625f\", \"roi\": {\"top\": 310, \"left\": 119, \"right\": 136, \"bottom\": 335}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"d6c1ffcc-027a-42b1-9ae7-40db78351aa4\", \"roi\": {\"top\": 310, \"left\": 136, \"right\": 153, \"bottom\": 335}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"c6c95b86-14ed-4376-b7be-a4a31af47cf9\", \"roi\": {\"top\": 310, \"left\": 153, \"right\": 170, \"bottom\": 335}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"deb8c20d-81c8-47d3-b169-b3cf04a07027\", \"roi\": {\"top\": 350, \"left\": 51, \"right\": 68, \"bottom\": 375}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"c79dff26-9d94-4b0b-9715-5ed55498c4de\", \"roi\": {\"top\": 350, \"left\": 68, \"right\": 85, \"bottom\": 375}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"00294d37-bd23-4b9f-9955-36b21aeb2668\", \"roi\": {\"top\": 350, \"left\": 85, \"right\": 102, \"bottom\": 375}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"e62f576f-e3ba-4ea6-9d0a-26146e83cc62\", \"roi\": {\"top\": 350, \"left\": 102, \"right\": 119, \"bottom\": 375}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"01b72064-f921-4a88-9ef9-3b6e499f28fe\", \"roi\": {\"top\": 350, \"left\": 119, \"right\": 136, \"bottom\": 375}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"e62ae393-7791-45b4-92e7-a10c119f5af8\", \"roi\": {\"top\": 350, \"left\": 136, \"right\": 153, \"bottom\": 375}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"620cb9ef-38f4-4c4c-8028-c3b7adc8d150\", \"roi\": {\"top\": 350, \"left\": 153, \"right\": 170, \"bottom\": 375}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"4209b7d8-b899-45e8-9b9e-b8f54c9fa486\", \"roi\": {\"top\": 390, \"left\": 51, \"right\": 68, \"bottom\": 415}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"79f97551-084e-495f-b40c-2082a5ba4fea\", \"roi\": {\"top\": 390, \"left\": 68, \"right\": 85, \"bottom\": 415}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"a9b745f2-3f3d-4683-b31c-e27ecd1d4b23\", \"roi\": {\"top\": 390, \"left\": 85, \"right\": 102, \"bottom\": 415}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"c0c10284-7bc7-429c-ac08-f5f8a7032092\", \"roi\": {\"top\": 390, \"left\": 102, \"right\": 119, \"bottom\": 415}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"de3c50a2-b0e7-48fa-a47d-bdc1cec14b4a\", \"roi\": {\"top\": 390, \"left\": 119, \"right\": 136, \"bottom\": 415}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"9776f53a-d7ff-475c-9e0e-f4d1ec1aab9c\", \"roi\": {\"top\": 390, \"left\": 136, \"right\": 153, \"bottom\": 415}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"2cba52e8-5b76-40b6-8094-a6d9759387cd\", \"roi\": {\"top\": 390, \"left\": 153, \"right\": 170, \"bottom\": 415}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"08dc59b6-8838-408a-979b-06ced3a837dc\", \"roi\": {\"top\": 430, \"left\": 51, \"right\": 68, \"bottom\": 455}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"27d27859-0fe6-441b-9b1c-4e0d99c3ffb1\", \"roi\": {\"top\": 430, \"left\": 68, \"right\": 85, \"bottom\": 455}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"734a5782-4afc-4af2-9423-18d3e9655793\", \"roi\": {\"top\": 430, \"left\": 85, \"right\": 102, \"bottom\": 455}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"ef0fc989-8b0d-4470-8e93-2d774415a117\", \"roi\": {\"top\": 430, \"left\": 102, \"right\": 119, \"bottom\": 455}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"4c43e7bf-68f2-4a2d-b63c-471d24bdc8ed\", \"roi\": {\"top\": 430, \"left\": 119, \"right\": 136, \"bottom\": 455}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"6a689544-1887-4c13-b302-1df4e7851de6\", \"roi\": {\"top\": 430, \"left\": 136, \"right\": 153, \"bottom\": 455}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}, {\"roiId\": \"1ba8bbfc-e792-444d-bfcf-c76dea1fb2c3\", \"roi\": {\"top\": 430, \"left\": 153, \"right\": 170, \"bottom\": 455}, \"extractionMethod\": \"NUMERIC_CLASSIFICATION\"}]"; 
    //             RNOpenCvCameraModel.openScanCamera(LiteracyClass2_3_ROIs)
    //                 .then(data => {
    //                     console.log("imgArrSuccess", JSON.parse(data));
    //                     let scannerResponse = JSON.parse(data)
    //                     scannerResponse.scannerCode = scannerCode
    //                     scannerResponse.scannerType = scannerType
    //                     this.props.OcrLocalResponseAction(scannerResponse)
    //                     this.setState({ isLoading: false })

    //                     if(scannerType == SCAN_TYPES.PAT_TYPE) {
    //                         this.props.navigation.navigate('patScanDetails', { oldBrightness: this.state.oldBrightness })
    //                     } else if(scannerType == SCAN_TYPES.SAT_TYPE) {
    //                         this.props.navigation.navigate('satScanDetails', { oldBrightness: this.state.oldBrightness })
    //                     }

    //                 })
    //                 .catch((code, errorMessage) => {
    //                     this.setState({ isLoading: false })
    //                     Alert.alert(Strings.message_text, Strings.table_image_is_not_proper)
    //                     console.log("dataFailure", code, "Message", errorMessage);
    //                 });
    //             }
    //         else if (!success) {
    //             Alert.alert(Strings.permission_deny, Strings.you_have_no_permission_to_change_settings, [
    //                 { 'text': Strings.ok_text, style: Strings.cancel_text },
    //                 { 'text': Strings.open_settings, onPress: () => SystemSetting.grantWriteSettingPremission() }
    //             ])
    //         }
    //     });
    // }

    getScannerType = (scanType) => {
        const { filteredData } = this.props
        let response = filteredData.response
        let classId = response.class
        if(scanType == SCAN_TYPES.PAT_TYPE) {
            let subject = response.subject.toLowerCase()
            let classId = response.class
            if(subject == 'math' && (classId == 3 || classId == 4|| classId == 5)) { //subject math - class -3,4&5.  - type -1
                return 1
            } else if(subject == 'hindi' && (classId == 2 || classId == 3)) { //subject hindi - class -2&3 - type - 2
                return 2
            }
            else if(subject == 'hindi' && (classId == 4 || classId == 5)) { //subject hindi - class -4&5 - type - 2
                return 3
            }
        } else if(scanType == SCAN_TYPES.SAT_TYPE) {
            if(classId == 3 || classId == 4 || classId == 5) {
                return 1
            } else if(classId == 6 || classId == 7 || classId == 8) {
                return 2
            }
        }
    }

    render() {
        const { isLoading } = this.state;
        const { loginData } = this.props
        return (

            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <HeaderComponent
                    title={Strings.up_saralData}
                />
                {(loginData && loginData.data) && 
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text 
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold',  paddingHorizontal: '5%', paddingVertical: '2%' }}
                    >
                        {Strings.school_name+' : '}
                        <Text style={{ fontWeight: 'normal'}}>
                            {loginData.data.school.name}
                        </Text>
                    </Text>
                    <Text 
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '2%' }}
                    >
                        {Strings.schoolId_text+' : '}
                        <Text style={{ fontWeight: 'normal'}}>
                            {loginData.data.school.schoolId}
                        </Text>
                    </Text>
                    </View>}
                    <Text 
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR-3, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', marginBottom: '4%' }}
                    >
                        {Strings.version_text+' : '}
                        <Text style={{ fontWeight: 'normal'}}>
                            {apkVersion}
                        </Text>
                    </Text>
                <ScrollView
                    contentContainerStyle={{  paddingTop: '5%', paddingBottom: '35%' }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                </ScrollView>
                <View style={styles.bottomTabStyle}>
                </View>

                <View style={[styles.bottomTabStyle, { height: 135, width: '50%', marginHorizontal: '25%', backgroundColor: 'transparent', justifyContent: 'center' }]}>
                    <TouchableOpacity style={[styles.subTabContainerStyle]}
                        onPress={this.onScanClick}
                    >
                        <TouchableOpacity 
                            style={[styles.scanTabContainerStyle,]}
                        >
                            <TouchableOpacity
                                style={styles.scanSubTabContainerStyle}
                            >
                                <Image
                                    source={require('../../assets/images/scanIcon.jpeg')}
                                    style={styles.tabIconStyle}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Text style={[styles.tabLabelStyle, { paddingTop: '71%' }]}>
                            {Strings.scan_text}
                        </Text>
                    </TouchableOpacity>
                </View>
                {isLoading &&
                    <Spinner
                        animating={isLoading}
                        customContainer={{ opacity: 0.9, elevation: 15 }}
                    />}
            </View>
        );
    }
}

const styles = {
    container1: {
        flex: 1,
        marginHorizontal: '6%',
        alignItems: 'center'
    },
    bottomTabStyle: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        height: 90,
        left: 0,
        right: 0,
        backgroundColor: AppTheme.WHITE,
        elevation: 10,
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'space-between'
    },
    subTabContainerStyle: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabIconStyle: {
        width: 40,
        height: 40
    },
    tabLabelStyle: {
        lineHeight: 40,
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    scanTabContainerStyle: {
        width: 85,
        height: 85,
        backgroundColor: AppTheme.WHITE,
        position: 'absolute',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scanSubTabContainerStyle: {
        width: '90%',
        height: '90%',
        backgroundColor: AppTheme.BLUE,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    }
}

const mapStateToProps = (state) => {
    return {
        ocrLocalResponse: state.ocrLocalResponse,
        loginData: state.loginData,
        filteredData: state.filteredData,
        scanTypeData: state.scanTypeData.response
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        OcrLocalResponseAction: OcrLocalResponseAction,
    }, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(MyScanComponent));