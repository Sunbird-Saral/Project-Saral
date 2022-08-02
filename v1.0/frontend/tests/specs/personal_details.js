const assert = require("assert")
import LOGININPUT from "./screenObjects/android/loginInput";
import AppObject from "./screenObjects/android/appObjectScreen";

describe('personal details', () => {
    afterEach('test case passed',()=>{
        console.log('test case passed succesfully')
    })
  it('login ', async () => {
    // schoolId and password
    await driver.pause(5000);
    LOGININPUT.minimal_mode();


    await driver.pause(2000);
    const displayLoginButton = await AppObject.loginBtn[1]
    await displayLoginButton.click();


    const displayStartButton = await AppObject.getStartedBtn
    await displayStartButton.waitForDisplayed()
    assert.equal(await displayStartButton.isDisplayed(), true)
    await displayStartButton.click();

  });
  it('profile menu test case', async () => {
    await driver.pause(3000);
    const profileicon = await AppObject.profileIcon
    await profileicon.waitForDisplayed()
    assert.equal(await profileicon.isDisplayed(), true)
    await profileicon.click();

    const modeswitch = await AppObject.modeSwitch
    await modeswitch.click();
  })

  it('minimal mode start', async () => {
    const displayStartButton = await AppObject.getStartedBtn
    await displayStartButton.waitForDisplayed()
    assert.equal(await displayStartButton.isDisplayed(), true)
    await displayStartButton.click();

    await driver.pause(3000)
    const openClassDropdown = await AppObject.class_dropdown
    await openClassDropdown.click();

    const layout = await AppObject.select_layout
    await layout.waitForDisplayed()
    assert.equal(await layout.isDisplayed(), true)
    await layout.click();
    await driver.pause(3000)

    const scanButton = await AppObject.scanButton[1]
    await scanButton.click()
     const detailText = await AppObject.detailText
     await detailText.waitForDisplayed({ timeout: 10000 })
     assert.equal(await detailText.isDisplayed(), true)
    // await AppObject.SUBMIT.click();
  })


//   it('studend deatil and after scan test', async () => {
//     await AppObject.continueScanBtn.click();
//     await AppObject.submitSetTime;
//     await AppObject.scanBtn.click();
//     const detailText = await AppObject.studentDetailText
//     await detailText.waitForDisplayed({ timeout: 30000 })
//     assert.equal(await detailText.isDisplayed(), true)
// });

// it('page1 validation test', async () => {
//     const tagImage = await AppObject.tagImage[2]
//     await tagImage.waitForDisplayed()
//     await tagImage.click();
//     await driver.pause(3000);
//     await AppObject.tagField.addValue('historics');
//     await AppObject.addTagButton.click();
//     await driver.back()
//     await driver.pause(3000);
//      await AppObject.scrollView

//     await AppObject.predictedMarks.clearValue();
//     await AppObject.scrollView
//     await AppObject.nextBtn.click();
//     await AppObject.ok.click();
   
//     await AppObject.scrollScanPage
//     await AppObject.inputMarks.addValue('6');
//     const regexMsg = await AppObject.regexValidationMsg0_1
//     await regexMsg.waitForDisplayed();
//     assert.equal(await regexMsg.isDisplayed(), true)
//     await AppObject.ok.click();
    

//     await driver.pause(5000);
//     await AppObject.clearInputMarks.clearValue()
//     await AppObject.inputMarks.addValue('0');
//     await AppObject.scrollView
//     await AppObject.nextBtn.click();
   
// });

// it('page_2 validation test', async () => {
//     await driver.pause(3000);
//     await AppObject.nextBtn.click();
//     await AppObject.nextBtn.click();
//     await AppObject.SUBMIT.click();

// });

//   it('after scan test cases', async () =>{
//     await driver.pause(3000);
//     const scanStatusBtn = await AppObject.scanStatus[1]
//     await scanStatusBtn.click();
//     await driver.pause(3000);
//     await driver.back();

//     const backBtn = await AppObject.Back
//     await backBtn.waitForDisplayed();
//     assert.equal(await backBtn.isDisplayed(), true)
//     await backBtn.click();

//     await driver.pause(3000);
//     const saveAllBtn = await AppObject.saveAllBtn
//     await saveAllBtn.waitForDisplayed();
//     assert.equal(await saveAllBtn.isDisplayed(), true)
//     await saveAllBtn.click();

//     const saveSuccessInDB = await AppObject.saveSuccessInDB
//     await saveSuccessInDB.waitForDisplayed();
//     assert.equal(await saveSuccessInDB.isDisplayed(), true)
//     await AppObject.ok.click();

//     await driver.pause(3000);
//     const saveStatusBtn = await AppObject.saveStatus[1]
//     await saveStatusBtn.click();
//     await driver.pause(3000);
//     await driver.back();


//     const displayprofileIcon = await AppObject.profileIcon
//     await displayprofileIcon.waitForDisplayed({ timeout: 5000 });
//     assert.equal(await displayprofileIcon.isDisplayed(), true)
//     await displayprofileIcon.click();

//     await AppObject.logoutTxt.click();
//     await AppObject.ok.click();
// })

})