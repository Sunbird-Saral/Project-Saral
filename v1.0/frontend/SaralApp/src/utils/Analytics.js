import analytics from '@react-native-firebase/analytics';

// /**
// *
// * @param {*} param0
// * for the links when user clicks
// */

 

export async function loginEvent(username) {
    // console.log('usernamefirebaseevent>>>>>',username);
    await analytics().logEvent("successfullLogin", {userName:username});
  }

  export async function SchoolDetailSubmit(username) {
    // console.log('schoolDetailSubmit>>>>>',username);
    await analytics().logEvent("schoolDetailSubmit", {schooldetailsubmituser:username});
  }

  
export async function markAttendance(value) {
  // console.log('markAttendancefirebaseevent>>>>>',value);
  await analytics().logEvent("attendance", {attendance:value});
}

export async function markAttendanceNext(username) {
  // console.log('markAttendancefirebaseevent>>>>>',username);
  await analytics().logEvent("attendanceNext",{attendanceNextUser:username});
}


export async function SaveInDbEvent(username) {
  console.log('saveAllScanClick>>>',username);
  await analytics().logEvent("saveAllScanClick",{saveinDbuser:username});
}

export async function onScanButtonClickEvent(username) {
  console.log('onclickscan');
  await analytics().logEvent("clickOnScanButton",{scanButtonclickuser:username});
}

export async function saveLocalAfterScan(username) {
  console.log('saveDatainLocal');
  await analytics().logEvent("SaveinLocalstorage",{savelocaldata:username});
}

export async function ReviewScan(username) {
  // console.log('reviewScan');
  await analytics().logEvent("ReviewScanButton",{reviewScanUser:username});
}

export async function ReScanButton(username) {
  console.log('rescanButton');
  await analytics().logEvent("ReScanButton",{rescanUser:username});
}

export async function AnalyticLogout(username) {
  console.log('logoutssss',username);
  await analytics().logEvent("logout",{logout:username});
}


// export async function selectAssesments(value) {
//   console.log('markAttendancefirebaseevent>>>>>',value);
//   await analytics().logEvent("Assessment");
// }