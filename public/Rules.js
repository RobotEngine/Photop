
var AboutText = [
  ['Title', 'Photop Rules'],
  ['Paragraph', 'To keep this online community safe, there are a set of rules you must follow. Not following these rules may risk account termination.'],
  ['Paragraph', '<b>These Rules Consist Of:</b>'],
  ['Paragraph', '<b>No Abuse/Harassment:</b> Abusing or harassing others as well as inciting others is strictly against the rules.'],
  ['Paragraph', '<b>No Violence:</b> Promoting or inciting violence is highly against the rules.'],
  ['Paragraph', '<b>No Hateful Contect:</b> Spreading hateful content will result in a platform ban.'],
  ['Paragraph', '<b>No Child Exploitation:</b> There is zero tolerance for child exploitation.'],
  ['Paragraph', '<b>No Terrorism/Violent Extremism:</b> Promoting Terrorism/Violent Extremism is highly against Photop rules.'],
  ['Paragraph', '<b>No Promoting Suicide/Self Harm:</b> Promoting such material will result in penalties.'],
  ['Paragraph', '<b>No Illegal Content:</b> Posting illegal materials or content will not only result in account termination but also result in authority notification.'],
  ['Paragraph', '<b>No Sensitive/Adult Content (NSFW):</b> Posting any form of sensitive/adult content including not safe for work material will result in account penalties.'],

  ['Paragraph', '<b>Nothing Private:</b> Anyone can view content on Photop, so posting anything private to you or someone else is against the rules.'],
  ['Paragraph', '<b>Permission Required:</b> When sending material with others you must have their permission.'],

  ['Paragraph', '<b>No Platform Manipulation (Spam):</b> Using Photop in a way which abuses the system or abuses other users will result in account termination.'],
  ['Paragraph', '<b>No Impersonation:</b> Impersonating someone else will result in account termination.'],
  ['Paragraph', '<b>Copyright and Trademark:</b> Posting any assets which contain copyrighted or trademarked material without permission is against the rules.'],
];

//window.history.pushState("rules", "rules", "?page=" + "rules");

SetPageTitle("Rules");
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
    ["max-width", "500px"],
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

for (var i = 0; i < AboutText.length; i++) {
  if (AboutText[i][0] == "Title") {
    var TopMargin = "8px";
    if (i > 0) {
      TopMargin = "24px";
    } 
    createElement("Title", "div", Frame, [
        ["position", "relative"],
        ["margin-top", TopMargin],
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
    ]).textContent = AboutText[i][1];
  } else if (AboutText[i][0] == "Paragraph") {
    createElement("Description", "div", Frame, [
        ["position", "relative"],
        ["margin-left", "8px"],
        ["margin-right", "8px"],
        ["margin-bottom", "8px"],

        // Text:
        ["font-size", "16px"],
        ["overflow-wrap", "break-word"],
        ["white-space", "pre-wrap"],
        ["font-family", FontTypeA],
        ["font-weight", "500"],
        ["color", FontColorA],
        ["text-align", "left"]
    ]).innerHTML = AboutText[i][1];
  }
}

var ButtonHolder = createElement("ButtonHolder", "div", Frame, [
    ["position", "relative"],
    ["margin-top", "8px"],
    ["margin-bottom", "8px"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],
    ["text-align", "right"]
]);
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
ClosePageButton.textContent = "I Understand";
ClosePageButton.addEventListener("click", function() {
  BackBlur.remove();
  URLParams("page");
  RevertTitle();
  removeScript("./Rules.js");
});