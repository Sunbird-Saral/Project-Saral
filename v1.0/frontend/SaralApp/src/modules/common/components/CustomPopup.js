import React, { Component } from 'react';
import { ScrollView, View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import AppTheme from '../../../utils/AppTheme';
const { height, width } = Dimensions.get('window')

export default class CustomPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { visible, title, message, onCancelPress, onOkPress, cancel_button, ok_button, customMessageTxtStyle, customPopStyle, customTitleTextStyle, customOkBtnTxtStyle, customStyle } = this.props;
        return (
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade">
                <View style={[{
                    height: height - 134, marginTop: 60, 
                    shadowColor: "black",
                    shadowOpacity: .2,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    shadowOffset:{height:3,width:3},
                    shadowRadius: 10,

                }, customStyle]}>
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                        <View
                            style={[{
                                elevation: 4,
                                width: width * .85,
                                backgroundColor: AppTheme.WHITE,
                                marginHorizontal: width * .075,
                                paddingLeft: width * .06,
                                paddingRight: width * 0.06,
                                paddingTop: height * .03,
                                borderRadius: 8
                                // marginTop: height * .4
                            }, customPopStyle]}>
                            <Text style={[styles.titleTextStyle, customTitleTextStyle]}>{title}</Text>
                            <Text style={[styles.messageTextStyle, customMessageTxtStyle]}>{message}</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingVertical: height * .03,
                                    justifyContent: "flex-end",
                                    marginRight: width * .04,
                                }}>
                                {cancel_button ?
                                    <TouchableOpacity
                                        onPress={onCancelPress}
                                        activeOpacity={0.7}
                                        style={{
                                            paddingHorizontal: width * .03,
                                            justifyContent: "center"
                                        }}>
                                        <Text style={[styles.TextStyle]}> {cancel_button} </Text>
                                    </TouchableOpacity> : null}

                                {ok_button ?
                                    <TouchableOpacity
                                        onPress={onOkPress}
                                        style={{
                                            paddingHorizontal: "5%",
                                            justifyContent: "center"
                                        }}
                                        activeOpacity={0.7}>
                                        <Text style={[styles.TextStyle, customOkBtnTxtStyle]}> {ok_button} </Text>
                                    </TouchableOpacity> : null}

                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}

const styles = {

    titleTextStyle: {
        fontSize: AppTheme.HEADER_FONT_SIZE_SMALL,
        color: AppTheme.BLACK,
        fontWeight: 'bold',
        textAlign: 'left'
    },

    messageTextStyle: {
        lineHeight: 25,
        fontSize: AppTheme.FONT_SIZE_REGULAR+2,
        color: AppTheme.DIM_GREY,
        height: 'auto',
        textAlign: 'left'
    },

    TextStyle: {
        color: AppTheme.BLACK,
        textAlign: 'center',
        fontSize: AppTheme.FONT_SIZE_REGULAR,
        fontWeight: "bold"
    }

};