import React, { Component } from 'react';
import { View, ActivityIndicator, Text, Image } from 'react-native';
import AppTheme from '../../../utils/AppTheme';


class Spinner extends Component {

  render() {
    const { animating, loadingText, iconShow, customContainer } = this.props
    return (
      <View style={[styles.container, customContainer]}>
        {animating && !iconShow &&
        <ActivityIndicator
          animating={animating}
          color={AppTheme.BLUE_BORDER}
          size="large"
          style={[styles.activityIndicator, this.props.loaderStyle]}
        />}
        {/* {iconShow &&
        <Image 
          source={require('../../../assets/images/scanCompleteIcon.png')}
          style={styles.iconStyle}
          resizeMode={'contain'}
        />} */}
        {loadingText != '' && <Text style={styles.loadingTextStyle}>{loadingText}</Text>}
      </View>
    )
  }
}

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    justifyContent: 'center',
    backgroundColor: AppTheme.BLACK,
    alignItems: 'center',
  },
  iconStyle: {
    width: 30,
    height: 30
  },
  activityIndicator: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    // opacity: 0.5,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF88'
  },
  loadingTextStyle: {
    textAlign: 'center',
    color: AppTheme.WHITE, 
    fontSize: AppTheme.HEADER_FONT_SIZE_REGULAR, 
    fontWeight: 'bold', 
    paddingHorizontal: '15%'
  }
};

export default Spinner
