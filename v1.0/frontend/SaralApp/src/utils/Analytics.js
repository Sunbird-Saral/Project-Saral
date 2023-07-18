import analytics from '@react-native-firebase/analytics';

// /**
// *
// * @param {*} param0
// * for the links when user clicks
// */

 

export async function loginEvent(username) {
    console.log('usernamefirebaseevent>>>>>',username);
    await analytics().logEvent("loginUser", {'userName':username});
  }