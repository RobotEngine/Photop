
SetPageTitle("Banned");

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
    ["max-width", "400px"],
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
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA],
    ["text-align", "left"]
]).textContent = "Banned From Photop";

var BanDescription = createElement("Description", "div", Frame, [
    ["position", "relative"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],
    ["margin-bottom", "8px"],

    // Text:
    ["font-size", "18px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", FontColorA],
    ["text-align", "left"]
]);

var BanInfoCSS = [
    ["position", "relative"],
    //["margin-top", "4px"],
    ["padding-left", "6px"],
    ["padding-top", "4px"],
    ["padding-bottom", "4px"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],
    ["text-align", "left"],
    ["border-radius", "6px"],

    // Text:
    ["font-size", "16px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", FontColorA],
    ["text-align", "left"]
];
createElement("BanExpires", "div", Frame, BanInfoCSS).innerHTML = "<b>Account:</b> " + BanData.Account;
createElement("BanReason", "div", Frame, BanInfoCSS).innerHTML = "<b>Reason:</b> " + BanData.BanReason;
var CaclTimestamp = BanData.BanExpires;
if (CaclTimestamp != "Permanent") {
  CaclTimestamp = TimestampToString(CaclTimestamp);
} else {
  CaclTimestamp = "Never (Permanent)"
}
createElement("BanExpires", "div", Frame, BanInfoCSS).innerHTML = "<b>Expires:</b> " + CaclTimestamp;

if (BanData.Appealed == false) {
  BanDescription.innerHTML = "Oh no! It appears you have broken a Photop rule resulting in your account being banned. If you believe this to be a mistake, please let us know by writing an <b>Appeal</b> in the box below. Also note that you may only send 1 appeal.";

  var BanAppealTextBox = createElement("BanAppealTextBox", "div", Frame, [
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
  BanAppealTextBox.className = "StandardScroll";
  BanAppealTextBox.setAttribute("role", "textbox");
  BanAppealTextBox.setAttribute("contenteditable", "true");
  BanAppealTextBox.setAttribute("tabindex", "-1");
  BanAppealTextBox.setAttribute("title", "Write a Ban Appeal");

  BanAppealTextBox.textContent = "Write a Ban Appeal";
  BanAppealTextBox.addEventListener("focus", function(e) {
    if (BanAppealTextBox.textContent == "Write a Ban Appeal") {
      BanAppealTextBox.textContent = "";
      setCSS(BanAppealTextBox, "color", FontColorA);
    }
  });
  BanAppealTextBox.addEventListener("focusout", function(e) {
    UpdateAppealButtonVisibility();
    if (BanAppealTextBox.innerText.length < 1 || BanAppealTextBox.innerText == "\n") {
      BanAppealTextBox.innerHTML = "Write a Ban Appeal";
      setCSS(BanAppealTextBox, "color", "#aaaaaa");
    }
  });

  var AppealDescription = createElement("Description", "div", Frame, [
      ["position", "relative"],
      ["margin-left", "16px"],
      ["margin-top", "2px"],
      ["width", "calc(100% - 32px)"],

      // Text:
      ["font-size", "14px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "500"],
      ["color", "#bbbbbb"],
      ["text-align", "left"]
  ]);
  AppealDescription.innerHTML = "<b>Important:</b> Your appeal will be sent to Photop moderation. Please try to be professional and include as much information as possible.";

  var ButtonHolder = createElement("ButtonHolder", "div", Frame, [
      ["position", "relative"],
      ["margin-top", "8px"],
      ["margin-bottom", "8px"],
      ["margin-left", "8px"],
      ["margin-right", "8px"],
      ["text-align", "right"]
  ]);

  var AppealBanButton = createElement("ClosePageButton", "div", ButtonHolder, [
      ["position", "relative"],
      ["display", "none"],
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

  function UpdateAppealButtonVisibility() {
    if (BanAppealTextBox.textContent != "Enter Ban Reason" && BanAppealTextBox.innerText.length > 0) {
      setCSS(AppealBanButton, "display", "inline-flex");
      return;
    }
    setCSS(AppealBanButton, "display", "none");
  }

  AppealBanButton.textContent = "Send Appeal";
  AppealBanButton.addEventListener("click", function() {
    if (BanAppealTextBox.textContent != "Enter Ban Reason" && BanAppealTextBox.innerText.length > 0) {
      SendBanAppeal(BanAppealTextBox.textContent);
    }

    BanAppealTextBox.remove();
    AppealDescription.remove();
    AppealBanButton.remove();
  });
} else {
  BanDescription.innerHTML = "Oh no! It appears you have broken a Photop rule resulting in your account being banned.";

  var ButtonHolder = createElement("ButtonHolder", "div", Frame, [
      ["position", "relative"],
      ["margin-top", "8px"],
      ["margin-bottom", "8px"],
      ["margin-left", "8px"],
      ["margin-right", "8px"],
      ["text-align", "right"]
  ]);
}