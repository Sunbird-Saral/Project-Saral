import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import AppTheme from '../../utils/AppTheme';
import { monospace_FF } from '../../utils/CommonUtils';
import { getPresentAbsentStudent } from '../../utils/StorageUtils';
import ScanStatusLocalList from '../ScanStatus/ScanStatusLocalList';

const ScanDataModal = ({
    minimalFlag,
    modalVisible,
    savingStatus,
    setModalVisible,
    localstutlist,
}) => {

    //Hooks
    const [presentStudentList, setPresentStudentList] = useState([]);
    const [unsavedstudentList, setUnsavedstudentList] = useState([]);

    useEffect(() => {

        if (savingStatus == 'scan') {
            getPresentStudentList(localstutlist)
            getStudentList()
        } else {
            setPresentStudentList(localstutlist)
        }
    }, [localstutlist])

    //functions
    const getPresentStudentList = (loacalstutlist) => {
        let data = typeof (loacalstutlist) === "object"
            ?
            loacalstutlist[0]
                ?
                loacalstutlist[0].studentsMarkInfo.filter((o, index) => {
                    if (o.studentAvailability && o.marksInfo.length > 0) {
                        return true
                    }
                })
                :
                []
            :
            []
        setPresentStudentList(data)
    }


    const renderItem = ({ item, index }) => {
        return <ScanStatusLocalList
            id={item.studentId}
            loacalstutlist={unsavedstudentList}
            themeColor1={AppTheme.BLUE}
            status={savingStatus == 'scan' ? `Scanned` : `Saved`}
            minimalFlag={minimalFlag}
        />

    }

    const getStudentList = async () => {
        let data = await getPresentAbsentStudent()
        if (data != null) {
            setUnsavedstudentList(data)
        }
    }

    const renderEmptyList = () => { 
        return(
            <View style={{justifyContent: 'center', alignItems:'center',flexGrow:1}}>
                <Text>No Data Available</Text>
            </View>
        )
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible()
            }}
            statusBarTranslucent={true}
        >
            <View style={styles.mainContainer}>
                {
                    <FlatList
                        data={presentStudentList}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmptyList}
                        contentContainerStyle={{ marginTop: 30, flex: 1 }}
                    />
                }

            </View>

        </Modal>
    );
}
export default ScanDataModal;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});
