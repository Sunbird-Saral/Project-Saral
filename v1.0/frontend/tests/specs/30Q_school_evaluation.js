const assert = require("assert")
import LOGININPUT from "./screenObjects/android/loginInput";
import AppObject from "./screenObjects/android/appObjectScreen";

describe('saral app test', () => {
    beforeEach('test case passed',()=>{
        console.log('test case passed succesfully')
    })
  it('find elements', async () => {
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

    await driver.pause(3000)
    const openSchoolDropdown = await AppObject.class_dropdown
    await openSchoolDropdown.click();

    const school = await AppObject.selectSchool
    await school.click();
    // await school.waitForDisplayed()
    // assert.equal(await school.isDisplayed(), true)
    // await school.click();

    await driver.pause(4000)
    await AppObject.scrollView
    const scanButton= await AppObject.scanButton[1]
    await scanButton.click();
    const detailText = await AppObject.details
    await detailText.waitForDisplayed({ timeout: 30000 })
    assert.equal(await detailText.isDisplayed(), true)

    await driver.pause(3000)
    await AppObject.scrollView

    await AppObject.SUBMIT.click();
    
    await driver.pause(3000)
    const scannedSchoolDropdown = await AppObject.class_dropdown
    await scannedSchoolDropdown.click();

    await AppObject.selectSchool.click();

});

it('after scan test cases', async () =>{
    await driver.pause(3000);
    const scanDataBtn = await AppObject.scanData
    await scanDataBtn.click();
    await driver.pause(3000);
    await driver.back();


    await driver.pause(3000);
    const saveAllScan = await AppObject.saveAllScan
    await saveAllScan.click();

    await AppObject.ok.click();

    await driver.pause(3000);
    const saveDatasBtn = await AppObject.savedData
    await saveDatasBtn.click();
    await driver.pause(3000);
    await driver.back();


    const displayprofileIcon = await AppObject.profileIcon
    await displayprofileIcon.waitForDisplayed({ timeout: 5000 });
    assert.equal(await displayprofileIcon.isDisplayed(), true)
    await displayprofileIcon.click();

    await AppObject.logoutTxt.click();
    await AppObject.ok.click();
})
});
