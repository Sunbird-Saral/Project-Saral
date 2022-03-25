import AppTheme from "../../utils/AppTheme";
import { monospace_FF } from "../../utils/CommonUtils";

export const styles = {
    container1: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header1TextStyle: {
        padding: '5%',
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_MEDIUM_SMALL,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        fontFamily : monospace_FF
    },
    row: {
        flexDirection: 'row'
    },
    container2: {
        flex: 1,
        borderRadius: 4,
        elevation: 4,
        marginHorizontal: '5%',
        backgroundColor: AppTheme.WHITE,
    },
    cancelBtnStyle: {
        backgroundColor: 'transparent',
        width: '40%',
        borderWidth: 1,
        borderColor: AppTheme.BTN_BORDER_GREY
    },
    cancelBtnTextStyle: {
        color: AppTheme.BLACK
    },
    container3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '4%',
        paddingTop: '15%',
        backgroundColor: AppTheme.WHITE
    },
    editBtnStyle: {
        width: '35%',
        justifyContent: 'space-evenly'
    },
    editBtnTextStyle: {
        color: AppTheme.BLACK
    },
    nxtBtnStyle: {
        backgroundColor: 'transparent',
        width: '60%',
        borderWidth: 1,
    },
    nxtBtnTextStyle: {
        color: AppTheme.BLUE
    },
    studentDetailsTxtStyle: {
        color: AppTheme.GREY_TITLE,
        fontSize: AppTheme.FONT_SIZE_MEDIUM,
        paddingHorizontal: '5%',
        paddingTop: '8%',
        paddingBottom: '8%',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily : monospace_FF
    },
    studentContainer: {
        // flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        width: '90%',
        borderBottomWidth: 1,
        borderBottomColor: AppTheme.LIGHT_GREY,
        paddingBottom: 10
    },
    imageViewContainer: {
        width: '30%',
        height: '100%',
        marginRight: '1%'
    },
    imageContainerStyle: {
        height: 90,
        width: 90,
        borderRadius: 45,
        borderWidth: 1,
        borderColor: AppTheme.TAB_BORDER,
        justifyContent: 'center',
        backgroundColor: AppTheme.TAB_BORDER
    },
    imageStyle: {
        height: '90%',
        width: '90%',
    },
    deatilsViewContainer: {
        width: '70%',
        height: '100%',
        paddingLeft: '1%',
    },
    detailsSubContainerStyle: {
        justifyContent: 'space-evenly',
        paddingVertical: '3%'
    },
    nameTextStyle: {
        lineHeight: 25,
        fontSize: AppTheme.FONT_SIZE_SMALL,
        fontWeight: '500',
        color: AppTheme.GREY_TEXT,
        letterSpacing: 1,
        fontFamily : monospace_FF
    },
    submitBtnStyle: {
        width: '60%',
    },
    fieldContainerStyle: {
        paddingVertical: '2.5%',
        marginHorizontal: '2.5%'
    },
    labelTextStyle: {
        width: '40%',
        fontSize: AppTheme.FONT_SIZE_MEDIUM,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        letterSpacing: 1,
        lineHeight: 35
    },
    viewnxtBtnStyle1: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nxtBtnStyle1: {
        width: '45%',
        marginHorizontal: 5,
        marginBottom: 20,
        borderRadius: 10
    },
    tabLabelStyle: {
        height: 70,
        lineHeight: 20,
        fontSize: AppTheme.FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    subTabContainerStyle: {
        marginBottom: -60,
        paddingHorizontal: 20,
        paddingTop: 20,
        height: 90,
        borderRadius: 100,
        margin: 10
    },
    scanTabContainerStyle: {
        width: 80,
        height: 80,
        position: 'absolute',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scanSubTabContainerStyle: {
        width: '90%',
        height: '90%',
        marginBottom: 30,
        backgroundColor: AppTheme.BLUE,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    }
}