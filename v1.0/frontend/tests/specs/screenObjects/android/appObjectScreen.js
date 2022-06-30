class AppObject {
    get waitFiveSecond() {
        return driver.pause(5000)  
    }
    get schoolId() {
        return $('//*[@text="School Id"]');
    }

    get password() {
        return $('//*[@text="Password"]');
    }

    get loginBtn() {
        return $$('//android.widget.TextView[@text="LOGIN"]');
    }

    get loginTxt() {
        return $('//*[@text="LOGIN"]');
    }

    get rememberMe() {
        return $('android.widget.Switch');
    }


    get passwordShow() {
        return $("android.widget.ImageView");
    }

    get getStartedBtn() {
        return $('//*[@text="GET STARTED"]');
    }

    get profileIcon() {
        return $('//*[@text="D"]');
    }

    get profileIcon_P() {
        return $('//*[@text="P"]');
    }

    get aboutTxt() {
        return $('//*[@text="About"]');
    }

    get documentLink() {
        return $('//*[@text="https://saral.sunbird.org/"]');
    }

    get helpText() {
        return $('//*[@text="Help"]');
    }

    get essertionImg() {
        return $("android.widget.ImageView");
    }

    get class_dropdown() {
        return $("android.widget.ImageView");  
    }

    get sectionSubject_dropdown() {
        return $$("android.widget.ImageView");  
    }

    get selectClass_2() {
        return $("//android.widget.TextView[@text='Class-2']");
    }

    get selectClass_3() {
        return $("//android.widget.TextView[@text='Class-3']");
    }

    get selectClass_4() {
        return $("//android.widget.TextView[@text='Class-4']");
    }
    get selectClass_5() {
        return $("//android.widget.TextView[@text='Class-5']");
    }

    get selectClass_9() {
        return $("//android.widget.TextView[@text='Class-9']");
    }
   
  
    get selectSection_B(){
        return $("//android.widget.TextView[@text='B']");
    }

    get selectSection_C(){
        return $("//android.widget.TextView[@text='C']");
    }

    get selectSection_A(){
        return $("//android.widget.TextView[@text='A']");
    }

    get selectSubject_2D_UP() {
        return $("//android.widget.TextView[@text='Hindi 23/09/2021']");
    }

    get selectSubject_4B() {
        return $("//android.widget.TextView[@text='Hindi 05/10/2021']");
    }

    get selectSubject_5D() {
        return $("//android.widget.TextView[@text='Hindi 05/10/2021']");
    }

    get selectSubject_2D() {
        return $("//android.widget.TextView[@text='Hindi 11/10/2021']");
    }

    get selectSubject_3D() {
        return $("//android.widget.TextView[@text='Hindi 24/09/2021']");
    }

    get selectSubject_2D_od() {
        return $("//android.widget.TextView[@text='Hindi 01/10/2021']");
    }

    get selectSubject_4D_multi() {
        return $("//android.widget.TextView[@text='Multi-Subject 28/09/2021']");
    }

    get selectSubject_2D_midday() {
        return $("//android.widget.TextView[@text='midday-meal 07/01/2022']");
    }
  
    get selectSubject_2A_assam() {
        return $("//android.widget.TextView[@text='Hindi 07/03/2022']");
    }

    get selectSubject_4A_assam() {
        return $("//android.widget.TextView[@text='Hindi 05/05/2022']");
    }

    get selectSubject_2B_Book() {
        return $("//android.widget.TextView[@text='book-distribution 20/06/2022']");
    }

    get selectSubject_9C() {
        return $("//android.widget.TextView[@text='Hindi 1/07/2022']");
    }
    get selectSubject_3A() {
        return $("//android.widget.TextView[@text='Maths 24/10/2022']");
    }

    get selectSchool() {
        return $("//android.widget.TextView[@text='school evaluation']");
    }


    get scrollView() {
        return  $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(1,5)');
    }

  
    
    get submitSetTime() {
       return driver.pause(5000)
    }

    get submitBtn() {
        return $("//android.widget.TextView[@text='Submit']");
    }

    get absent_present() {
        return $("//android.widget.TextView[@text='Mark as Absent']")
    }

    get nextBtn() {
        return $("//android.widget.TextView[@text='NEXT']");
    }

    get detailLink() {
        return $("//android.widget.TextView[@text='Details(c)']");
    }

    get closeBtn() {
        return $("//android.widget.TextView[@text='CLOSE']");
        
    }

    get saveAllBtn() {
        return $("//android.widget.TextView[@text='Save All Scan']");
    }

    get ok() {
        return $("//android.widget.TextView[@text=' OK ']");
    }

    get continueScanBtn() {
        return $("//android.widget.TextView[@text='Continue Scan']");
    }

    get scanBtn() {
        return $("android.widget.ImageView");
    }

    get scanButton() {
        return $$("android.widget.ImageView");
    }

    get scanSetTime() {
        return driver.pause(20000)
    }

    get studentDetailText(){
        return $("//android.widget.TextView[@text='Student Details']");
    }

    get details(){
        return $("//android.widget.TextView[@text='Details']");
    }


   
    get SUBMIT() {
        return $("//android.widget.TextView[@text='SUBMIT']");
    }

    get checkbox() {
        return  $("android.widget.CheckBox");
    }

    get logoutTxt() {
        return $('//*[@text="Logout"]');
    }

    get supportTxt() {
        return $('//*[@text="Support"]');
    }

    get goDashboard() {
        return $('//android.widget.TextView[@text="Go Back To Dashboard"]');
   }
   get editInput() {
    return $('//android.widget.EditText[@text = ""]');
}
   get inputValue() {
        return $('//android.widget.EditText[@text = "3309001"]');
   }

   get studentinputValue() {
    return $('//android.widget.EditText[@text = "1210001"]');
}

   get predictedMarks() {
    return $('//android.widget.EditText[@text = "0"]');
   }

   get inputMarks() {
    return $('//android.widget.EditText[@text = ""]');
   }
   
   get clearInputMarks() {
    return $('//android.widget.EditText[@text = "6"]');
   }


   get Back() {
    return $('//android.widget.TextView[@text = "BACK"]');
   }

   get openDropdown_minimal() {
    return $('//android.widget.ImageView[@text = "Select Layout"]');  
}
   
get selectMinimalOption() {
    return $("//android.widget.TextView[@text='electricity reading']");  
}

get regexValidationMsg(){
    return $("//android.widget.TextView[@text='Omr result should be between 0 to 5']");  
}

get regexValidationMsg0_1(){
    return $("//android.widget.TextView[@text='Omr result should be 1 or 0']");  
}

get editAndCorrectMsg() {
    return $("//android.widget.TextView[@text='Please edit and correct result data.']")
}

get saveSuccessInDB() {
    return $("//android.widget.TextView[@text='Saved Successfully']")
}

get scanStatus() {
    return $$("//android.widget.TextView[@text='Scan Status']")
}

get scanData() {
    return $("//android.widget.TextView[@text='SCAN DATA']")
}

get saveStatus() {
    return $$("//android.widget.TextView[@text='Save Status']")
}

get savedData() {
    return $("//android.widget.TextView[@text='SAVED DATA']")
}

get saveAllScan() {
    return $("//android.widget.TextView[@text='SAVED ALL SCAN']")
}


get tagImage() {
    return $$("android.widget.ImageView");
}

get tagField() {
    return $("//android.widget.EditText[@text='Add New Tag']")
}

get addTagButton() {
    return $("//android.widget.TextView[@text='Add Tag']")
}
get scrollToDetails() {
    return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Student Details")');
}
}
export default new AppObject();
