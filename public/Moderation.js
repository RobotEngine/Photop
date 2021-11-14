
SetPageTitle("Moderation | Photop");

var BackBlur = createElement("BackBlur", "div", "body", [
    ["position", "fixed"],
    ["width", "100%"],
    ["height", "100%"],
    ["backdrop-filter", "blur(2px)"],
    ["-webkit-backdrop-filter", "blur(2px)"],
    ["left", "0px"],
    ["top", "0px"],
    ["z-index", "999"]
]);

var Frame = createElement("Frame", "div", BackBlur, [
    ["position", "relative"],
    ["width", "100%"],
    ["max-width", "450px"],
    ["max-height", "100%"],
    ["background-color", LeftSidebarColor],
    ["border-style", "solid"],
    ["border-radius", "12px"],
    ["border-color", BorderColor],
    ["border-width", "4px"],
    ["left", "50%"],
    ["top", "50%"],
    ["transform", "translate(-50%, -50%)"],
    ["overflow-y", "auto"]
]);
Frame.className = "StandardScroll";

createElement("Title", "div", Frame, [
    ["position", "relative"],
    ["margin-top", "8px"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],

    // Text:
    ["font-size", "28px"],
    ["overflow-wrap", "break-word"],
    ["whitespace", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA],
    ["text-align", "left"]
]).textContent = "Ban " + SelectedModerationData.User;

createElement("Description", "div", Frame, [
    ["position", "relative"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],
    ["margin-bottom", "8px"],

    // Text:
    ["font-size", "18px"],
    ["overflow-wrap", "break-word"],
    ["whitespace", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", FontColorA],
    ["text-align", "left"]
]).innerHTML = "Type why and select how long you want to ban <b>" + SelectedModerationData.User + "</b> from Photop.";

var BanReasonTextBox = createElement("BanReasonTextBox", "div", Frame, [
    ["position", "relative"],
    ["display", "block"],
    ["left", "8px"],
    ["margin-top", "10px"],
    ["width", "calc(100% - 16px)"],
    ["min-height", "50px"],
    ["background-color", ContentColorLayer3],
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
BanReasonTextBox.className = "StandardScroll";
BanReasonTextBox.setAttribute("role", "textbox");
BanReasonTextBox.setAttribute("contenteditable", "true");
BanReasonTextBox.setAttribute("tabindex", "-1");
BanReasonTextBox.setAttribute("title", "Enter Ban Reason");

BanReasonTextBox.textContent = "Enter Ban Reason";
BanReasonTextBox.addEventListener("focus", function(e) {
  if (BanReasonTextBox.textContent == "Enter Ban Reason") {
    BanReasonTextBox.textContent = "";
    setCSS(BanReasonTextBox, "color", FontColorA);
  }
});
BanReasonTextBox.addEventListener("focusout", function(e) {
  UpdateBanButtonVisibility();
  if (BanReasonTextBox.innerText.length < 1 || BanReasonTextBox.innerText == "\n") {
    BanReasonTextBox.innerHTML = "Enter Ban Reason";
    setCSS(BanReasonTextBox, "color", "#aaaaaa");
  }
});

createElement("Description", "div", Frame, [
    ["position", "relative"],
    ["margin-left", "16px"],
    ["margin-top", "2px"],
    ["width", "calc(100% - 32px)"],

    // Text:
    ["font-size", "14px"],
    ["overflow-wrap", "break-word"],
    ["whitespace", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", "#bbbbbb"],
    ["text-align", "left"]
]).innerHTML = "<b>Important:</b> This ban reason will be displayed to " + SelectedModerationData.User + ". Please keep your reason formal and professional.";

var SubTitleCSS = [
    ["position", "relative"],
    ["margin-top", "8px"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],

    // Text:
    ["font-size", "22px"],
    ["overflow-wrap", "break-word"],
    ["whitespace", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA],
    ["text-align", "left"]
];

createElement("Title", "div", Frame, SubTitleCSS).textContent = "Ban Length";

var TerminateAccount = false;

var SelectedBanTime = 0;
function CreateReportButton(ButtonText, Length) {
  var LButton = createElement(ButtonText + "BanB", "div", Frame, [
      ["position", "relative"],
      //["margin-top", "4px"],
      ["padding-left", "6px"],
      ["padding-top", "4px"],
      ["padding-bottom", "4px"],
      ["margin-left", "8px"],
      ["margin-right", "8px"],
      ["text-align", "left"],
      ["border-radius", "6px"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "16px"],
      ["overflow-wrap", "break-word"],
      ["whitespace", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "500"],
      ["color", FontColorA],
      ["text-align", "left"]
  ]);
  LButton.textContent = ButtonText;
  LButton.setAttribute("LengthButtonBanLength", Length);
  LButton.setAttribute("onMouseOver", "if (this.className != 'SelectedBanReason' && this.className != 'SelectedTerminate') { this.style.backgroundColor = '" + ContentColor + "'; this.style.fontWeight = 900 }");
  LButton.setAttribute("onMouseOut", "if (this.className != 'SelectedBanReason' && this.className != 'SelectedTerminate') { this.style.backgroundColor = 'rgba(0, 0, 0, 0)'; this.style.fontWeight = 500 }");
  LButton.addEventListener("click", function() {
    var ButtonTimeAttribute = LButton.getAttribute("LengthButtonBanLength");
    if (ButtonTimeAttribute != "Terminate") {
      var SelectedReasons = document.getElementsByClassName("SelectedBanReason");
      for (var i = 0; i < SelectedReasons.length; i++) {
        setCSS(SelectedReasons[i], "background-color", "#ffffff00");
        setCSS(SelectedReasons[i], "font-weight", 500);
        SelectedReasons[i].className = "";
      }
      if (SelectedBanTime != ButtonTimeAttribute) {
        LButton.className = "SelectedBanReason";
        SelectedBanTime = ButtonTimeAttribute;
        setCSS(LButton, "background-color", "#FF5C5C");
        setCSS(LButton, "font-weight", 900);
      } else {
        SelectedBanTime = 0;
      }
    } else {
      if (TerminateAccount == false) {
        TerminateAccount = true;
        LButton.className = "SelectedTerminate";
        setCSS(LButton, "background-color", "#FF5C5C");
        setCSS(LButton, "font-weight", 900);
      } else {
        TerminateAccount = false;
        LButton.className = "";
        setCSS(LButton, "background-color", "#ffffff00");
        setCSS(LButton, "font-weight", 500);
      }
    }
    UpdateBanButtonVisibility();
  });
}
CreateReportButton("30 Minutes", 1800);
CreateReportButton("1 Hour", 3600);
CreateReportButton("6 Hours", 21600);
CreateReportButton("1 Day", 86400);
CreateReportButton("3 Days", 259200);
CreateReportButton("1 Week", 604800);
CreateReportButton("1 Month", 2678400);
CreateReportButton("3 Monthes", 7890000);
CreateReportButton("6 Months", 15780000);
CreateReportButton("1 Year", 31536000);
CreateReportButton("Permanent", "Permanent");

createElement("Title", "div", Frame, SubTitleCSS).textContent = "Terminate Account";
createElement("Description", "div", Frame, [
    ["position", "relative"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],
    ["margin-bottom", "8px"],

    // Text:
    ["font-size", "16px"],
    ["overflow-wrap", "break-word"],
    ["whitespace", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", FontColorA],
    ["text-align", "left"]
]).innerHTML = "Do you want to terminate the account <b>" + SelectedModerationData.User + "</b> from Photop. This will forever stop the account from being logged into and also hide all content. <i>(Check this for example if their name is inappropriate)</i>";

CreateReportButton("Terminate", "Terminate");

var ButtonHolder = createElement("ButtonHolder", "div", Frame, [
    ["position", "relative"],
    ["margin-top", "8px"],
    ["margin-bottom", "8px"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],
    ["text-align", "right"]
]);

var BanUserButton = createElement("BanUserButton", "div", ButtonHolder, [
    ["position", "relative"],
    ["display", "none"],
    ["width", "fit-content"],
    ["height", "45px"],
    ["margin-left", "8px"],
    ["margin-top", "8px"],
    ["background-color", "#FF5C5C"],
    ["border-radius", "8px"],
    ["cursor", "pointer"],

    // Text:
    ["padding-left", "10px"],
    ["padding-right", "10px"],
    ["font-size", "24px"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", "#ffffff"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"]
]);
BanUserButton.textContent = "Ban " + SelectedModerationData.User;

function UpdateBanButtonVisibility() {
  if (BanReasonTextBox.textContent != "Enter Ban Reason" && BanReasonTextBox.innerText.length > 0) {
    if (SelectedBanTime > 0 || SelectedBanTime == "Permanent" || TerminateAccount == true) {
      setCSS(BanUserButton, "display", "inline-flex");
      return;
    }
  }
  setCSS(BanUserButton, "display", "none");
}

BanUserButton.addEventListener("mouseup", function() {
  if (BanReasonTextBox.textContent != "Enter Ban Reason" && BanReasonTextBox.innerText.length > 0) {
    if (SelectedBanTime > 0 || SelectedBanTime == "Permanent" || TerminateAccount == true) {
      ModerateUserAction("Ban", { UserID: SelectedModerationData.UserID, Reason: BanReasonTextBox.innerText, BanLength: SelectedBanTime, TerminateAccount: TerminateAccount })
      
      BackBlur.remove();
      removeScript("./Moderation.js");
      RevertTitle();

      return;
    }
  }
  setCSS(BanUserButton, "display", "none");
});

var ClosePageButton = createElement("ClosePageButton", "div", ButtonHolder, [
    ["position", "relative"],
    ["display", "inline-flex"],
    ["width", "fit-content"],
    ["height", "45px"],
    ["margin-left", "8px"],
    ["margin-top", "8px"],
    ["background-color", ThemeColor],
    ["border-radius", "8px"],
    ["cursor", "pointer"],

    // Text:
    ["padding-left", "10px"],
    ["padding-right", "10px"],
    ["font-size", "24px"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", "#ffffff"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"]
]);
ClosePageButton.textContent = "Cancel";
ClosePageButton.addEventListener("click", function() {
  BackBlur.remove();
  removeScript("./Moderation.js");
  RevertTitle();
});