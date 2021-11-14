var UserDetails = {};

var EmojiEditorLoadSource = null;
var EmojiEditorOpen = false;

function clipBoardRead(e) {
  e.preventDefault();
  document.execCommand('inserttext', false, e.clipboardData.getData("text/plain"));
}

var HighlightChars = {
  "http://": {
    Type: "Link",
    Style: "color: #3D87FF; font-style: italic;",
    MustInclude: ".",
    OtherEndings: false
  }, //["Link", "color: #3D87FF; font-style: italic", ".", false],
  "https://": {
    Type: "Link",
    Style: "color: #3D87FF; font-style: italic;",
    MustInclude: ".",
    OtherEndings: false
  }, //["Link", "color: #3D87FF; font-style: italic", ".", false],
  "www.": {
    Type: "Link",
    Style: "color: #3D87FF; font-style: italic;",
    MustInclude: ".",
    OtherEndings: false
  }, //["Link", "color: #3D87FF; font-style: italic", ".", false],

  "@": {
    Type: "Mention",
    Style: "color: #FE5D6A; font-style: bold;",
    MustInclude: "",
    OtherEndings: true
  }, //["Ping", "color: #FE5D6A; font-style: bold", "", true],
  "/Post_": {
    Type: "Quote",
    Style: "color: #C95EFF; font-style: bold;",
    MustInclude: "",
    OtherEndings: true
  }, //["Quote", "color: #C95EFF; font-style: bold", "", true],
  "/Chat_": {
    Type: "ChatLoad",
    Style: "color: #2AF5B5; font-style: bold;",
    MustInclude: "",
    OtherEndings: true
  },
  "/User_": {
    Type: "UserLoad",
    Style: "color: " + ThemeColor + "; font-style: bold;",
    MustInclude: "",
    OtherEndings: true
  },

  "(!": {
    Type: "Bold",
    Style: "font-weight: 900;",
    MustInclude: "",
    EndChar: ")",
    OtherEndings: false,
    IncludeKeys: false
  }, //["Bold", "font-style: bold", "", false, ")"],
  "(*": {
    Type: "Italic",
    Style: "font-style: italic;",
    MustInclude: "",
    EndChar: ")",
    OtherEndings: false,
    IncludeKeys: false
  }, //["Italic", "font-style: italic", "", false, ")"],
  "(_": {
    Type: "Bold",
    Style: "text-decoration: underline;",
    MustInclude: "",
    EndChar: ")",
    OtherEndings: false,
    IncludeKeys: false
  },
  "(-": {
    Type: "Bold",
    Style: "text-decoration: line-through;",
    MustInclude: "",
    EndChar: ")",
    OtherEndings: false,
    IncludeKeys: false
  },
  "(`": {
    Type: "Code",
    Tag: "code",
    Style: "background-color: " + ContentColorLayer3 + "",
    MustInclude: "",
    EndChar: ")",
    OtherEndings: false,
    IncludeKeys: false
  },

  "emoji[": {
    Type: "Emoji",
    EndChar: "]",
    OtherEndings: false,
    IncludeKeys: false,
    HideKeysOnCreate: true
  },
  //" ": ["Text", ""],
};

var OtherEnds = ["!", "?", ".", ",", ":", "&#63;"];

var LoginForm = createElement("LoginForm", "div", "MainContent", [
    ["position", "relative"],
    ["display", "block"],
    ["width", "100%"],
    //["max-height", "calc(100vh - 16px)"],
    ["margin-top", "8px"],
    ["background-color", ContentColor],
    ["z-index", "20"],
    ["border-radius", "12px"],

    // ["background-image", "url('https://images.assetsdelivery.com/compings_v2/robisklp/robisklp1505/robisklp150500009.jpg')"],
    // ["background-size", "cover"],
    // ["filter", "brightness(80%)"],
    // ["repeat", "none"],

    ["overflow-y", "hidden"]
]);
LoginForm.setAttribute("Solid", "true");

var RightImageHolder = null;
function AddSplashImage() {
  if (RightImageHolder != null) {
    RightImageHolder.remove();
  }
  RightImageHolder = createElement("RightImageHolder", "div", LoginForm, [
      ["position", "relative"],
      ["flex", "1"],
      ["overflow", "hidden"]
  ]);
  createElement("RightImage", "div", RightImageHolder, [
      ["position", "relative"],
      //["width", "100%"],
      ["height", "100%"],
      ["top", "0px"],
      ["left", "0px"],
      ["background-size", "cover"],
      ["repeat", "none"],
      ["background-image", "url('./Images/PhotopBackgroundImage1.svg')"],
  ]);
  createElement("RightImageSlogan", "div", RightImageHolder, [
      ["position", "absolute"],
      ["width", "100%"],
      ["height", "100%"],
      ["top", "0px"],
      ["left", "0px"],
      //["background-size", "cover"],
      ["repeat", "none"],
      ["content", "url('./Images/PhotopSloganImage1.svg')"],
      //["overflow", "hidden"]
  ]);
}

var LeftColumn = null;
function StartSignIn() {
  SwitchPage("Home");

  if (LeftColumn != null) {
    LeftColumn.remove();
  }

  LeftColumn = createElement("LeftColumn", "div", LoginForm, [
    ["position", "relative"],
    ["float", "left"],
    ["flex", "1.25 auto"],
    ["height", "100%"],
    ["max-width","350px"],
    ["top", "1px"],
    ["left", "0px"],
    ["overflow", "hidden"],
    ["overflow-y", "auto"]
  ]);
  LeftColumn.className = "StandardScroll";
  
  var FirstLine = createElement("FirstLine", "div", LeftColumn, [
      ["position", "relative"],
      ["width", "100%"],
      ["height", "45px"],
      ["margin-top", "8px"],
      ["text-align", "center"],
      ["white-space", "nowrap"]
  ]);
  createElement("PhotopLogoImg", "div", FirstLine, [
      ["position", "relative"],
      ["display", "inline"],
      ["height", "100%"],
      ["vertical-align", "center"],

      ["content", "url(./Images/PhotopLogo1.svg)"]
  ]);
  createElement("ExotekLoginText", "div", FirstLine, [
      ["position", "relative"],
      ["display", "inline"],
      ["max-height", "100%"],
      ["margin-left", "8px"],
      ["vertical-align", "top"],

      // Text:
      ["font-size", "36px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
  ]).textContent = "Login";

  var LoginFields = createElement("LoginFields", "form", LeftColumn, [
      ["position", "relative"],
      ["width", "100%"],
      ["margin-top", "16px"],
      ["text-align", "center"],
      ["white-space", "nowrap"]
  ]);

  createElement("UsernameFieldTitle", "div", LoginFields, [
      ["position", "relative"],
      ["width", "calc(70% - 8px)"],
      ["left", "15%"],
      ["background-color", ContentColorLayer3],
      ["border-top-left-radius", "10px"],
      ["border-top-right-radius", "10px"],

      // Text:
      ["padding-left", "8px"],
      ["font-size", "20px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
  ]).textContent = "Username";

  var TextFieldSignInUsername = createElement("TextFieldSignInUsername", "input", LoginFields, [
      ["position", "relative"],
      ["display", "block"],
      ["width", "70%"],
      ["box-sizing", "border-box"],
      ["padding-top", "6px"],
      ["padding-bottom", "6px"],
      ["height", "40px"],
      ["min-width", "70%"],
      ["min-height", "40px"],
      ["left", "15%"],
      ["background-color", ContentColorLayer2],
      ["border-width", "0px"],
      ["border-bottom-left-radius", "10px"],
      ["border-bottom-right-radius", "10px"],

      // Text:
      ["padding-left", "8px"],
      ["font-size", "26px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow", "auto"]
  ]);
  TextFieldSignInUsername.placeholder = "Username";
  TextFieldSignInUsername.setAttribute("title", "Username");

  createElement("PasswordFieldTitle", "div", LoginFields, [
      ["position", "relative"],
      ["width", "calc(70% - 8px)"],
      ["left", "15%"],
      ["margin-top", "8px"],
      ["background-color", ContentColorLayer3],
      ["border-top-left-radius", "10px"],
      ["border-top-right-radius", "10px"],

      // Text:
      ["padding-left", "8px"],
      ["font-size", "20px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
  ]).textContent = "Password";
  var TextFieldSignInPassword = createElement("TextFieldSignInPassword", "input", LoginFields, [
      ["position", "relative"],
      ["display", "block"],
      ["width", "70%"],
      ["box-sizing", "border-box"],
      ["padding-top", "6px"],
      ["padding-bottom", "6px"],
      ["height", "40px"],
      ["min-width", "70%"],
      ["min-height", "40px"],
      ["left", "15%"],
      ["background-color", ContentColorLayer2],
      ["border-width", "0px"],
      ["border-bottom-left-radius", "10px"],
      ["border-bottom-right-radius", "10px"],

      // Text:
      ["padding-left", "8px"],
      ["font-size", "26px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow", "auto"]
  ]);
  TextFieldSignInPassword.placeholder = "Password";
  TextFieldSignInPassword.setAttribute("type", "password");
  TextFieldSignInPassword.setAttribute("title", "Password");

  var SignInButton = createElement("SignInButton", "div", LoginFields, [
      ["position", "relative"],
      ["display", "inline-flex"],
      ["height", "35px"],
      ["width", "106px"],
      ["margin", "10px 5px 10px 0px"],
      ["background-color", ThemeColor],
      ["border-radius", "8px"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "26px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"],
  ]);
  SignInButton.textContent = "Sign In";
  SignInButton.setAttribute("title", "Sign In");
  var SignUpTransfer = createElement("SignUpTransferButton", "div", LoginFields, [
      ["position", "relative"],
      ["display", "inline-flex"],
      ["height", "35px"],
      ["width", "106px"],
      ["margin", "10px 0px 10px 5px"],
      ["background-color", "#2AF5B5"],
      ["border-radius", "8px"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "26px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"]
  ]);
  SignUpTransfer.textContent = "Sign Up";
  SignUpTransfer.setAttribute("title", "Sign Up");
  SignUpTransfer.addEventListener("click", function() {
    StartSignUp();
  });

  SignInButton.addEventListener("click", function() {
    LoginToAccount({Username: TextFieldSignInUsername.value, Password: TextFieldSignInPassword.value});
  });
  TextFieldSignInPassword.addEventListener("keyup", function(event) {
    if (event.which === 13 && event.shiftKey === false) {
      LoginToAccount({Username: TextFieldSignInUsername.value, Password: TextFieldSignInPassword.value});
    }
  });

  AddSplashImage();
}


var TextFieldSignUpEmail = null;
var TextFieldSignUpUsername = null;
var TextFieldSignUpPassword = null;
function SetFocusSignUpEmail() {
  if (TextFieldSignUpEmail != null) {
    TextFieldSignUpEmail.focus();
  }
}
function SetFocusSignUpUsername() {
  if (TextFieldSignUpUsername != null) {
    TextFieldSignUpUsername.focus();
  }
}
function SetFocusSignUpPassword() {
  if (TextFieldSignUpPassword != null) {
    TextFieldSignUpPassword.focus();
  }
}

function StartSignUp() {
  SwitchPage("Home");
  if (LeftColumn != null) {
    LeftColumn.remove();
  }

  LeftColumn = createElement("LeftColumn", "div", LoginForm, [
      ["position", "relative"],
      ["float", "left"],
      ["flex", "1.25 auto"],
      ["height", "100%"],
      ["max-width","350px"],
      ["top", "1px"],
      ["left", "0px"],
      ["overflow", "hidden"],
      ["overflow-y", "auto"]
  ]);
  LeftColumn.className = "StandardScroll";

  var FirstLine = createElement("FirstLine", "div", LeftColumn, [
      ["position", "relative"],
      ["width", "100%"],
      ["height", "45px"],
      ["margin-top", "8px"],
      ["text-align", "center"],
      ["white-space", "nowrap"]
  ]);
  createElement("PhotopLogoImg", "div", FirstLine, [
      ["position", "relative"],
      ["display", "inline"],
      ["height", "100%"],
      ["vertical-align", "center"],

      ["content", "url(./Images/PhotopLogo1.svg)"]
  ]);
  createElement("ExotekLoginText", "div", FirstLine, [
      ["position", "relative"],
      ["display", "inline"],
      ["max-height", "100%"],
      ["margin-left", "8px"],
      ["vertical-align", "top"],

      // Text:
      ["font-size", "36px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
  ]).textContent = "Sign Up";

  var LoginFields = createElement("LoginFields", "form", LeftColumn, [
      ["position", "relative"],
      ["width", "100%"],
      ["margin-top", "16px"],
      ["text-align", "center"]
  ]);


  createElement("EmailFieldTitle", "div", LoginFields, [
      ["position", "relative"],
      ["width", "calc(70% - 8px)"],
      ["left", "15%"],
      ["background-color", ContentColorLayer3],
      ["border-top-left-radius", "10px"],
      ["border-top-right-radius", "10px"],
      

      // Text:
      ["padding-left", "8px"],
      ["font-size", "20px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
  ]).textContent = "Add Email";
  TextFieldSignUpEmail = createElement("TextFieldSignUpEmail", "input", LoginFields, [
      ["position", "relative"],
      ["display", "block"],
      ["width", "70%"],
      ["box-sizing", "border-box"],
      ["padding-top", "6px"],
      ["padding-bottom", "6px"],
      ["height", "40px"],
      ["min-width", "70%"],
      ["min-height", "40px"],
      ["left", "15%"],
      ["background-color", ContentColorLayer2],
      ["border-width", "0px"],
      ["border-bottom-left-radius", "10px"],
      ["border-bottom-right-radius", "10px"],

      // Text:
      ["padding-left", "8px"],
      ["font-size", "26px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow", "auto"]
  ]);
  TextFieldSignUpEmail.placeholder = "Email";
  TextFieldSignUpEmail.setAttribute("type", "email");
  TextFieldSignUpEmail.setAttribute("title", "Email");

  /*
  createElement("Info", "div", LoginFields, [
      ["position", "relative"],
      ["display", "block"],
      ["box-sizing", "border-box"],
      ["width", "80%"],
      //["height", "50px"],
      ["left", "10%"],
      ["margin-top", "6px"],
      ["margin-bottom", "12px"],
      ["background-color", ContentColorLayer3],
      ["border-radius", "10px"],
      

      // Text:
      ["padding-top", "6px"],
      ["padding-bottom", "6px"],
      ["padding-left", "6px"],
      ["padding-right", "6px"],
      ["font-size", "12px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#bbbbbb"],
      //["overflow-wrap", "break-word"],
      ["text-align", "center"],
  ]).innerHTML = "We recommend you add your email so that we can contact you about any account issues!";
  */
  
  createElement("UsernameFieldTitle", "div", LoginFields, [
      ["position", "relative"],
      ["width", "calc(70% - 8px)"],
      ["left", "15%"],
      ["margin-top", "8px"],
      ["background-color", ContentColorLayer3],
      ["border-top-left-radius", "10px"],
      ["border-top-right-radius", "10px"],
      

      // Text:
      ["padding-left", "8px"],
      ["font-size", "20px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
  ]).textContent = "Create Username";
  TextFieldSignUpUsername = createElement("TextFieldSignUpUsername", "input", LoginFields, [
      ["position", "relative"],
      ["display", "block"],
      ["box-sizing", "border-box"],
      ["width", "70%"],
      ["padding-top", "6px"],
      ["padding-bottom", "6px"],
      ["height", "40px"],
      ["min-width", "70%"],
      ["min-height", "40px"],
      ["left", "15%"],
      ["background-color", ContentColorLayer2],
      ["border-width", "0px"],
      ["border-bottom-left-radius", "10px"],
      ["border-bottom-right-radius", "10px"],

      // Text:
      ["padding-left", "8px"],
      ["font-size", "26px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow", "auto"]
  ]);
  TextFieldSignUpUsername.placeholder = "Username";
  TextFieldSignUpUsername.setAttribute("title", "Username");

  createElement("PasswordFieldTitle", "div", LoginFields, [
      ["position", "relative"],
      ["width", "calc(70% - 8px)"],
      ["left", "15%"],
      ["margin-top", "8px"],
      ["background-color", ContentColorLayer3],
      ["border-top-left-radius", "10px"],
      ["border-top-right-radius", "10px"],

      // Text:
      ["padding-left", "8px"],
      ["font-size", "20px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
  ]).textContent = "Create Password";
  TextFieldSignUpPassword = createElement("TextFieldSignUpPassword", "input", LoginFields, [
      ["position", "relative"],
      ["display", "block"],
      ["box-sizing", "border-box"],
      ["width", "70%"],
      ["padding-top", "6px"],
      ["padding-bottom", "6px"],
      ["height", "40px"],
      ["min-width", "70%"],
      ["min-height", "40px"],
      ["left", "15%"],
      ["background-color", ContentColorLayer2],
      ["border-width", "0px"],
      ["border-bottom-left-radius", "10px"],
      ["border-bottom-right-radius", "10px"],

      // Text:
      ["padding-left", "8px"],
      ["font-size", "26px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow", "auto"]
  ]);
  TextFieldSignUpPassword.placeholder = "Password";
  TextFieldSignUpPassword.setAttribute("type", "password");
  TextFieldSignUpPassword.setAttribute("title", "Password");
  createElement("Info", "div", LoginFields, [
      ["position", "relative"],
      ["display", "block"],
      ["box-sizing", "border-box"],
      ["width", "80%"],
      ["left", "10%"],
      ["margin-top", "6px"],
      ["margin-bottom", "12px"],
      ["background-color", ContentColorLayer3],
      ["border-radius", "10px"],
      

      // Text:
      ["padding", "6px"],
      ["font-size", "12px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#bbbbbb"],
      ["text-align", "center"],
  ]).innerHTML = "Passwords must be longer than 8 charecters, contain at least 1 number, and have at least 1 symbol.";
  
  createElement("SignUpCaptcha", "div", LoginFields, [
      ["position", "relative"],
      ["width", "89.5%"],
      ["height", "75px"],
      ["left", "5.7%"],
      ["margin-top", "12px"]
  ]);
  SetCaptchaExpired();

  var HScript = loadScript("https://hcaptcha.com/1/api.js");
  HScript.addEventListener('load', function() {
    hcaptcha.render("SignUpCaptcha", { sitekey: "1f803f5f-2da5-4f83-b2c6-d9a8e00ba2d3", theme: "dark", callback: "SetCaptchaData", "expired-callback": "SetCaptchaExpired" });
  });

  createElement("Info", "div", LoginFields, [
      ["position", "relative"],
      ["display", "block"],
      ["width", "80%"],
      ["left", "10%"],
      ["margin-top", "12px"],
      ["background-color", ContentColorLayer3],
      ["border-radius", "10px"],

      // Text:
      ["padding", "6px"],
      ["font-size", "14px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#dddddd"],
      ["text-align", "center"],
  ]).innerHTML = 'By clicking "Sign Up" you are agreeing to our Terms of Use, Privicy Policy, and Rules.';

  var SignUpButton = createElement("SignUpButton", "div", LoginFields, [
      ["position", "relative"],
      ["display", "inline-flex"],
      ["height", "35px"],
      ["width", "106px"],
      ["margin", "14px 5px 14px 0px"],
      ["background-color", "#2AF5B5"],
      ["border-radius", "8px"],

      ["cursor", "pointer"],

      // Text:
      ["font-size", "26px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"],
  ]);
  SignUpButton.textContent = "Sign Up";
  SignUpButton.setAttribute("title", "Sign Up");
  async function TrySignUp() {
    var Email = TextFieldSignUpEmail.value;
    var Username = TextFieldSignUpUsername.value;
    var Password = TextFieldSignUpPassword.value;
    
    // ALPHA TESTING ONLY:
    /*
    if (TextFieldSignUpAccessCode.value == "") {
      ShowPopUp("Access Code Required", "Please enter an <b>access code</b> to continue with sign up.", [ ["Okay", "#618BFF", null] ]);
      return;
    }
    */
    /////////////////////////////////////////////

    // Basic EMAIL Varification:
    // Credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const VerifyEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (VerifyEmailRegex.test((Email).toLowerCase()) != true) {
      ShowPopUp("Invalid Email", "Please enter a <b>valid email address</b> in case we need to contact you with any account issues. <b>Two Step Authorization</b> is also coming soon.", [ ["Okay", "#618BFF", "SetFocusSignUpEmail"] ]);
      return;
    }

    // Username Verification:
    if (Username.length < 3 || Username.length > 20) {
      ShowPopUp("Username Length", "Your <b>username</b> must be at least <b>3 characters</b> long while not longer than <b>20 characters</b>.", [ ["Okay", "#618BFF", "SetFocusSignUpUsername"] ]);
      return;
    }
    if (Username.toLowerCase().replace(/[^A-Za-z0-9_-]/g, "") != Username.toLowerCase()) {
      ShowPopUp("No Symbols", "Your username cannot contain symbols!", [ ["Okay", "#618BFF", "SetFocusSignUpUsername"] ]);
      return;
    }

    // Password Verification:
    if (Password.length < 8) {
      ShowPopUp("Must be Longer", "Your password must be at least 8 charecters long.", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
      return;
    }
    if (Password.replace(/[^0-9]/g,"").length < 1) {
      ShowPopUp("Needs Numbers", "Your password must have at least 1 number!", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
      return;
    }
    if ((/[ !@#$%^&*()+\-_=\[\]{};':"\\|,.<>\/?]/).test(Password.toLowerCase()) == false) {
      ShowPopUp("Needs Symbol", "Your password must have at least 1 symbol!", [ ["Okay", "#618BFF", "SetFocusSignUpPassword"] ]);
      return;
    }

    CreateAccount({
      //TestingAccessCode: TextFieldSignUpAccessCode.value,
      
      Email: Email.toLowerCase(),
      Username: Username,
      Password: Password
    });
  }
  SignUpButton.addEventListener("click", TrySignUp);
  var SignInTransfer = createElement("SignInTransferButton", "div", LoginFields, [
      ["position", "relative"],
      ["display", "inline-flex"],
      ["height", "35px"],
      ["width", "106px"],
      ["margin", "14px 0px 14px 5px"],
      ["background-color", ThemeColor],
      ["border-radius", "8px"],

      ["cursor", "pointer"],

      // Text:
      ["font-size", "26px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"]
  ]);
  SignInTransfer.textContent = "Sign In";
  SignInTransfer.setAttribute("title", "Sign In");
  SignInTransfer.addEventListener("click", function() {
    StartSignIn();
  });

  AddSplashImage();
}

var CreatePost = createElement("CreatePost", "div", "MainContent", [
    ["position", "relative"],
    ["display", "none"],
    ["box-sizing", "border-box"],
    ["width", "100%"],
    ["min-height", "170px"],
    ["margin-top", "8px"],
    ["background-color", ContentColor],
    ["z-index", "20"],
    ["border-radius", "12px"],

    ["overflow-y", "hidden"]
]);
CreatePost.setAttribute("Solid", "true");

createElement("CreatePostProfilePic", "div", CreatePost.id, [
    ["position", "absolute"],
    ["width", "48px"],
    ["height", "48px"],
    ["left", "16px"],
    ["top", "16px"],
    ["object-fit", "cover"],
    ["border-radius", "8px"],

    ["content", "url('" + GoogleCloudStorgeURL + "ProfileImages/" + "DefaultProfilePic" + "')"]
]);
createElement("CreatePostUser", "div", CreatePost.id, [
    ["position", "absolute"],
    ["width", "calc(100% - 70px)"],
    ["left", "70px"],
    ["top", "18px"],

    // Text:
    ["font-size", "24px"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA],
    ["text-align", "left"],
    ["white-space", "nowrap"],
    ["text-overflow", "ellipsis"],
    ["overflow", "hidden"]
]).textContent = "Loading...";

createElement("CreatePostCore", "div", CreatePost.id, [
    ["position", "relative"],
    ["width", "calc(100% - 135px)"],
    ["left", "70px"],
    ["top", "52px"],
]);


// Credit: https://jsfiddle.net/nrx9yvw9/5/
function createRange(node, chars, range) {
    if (!range) {
        range = document.createRange()
        range.selectNode(node);
        range.setStart(node, 0);
    }

    if (chars.count === 0) {
        range.setEnd(node, chars.count);
    } else if (node && chars.count >0) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.length < chars.count) {
                chars.count -= node.textContent.length;
            } else {
                range.setEnd(node, chars.count);
                chars.count = 0;
            }
        } else {
            for (var lp = 0; lp < node.childNodes.length; lp++) {
                range = createRange(node.childNodes[lp], chars, range);

                if (chars.count === 0) {
                  break;
                }
            }
        }
  } 

  return range;
}

var PostText = "";
var CreatePostTextHolder = createElement("CreatePostTextHolder", "div", "CreatePostCore", [
    ["position", "relative"],
    ["display", "block"],
    ["min-width", "calc(100% - 10px)"],
    ["min-height", "50px"],
    ["background-color", ContentColorLayer2],
    ["border-width", "0px"],
    ["border-radius", "10px"],
    ["padding-left", "10px"],
    ["box-sizing", "border-box"],
    ["display", "border-box"],
    ["text-align", "left"],

    ["max-height", "200px"],
    ["overflow", "auto"],

    // Text:
    ["font-size", "20px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "400"],
    ["color", "#aaaaaa"],
    ["text-align", "left"]
]);
CreatePostTextHolder.className = "StandardScroll";
CreatePostTextHolder.setAttribute("role", "textbox");
CreatePostTextHolder.setAttribute("contenteditable", "true");
CreatePostTextHolder.setAttribute("tabindex", "-1");
CreatePostTextHolder.setAttribute("title", "Start the Hangout by Creating a Post");
//CreatePostTextHolder.setAttribute("onkeydown", "myKeyPress(event)");
var PrevSpaceAm = "";

var CharPostCount = createElement("CharPostCount", "div", "CreatePostCore", [
    ["position", "relative"],
    ["width", "calc(100% - 4px)"],
    ["height", "6px"],
    ["right", "4px"],
    ["margin-top", "4px"],

    // Text:
    ["font-size", "12px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "600"],
    ["color", "#bbbbbb"],
    ["text-align", "right"]
]);
CharPostCount.textContent = "0 / 400";
CharPostCount.setAttribute("title", "0 / 400 Max Characters");

function SetCursor(TextFieldCreatePost, Pos) {
  var Spacing = 1;
  //if (Text.length == 2 && TextFieldCreatePost == CreatePostTextHolder.children[CreatePostTextHolder.children.length-1]) {
  //  Spacing = 2;
  //}
  var selection = window.getSelection();
  range = createRange(TextFieldCreatePost, { count: Pos });
  
  if (range != null) {
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Credit: https://javascript.plainenglish.io/how-to-find-the-caret-inside-a-contenteditable-element-955a5ad9bf81
function getCaretIndex(element) {
  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
  }
  return position;
}

function findAllIndexes(string, word){
  let result = [];
  let dif = 0;
  while(true){
    let index = string.indexOf(word);
    if(index === -1) break;
    else{
      result.push(index + dif);
      let cur = string.length;
      string = string.substring(index + word.length);
      dif += cur - string.length;
    }
  }
  return result;
}

/*
var HighlightChars = {
  "http://": ["Link", "color: #3D87FF; font-style: italic", ".", false],
  "https://": ["Link", "color: #3D87FF; font-style: italic", ".", false],
  "www.": ["Link", "color: #3D87FF; font-style: italic", ".", false],

  "@": ["Ping", "color: #FE5D6A; font-style: bold", "", true],
  "/Post_": ["Quote", "color: #C95EFF; font-style: bold", "", true],
  "/Chat_": ["Quote", "color: #2AF5B5; font-style: bold", "", true],

  "(!": ["Bold", "font-style: bold", "", false, ")"],
  "(*": ["Italic", "font-style: italic", "", false, ")"],

  //" ": ["Text", ""],
};
*/
var HighlightKeys = Object.keys(HighlightChars); // An array of the keys in "HighlightChars"

//CreatePostTextHolder.innerHTML = "Type Here <br /> a";
//CreatePostTextHolder.textContent = "Type Here";

var WasEnter = false;
CreatePostTextHolder.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    WasEnter = true;
  } else {
    WasEnter = false;
  }
  return true;
});

var PreviousHighlights = [];

function AddFormatting(StandardText, HolderID) {
  //CreatePostTextHolder.innerHTML = CreatePostTextHolder.innerHTML.replaceAll("<div>", "$NEWLINE;").replaceAll("</div>", "");//.replaceAll("<br>", "$NEWLINE;");
  //var StandardText = Element.textContent; //innerText

  //console.log(CreatePostTextHolder.innerHTML.replaceAll("&nbsp;","-"));

  StandardText = StandardText.replace(/\&/g, "&#38;");
  StandardText = StandardText.replace(/\$/g, "&#36;");
  StandardText = StandardText.replace(/\?/g, "&#63;");
  //StandardText = StandardText.replaceAll("#", "&#35;");
  StandardText = StandardText.replace(/\=/g, "&#61;");

  // Multiple Lines:
  //StandardText = StandardText.replaceAll("\n", "??????NEWLINE??????");

  //StandardText = StandardText.replaceAll(/[^ -~]+/g, " "); // Invisible charecter.
  //StandardText = StandardText.replaceAll("&zwj;", ""); // Invisible charecter.
  //StandardText = StandardText.replaceAll(/\s/g, " ")
  //StandardText = StandardText.replaceAll("&nbsp;", " ");
  //StandardText = StandardText.replaceAll("$NEWLINE;", " ");
  
  // XSS Protection:
  StandardText = StandardText.replace(/\</g, "&#60;");
  StandardText = StandardText.replace(/\>/g, "&#62;");

  var NewHTML = "";
  //var SetHighlights = [];

  var ContainedOne = true;
  while (ContainedOne == true) {
    ContainedOne = false;
    var SortedOrder = [];
    for (var f = 0; f < HighlightKeys.length; f++) {
      var Index = StandardText.indexOf(HighlightKeys[f]);
      if (Index != -1) {
        ContainedOne = true;
        SortedOrder.push([Index,HighlightKeys[f]]);
      }
    }

    SortedOrder = SortedOrder.sort(function(a, b) {
      return a[0] - b[0];
    });

    for (var i = 0; i < SortedOrder.length; SortedOrder++) {
      //var Index = SortedOrder[i][0];
      var Search = SortedOrder[i][1];
      var Index = StandardText.indexOf(Search);
      var IndexSort = StandardText.replace(/ /g, " ").replace(/ /g, " ").replace(/&nbsp;/g, " ").replace(/‎/g, " ").replace(/&#x0020;/g, " ").replace(/\t/g, " ").replace(/\r/g, " ").replace(/\v/g, " ").replace(/\f/g, " ").replace(/\n/g, " ");
      //console.log(IndexSort);
      //SetHighlights.push(Search);
      
      var CheckIndexFor = " ";
      if (HighlightChars[Search].EndChar != null) {
        CheckIndexFor = HighlightChars[Search].EndChar;
      }
      var EndIndex = IndexSort.indexOf(CheckIndexFor, Index+1);

      if (EndIndex < 0) {
        EndIndex = StandardText.length;
      }

      if (HighlightChars[Search].OtherEndings == true) {
        for (var e = 0; e < OtherEnds.length; e++) {
          var CheckIndex = IndexSort.indexOf(OtherEnds[e], Index+1);
          if (CheckIndex > 0 && CheckIndex < EndIndex) {
            EndIndex = CheckIndex;
            break;
          }
        }
      }

      var SearchIndex = Index;
      var SearchEndIndex = EndIndex;

      if (HighlightChars[Search].HideKeysOnCreate == null || HighlightChars[Search].HideKeysOnCreate == false) {
        if (HighlightChars[Search].IncludeKeys != null && HighlightChars[Search].IncludeKeys == false) {
          EndIndex += HighlightChars[Search].EndChar.length;
          SearchEndIndex += HighlightChars[Search].EndChar.length;
        }
      } else {
        SearchIndex += Search.length;
        SearchEndIndex += HighlightChars[Search].EndChar.length;
      }
      
      var TextAdd = StandardText.substring(SearchIndex, SearchEndIndex); // Get just the highlighted string

      if (HighlightChars[Search].MustInclude == null || TextAdd.includes(HighlightChars[Search].MustInclude) == true) {
        // Add the string before the search:
        NewHTML += StandardText.substring(0, Index);

        var TagSet = HighlightChars[Search].Tag || "span";
        
        // Add the new InnerHTML:
        var AddHTMLStart = '<' + TagSet + ' style="' + HighlightChars[Search].Style + '" typerender="Create' + HighlightChars[Search].Type + '" ' + 'texttypeholder="' + HolderID + '" textspan="">';
        var AddHTMLEnd = "</" + TagSet + ">";
        NewHTML += AddHTMLStart + TextAdd + AddHTMLEnd;

        StandardText = StandardText.substring(SearchEndIndex);
      } else {
        if (TextAdd.includes(HighlightChars[Search].MustInclude) == false) {
          NewHTML += StandardText.substring(0, EndIndex);
          StandardText = StandardText.substring(EndIndex);
        }
      }
    }
  }
  NewHTML += StandardText;

  /*
  if (StandardText.length > 0) {
    SetHighlights.push("EndStandard");
  }
  */
  //NewHTML = NewHTML.replaceAll("$NEWLINE;", "<br/>");
  //prompt(NewHTML.replaceAll("\n","-"));
  

  //var StringHeighlights = JSON.stringify(SetHighlights);
  //prompt(StringHeighlights);
  //if (StringHeighlights != PreviousHighlights) {
    //PreviousHighlights = StringHeighlights;
    /*
    if (WasEnter == true) {
      NewHTML += "‎";
      CaretPos += 1;
    }
    */
    return NewHTML;
    // Element.innerHTML = NewHTML;
    
  //}
}

var LastCursorPos = 0;
var LastCursorObject = CreatePostTextHolder;

var PreviousDivs = [];
var PreviousText = "";

function RenderNewText() {
  if (PreviousText == CreatePostTextHolder.textContent) {
    return;
  }
  PreviousText = CreatePostTextHolder.textContent;
  
  /*
  if (CreatePostTextHolder.innerHTML.includes("$[NEWLINE]") == true) {
    CreatePostTextHolder.innerHTML = CreatePostTextHolder.innerHTML.replaceAll("$[NEWLINE]", "\n");
  }
  */

  var Anchor = window.getSelection().anchorNode.parentNode || CreatePostTextHolder;
  if (Anchor.nodeName != "DIV") {
    Anchor = find(Anchor.getAttribute("TextTypeHolder"));
  }
  var CaretPos = getCaretIndex(Anchor);
  
  if (getCSS(CreatePostTextHolder, "color") == "#aaaaaa") {
    CreatePostTextHolder.innerHTML = CreatePostTextHolder.innerHTML.replace(/Ready to Hangout\?/g, "");
    setCSS(CreatePostTextHolder, "color", FontColorA);
    return;
  }
  
  var Children = CreatePostTextHolder.childNodes;
  if (Children[0] != null && Children[0].nodeValue != null && typeof Children[0].nodeValue == "string") {
    var AddText = Children[0].nodeValue;
    Children[0].nodeValue = null;
    CreatePostTextHolder.innerHTML = "<div>" + AddText + "</div>" + CreatePostTextHolder.innerHTML;
    Children = CreatePostTextHolder.childNodes;
  }
  //Children[0].nodeValue = AddFormatting(Children[0].nodeValue);

  for (var e = 0; e < Children.length; e++) {
    var FormatElement = Children[e];
    if (FormatElement.innerText.length > 0) {
      var SetID = FormatElement.id;
      if (FormatElement.hasAttribute("id") == false || find(SetID) != null) {
        SetID = e;
        FormatElement.id = SetID;
      }
      var SetInnerHTML = AddFormatting(FormatElement.innerText, SetID);
      //FormatElement.setAttribute("role", "textbox");
      //FormatElement.setAttribute("contenteditable", "true");
      FormatElement.innerHTML = SetInnerHTML;
    } else {
      FormatElement.remove();
    }
  }

  if (Anchor != null && Anchor.tagName.toString() == "DIV") {
    if (Anchor.parentNode == CreatePostTextHolder) {
      LastCursorPos = CaretPos;
      LastCursorObject = Anchor;
    }

    if (CaretPos > Anchor.innerText.length) {
      CaretPos = Anchor.innerText.length;
    }
    //console.log(NewDiv == Anchor);
    //SetCursor(Anchor, CaretPos); //CreatePostTextHolder.children[CaretPos[1]+0]
    SetCursor(Anchor, CaretPos);
  }

  PreviousDivs = Array.prototype.slice.call(CreatePostTextHolder.childNodes); // Convert to array.

  WasEnter = false;
}
CreatePostTextHolder.addEventListener("click", function() {
  var Anchor = window.getSelection().anchorNode.parentNode || CreatePostTextHolder;
  if (Anchor.nodeName == "SPAN") {
    Anchor = find(Anchor.getAttribute("TextTypeHolder"));
  }
  var CaretPos = getCaretIndex(Anchor);
  if (Anchor != null && Anchor.tagName.toString() == "DIV") {
    if (Anchor.parentNode == CreatePostTextHolder) {
      LastCursorPos = CaretPos;
      LastCursorObject = Anchor;
    }
  }

  // User Mention:
  var Anchor = window.getSelection().anchorNode;
  if (Anchor != null && Anchor.parentNode != null && Anchor.parentNode.getAttribute("typerender") == "CreateMention") {
    CreateMentionPreview(Anchor.parentNode);
  } else {
    RemoveMentionPreview();
  }
});

/*
function RenderNewText() {
  //if (WasEnter == true) {
  //  return;
  //}
  var CaretPos = getCaretIndex(CreatePostTextHolder);

  var StandardText = CreatePostTextHolder.textContent; //innerText
  //console.log(StandardText);
  
  if (getCSS(CreatePostTextHolder, "color") == "#aaaaaa") {
    StandardText = StandardText.replaceAll("Ready to Hangout?", "");
    setCSS(CreatePostTextHolder, "color", FontColorA);
  }

  StandardText = StandardText.replaceAll(";", "&#59;");
  
  StandardText = StandardText.replaceAll("&", "&#38;");
  //StandardText = StandardText.replaceAll("#", "&#35;");
  StandardText = StandardText.replaceAll("=", "&#61;");

  StandardText = StandardText.replaceAll("&zwj;", ""); // Invisible charecter.
  StandardText = StandardText.replaceAll(/\s/g, " ")
  StandardText = StandardText.replaceAll("&nbsp;", " ");

  // XSS Protection:
  StandardText = StandardText.replaceAll("<", "&#60;");
  StandardText = StandardText.replaceAll(">", "&#62;");
  
  //StandardText = StandardText.replaceAll("‎", "&lrm;");

  var NewHTML = "";

  for (var i = 0; i < StandardText.length; i++) {
    var Char = StandardText[i];
    if (Char != "=") {
      var Found = false;
      for (var f = 0; f < HighlightKeys.length; f++) {
        if (StandardText.substring(i,i+(HighlightKeys[f].length)) == HighlightKeys[f]) {
          var IndexSort = StandardText.replaceAll(" ", " ").replaceAll(" ", " ").replaceAll("&nbsp;", " ").replaceAll("‎", " ").replaceAll("&#x0020;", " ").replaceAll("\t", " ").replaceAll("\r", " ").replaceAll("\v", " ").replaceAll("\f", " ").replaceAll("\n", " ");
          var IndexSet = StandardText.length;
          var CheckIndexFor = " ";
          if (HighlightChars[HighlightKeys[f]][4] != null) {
            CheckIndexFor = HighlightChars[HighlightKeys[f]][4];
          }
          var NewSet = IndexSort.indexOf(CheckIndexFor, i+HighlightKeys[f].length);
          if (NewSet < IndexSet) {
            IndexSet = NewSet;
          }
          if (HighlightChars[HighlightKeys[f]][3] == true) {
            for (var e = 0; e < OtherEnds.length; e++) {
              var CheckIndex = IndexSort.indexOf(OtherEnds[e], i+1);
              if (CheckIndex > 0 && CheckIndex < IndexSet) {
                IndexSet = CheckIndex;
                break;
              }  
            }
          }
          if (IndexSet < 0) {
            IndexSet = StandardText.length;
          }
          var TextAdd = StandardText.substring(i,IndexSet);
          var AddSubOne = 0;
          if (HighlightChars[HighlightKeys[f]][4] != null) {
            // console.log("E " + StandardText.substring(i,IndexSet+1));
            TextAdd = StandardText.substring(i,IndexSet+1);
            AddSubOne = 1;
          }
          if (TextAdd.includes(HighlightChars[HighlightKeys[f]][2])) {
            var AddHTMLStart = '<span style="' + HighlightChars[HighlightKeys[f]][1] + '" textspan="">';
            var AddHTMLEnd = "</span>";
            NewHTML += AddHTMLStart + TextAdd + AddHTMLEnd
            var Add = "";
            for (var a = 0; a < TextAdd.length+AddSubOne; a++) {
              Add += "=";
            }
            StandardText = StandardText.substring(0, i) + Add + StandardText.substring(IndexSet+AddSubOne); //
            Found = true;
            //NewHTML = NewHTML.replace(StandardText.substring(i,IndexSet), AddHTMLStart + StandardText.substring(i,IndexSet) + AddHTMLEnd);
            break;
          }
        }
      }
      if (Found == false) {
        NewHTML += Char;
      }
    }
  }

  if (CreatePostTextHolder.innerHTML != NewHTML) {
    if (WasEnter == true) {
      NewHTML += "‎";
      CaretPos += 1;
    }
    CreatePostTextHolder.innerHTML = NewHTML;
    CreatePostTextHolder.focus();
    SetCursor(CreatePostTextHolder, CaretPos); //CreatePostTextHolder.children[CaretPos[1]+0] || 
  }
  WasEnter = false;
}
*/

function UpdatePostCharTextCounter(SetChatText) {
  if (SetChatText == null) {
    CharPostCount.innerHTML = CreatePostTextHolder.innerHTML.replace(/\<\/div\>/g, "\n");
    var Subtract = 0;
    /*
    if (CharPostCount.innerHTML.includes("$[NEWLINE];") == true) {
      Subtract = 11;
    }
    */
    SetChatText = CharPostCount.textContent.length-Subtract;
  }
  SetChatText += " / " + MaxPostCharAmount;
  CharPostCount.textContent = SetChatText;
  CharPostCount.setAttribute("title", SetChatText + " Max Characters");
}

CreatePostTextHolder.addEventListener("input", () => {
  //console.log(CreatePostTextHolder.childNodes[0].nodeValue);
  UpdatePostCharTextCounter();
  RenderNewText();

  // User Mention:
  var Anchor = window.getSelection().anchorNode;
  if (Anchor != null && Anchor.parentNode != null && Anchor.parentNode.getAttribute("typerender") == "CreateMention") {
    CreateMentionPreview(Anchor.parentNode);
  } else {
    RemoveMentionPreview();
  }

  //console.log(CreatePostTextHolder.innerHTML);
});

CreatePostTextHolder.textContent = "Ready to Hangout?";
CreatePostTextHolder.addEventListener("focus", function(e) {
  if (CreatePostTextHolder.textContent == "Ready to Hangout?") {
    CreatePostTextHolder.textContent = "";
    setCSS(CreatePostTextHolder, "color", FontColorA);
    UpdatePostCharTextCounter(0);
  }
  SetPageTitle("Creating Post");
});
CreatePostTextHolder.addEventListener("focusout", async function(e) {
  if (CreatePostTextHolder.innerText.length < 1 || CreatePostTextHolder.innerText == "\n") {
    CreatePostTextHolder.innerHTML = "Ready to Hangout?";
    setCSS(CreatePostTextHolder, "color", "#aaaaaa");
    LastCursorPos = 0;
    LastCursorObject = CreatePostTextHolder;
    UpdatePostCharTextCounter(0);
  }
  RevertTitle();
  await sleep(100);
  RemoveMentionPreview();
});

function CreateTypeTextFormat(Type, Text, SetMouse, Parent, Config) {
  var SendData = [
    ["position", "relative"],
    ["display", "inline"],
    ["border-width", "0px"],
    ["border-radius", "10px"],
    ["box-sizing", "border-box"],
    
    // Text:
    ["font-size", "20px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "400"],
    ["color", "white"],
    ["text-align", "left"],
    ["overflow", "hidden"]
  ];

  for (var i = 0; i < Config.length; i++) {
    var Found = false;
    for (var o = 0; o < SendData.length; o++) {
      if (SendData[o][0] == Config[i][0]) {
        SendData[o] = Config[i];
        Found = true;
      }
    }
    if (Found == false) {
      SendData.push(Config[i]);
    }
  }

  var TextFieldCreatePost = createElement("CreatePostText", "span", Parent, SendData);
  TextFieldCreatePost.textContent = Text;
  TextFieldCreatePost.setAttribute("tabindex", "-1");
  TextFieldCreatePost.setAttribute("Type", Type);

  return TextFieldCreatePost;
}

CreatePostTextHolder.setAttribute("onpaste", "return clipBoardRead(event)");

/*
var PostText = createElement(ID + "TextHolder", "div", MainContent, [
      ["position", "relative"],
      ["width", "95%"],
      ["margin-left", "3.5%"],
      ["margin-top", "6px"],
      ["padding-bottom", "12px"],
      ["z-index", "5"],
      ["cursor", "pointer"],

      ["border-radius", "12px"],

      ["overflow-wrap", "break-word"],
      ["display", "border-box"],
      ["white-space", "pre-wrap"],
      ["text-align", "left"]
  ]);

  createElement(ID + "Hey!", "span", PostText, [
      ["height", "16px"],
      ["display", "inline"],
      ["box-sizing", "border-box"],
      
      // Text:
      ["font-size", "20px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow", "hidden"]
  ]).textContent = Data.Text;

*/
var CreateMediaHolder = createElement("CreateMediaHolder", "div", "CreatePostCore", [
    ["position", "relative"],
    ["vertical-align", "top"],
    ["z-index", "4"],
    ["width", "100%"],
    ["max-height", "200px"],
    ["overflow", "hidden"],
    ["overflow-x", "auto"],
    ["white-space", "nowrap"]
]);
CreateMediaHolder.className = "StandardScroll";

var CreateButtonHolder = createElement("CreateButtonHolder", "div", "CreatePostCore", [
    ["position", "relative"],
    ["z-index", "4"],
    ["width", "100%"],
    ["height", "35px"],
    ["margin-top", "15px"],
    ["margin-bottom", "75px"],
    ["overflow", "hidden"]
]);

function createSVGButtonImage(ButtonID, PercentMove, Color, Size, Border, Svg) {
  var SVGElem = createElement(ButtonID +  "Svg", "svg", ButtonID, [
      ["position", "relative"],
      ["height", "100%"],
      ["width", "100%"],

      // ["height", PxSize + "px"],
      // ["width", PxSize + "px"],
      //["top", (CreateButtonHolder.clientHeight-PxSize)/2 + "px"],
      ["cursor", "pointer"]
  ], "http://www.w3.org/2000/svg");
  SVGElem.setAttribute("viewBox", "0 0 " + Size + " " + Size)
  var GTag = createElement(ButtonID + "G", "g", ButtonID + "Svg", null, "http://www.w3.org/2000/svg");
  var i;
  for (i = 0; i < Svg.length; i += 1) {
      if (Array.isArray(Svg[i]) == false) {
          createElement("Svg", "path", ButtonID + "G", null, "http://www.w3.org/2000/svg").setAttribute("d", Svg[i]);
      } else {
          if (Svg[i][0] == "circle") {
              var Circle = createElement("Svg", "circle", ButtonID + "G", null, "http://www.w3.org/2000/svg");
              Circle.setAttribute("cx", "256");
              Circle.setAttribute("cy", "256");
              Circle.setAttribute("r", "63.2");
          }
      }
  }
  
  GTag.setAttribute("fill", Color);
  GTag.setAttribute("stroke", Border.Color);
  GTag.setAttribute("stroke-width", Border.Size);
  
  return SVGElem;
}

var CreateImageButton = createElement("CreateImageButton", "div", CreateButtonHolder, [
    ["position", "relative"],
    ["display", "inline-block"],
    ["height", "100%"],
    ["width", "35px"],
    ["margin-left", "20px"],

    // ["height", PxSize + "px"],
    // ["width", PxSize + "px"],
    //["top", (CreateButtonHolder.clientHeight-PxSize)/2 + "px"],
    ["cursor", "pointer"]
]);
CreateImageButton.setAttribute("title", "Upload Image");
createSVGButtonImage("CreateImageButton", 1, ThemeColor, "550.801", {Color: FontColorA, Size: 0}, ["M515.828,61.201H34.972C15.659,61.201,0,76.859,0,96.172v358.458C0,473.942,15.659,489.6,34.972,489.6h480.856 c19.314,0,34.973-15.658,34.973-34.971V96.172C550.801,76.859,535.143,61.201,515.828,61.201z M515.828,96.172V350.51l-68.92-62.66 c-10.359-9.416-26.289-9.04-36.186,0.866l-69.752,69.741L203.438,194.179c-10.396-12.415-29.438-12.537-39.99-0.271L34.972,343.219 V96.172H515.828z M367.201,187.972c0-26.561,21.523-48.086,48.084-48.086c26.562,0,48.086,21.525,48.086,48.086 c0,26.561-21.523,48.085-48.086,48.085C388.725,236.058,367.201,214.533,367.201,187.972z"]);
var ImageHolder = createElement("LoadImageButton", "input", CreatePost, [
    ["position", "absolute"],
    ["height", "100%"],
    ["width", "100%"],
    ["left", "0px"],
    ["top", "0px"]
]);
ImageHolder.setAttribute("type", "file");
ImageHolder.setAttribute("accept", "image/*");
ImageHolder.setAttribute("multiple", "true");
ImageHolder.setAttribute("hidden", "true");

CreatePostTextHolder.addEventListener("drop", function(event) {
  setCSS(CreatePost, "border-style", "solid");
  setCSS(CreatePost, "border-width", "0px");
  setCSS(CreatePost, "border-bottom-width", "0px");
  ProcessUpload(event.dataTransfer.items);
  event.preventDefault();
});
CreatePostTextHolder.addEventListener("dragenter", function(event) {
  setCSS(CreatePost, "border-style", "dashed");
  setCSS(CreatePost, "border-width", "4px");
  setCSS(CreatePost, "border-bottom-width", "4px");
  setCSS(CreatePost, "border-color", ThemeColor);
});
CreatePostTextHolder.addEventListener("dragleave", function(event) {
  setCSS(CreatePost, "border-style", "solid");
  setCSS(CreatePost, "border-width", "0px");
  setCSS(CreatePost, "border-bottom-width", "0px");
});
CreatePostTextHolder.addEventListener("paste", function(event) {
  ProcessUpload((event.clipboardData || event.originalEvent.clipboardData).items);
  UpdatePostCharTextCounter();
});

async function ProcessUpload(UploadedImages) {
  for (var i = 0; i < UploadedImages.length; i++) {
    var FileUpload = UploadedImages[i];
    if (FileUpload.kind == "file") {
      FileUpload = FileUpload.getAsFile();
    }
    if (FileUpload.type.substring(0, 6) == "image/") {
      if (SupportedImageTypes.includes(FileUpload.type.replace(/image\//g, "")) == true) {
        if (CreateMediaHolder.childNodes.length < 3) {
          if (FileUpload.size < (15 * 1024 * 1024)+1) {
            var BlobURL = URL.createObjectURL(FileUpload);

            CreateViewImage(BlobURL);
            function CreateViewImage(ObjectURL) {
              setCSS(CreateMediaHolder, "margin-top", "15px");

              var NewBlobImage = createElement(ObjectURL, "div", CreateMediaHolder, [
                ["position", "relative"],
                ["display", "inline-block"],
                ["min-width", "42px"],
                ["top", "0px"],
                ["margin-right", "8px"]
              ]);
              NewBlobImage.className = "UploadedImage";
              var PostImageBlob = createElement("Image", "div", NewBlobImage, [
                ["position", "relative"],
                ["height", "180px"],
                ["border-radius", "12px"],

                ["content", "url(" + ObjectURL + ")"]
              ]);
              var CloseImageButton = createElement(ObjectURL + "Close", "div", NewBlobImage, [
                ["position", "absolute"],
                ["display", "flex"],
                ["top", "6px"],
                ["right", "6px"],
                ["height", "29px"],
                ["width", "30px"],
                ["padding-bottom", "1px"],
                ["background-color", "rgba(0, 0, 0, 0.45)"],
                ["border-radius", "60px"],
                ["cursor", "pointer"],

                // Text:
                ["font-size", "28px"],
                ["font-family", FontTypeA],
                ["color", "#cccccc"],
                ["text-align", "center"],
                ["justify-content", "center"],
                ["align-items", "center"]
              ]);
              CloseImageButton.innerHTML = "&times;";
              PostImageBlob.addEventListener("click", function() {
                HighlightedMedia(ObjectURL);
              });
              CloseImageButton.addEventListener("click", function() {
                NewBlobImage.remove();
                URL.revokeObjectURL(ObjectURL);
                if (CreateMediaHolder.childNodes.length < 1) {
                  setCSS(CreateMediaHolder, "margin-top", "0px");
                }
              });
            }
          } else {
            ShowPopUp("That's a lot of Bytes", "Images must be under <b>5 MB</b> in size!", [ ["Okay", "#618BFF", null] ]);
          }
        } else {
          ShowPopUp("Image Overload", "You can only upload up to <b>3 images</b> currently.", [ ["Okay", "#618BFF", null] ]);
        }
      } else {
        ShowPopUp("Invalid File Type", "Images can't be a <b>" + (FileUpload.type.substring(FileUpload.type.indexOf("/")+1) || "file") + "</b> format.", [ ["Okay", "#618BFF", null] ]);
      }
    }
  }
  ImageHolder.value = null;
}
ImageHolder.addEventListener('change', function(event) {
  ProcessUpload(event.target.files);
});

CreateImageButton.addEventListener('click', function() {
  if (CreateMediaHolder.childNodes.length < 3) {
    ImageHolder.click()
  } else {
    ShowPopUp("Image Overload", "You can only upload up to <b>3 images</b> currently.", [ ["Okay", "#618BFF", null] ]);
  }
});
//Filled: m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0

var EmojiButton = createElement("EmojiButton", "div", CreateButtonHolder, [
    ["position", "relative"],
    ["display", "inline-block"],
    ["height", "100%"],
    ["width", "35px"],
    ["margin-left", "20px"],

    // ["height", PxSize + "px"],
    // ["width", PxSize + "px"],
    //["top", (CreateButtonHolder.clientHeight-PxSize)/2 + "px"],
    ["cursor", "pointer"]
]);
EmojiButton.setAttribute("title", "Add Emoji");
createSVGButtonImage("EmojiButton", 2, ThemeColor, "512", {Color: FontColorA, Size: 0}, ["m256 512c-68.38 0-132.667-26.629-181.02-74.98-48.351-48.353-74.98-112.64-74.98-181.02s26.629-132.667 74.98-181.02c48.353-48.351 112.64-74.98 181.02-74.98s132.667 26.629 181.02 74.98c48.351 48.353 74.98 112.64 74.98 181.02s-26.629 132.667-74.98 181.02c-48.353 48.351-112.64 74.98-181.02 74.98zm0-472c-119.103 0-216 96.897-216 216s96.897 216 216 216 216-96.897 216-216-96.897-216-216-216zm93.737 260.188c-9.319-5.931-21.681-3.184-27.61 6.136-.247.387-25.137 38.737-67.127 38.737s-66.88-38.35-67.127-38.737c-5.93-9.319-18.291-12.066-27.61-6.136s-12.066 18.292-6.136 27.61c1.488 2.338 37.172 57.263 100.873 57.263s99.385-54.924 100.873-57.263c5.93-9.319 3.183-21.68-6.136-27.61zm-181.737-135.188c13.807 0 25 11.193 25 25s-11.193 25-25 25-25-11.193-25-25 11.193-25 25-25zm150 25c0 13.807 11.193 25 25 25s25-11.193 25-25-11.193-25-25-25-25 11.193-25 25z"]);
EmojiButton.addEventListener("click", function() {
  if (EmojiEditorOpen == false) {
    EmojiEditorOpen = true;
    EmojiEditorLoadSource = EmojiButton;
    if (typeof EmojiEditorLoaded !== 'undefined') {
      LoadEmojiEditor();
    } else {
      loadScript(LoadScripts.EmojiPicker);
    }
  }
});

// Filled: ["m0 204.647v175.412h175.412v-175.412h-116.941c0-64.48 52.461-116.941 116.941-116.941v-58.471c-96.728 0-175.412 78.684-175.412 175.412z", "m409.294 87.706v-58.471c-96.728 0-175.412 78.684-175.412 175.412v175.412h175.412v-175.412h-116.941c0-64.48 52.461-116.941 116.941-116.941z"]

var ConfigurePostButton = createElement("ConfigurePostButton", "div", CreateButtonHolder, [
    ["position", "relative"],
    ["display", "inline-block"],
    ["height", "100%"],
    ["width", "35px"],
    ["margin-left", "20px"],

    // ["height", PxSize + "px"],
    // ["width", PxSize + "px"],
    //["top", (CreateButtonHolder.clientHeight-PxSize)/2 + "px"],
    ["cursor", "pointer"]
]);
ConfigurePostButton.setAttribute("title", "Configure Post");
createSVGButtonImage("ConfigurePostButton", 3, ThemeColor, "513.607", {Color: FontColorA, Size: 0}, ["m503.384 243.685c-30.059-12.05-58.533-34.623-82.345-65.281-24.287-31.271-43.862-71.117-56.609-115.233l-14.588-50.485c-1.854-6.418-7.729-10.836-14.41-10.836s-12.556 4.418-14.41 10.836l-14.587 50.484c-12.747 44.116-32.322 83.964-56.609 115.233-23.812 30.658-52.286 53.231-82.346 65.281-5.61 2.249-9.322 7.645-9.417 13.688-.095 6.044 3.446 11.554 8.983 13.977l4.663 2.041c59.676 26.122 108.444 90.453 133.8 176.5l15.534 52.718c1.88 6.38 7.737 10.76 14.389 10.76s12.508-4.38 14.389-10.76l15.535-52.718c25.355-86.047 74.124-150.378 133.801-176.5l4.662-2.041c5.536-2.424 9.077-7.934 8.982-13.977s-3.806-11.438-9.417-13.687zm-166.805 197.724-1.146 3.891-1.146-3.891c-24.688-83.781-70.572-149.266-127.875-183.753 24.507-14.749 47.336-35.395 67.106-60.851 26.598-34.244 47.946-77.574 61.737-125.308l.178-.612.177.612c13.791 47.733 35.14 91.063 61.737 125.308 19.771 25.456 42.6 46.102 67.106 60.851-57.302 34.488-103.186 99.972-127.874 183.753z", "m19.57 149.497 2.338 1.022c27.903 12.214 50.843 42.754 62.935 83.788l7.791 26.441c1.88 6.381 7.737 10.761 14.389 10.761 6.65 0 12.508-4.38 14.389-10.76l7.792-26.441c12.092-41.035 35.031-71.575 62.934-83.788l2.339-1.023c5.537-2.423 9.079-7.933 8.984-13.977-.094-6.043-3.807-11.439-9.417-13.688-28.709-11.509-53.118-43.536-65.294-85.675l-7.316-25.321c-1.856-6.418-7.731-10.836-14.412-10.836s-12.557 4.419-14.411 10.837l-7.314 25.32c-12.176 42.139-36.585 74.166-65.294 85.675-5.61 2.249-9.322 7.646-9.417 13.688-.095 6.044 3.447 11.554 8.984 13.977zm87.452-84.254c12.055 30.262 29.807 54.618 51.29 70.577-21.479 16.062-39.275 40.582-51.29 70.846-12.014-30.264-29.81-54.783-51.289-70.846 21.483-15.959 39.234-40.315 51.289-70.577z", "m134.704 400.672c-18.679-7.488-34.656-28.66-42.74-56.636l-5.089-17.617c-1.854-6.418-7.73-10.837-14.411-10.837-6.68 0-12.556 4.418-14.41 10.836l-5.091 17.618c-8.083 27.976-24.061 49.147-42.739 56.636-5.61 2.249-9.323 7.646-9.417 13.688-.095 6.044 3.447 11.554 8.985 13.977l1.625.711c17.908 7.84 33.324 28.552 41.237 55.404l5.421 18.396c1.881 6.38 7.737 10.76 14.389 10.76s12.508-4.38 14.389-10.76l5.421-18.396c7.912-26.853 23.328-47.563 41.235-55.402l1.627-.712c5.538-2.423 9.08-7.933 8.985-13.977-.094-6.044-3.807-11.44-9.417-13.689zm-62.241 51.912c-7.429-15.379-17.101-28.297-28.376-37.932 11.279-9.58 20.937-22.428 28.376-37.795 7.439 15.367 17.097 28.215 28.376 37.795-11.277 9.634-20.947 22.551-28.376 37.932z"]);
ConfigurePostButton.addEventListener("click", function() {
  ShowPopUp("Post Configuration Soon", "Soon, you will be able to configure your post. This currently is just a placeholder button.", [ ["Okay", "#618BFF", null] ]);
  /*
  CreateDropdown(ConfigurePostButton, [
    ["Disable Chat", "#2AF5B5", null],
    ["Disable Likes", "#FF5786", null],
    ["Disable Quotes", "#C95EFF", null],
    ["Set Slowmode", ThemeColor, null],
    ["Enable Filter", ThemeColor, null]
  ], 8);
  */
});

var CreatePostButton = createElement("CreatePostButton", "a", CreatePost.id, [
    ["position", "absolute"],
    ["display", "flex"],
    ["height", "40px"],
    ["width", "85px"],
    ["right", "8px"],
    ["bottom", "8px"],
    ["background-color", ThemeColor],
    ["border-radius", "8px"],
    ["z-index", "6"],
    ["cursor", "pointer"],

    // Text:
    ["font-size", "26px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", "#ffffff"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"]
]);
CreatePostButton.textContent = "Post";
CreatePostButton.setAttribute("title", "Post");

var PostDisplayHolder = null;
function CreatePostDisplay() {
  if (PostDisplayHolder != null) {
    PostDisplayHolder.remove();
  }
  PostDisplayHolder = createElement("PostDisplayHolder", "div", "MainContent", [
      ["position", "relative"],
      ["width", "100%"],
      ["margin-bottom", "8px"],
  ]);
}

var WaitPostTime = Math.floor(Date.now() / 1000) + 1;
CreatePostButton.addEventListener("click", function() {
  UpdatePostCharTextCounter();
  
  //var OriginalHTML = CreatePostTextHolder.innerHTML;
  //CreatePostTextHolder.innerHTML = OriginalHTML.replace(/\<\/div\>/g, "$[NewLineChar];");
  //CreatePostTextHolder.innerHTML = CreatePostTextHolder.innerText.replace(/\n\n/g, "\n");
  var PostText = CreatePostTextHolder.innerText.replace(/\n\n/g, "\n").trim();
  //var PostText = CreatePostTextHolder.textContent.trim();
  //CreatePostTextHolder.innerHTML = OriginalHTML;
  
  //PostText = PostText.replace(/\$\[NewLineChar\]\;/g, "\n");
  
  if ((PostText == "" || getCSS(CreatePostTextHolder, "color") == "#aaaaaa" && CreatePostTextHolder.textContent == "Ready to Hangout?") && CreateMediaHolder.childNodes.length < 1) {
    ShowPopUp("Write a Post", "You can't post... NOTHING! Write something!", [ ["Okay", "#618BFF", null] ]);
    return;
  }
  
  if (getCSS(CreatePostTextHolder, "color") == "#aaaaaa" && CreatePostTextHolder.textContent == "Ready to Hangout?") {
    PostText = "";
  }
  
  /*
  if (WaitPostTime > Math.floor(Date.now() / 1000)) {
    ShowPopUp("Posting toi Fast", "You must wait <b>" + Math.round(WaitPostTime - Math.floor(Date.now() / 1000)) + "</b> more seconds before you can post (To prevent spam).", [ ["Okay", "#618BFF", null] ]);
    return;
  }
  */

  var Subtract = 0;
  /*
  if (PostText.includes("$[NEWLINE];") == true) {
    Subtract = 11;
  }
  */

  /*
  if (PostText.length-Subtract < 3) {
    ShowPopUp("Must be Longer", "Your post must be at least <b>3 characters</b> long before you can post.", [ ["Okay", "#618BFF", null] ]);
    return;
  }
  */

  if (PostText.length-Subtract > MaxPostCharAmount) {  // 400 max characters
    ShowPopUp("Text Overload", "Your post has to have under <b>400 characters</b> in length! (" + (PostText.length-Subtract) + "/400)", [ ["Okay", "#618BFF", null] ]);
    return;
  }

  if (CreateMediaHolder.childNodes.length > 3) {
    ShowPopUp("Image Overload", "You can only upload up to <b>3 images</b> currently.", [ ["Okay", "#618BFF", null] ]);
    return;
  }

  //PostText = PostText.replaceAll("\n", "$[NEWLINE]");
  
  WaitPostTime = Math.floor(Date.now() / 1000) + 30;

  UpdatePostCharTextCounter(0);

  CreatePostTextHolder.textContent = "Ready to Hangout?";
  setCSS(CreatePostTextHolder, "color", "#aaaaaa");

  setCSS(CreateMediaHolder, "margin-top", "0px");
  var ImageElements = findClass("UploadedImage");

  var PostData = {
    Text: PostText,
    Media: {},
    Configuration: [] //"Hidden"
  }
  if (ImageElements.length > 0) {
    PostData.Media.ImageCount = ImageElements.length;
  }
  AddPost(PostData, ImageElements);
});

var ViewRefreshBar = createElement("ViewRefreshBar", "div", "MainContent", [
    ["position", "sticky"],
    ["display", "none"],
    ["width", "calc(100% - 20px)"],
    ["left", "0px"],
    ["top", "8px"],
    ["margin-top", "8px"],
    ["padding-left", "10px"],
    ["padding-right", "10px"],
    ["padding-top", "8px"],
    ["padding-bottom", "8px"],
    ["background-color", ContentColor],
    ["border-radius", "12px"],
    ["border-top-width", "8px"],
    ["box-shadow", "0px 6px 5px " + PageColor + ", 0px -25px 0px " + PageColor],
    ["z-index", "15"],
    
    // Text:
    ["font-size", "20px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", "#bbbbbb"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"]
]);
ViewRefreshBar.setAttribute("Solid", "true");

ViewRefreshBar.addEventListener("click", function() {
  //setCSS(ViewRefreshBar, "display", "none");
  window.scrollTo(0, 0);
  window.history.pushState("", "", "?post=");
  //RevertTitle();
  GetPosts({
    Add: "Top",
    Limit: 15
  });
});

// loadScript(LoadScripts.AdManager);
loadScript(LoadScripts.PostRender);