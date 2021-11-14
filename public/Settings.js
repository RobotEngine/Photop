var SideBarSettingHolder = null;
var SaveSettingsButton = null;

var SaveNewSettings = JSON.parse(JSON.stringify(UserDisplaySettings));

var CurrentScreen = "AccountScreen";

function CreateSelectTile(Parent, Name, Text, IsSelected) {
  var SelectTile = createElement(Name, "div", Parent, [
      ["position", "relative"],
      ["margin-bottom", "4px"],
      ["width", "300px"],
  ]);
  if (IsSelected == true) {
    IsSelected = ThemeColor;
  } else {
    IsSelected = ContentColorLayer3;
  }
  createElement("SelectCircle", "div", SelectTile, [
      ["position", "relative"],
      ["box-sizing", "border-box"],
      ["left", "0px"],
      ["background-color", IsSelected],
      ["border-color", BorderColor],
      ["width", "28px"],
      ["height", "28px"],
      ["border-style", "solid"],
      ["border-width", "4px"],
      ["border-radius", "100%"],
      ["cursor", "pointer"]
  ]);
  createElement("SelectTitle", "div", SelectTile, [
      ["position", "absolute"],
      ["box-sizing", "border-box"],
      ["left", "32px"],
      ["top", "3px"],

      // Text:
      ["font-size", "18px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"]
  ]).textContent = Text;
  return SelectTile;
};

var SettingScreens = {
  AccountScreen() {
    var ChangeVisibleDataHolder = createElement("ChangeVisibleDataHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["vertical-align", "top"],
        ["background-color", ContentColor],
        ["width", "calc(100% - 24px)"],
        ["padding", "6px 6px 6px 6px"],
        ["max-width", "300px"],
        ["margin-top", "12px"],
        ["border-radius", "12px"],
        ["overflow-x", "auto"]
    ]);
    ChangeVisibleDataHolder.className = "StandardScroll";
    var ProfilePicLoad = "DefaultProfilePic";
    if (Settings != null && Settings.ProfilePic != null) {
      ProfilePicLoad = Settings.ProfilePic;
    }
    var ProfilePicView = createElement("ProfilePicture", "div", ChangeVisibleDataHolder, [
        ["position", "absolute"],
        //["display", "inline-block"],
        ["background-color", ContentColorLayer3],
        ["width", "88px"],
        ["height", "88px"],
        ["object-fit", "cover"],
        ["border-radius", "8px"],

        ["content", "url('" + GoogleCloudStorgeURL + "ProfileImages/" + ProfilePicLoad + "')"]
    ]);
    var ProfileImageUpload = createElement("LoadImageButton", "input", ProfilePicture, [
        ["position", "absolute"],
        ["height", "100%"],
        ["width", "100%"],
    ]);
    ProfileImageUpload.setAttribute("type", "file");
    ProfileImageUpload.setAttribute("accept", "image/*");
    ProfileImageUpload.setAttribute("hidden", "true");
    ProfileImageUpload.addEventListener('change', function(event) {
      var UploadedImage = event.target.files;
      if (UploadedImage != null && UploadedImage[0] != null) {
        if (SupportedImageTypes.includes(UploadedImage[0].type.replace(/image\//g, "")) == true) {
          if (UploadedImage[0].size < (2 * 1024 * 1024)+1) {  // No larger than 2 MB.
            var BlobURL = URL.createObjectURL(UploadedImage[0]);
            if (ProfilePicView.hasAttribute("ImageBlobURL") == true) {
              URL.revokeObjectURL(ProfilePicView.getAttribute("ImageBlobURL"));
            }
            setCSS(ProfilePicView, "content", "url(" + BlobURL + ")");
            ProfilePicView.setAttribute("ImageBlobURL", BlobURL);
            setCSS(SaveSettingsButton, "display", "flex");
          } else {
            ShowPopUp("That's a lot of Bytes", "Profile pictures must be under <b>2 MB</b> in size!", [ ["Okay", "#618BFF", null] ]);
          }
        } else {
          ShowPopUp("Invalid File Type", "Profile pictures can't be a <b>" + (UploadedImage[0].type.substring(UploadedImage[0].type.indexOf("/")+1) || "file") + "</b> format.", [ ["Okay", "#618BFF", null] ]);
        }
      }
    });

    var ChangeUsernameBox = createElement("ChangeUsernameTextBox", "input", ChangeVisibleDataHolder, [
        ["position", "relative"],
        //["display", "inline-block"],
        ["box-sizing", "border-box"],
        ["border-width", "0px"],
        ["background-color", ContentColorLayer3],
        ["width", "calc(100% - 94px)"],
        ["height", "41px"],
        ["min-width", "150px"],
        ["border-radius", "8px"],
        ["float", "left"],
        ["margin-left", "94px"],
        ["border-radius", "8px"],

        // Text:
        ["padding-left", "8px"],
        ["font-size", "26px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "left"],
        ["overflow", "auto"]
    ]);
    ChangeUsernameBox.placeholder = Username || "Change Username";
    ChangeUsernameBox.setAttribute("title", "Change Username");
    ChangeUsernameBox.addEventListener("focusout", function() {
      if (ChangeUsernameBox.value != "" && ChangeUsernameBox.value != Username) {
        var InvalidUsername = false;

        // Username Verification:
        if (ChangeUsernameBox.value.length < 3 || ChangeUsernameBox.value.length > 20) {
          InvalidUsername = true;
        }
        if (ChangeUsernameBox.value.replace(/[^A-Za-z0-9_-]/g, "") != ChangeUsernameBox.value) {
          InvalidUsername = true;
        }

        if (InvalidUsername == false) {
          CheckUsernameAvailability(ChangeUsernameBox.value);
        } else {
          var SaveButton = find("SaveSettingsButton");
          if (SaveButton != null) {
            setCSS(SaveButton, "display", "none");
          }
          ShowPopUp("Invalid Username!", "This username is invalid. Usernames must be <b>longer</b> than <b>3 characters</b>, <b>not</b> contain any <b>symbols</b>, while being <b>shorter</b> than <b>20 characters</b>.", [ ["Okay", "#618BFF", null] ]);
        }
      }
    });

    var ChangeProfilePicButton = createElement("ChangeProfilePictureButton", "div", ChangeVisibleDataHolder, [
        ["position", "relative"],
        ["display", "flex"],
        ["box-sizing", "border-box"],
        //["display", "inline-block"],
        ["background-color", ContentColorLayer3],
        ["height", "41px"],
        ["float", "left"],
        ["margin-left", "94px"],
        ["margin-top", "6px"],
        ["padding", "0px 12px 0px 12px"],
        ["min-width", "150px"],
        ["border-radius", "8px"],
        ["cursor", "pointer"],

        // Text:
        ["font-size", "20px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "center"],
        ["justify-content", "center"],
        ["align-items", "center"]
    ]);
    ChangeProfilePicButton.textContent = "✏️ Change Photo";
    var ClickTime = Date.now();
    function PromptProfilePicUpload() {
      if (ClickTime+100 < Date.now()) {
        ClickTime = Date.now();
        ProfileImageUpload.click();
      }
    }
    ChangeProfilePicButton.addEventListener("click", PromptProfilePicUpload);
    ProfilePicture.addEventListener("click", PromptProfilePicUpload);

    var FieldTitleCSS = [
        ["position", "relative"],

        // Text:
        ["font-size", "16px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "left"],
        ["overflow", "auto"]
    ];

    var ChangeEmailHolder = createElement("ChangeEmailHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["vertical-align", "top"],
        ["background-color", ContentColor],
        ["width", "calc(100% - 24px)"],
        ["padding", "6px 6px 6px 6px"],
        ["max-width", "300px"],
        ["margin-top", "12px"],
        ["border-radius", "12px"],
        ["overflow-x", "auto"]
    ]);
    
    createElement("ChangeEmailBoxTitle", "div", ChangeEmailHolder, FieldTitleCSS).textContent = "Set New Email";
    var ChangeEmailBox = createElement("ChangeEmailBox", "input", ChangeEmailHolder, [
        ["position", "relative"],
        ["box-sizing", "border-box"],
        ["border-width", "0px"],
        ["background-color", ContentColorLayer3],
        ["width", "100%"],
        ["height", "41px"],
        ["min-width", "150px"],
        ["border-radius", "8px"],
        ["border-radius", "8px"],

        // Text:
        ["padding-left", "8px"],
        ["font-size", "20px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "left"],
        ["overflow", "auto"]
    ]);
    ChangeEmailBox.placeholder = UserEmail || "Change Email";
    ChangeEmailBox.setAttribute("title", "Change Email");
    ChangeEmailBox.addEventListener("focusout", function() {
      if (ChangeEmailBox.value != "") {
        // Basic EMAIL Varification:
        // Credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        const VerifyEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (VerifyEmailRegex.test((ChangeEmailBox.value).toLowerCase()) != true) {
          var SaveButton = find("SaveSettingsButton");
          if (SaveButton != null) {
            setCSS(SaveButton, "display", "none");
          }
          ShowPopUp("Invalid Email", "Please enter a <b>valid email address</b> in case we need to contact you with any account issues.", [ ["Okay", "#618BFF", null] ]);
          return;
        }

        var SaveButton = find("SaveSettingsButton");
        if (SaveButton != null) {
          setCSS(SaveButton, "display", "flex");
        }
      }
    });

    
    var ChangePasswordHolder = createElement("ChangeEmailHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["display", "inline-block"],
        // ["display", "none"], // TEMP
        ["vertical-align", "top"],
        ["background-color", ContentColor],
        ["width", "calc(100% - 24px)"],
        ["padding", "6px 6px 0px 6px"],
        ["max-width", "300px"],
        ["margin-top", "12px"],
        ["border-radius", "12px"],
        ["overflow-x", "auto"]
    ]);

    var PasswordFieldsCSS = [
        ["position", "relative"],
        ["box-sizing", "border-box"],
        ["border-width", "0px"],
        ["background-color", ContentColorLayer3],
        ["width", "100%"],
        ["height", "41px"],
        ["min-width", "150px"],
        ["margin-bottom", "6px"],
        ["border-radius", "8px"],

        // Text:
        ["padding-left", "8px"],
        ["font-size", "20px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "left"],
        ["overflow", "auto"]
    ];

    createElement("OldPasswordBoxTitle", "div", ChangePasswordHolder, FieldTitleCSS).textContent = "Confirm Old Password";
    var OldPasswordBox = createElement("OldPasswordBox", "input", ChangePasswordHolder, PasswordFieldsCSS);
    OldPasswordBox.placeholder = "Old Password";
    OldPasswordBox.setAttribute("type", "password");
    OldPasswordBox.setAttribute("autocomplete", "new-password");
    OldPasswordBox.setAttribute("title", "Old Password");
    createElement("NewPasswordBoxTitle", "div", ChangePasswordHolder, FieldTitleCSS).textContent = "Create New Password";
    var NewPasswordBox = createElement("NewPasswordBox", "input", ChangePasswordHolder, PasswordFieldsCSS);
    NewPasswordBox.placeholder = "New Password";
    NewPasswordBox.setAttribute("type", "password");
    NewPasswordBox.setAttribute("autocomplete", "new-password");
    NewPasswordBox.setAttribute("title", "New Password");
    createElement("ConfirmNewPasswordTitle", "div", ChangePasswordHolder, FieldTitleCSS).textContent = "Confirm New Password";
    var ConfirmNewPasswordBox = createElement("ConfirmNewPasswordBox", "input", ChangePasswordHolder, PasswordFieldsCSS);
    ConfirmNewPasswordBox.placeholder = "Confirm New Password";
    ConfirmNewPasswordBox.setAttribute("type", "password");
    ConfirmNewPasswordBox.setAttribute("autocomplete", "new-password");
    ConfirmNewPasswordBox.setAttribute("title", " Confirm New Password");
    
    function IsValidPassword(Password) {
      // Password Verification:
      if (Password.length < 8) {
        ShowPopUp("Must be Longer", "A password must be at least 8 charecters long.", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
        return false;
      }
      if (Password.replace(/[^0-9]/g,"").length < 1) {
        ShowPopUp("Needs Numbers", "A password must have at least 1 number!", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
        return false;
      }
      if ((/[ !@#$%^&*()+\-_=\[\]{};':"\\|,.<>\/?]/).test(Password.toLowerCase()) == false) {
        ShowPopUp("Needs Symbol", "A password must have at least 1 symbol!", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
        return false;
      }

      return true;
    }
    function TestPasses() {
      var SaveButton = find("SaveSettingsButton");

      if (OldPasswordBox.value != "") {
        if (IsValidPassword(OldPasswordBox.value) == true) {
          if (NewPasswordBox.value != "") {
            if (IsValidPassword(NewPasswordBox.value) == true) {
              if (ConfirmNewPasswordBox.value != "") {
                if (ConfirmNewPasswordBox.value == NewPasswordBox.value) {
                  if (IsValidPassword(ConfirmNewPasswordBox.value) == true) {
                    setCSS(SaveButton, "display", "flex");
                    return;
                  }
                } else {
                  ShowPopUp("Doesn't Match", "The confirmed new password doesn't match the new password.", [ ["Okay", "#618BFF", null] ]);
                }
              }
            }
          }
        }
      }
      setCSS(SaveButton, "display", "none");
    }
    OldPasswordBox.addEventListener("focusout", function() {
      TestPasses();
    });
    NewPasswordBox.addEventListener("focusout", function() {
      TestPasses();
    });
    ConfirmNewPasswordBox.addEventListener("focusout", function() {
      TestPasses();
    });

    var DeleteAccountHolder = createElement("DeleteAccountHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["vertical-align", "top"],
        ["background-color", ContentColor],
        ["width", "calc(100% - 24px)"],
        ["padding", "6px 6px 6px 6px"],
        ["margin-bottom", "8px"],
        ["max-width", "300px"],
        ["margin-top", "12px"],
        ["border-radius", "12px"],
        ["overflow-x", "auto"]
    ]);
    
    createElement("DeleteAccountTitle", "div", DeleteAccountHolder, FieldTitleCSS).textContent = "Account Removal";
    createElement("DeleteAccountDescription", "div", DeleteAccountHolder, [
      ["position", "relative"],

      // Text:
      ["font-size", "12px"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", "#bbbbbb"],
      ["text-align", "left"],
      ["overflow", "auto"]
    ]).textContent = "Disabling your account hides all content from you while still allowing you to come back at any time. Deleting your account removes your account and all data associated with the account.";

    var DeleteButtonsCSS = [
      ["position", "relative"],
      ["display", "flex"],
      ["box-sizing", "border-box"],
      //["display", "inline-block"],
      ["background-color", ContentColorLayer3],
      ["border-style", "solid"],
      ["border-width", "2px"],
      ["border-color", "#FF5786"],
      //["height", "41px"],
      ["float", "left"],
      ["margin-right", "6px"],
      ["margin-top", "6px"],
      ["padding", "6px 12px 6px 12px"],
      //["min-width", "150px"],
      ["border-radius", "8px"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "16px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#FF5786"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"]
    ];

    var DisableAccountButton = createElement("DisableAccountButton", "div", DeleteAccountHolder, DeleteButtonsCSS);
    DisableAccountButton.textContent = "Disable Account";
    DisableAccountButton.addEventListener("mouseup", function() {
      ShowPopUp("Are You Sure?", "Disabling your account will hide all content from you while still allowing you to return at any time.", [ ["Confirm", "#FF5786", "DisableAccount"], ["Cancel", "#475059", null] ]);
    });
    var DeleteAccountButton = createElement("DeleteAccountButton", "div", DeleteAccountHolder, DeleteButtonsCSS);
    DeleteAccountButton.textContent = "Delete Account";
    DeleteAccountButton.addEventListener("mouseup", function() {
      ShowPopUp("ARE YOU SURE!?!", "Deleting your account will hide all content from you and after 30 days all data associated with you will be removed permanently.", [ ["Confirm", "#FF5786", "DeleteAccount"], ["Cancel", "#475059", null] ]);
    });

    return true;
  },

  ProfileScreen() {
    var BannerIsValid = true;
    var DescIsValid = true;

    var ChangeVisibleDataHolder = createElement("ChangeVisibleDataHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["vertical-align", "top"],
        ["background-color", ContentColorLayer3],
        ["width", "calc(100% - 24px)"],
        ["padding", "6px 6px 6px 6px"],
        ["margin-top", "6px"],
        ["border-radius", "12px"]
    ]);

    var BannerImageView = createElement("BannerImageView", "div", ChangeVisibleDataHolder, [
        ["background-color", ContentColor],
        ["width", "100%"],
        ["height", "150px"],
        ["object-fit", "cover"],
        ["border-radius", "8px"]
    ]);
    if (Settings != null && Settings.ProfileBanner != null) {
      setCSS(BannerImageView, "content", "url('" + GoogleCloudStorgeURL + "ProfileBanners/" + Settings.ProfileBanner + "')");
    }
    var BannerImageUpload = createElement("LoadImageButton", "input", BannerImageView, [
        ["position", "absolute"],
        ["height", "100%"],
        ["width", "100%"],
    ]);
    BannerImageUpload.setAttribute("type", "file");
    BannerImageUpload.setAttribute("accept", "image/*");
    BannerImageUpload.setAttribute("hidden", "true");
    BannerImageUpload.addEventListener('change', function(event) {
      var UploadedImage = event.target.files;
      if (UploadedImage != null && UploadedImage[0] != null) {
        if (SupportedImageTypes.includes(UploadedImage[0].type.replace(/image\//g, "")) == true) {
          if (UploadedImage[0].size < (5 * 1024 * 1024)+1) {  // No larger than 5 MB.
            var BlobURL = URL.createObjectURL(UploadedImage[0]);
            if (BannerImageView.hasAttribute("ImageBlobURL") == true) {
              URL.revokeObjectURL(BannerImageView.getAttribute("ImageBlobURL"));
            }
            setCSS(BannerImageView, "content", "url(" + BlobURL + ")");
            BannerImageView.setAttribute("ImageBlobURL", BlobURL);
            BannerIsValid = true;
            if (DescIsValid == true) {
              setCSS(SaveSettingsButton, "display", "flex");
            }
            return;
          } else {
            ShowPopUp("That's a lot of Bytes", "Banners must be under <b>5 MB</b> in size!", [ ["Okay", "#618BFF", null] ]);
          }
        } else {
          ShowPopUp("Invalid File Type", "Banners can't be a <b>" + (UploadedImage[0].type.substring(UploadedImage[0].type.indexOf("/")+1) || "file") + "</b> format.", [ ["Okay", "#618BFF", null] ]);
        }
      }
      BannerIsValid = false;
      setCSS(SaveSettingsButton, "display", "none");
    });

    var ChangeBannerButton = createElement("ChangeBannerButton", "div", ChangeVisibleDataHolder, [
        ["position", "relative"],
        ["display", "flex"],
        ["box-sizing", "border-box"],
        //["display", "inline-block"],
        ["width", "100%"],
        ["background-color", ContentColorLayer2],
        ["margin-top", "6px"],
        ["padding", "6px 12px 6px 12px"],
        ["border-radius", "8px"],
        ["cursor", "pointer"],

        // Text:
        ["font-size", "20px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "center"],
        ["justify-content", "center"],
        ["align-items", "center"]
    ]);
    ChangeBannerButton.textContent = "✏️ Change Banner";
    var ClickTime = Date.now();
    function PromptProfilePicUpload() {
      if (ClickTime+100 < Date.now()) {
        ClickTime = Date.now();
        BannerImageUpload.click();
      }
    }
    ChangeBannerButton.addEventListener("click", PromptProfilePicUpload);
    BannerImageView.addEventListener("click", PromptProfilePicUpload);

    var ChangeDescriptionHolder = createElement("ChangeDescriptionHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["vertical-align", "top"],
        ["background-color", ContentColor],
        ["width", "calc(100% - 24px)"],
        ["padding", "6px 6px 6px 6px"],
        ["margin-top", "12px"],
        ["margin-bottom", "12px"],
        ["border-radius", "12px"]
    ]);

    createElement("ChangeDescriptionBoxTitle", "div", ChangeDescriptionHolder, [
      ["position", "relative"],

      // Text:
      ["font-size", "16px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow", "auto"]
    ]).textContent = "Change Description";

    var NewDescriptionBox = createElement("NewDescriptionBox", "div", ChangeDescriptionHolder, [
        ["position", "relative"],
        ["box-sizing", "border-box"],
        ["border-width", "0px"],
        ["background-color", ContentColorLayer3],
        ["width", "100%"],
        ["max-height", "200px"],
        ["min-height", "48px"],
        ["margin-top", "6px"],
        ["border-radius", "8px"],

        // Text:
        ["padding-left", "8px"],
        ["font-size", "16px"],
        ["font-family", FontTypeA],
        ["font-weight", "500"],
        ["color", FontColorA],
        ["text-align", "left"],
        ["overflow", "auto"]
    ]);
    NewDescriptionBox.className = "StandardScroll";
    NewDescriptionBox.setAttribute("contenteditable", "true");
    NewDescriptionBox.setAttribute("onpaste", "return clipBoardRead(event)");
    NewDescriptionBox.setAttribute("title", "Change Description");
    
    var CharDescCount = createElement("CharDescCount", "div", ChangeDescriptionHolder, [
        ["position", "relative"],
        ["width", "calc(100% - 4px)"],
        ["height", "6px"],
        ["right", "4px"],
        ["margin-top", "4px"],
        ["margin-bottom", "5px"],
    
        // Text:
        ["font-size", "12px"],
        ["overflow-wrap", "break-word"],
        ["white-space", "pre-wrap"],
        ["font-family", FontTypeA],
        ["font-weight", "600"],
        ["color", "#bbbbbb"],
        ["text-align", "right"]
    ]);
    CharDescCount.textContent = "0 / 300";
    CharDescCount.setAttribute("title", "0 / 300 Max Characters");

    function UpdateDescCharTextCounter(SetChatText) {
      if (SetChatText == null) {
        CharDescCount.innerHTML = NewDescriptionBox.innerHTML.replace(/\<\/div\>/g, "\n");

        SetChatText = CharDescCount.textContent.length;
      }
      SetChatText += " / 300";
      CharDescCount.textContent = SetChatText;
      CharDescCount.setAttribute("title", SetChatText + " Max Characters");
    }

    NewDescriptionBox.addEventListener("input", (event) => {
      UpdateDescCharTextCounter();
    });

    NewDescriptionBox.addEventListener("focus", function() {
      if (NewDescriptionBox.textContent == "Talk About Yourself!" && getCSS(NewDescriptionBox, "color") == "#aaaaaa") {
        NewDescriptionBox.textContent = "";
        setCSS(NewDescriptionBox, "color", FontColorA);
        UpdateDescCharTextCounter(0);
      }
    });

    NewDescriptionBox.addEventListener("focusout", function() {
      var DescriptionText = NewDescriptionBox.innerText.replace(/\n\n/g, "\n").trim();
      var SaveButton = find("SaveSettingsButton");
      
      if (DescriptionText == "") {
        NewDescriptionBox.setAttribute("Edited", "");
        NewDescriptionBox.textContent = "Talk About Yourself!";
        setCSS(NewDescriptionBox, "color", "#aaaaaa");
      }
      if (DescriptionText.length > 300) {  // 300 max characters
        ShowPopUp("Text Overload", "Your description has to be under <b>300 characters</b> in length! (" + DescriptionText.length + "/300)", [ ["Okay", "#618BFF", null] ]);
        setCSS(SaveButton, "display", "none");
        DescIsValid = false;
        return;
      }

      NewDescriptionBox.setAttribute("Edited", "");

      DescIsValid = true;
      if (BannerIsValid == true) {
        setCSS(SaveButton, "display", "flex");
      }
    });

    var UserContentDesc = "Talk About Yourself!";
    /*
    if (ProfileData != null && ProfileData.Description != null) {
      UserContentDesc = CleanString(ProfileData.Description).replace(/\n/g, "<br/>");
    } else {
      setCSS(NewDescriptionBox, "color", "#aaaaaa");
    }
    */
    setCSS(NewDescriptionBox, "color", "#aaaaaa");
    NewDescriptionBox.innerHTML = UserContentDesc;
    /*
    if (UserContentDesc != "Talk About Yourself!") {
      NewDescriptionBox.innerHTML = NewDescriptionBox.innerHTML.replace(/\&nbsp\;/g, " ");
      UpdateDescCharTextCounter();
    }
    */

    var SocialLinksHolder = createElement("SocialLinksHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["vertical-align", "top"],
        ["background-color", ContentColor],
        ["width", "calc(100% - 24px)"],
        ["padding", "6px 6px 2px 6px"],
        ["margin-bottom", "6px"],
        ["border-radius", "12px"]
    ]);

    createElement("SocialLinksTitle", "div", SocialLinksHolder, [
      ["position", "relative"],

      // Text:
      ["font-size", "16px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"]
    ]).textContent = "Social Connections";

    createElement("AddSocialMediaDesc", "div", SocialLinksHolder, [
      ["position", "relative"],
      ["margin-top", "2px"],
      
      // Text:
      ["font-size", "12px"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", "#bbbbbb"],
      ["text-align", "left"]
    ]).textContent = "Click a Social Media below to add (Displayed Publicly):";

    var SocialLinkAddHolder = createElement("SocialLinkAddHolder", "div", SocialLinksHolder, [
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["gap", "4px"],
      ["width", "100%"],
      ["margin-top", "3px"]
    ]);

    function CreateSocialLink(SocialMedia, Color) {
      var AddSocialAccountB = createElement("AddAccount" + SocialMedia, "div", SocialLinkAddHolder, [
        ["box-sizing", "border-box"],
        ["width", "39px"],
        ["height", "39px"],
        ["padding", "4px"],
        ["background-color", Color],
        ["content", "url('./Images/SocialNetworks/" + SocialMedia + ".svg')"],
        ["border-radius", "6px"],
        ["cursor", "pointer"]
      ]);
      AddSocialAccountB.setAttribute("title", SocialMedia);
      AddSocialAccountB.addEventListener("mouseup", function() {
        SendRequest("SocialLinkAuthorize", { SocialSite: SocialMedia }, function (Metadata, Data) {
          if (Data.Code == 200) {
            var Left = (screen.width/2)-(500/2);
            var Top = (screen.height/2)-(600/2) - 100;
            if (MobileVersion != true) {
              window.open(Data.LoadOAuth, "SocialLinks", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=500, height=600, top=" + Top + ", left=" + Left);
            } else {
              window.open(Data.LoadOAuth);
            }
          }
        });
      });
    }
    var SocialLinkDataKeys = Object.keys(SocialLinkData);
    for (var i = 0; i < SocialLinkDataKeys.length; i++) {
      var SocialData = SocialLinkData[SocialLinkDataKeys[i]];
      CreateSocialLink(SocialData[0], SocialData[1]);
    }

    createElement("AddSocialMediaNote", "div", SocialLinksHolder, [
      ["position", "relative"],
      ["margin-top", "3px"],
      
      // Text:
      ["font-size", "12px"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", "#bbbbbb"],
      ["text-align", "left"]
    ]).innerHTML = "<b>Note:</b> Changing a username will require you to re-add.";

    createElement("ConnectedSocialLinksTitle", "div", SocialLinksHolder, [
      ["position", "relative"],
      ["margin-top", "12px"],

      // Text:
      ["font-size", "16px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"]
    ]).textContent = "Added Connections";
    var MaxConnectedCounter = createElement("MaxConnectedCounter", "div", SocialLinksHolder, [
      ["position", "relative"],
      
      // Text:
      ["font-size", "12px"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", "#bbbbbb"],
      ["text-align", "left"]
    ]);

    if (ProfileData != null && ProfileData.Socials != null) {
      var SocialKeys = Object.keys(ProfileData.Socials);
      MaxConnectedCounter.innerHTML = "<b>" + SocialKeys.length + "</b>/12 Accounts";
      for (var s = 0; s < SocialKeys.length; s++) {
        var MediaInfo = SocialKeys[s];
        var SocialData = SocialLinkData[MediaInfo.substring(0, MediaInfo.indexOf("_"))];
        
        var Tile = createElement("SocialConnectionTile" + MediaInfo, "div", SocialLinksHolder, [
          ["position", "relative"],
          ["display", "inline-block"],
          ["box-sizing", "border-box"],
          ["background-color", ContentColorLayer3],
          ["width", "100%"],
          ["padding", "5px"],
          ["margin-top", "3px"],
          ["border-radius", "8px"]
        ]);
        Tile.setAttribute("title", SocialData[0]);
        var ViewProfileB = createElement("SocialViewProfile" + MediaInfo, "a", Tile, [
          ["box-sizing", "border-box"],
          ["width", "30px"],
          ["height", "30px"],
          ["float", "left"],
          ["padding", "4px"],
          ["background-color", SocialData[1]],
          ["content", "url('./Images/SocialNetworks/" + SocialData[0] + ".svg')"],
          ["border-radius", "6px"],
          ["cursor", "pointer"]
        ]);
        var ConnectedMediaUsername = createElement("ConnectedMediaUsername" + MediaInfo, "a", Tile, [
          ["position", "relative"],
          ["display", "inline-block"],
          ["float", "left"],
          ["margin-left", "4px"],
          ["margin-top", "5.5px"],
          ["cursor", "pointer"],

          // Text:
          ["font-size", "16px"],
          ["font-family", FontTypeA],
          ["font-weight", "900"],
          ["text-decoration", "none"],
          ["color", FontColorA],
          ["text-align", "left"]
        ]);
        var SocialProfileName = ProfileData.Socials[MediaInfo];
        if (SocialData[3] != null) {
          SocialProfileName = SocialData[3] + SocialProfileName;
        }
        ConnectedMediaUsername.textContent = SocialProfileName;
        if (SocialData[2] != "PROMPT_USERNAME") {
          ViewProfileB.setAttribute("href", SocialData[2].replace(/USERID_GOES_HERE/g, MediaInfo.substring(MediaInfo.indexOf("_")+1)).replace(/USERNAME_GOES_HERE/g, ProfileData.Socials[MediaInfo]));
          ViewProfileB.setAttribute("target", "_blank");
          ConnectedMediaUsername.setAttribute("href", SocialData[2].replace(/USERID_GOES_HERE/g, MediaInfo.substring(MediaInfo.indexOf("_")+1)).replace(/USERNAME_GOES_HERE/g, ProfileData.Socials[MediaInfo]));
          ConnectedMediaUsername.setAttribute("target", "_blank");
        } else {
          ViewProfileB.setAttribute("onmouseup", 'ShowPopUp("' + SocialData[0] + '", "<i>' + ProfileData.Socials[MediaInfo] + '</i>", [ ["Close", "#618BFF"] ])');
          ConnectedMediaUsername.setAttribute("onmouseup", 'ShowPopUp("' + SocialData[0] + '", "<i>' + ProfileData.Socials[MediaInfo] + '</i>", [ ["Close", "#618BFF"] ])');
        }
        var RemoveConnectionB = createElement("RemoveConnectionB" + MediaInfo, "div", Tile, [
          ["position", "relative"],
          ["display", "inline-block"],
          ["background-color", "#FF4174"],
          ["padding", "4px 6px 4px 6px"],
          ["float", "right"],
          ["margin", "3px 3px 0px 0px"],
          ["cursor", "pointer"],
          ["border-radius", "6px"],

          // Text:
          ["font-size", "14px"],
          ["font-family", FontTypeA],
          ["font-weight", "900"],
          ["color", "#ffffff"],
          ["text-align", "left"]
        ]);
        RemoveConnectionB.textContent = "Remove";
        RemoveConnectionB.setAttribute("TypeRender", "RemoveSocialConnectionB");
        RemoveConnectionB.setAttribute("SocialID", MediaInfo);
      }
    } else {
      MaxConnectedCounter.innerHTML = "<b>0</b>/12 Accounts";
    }
  },
  
  DisplayScreen() {

    SaveNewSettings = JSON.parse(JSON.stringify(UserDisplaySettings));

    var SettingsData = {
      "Theme": ["Toggle", null, {
        "Dark Mode": true,
        "Light Mode": false
      }],
      "Embeds": ["MultiSelect", "Embeds are from 3rd Party Sites - which could track you or slow down your browser.", {
        "Embed YouTube Videos": true,
        "Embed Twitch Streams": true,
        "Embed Twitch Live Chat": true,
        "Embed GIFs": true,
        "Embed Scratch Games": true,
        "Embed code.org Projects": false,
      }]
    }

    var SettingsDataKeys = Object.keys(SettingsData);
    for (var i = 0; i < SettingsDataKeys.length; i++) {
      var Key = SettingsDataKeys[i];
      var Data = SettingsData[Key];

      var Holder = createElement("SettingsHolderTile", "div", SideBarSettingHolder, [
          ["position", "relative"],
          ["display", "inline-block"],
          ["vertical-align", "top"],
          ["background-color", ContentColor],
          ["width", "calc(100% - 24px)"],
          ["padding", "6px 6px 2px 6px"],
          ["max-width", "300px"],
          ["margin-bottom", "8px"],
          ["margin-top", "12px"],
          ["border-radius", "12px"],
          ["overflow", "hidden"]
      ]);
      createElement("SettingsTileTitle", "div", Holder, [
          ["position", "relative"],
          ["width", "100%"],

          // Text:
          ["padding-left", "6px"],
          ["font-size", "22px"],
          ["font-family", FontTypeA],
          ["font-weight", "900"],
          ["color", FontColorA],
          ["text-align", "left"]
      ]).textContent = Key;
      createElement("SettingsTileDesc", "div", Holder, [
          ["position", "relative"],
          ["width", "100%"],
          ["margin-bottom", "6px"],

          // Text:
          ["padding-left", "6px"],
          ["font-size", "14px"],
          ["font-family", FontTypeA],
          ["font-weight", "900"],
          ["color", "#bbbbbb"],
          ["text-align", "left"]
      ]).textContent = Data[1];
      var SettingKeys = Object.keys(Data[2]);
      for (var s = 0; s < SettingKeys.length; s++) {
        var Selected = SaveNewSettings[SettingKeys[s]] || false;
        if (Data[0] == "Toggle") {
          if (SettingKeys[s] == SaveNewSettings[Key]) {
            Selected = true;
          }
        }
        var TileButton = CreateSelectTile(Holder, SettingKeys[s], SettingKeys[s], Selected);
        function AddListener(Key, Holder, TileButton, SetKey, Type) {
          TileButton.addEventListener("mousedown", function() {
            if (Type == "Toggle") {
              var ChildrenTiles = Holder.childNodes;
              for (var c = 0; c < ChildrenTiles.length; c++) {
                var CircleSelect = ChildrenTiles[c].querySelector("#SelectCircle");
                if (CircleSelect != null) {
                  setCSS(CircleSelect, "background-color", ContentColorLayer3);
                }
              }
              var TileCircleSelect = TileButton.querySelector("#SelectCircle");
              if (TileCircleSelect != null) {
                setCSS(TileCircleSelect, "background-color", ThemeColor);
              }
              SaveNewSettings[Key] = SetKey;
            } else if (Type == "MultiSelect") {
              var TileCircleSelect = TileButton.querySelector("#SelectCircle");
              if (TileCircleSelect != null) {
                if (getCSS(TileCircleSelect, "background-color") == ContentColorLayer3) {
                  setCSS(TileCircleSelect, "background-color", ThemeColor);
                  SaveNewSettings[SetKey] = true;
                } else {
                  setCSS(TileCircleSelect, "background-color", ContentColorLayer3);
                  SaveNewSettings[SetKey] = false;
                }
              }
            }
            setCSS(find("SaveSettingsButton"), "display", "flex");
          });
        }
        AddListener(Key, Holder, TileButton, SettingKeys[s], Data[0]);
      }
    }
    
    /*
    CreateSelectTile(LightDarkModeHolder, "DarkModeSelect", "Dark Mode", true);
    CreateSelectTile(LightDarkModeHolder, "LightModeSelect", "Light Mode");

    var AllowedEmbedModeHolder = createElement("LightDarkModeHolder", "div", SideBarSettingHolder, DisplaySettingTileCSS);
    CreateSelectTile(AllowedEmbedModeHolder, "YouTubeSelect", "Embed YouTube Videos", true);
    CreateSelectTile(AllowedEmbedModeHolder, "TwitchStreamSelect", "Embed Twitch Streams", true);
    CreateSelectTile(AllowedEmbedModeHolder, "TwitchChatSelect", "Embed Twitch Live Chat", true);
    CreateSelectTile(AllowedEmbedModeHolder, "ScratchSelect", "Embed Scratch Games", true);
    CreateSelectTile(AllowedEmbedModeHolder, "CodeOrgSelect", "Embed code.org Projects", true);
    */
  },

  BlockedUsersScreen: function() {
    var TopBar = createElement("TopBar", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["width", "100%"],
        ["height", "50px"],
        ["background-color", ContentColor],
    ]);
    var TitleText = createElement("BlockedUserSettingsTitleText", "div", TopBar, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["max-width", "calc(100% - 100px)"],
        ["float", "left"],
        ["left", "12px"],
        ["top", "12px"],

        // Text:
        ["font-size", "24px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "left"]
    ]);
    TitleText.innerHTML = "Blocked Users  <span style='font-size: 16px; color: #dddddd '>0</span><span style='font-size: 13px; color: #888888'> /50</span>";
    TitleText.setAttribute("title", "There is currently a limit of 50 blocked users.");
    
    var UnblockAllButton = createElement("UnblockAllButton", "div", TopBar, [
        ["position", "relative"],
        ["display", "none"],
        ["background-color", "#618BFF"],
        ["padding-left", "6px"],
        ["padding-right", "6px"],
        ["padding-top", "4px"],
        ["padding-bottom", "4px"],
        ["border-radius", "8px"],
        ["float", "right"],
        ["right", "10.5px"],
        ["top", "11px"],
        ["cursor", "pointer"],

        // Text:
        ["font-size", "18px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#ffffff"],
        ["text-align", "left"]
    ]);
    UnblockAllButton.addEventListener("mouseup", function(event) {
      if (event.button != 0) {
        return;
      }
      UnblockUsers("ALL");
    });
    UnblockAllButton.textContent = "Unblock All";

    var BlockedHolder = createElement("SettingsBlockedHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["width", "100%"],
        ["height", "calc(100% - 56px)"],
        ["margin", "0px"],
        ["padding-bottom", "6px"],
        ["overflow-y", "auto"]
    ]);
    BlockedHolder.className = "StandardScroll";
    BlockedHolder.addEventListener("mouseup", function(event) {
      if (event.button != 0) {
        return;
      }

      var Path = event.path || (event.composedPath && event.composedPath());

      if (Path[0].hasAttribute("UnblockButton")) {
        UnblockUsers([Path[0].getAttribute("UnblockButton")]);
      }
    });

    createElement("NobodyBlockedMessage", "div", BlockedHolder, [
        ["position", "relative"],
        ["width", "calc(100% - 30px)"],
        ["left", "15px"],
        ["margin-top", "6px"],

        // Text:
        ["font-size", "16px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#aaaaaa"],
        ["text-align", "center"]
    ]).textContent = "Loading blocked users... Please wait...";

    GetBlockedUsers();
  },

  SessionsScreen: function() {
    var TopBar = createElement("TopBar", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["width", "100%"],
        ["height", "50px"],
        ["background-color", ContentColor],
    ]);
    var TitleText = createElement("SessionSettingsTitleText", "div", TopBar, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["max-width", "calc(100% - 100px)"],
        ["float", "left"],
        ["left", "12px"],
        ["top", "12px"],

        // Text:
        ["font-size", "24px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "left"]
    ]);
    TitleText.textContent = "Active Sessions";
    TitleText.setAttribute("title", "All active sessions on this account.");
    
    var SignOutAllButton = createElement("SignOutAllButton", "div", TopBar, [
        ["position", "relative"],
        //["display", "none"],
        ["background-color", "#618BFF"],
        ["padding-left", "6px"],
        ["padding-right", "6px"],
        ["padding-top", "4px"],
        ["padding-bottom", "4px"],
        ["border-radius", "8px"],
        ["float", "right"],
        ["right", "10.5px"],
        ["top", "11px"],
        ["cursor", "pointer"],

        // Text:
        ["font-size", "18px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#ffffff"],
        ["text-align", "left"]
    ]);
    SignOutAllButton.addEventListener("mouseup", function(event) {
      if (event.button != 0) {
        return;
      }
      LogoutDevice("ALL");
    });
    SignOutAllButton.textContent = "Sign Out All";

    var SessionHolder = createElement("SettingsSessionHolder", "div", SideBarSettingHolder, [
        ["position", "relative"],
        ["width", "100%"],
        ["height", "calc(100% - 56px)"],
        ["margin", "0px"],
        ["padding-bottom", "6px"],
        ["overflow-y", "auto"]
    ]);
    SessionHolder.className = "StandardScroll";
    SessionHolder.addEventListener("mouseup", function(event) {
      if (event.button != 0) {
        return;
      }

      var Path = event.path || (event.composedPath && event.composedPath());

      if (Path[0].hasAttribute("SignOutButton")) {
        LogoutDevice(Path[0].getAttribute("SignOutButton"));
      }
    });
    
    createElement("LoadingSessionsMessage", "div", SessionHolder, [
        ["position", "relative"],
        ["width", "calc(100% - 30px)"],
        ["left", "15px"],
        ["margin-top", "6px"],

        // Text:
        ["font-size", "16px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#aaaaaa"],
        ["text-align", "center"]
    ]).textContent = "Loading sessions... Please wait...";

    GetActiveSessions();
  }
};


var BackBlur = createElement("SettingsBackBlur", "div", "body", [
    ["position", "fixed"],
    ["width", "100%"],
    ["height", "100%"],
    ["backdrop-filter", "blur(4px)"],
    ["-webkit-backdrop-filter", "blur(4px)"],
    ["left", "0px"],
    ["top", "0px"],
    ["z-index", "999"]
]);
var SettingFrame = createElement("SettingFrame", "div", BackBlur, [
    ["position", "relative"],
    ["width", "100%"],
    ["height", "100%"],
    ["max-width", "560px"],
    ["max-height", "400px"],
    ["background-color", ContentColorLayer3],
    ["border-style", "solid"],
    ["border-radius", "12px"],
    ["border-color", BorderColor],
    ["border-width", "4px"],
    ["left", "50%"],
    ["top", "50%"],
    ["transform", "translate(-50%, -50%)"],
    ["overflow", "hidden"]
]);
var TopRibbon = createElement("TopRibbon", "div", SettingFrame, [
    ["position", "relative"],
    ["width", "100%"],
    ["height", "60px"],
    ["left", "0px"],
    ["top", "0px"]
]);
var TitleText = createElement("TitleText", "div", TopRibbon, [
    ["position", "relative"],
    ["width", "calc(100% - 100px)"],
    ["left", "10px"],
    ["top", "10px"],

    // Text:
    ["font-size", "40px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA]
]).textContent = "Settings";

SaveSettingsButton = createElement("SaveSettingsButton", "div", TopRibbon, [
    ["position", "absolute"],
    ["display", "none"],
    ["height", "43px"],
    ["padding-top", "2px"],
    ["right", "61px"],
    ["top", "8px"],
    ["padding", "0px 8px 0px 8px"],
    ["background-color", ThemeColor],
    ["border-radius", "12px"],
    ["cursor", "pointer"],

    // Text:
    ["font-size", "24px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", "#ffffff"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"]
]);
SaveSettingsButton.textContent = "Save";
SaveSettingsButton.onclick = async function() {
  setCSS(SaveSettingsButton, "display", "none");
  var SendBlobURL = null;
  var SaveLocalStorage = null;

  var SaveData = [];
  if (CurrentScreen == "AccountScreen") {
    var ProfilePicView = find("ProfilePicture");
    if (ProfilePicView.hasAttribute("ImageBlobURL") == true) {
      SendBlobURL = ProfilePicView.getAttribute("ImageBlobURL");
      SaveData.push({
        Change: "ProfilePic"
      });
    }
    var ChangeUsernameBox = find("ChangeUsernameTextBox");
    if (ChangeUsernameBox.value != "" && ChangeUsernameBox.value != Username) {
      var InvalidUsername = false;

      // Username Verification:
      if (ChangeUsernameBox.value.length < 3 || ChangeUsernameBox.value.length > 16) {
        InvalidUsername = true;
      }
      if (ChangeUsernameBox.value.replace(/[^A-Za-z0-9_-]/g, "") != ChangeUsernameBox.value) {
        InvalidUsername = true;
      }

      if (InvalidUsername == false) {
        SaveData.push({
          Change: "Username",
          Username: ChangeUsernameBox.value,
        });
      } else {
        setCSS(SaveSettingsButton, "display", "none");
        ShowPopUp("Invalid Username!", "This username is invalid. Usernames must be <b>longer</b> than <b>3 characters</b>, <b>not</b> contain any <b>symbols</b>, while being <b>shorter</b> than <b>16 characters</b>.", [ ["Okay", "#618BFF", null] ]);
        return;
      }
    }
    var ChangeEmailBox = find("ChangeEmailBox");
    if (ChangeEmailBox.value != "") {
      // Basic EMAIL Varification:
      // Credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      const VerifyEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (VerifyEmailRegex.test((ChangeEmailBox.value).toLowerCase()) == true) {
        SaveData.push({
          Change: "Email",
          Email: ChangeEmailBox.value,
        });
      } else {
        setCSS(SaveSettingsButton, "display", "none");
        ShowPopUp("Invalid Email", "Please enter a <b>valid email address</b> in case we need to contact you with any account issues.", [ ["Okay", "#618BFF", null] ]);
        return;
      }
    }
    var OldPasswordBox = find("OldPasswordBox");
    if (OldPasswordBox.value != "") {
      var NewPasswordBox = find("NewPasswordBox");
      if (NewPasswordBox.value != "") {
        var ConfirmNewPasswordBox = find("ConfirmNewPasswordBox");
        if (ConfirmNewPasswordBox.value != "") {
          function IsValidPassword(Password) {
            // Password Verification:
            if (Password.length < 8) {
              ShowPopUp("Must be Longer", "A password must be at least 8 charecters long.", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
              return false;
            }
            if (Password.replace(/[^0-9]/g,"").length < 1) {
              ShowPopUp("Needs Numbers", "A password must have at least 1 number!", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
              return false;
            }
            if ((/[ !@#$%^&*()+\-_=\[\]{};':"\\|,.<>\/?]/).test(Password.toLowerCase()) == false) {
              ShowPopUp("Needs Symbol", "A password must have at least 1 symbol!", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
              return false;
            }

            return true;
          }
          var AreValidPasswords = IsValidPassword(OldPasswordBox.value) && IsValidPassword(NewPasswordBox.value) && IsValidPassword(ConfirmNewPasswordBox.value);

          if (NewPasswordBox.value != ConfirmNewPasswordBox.value) {
            ShowPopUp("Doesn't Match", "The confirmed new password doesn't match the new password.", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
            setCSS(SaveSettingsButton, "display", "none");
            return;
          }

          if (AreValidPasswords == true) {
            SaveData.push({
              Change: "Password",
              OldPass: OldPasswordBox.value,
              NewPass: NewPasswordBox.value
            });
          } else {
            setCSS(SaveSettingsButton, "display", "none");
            return;
          }
        }
      }
    }
  } else if (CurrentScreen == "ProfileScreen") {
    var BannerImageView = find("BannerImageView");
    if (BannerImageView.hasAttribute("ImageBlobURL") == true) {
      SendBlobURL = BannerImageView.getAttribute("ImageBlobURL");
      SaveData.push({
        Change: "ProfileBanner"
      });
    }
    var NewDescriptionBox = find("NewDescriptionBox");
    if (NewDescriptionBox.hasAttribute("Edited")) {
      //NewDescriptionBox.innerHTML = NewDescriptionBox.innerHTML.replace(new RegExp("<b/>", "g"), "\n\n");
      var NewDescText = NewDescriptionBox.innerText.replace(/\n\n/g, "\n").trim();
      if (NewDescriptionBox.textContent == "Talk About Yourself!" && getCSS(NewDescriptionBox, "color") == "#aaaaaa") {
        NewDescText = "";
      }
      if (NewDescText.length < 301) {  // 300 max characters
        SaveData.push({
          Change: "ProfileDescription",
          NewText: NewDescText
        });
      }
    }
  } else if (CurrentScreen == "DisplayScreen") {
    SaveLocalStorage = SaveNewSettings;
    SaveData.push({ Change: "DisplaySettings", NewSettings: SaveNewSettings });
  }

  SaveAccountData(SaveData, SendBlobURL, CurrentScreen, SaveLocalStorage);
}

var CloseSettings = createElement("CloseSettings", "div", TopRibbon, [
    ["position", "absolute"],
    ["display", "flex"],
    ["width", "45px"],
    ["height", "43px"],
    ["padding-top", "2px"],
    ["right", "8px"],
    ["top", "8px"],
    ["background-color", "rgba(0, 0, 0, 0.45)"],
    ["border-radius", "12px"],
    ["cursor", "pointer"],

    // Text:
    ["font-size", "40px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", "#ffffff"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"]
]);
CloseSettings.innerHTML = "&times;";
CloseSettings.onclick = function() {
  BackBlur.remove();
  removeScript("./Settings.js");
  RevertTitle();
}

var MainHolder = createElement("MainHolder", "div", SettingFrame, [
    ["position", "relative"],
    ["display", "inline-block"],
    ["width", "100%"],
    ["height", "calc(100% - 72px)"],
    ["margin-top", "12px"],
]);

var SidebarSettingSectionHolder = createElement("SidebarSettingSectionHolder", "div", MainHolder, [
    ["position", "relative"],
    ["display", "inline-block"],
    ["width", "30%"],
    ["height", "100%"],
    ["border-top-right-radius", "16px"],
    ["background-color", ContentColor],
    ["overflow-y", "auto"],
    ["justify-content", "center"]
]);
SidebarSettingSectionHolder.className = "StandardScroll";

function CreateSideBarSettingHolder() {
  setCSS(find("SaveSettingsButton"), "display", "none");
  if (SideBarSettingHolder != null) {
    SideBarSettingHolder.remove()
  }
  SideBarSettingHolder = createElement("SideBarSettingHolder", "div", MainHolder, [
      ["position", "relative"],
      ["display", "block"],
      ["float", "right"],
      ["width", "calc(70% - 8px)"],
      ["height", "100%"],
      ["border-top-left-radius", "16px"],
      ["background-color", ContentColorLayer2],
      ["margin-left", "8px"],
      ["text-align", "center"],
      ["overflow", "hidden"],
      ["overflow-y", "auto"]
  ]);
  SideBarSettingHolder.className = "StandardScroll";
}
CreateSideBarSettingHolder();

var DisplaySettingButtonCSS = [
    ["position", "relative"],
    ["max-width", "calc(95% - 12px)"],
    ["margin-left", "12px"],
    ["margin-top", "12px"],
    ["cursor", "pointer"],
    
    // Text:
    ["font-size", "18px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA]
];

var AccountSettingB = createElement("AccountSettingB", "div", SidebarSettingSectionHolder, DisplaySettingButtonCSS);
AccountSettingB.textContent = "Account";
AccountSettingB.setAttribute("onMouseOver", "this.style.textDecoration = 'underline'");
AccountSettingB.setAttribute("onMouseOut", "this.style.textDecoration = 'none'");
AccountSettingB.addEventListener("click", function() {
  CreateSideBarSettingHolder();
  CurrentScreen = "AccountScreen";
  SettingScreens.AccountScreen();
});

if (LoadScriptMetadata == null) {
  SettingScreens.AccountScreen();
} else {
  if (SettingScreens[LoadScriptMetadata] != null) {
    CurrentScreen = LoadScriptMetadata;
    SettingScreens[LoadScriptMetadata]();
  } else {
    SettingScreens.AccountScreen();
  }
}

var ProfileSettingB = createElement("ProfileSettingB", "div", SidebarSettingSectionHolder, DisplaySettingButtonCSS);
ProfileSettingB.textContent = "Profile";
ProfileSettingB.setAttribute("onMouseOver", "this.style.textDecoration = 'underline'");
ProfileSettingB.setAttribute("onMouseOut", "this.style.textDecoration = 'none'");
ProfileSettingB.addEventListener("click", function() {
  CreateSideBarSettingHolder();
  CurrentScreen = "ProfileScreen";
  SettingScreens.ProfileScreen();
});

var DisplaySettingB = createElement("DisplaySettingB", "div", SidebarSettingSectionHolder, DisplaySettingButtonCSS);
DisplaySettingB.textContent = "Display";
DisplaySettingB.setAttribute("onMouseOver", "this.style.textDecoration = 'underline'");
DisplaySettingB.setAttribute("onMouseOut", "this.style.textDecoration = 'none'");
DisplaySettingB.addEventListener("click", function() {
  CreateSideBarSettingHolder();
  CurrentScreen = "DisplayScreen";
  SettingScreens.DisplayScreen();
});

var BlockedSettingB = createElement("BlockedSettingB", "div", SidebarSettingSectionHolder, DisplaySettingButtonCSS);
BlockedSettingB.textContent = "Blocked Users";
BlockedSettingB.setAttribute("onMouseOver", "this.style.textDecoration = 'underline'");
BlockedSettingB.setAttribute("onMouseOut", "this.style.textDecoration = 'none'");
BlockedSettingB.addEventListener("click", function() {
  CreateSideBarSettingHolder();
  CurrentScreen = "BlockedUsersScreen";
  SettingScreens.BlockedUsersScreen();
});

var CurrentLoginsSettingB = createElement("CurrentLoginsSettingB", "div", SidebarSettingSectionHolder, DisplaySettingButtonCSS);
CurrentLoginsSettingB.textContent = "Active Sessions";
CurrentLoginsSettingB.setAttribute("onMouseOver", "this.style.textDecoration = 'underline'");
CurrentLoginsSettingB.setAttribute("onMouseOut", "this.style.textDecoration = 'none'");
CurrentLoginsSettingB.addEventListener("click", function() {
  CreateSideBarSettingHolder();
  CurrentScreen = "SessionsScreen";
  SettingScreens.SessionsScreen();
});