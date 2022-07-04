const assert = require("assert")
import LOGININPUT from "./screenObjects/android/loginInput";
import AppObject from "./screenObjects/android/appObjectScreen";

describe('saral app test', () => {
  afterEach('test case passed', async () => {
    console.log('test case passed succesfully')
  })
  it('find elements', async () => {
    // schoolId and password
    await driver.pause(5000);
    LOGININPUT.u002();


    await driver.pause(2000);
    const displayLoginButton = await AppObject.loginBtn[1]
    await displayLoginButton.click();


    const displayStartButton = await AppObject.getStartedBtn
    await displayStartButton.waitForDisplayed()
    assert.equal(await displayStartButton.isDisplayed(), true)
    await displayStartButton.click();

    await driver.pause(3000)
    const openClassDropdown = await AppObject.class_dropdown
    await openClassDropdown.click();


    const class2 = await AppObject.selectClass_2
    await class2.waitForDisplayed()
    assert.equal(await class2.isDisplayed(), true)
    await class2.click();

    await driver.pause(2000)
    const openSubjectDropdown = await AppObject.sectionSubject_dropdown[2]
    await openSubjectDropdown.waitForDisplayed();
    assert.equal(await openSubjectDropdown.isDisplayed(), true)
    await openSubjectDropdown.click();
    await AppObject.selectSubject_2D_midday.click();


    await AppObject.submitBtn.click();
    await AppObject.scrollView
    await driver.pause(5000);
    await AppObject.nextBtn.click();


    const displaySaveAllBtn = await AppObject.saveAllBtn
    await displaySaveAllBtn.waitForDisplayed();
    assert.equal(await displaySaveAllBtn.isDisplayed(), true)
    await displaySaveAllBtn.click();
    await AppObject.ok.click();

  });


  it('studend deatil and after scan test', async () => {
    await AppObject.continueScanBtn.click();
    await AppObject.submitSetTime;
    await AppObject.scanBtn.click();
    const detailText = await AppObject.studentDetailText
    await detailText.waitForDisplayed({ timeout: 60000 })
    assert.equal(await detailText.isDisplayed(), true)
  });

  it('page1 validation test', async () => {
    const tagImage = await AppObject.tagImage[0]
    await tagImage.waitForDisplayed()
    await tagImage.click();
    await driver.pause(3000);
    await AppObject.tagField.addValue('historics');
    await AppObject.addTagButton.click();
    await driver.back()
    await driver.pause(3000);
    await AppObject.scrollView

  });

  it('page_2 validation test', async () => {
    await driver.pause(3000);
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    const skipPage = await AppObject.checkbox
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.nextBtn.click();
    await skipPage.click();
    await AppObject.SUBMIT.click();

  });

  it('after scan test cases', async () => {
    await driver.pause(3000);
    const scanStatusBtn = await AppObject.scanStatus[1]
    await scanStatusBtn.click();
    await driver.pause(3000);
    await driver.back();

    const backBtn = await AppObject.Back
    await backBtn.waitForDisplayed();
    assert.equal(await backBtn.isDisplayed(), true)
    await backBtn.click();

    await driver.pause(3000);
    const saveAllBtn = await AppObject.saveAllBtn
    await saveAllBtn.waitForDisplayed();
    assert.equal(await saveAllBtn.isDisplayed(), true)
    await saveAllBtn.click();

    const saveSuccessInDB = await AppObject.saveSuccessInDB
    await saveSuccessInDB.waitForDisplayed();
    assert.equal(await saveSuccessInDB.isDisplayed(), true)
    await AppObject.ok.click();

    await driver.pause(3000);
    const saveStatusBtn = await AppObject.saveStatus[1]
    await saveStatusBtn.click();
    await driver.pause(3000);
    await driver.back();


    const displayprofileIcon = await AppObject.profileIcon
    await displayprofileIcon.waitForDisplayed({ timeout: 5000 });
    assert.equal(await displayprofileIcon.isDisplayed(), true)
    await displayprofileIcon.click();

    await AppObject.logoutTxt.click();
    await AppObject.ok.click();
  })

})