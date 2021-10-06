import { StyleSheet } from "react-native";
import AppTheme from "../../utils/AppTheme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: AppTheme.BLUE,
        width: '80%',
        borderRadius: 8,
        marginTop: 20,
        marginHorizontal: '10%'
    },
    container1: {
        flex: 1,
        marginHorizontal: '4%',
        alignItems: 'center',
        paddingVertical: '5%'
    },
    header1TextStyle: {
        backgroundColor: AppTheme.LIGHT_YELLOW,
        lineHeight: 40,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: AppTheme.LIGHT_GREY,
        width: '100%',
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        letterSpacing: 1
    },
    scanCardStyle: {
        flexDirection: 'row',
        paddingHorizontal: '2%',
    },
    scanLabelStyle: {
        padding: '3%',
        borderTopWidth: 1,
        borderColor: AppTheme.BLACK
    },
    scanLabelKeyStyle: {
        width: '40%',
        backgroundColor: AppTheme.TAB_BORDER,
        borderLeftWidth: 1,
        borderRightWidth: .5,
    },
    scanLabelValueStyle: {
        width: '60%',
        backgroundColor: AppTheme.WHITE,
        borderLeftWidth: .5,
        borderRightWidth: 1,
    }

});