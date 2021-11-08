import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Strings from '../../../utils/Strings';
import AppTheme from '../../../utils/AppTheme';
import { Assets } from '../../../assets/index'
import ButtonComponent from './ButtonComponent';
class Brands extends PureComponent {
    constructor() {
        super()
        this.state = {
            defaultIamge: true
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: 100, width: 100 }} source={this.props.Image ?  { uri: this.props.Image } : Assets.AppLogo}
                                 />
                        </View>
                        <View>
                            <Text style={styles.welcometext}>{this.props.appName ? this.props.appName : <Text>Saral Ocr App</Text>}</Text>
                        </View>

                        <View style={styles.btnContainer}>
                            <ButtonComponent
                                customBtnStyle={[styles.nxtBtnStyle, { backgroundColor: this.props.themeColor ? this.props.themeColor : AppTheme.BLUE }]}
                                btnText={Strings.get_start}
                                onPress={this.props.onPress}
                            />
                        </View>
                    </View>
                </View>
            </View>

        )
    }

}

const styles = {

    btnContainer: {
        paddingVertical: '5%'
    },
    welcometext: { textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#00000033', fontWeight: 'bold' },
    nxtBtnStyle: {
        width: 250,
        marginBottom: 15
    }
}


export default Brands;