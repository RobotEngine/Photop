
var AboutText = [
  ["Title", "Your Hangout"],
  ["Paragraph", "Ever wanted a place to just hangout? Well with Photop this place is created!"],

  ["Title", "It Just Takes a Post..."],
  ["Paragraph", "All it takes is a post, and from their the conversation is started. Start a conversation about anything ranging from video games to anime. We won't judge!"],

  ["Title", "Contribute!"],
  ["Paragraph", "It's no fun without your thoughts! Check out posts and chat your opinion. With a live chat you can connect with people in a way not possible with traditional comments."],
];

SetPageTitle("About");
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
    ["max-width", "600px"],
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
        ["whitespace", "pre-wrap"],
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
        ["font-size", "18px"],
        ["overflow-wrap", "break-word"],
        ["whitespace", "pre-wrap"],
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
ClosePageButton.textContent = "Close";
ClosePageButton.addEventListener("click", function() {
  BackBlur.remove();
  removeScript("./AboutPage.js");
  RevertTitle();
});