import { StyleSheet } from "react-native";
import AppTheme from "../../utils/AppTheme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    schoolCon: {
        // flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    schoolName: {
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        paddingHorizontal: '5%',
        paddingVertical: '2%'
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
        paddingBottom: 10
    },
    content: {
        paddingBottom: 20,
        flexGrow:1
    }
});