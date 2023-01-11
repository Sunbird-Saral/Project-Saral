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
        paddingVertical: '2%',
        fontFamily : monospace_FF
    },
    schoolId:
    {
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        paddingHorizontal: '5%',
    },
    scanStatus: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center',
        paddingBottom: 10,
        fontFamily : monospace_FF
    },
    content: {
        paddingBottom: 20,
        flexGrow:1
    },
    nxtBtnStyle1: {
        flex:1,
        borderRadius: 10,
        marginBottom: 20,
        marginHorizontal: 10,
    },
});