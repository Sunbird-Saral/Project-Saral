import { StyleSheet } from "react-native";
import AppTheme from "../../utils/AppTheme";
export const styles = StyleSheet.create({
    container: {
        backgroundColor:AppTheme.BLUE,
        width: '90%',
        borderRadius: 8,
        marginTop: 20,
        justifyContent:'center',
        alignSelf:"center"
        
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
        padding: '2.4%',
        // borderTopWidth: 1,
        borderColor: AppTheme.BLACK,
        // borderColor:'#DADADA',
        borderWidth:0.4,
        borderLeftWidth:0,
        borderRightWidth:0

    },
    scanLabelKeyStyle: {
        width: '60%',
        backgroundColor: AppTheme.WHITE,
        // borderLeftWidth: 1,
        // borderRightWidth: 1,
    },
    scanLabelValueStyle: {
        width: '40%',
        backgroundColor: AppTheme.WHITE,
        alignItems:'center',
    },

});