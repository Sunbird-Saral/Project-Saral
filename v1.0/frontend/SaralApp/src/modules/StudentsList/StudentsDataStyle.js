import { StyleSheet } from "react-native";
import AppTheme from "../../utils/AppTheme";
import { monospace_FF } from "../../utils/CommonUtils";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    schoolName: {
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        paddingHorizontal: '5%',
        paddingVertical: '2%'
    },
    schoolId: {
        fontSize: AppTheme.FONT_SIZE_REGULAR - 3,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        paddingHorizontal: '5%',
        marginBottom: '2%'
    },
    flatlistCon: {
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    cardCon: {
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 40,
        marginTop: 20
    },
    cardChildCon: {
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8
    },
    line: {
        height: 1.2,
        width: '100%',
        backgroundColor: 'black',
    },
    aadhar: {
        padding: 10,
        textAlign: 'center',
        fontFamily : monospace_FF
    },
    markasAbsent: {
        color: '#ffffff',
        paddingHorizontal: 25,
        paddingVertical: 6,
        borderRadius: 20,
        margin: 10
    },
    markasPresent:{
        color: '#000',
        paddingHorizontal: 25,
        paddingVertical: 6,
        borderRadius: 20,
        margin: 10
    },
    btnCon: {
        paddingHorizontal: 25,
        paddingVertical: 6,
        borderRadius: 20,
        margin: 10
    },
    nxtBtnStyle: {
        marginHorizontal: 40,
        marginBottom: 20,
        borderRadius: 10
    },
    nxtBtnStyle1: {
        width:'45%',
        marginHorizontal: 5,
        marginBottom: 20,
        borderRadius: 10
    },
    viewnxtBtnStyle1 : {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }

});