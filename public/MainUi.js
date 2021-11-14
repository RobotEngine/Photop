var UserDisplaySettings = JSON.parse(window.localStorage.getItem("DisplaySettings")) || { "Embed Twitch Live Chat": true, "Embed Twitch Streams": true, "Embed YouTube Videos": true, "Embed GIFs": true, "Embed Scratch Games": false, "Embed code.org Projects": false, Theme: "Dark Mode" };

var CurrentTheme = "";

var BackColor;
var LeftSidebarColor;
var RightSidebarColor;

var PageColor;

var ContentColor;
var ContentColorLayer2;
var ContentColorLayer3;

var BorderColor;

var ThemeColor;  // Blue: #5ab7fa, Purple: #a587ff

var FontTypeA; //'Poppins', sans-serif
var FontTypeB;
var FontColorA;
var FontColorB;

// Room Color: #4FA1FF

if (UserDisplaySettings.Theme == "Light Mode") {
  CurrentTheme = "Light Mode";

  BackColor = "";
  LeftSidebarColor = "#E3E3E3";
  RightSidebarColor = "";

  PageColor = "#ffffff";

  ContentColor = "#EBEBEB";
  ContentColorLayer2 = "#E3E3E3";
  ContentColorLayer3 = "#D9D9D9";

  BorderColor = "#D8D8D8";

  ThemeColor = "#5ab7fa";  // Blue: #7DCBFF, Purple: #a587ff, CJKBlue: #5ab7fa

  FontTypeA = "Roboto, sans-serif"; //'Poppins', sans-serif
  FontTypeB = "";
  FontColorA = "#000000";
  FontColorB = "";
} else {
  CurrentTheme = "Dark Mode";

  BackColor = "";
  LeftSidebarColor = "#262630";
  RightSidebarColor = "";

  PageColor = "#151617";

  ContentColor = "#1F1F28";
  ContentColorLayer2 = "#24242E";
  ContentColorLayer3 = "#2A2A37";

  BorderColor = "#323242";

  ThemeColor = "#5ab7fa";  // Blue: #7DCBFF, Purple: #a587ff, CJKBlue: #5ab7fa

  FontTypeA = "Roboto, sans-serif"; //'Poppins', sans-serif
  FontTypeB = "";
  FontColorA = "#ffffff";
  FontColorB = "";
}

var SiteTitle = "Photop";
var PhotopLogoSVG = '<svg viewBox="0 0 668 188" xmlns="http://www.w3.org/2000/svg"> <rect y="0.0800018" width="361.813" height="160.427" rx="27.3067" fill="' + ThemeColor + '"/> <path d="M116.565 61.7867C116.565 69.0684 114.859 75.7244 111.445 81.7547C108.146 87.6711 103.083 92.4498 96.256 96.0907C89.5431 99.6178 81.2942 101.381 71.5093 101.381H54.9547V142H21.504V21.68H71.5093C81.1804 21.68 89.3724 23.3867 96.0853 26.8C102.912 30.2133 108.032 34.9351 111.445 40.9653C114.859 46.9955 116.565 53.936 116.565 61.7867ZM68.2667 74.7573C77.7102 74.7573 82.432 70.4338 82.432 61.7867C82.432 53.0258 77.7102 48.6453 68.2667 48.6453H54.9547V74.7573H68.2667ZM192.98 45.4027C203.903 45.4027 212.55 49.1004 218.921 56.496C225.407 63.7778 228.649 73.6764 228.649 86.192V142H195.199V90.6293C195.199 85.168 193.776 80.9013 190.932 77.8293C188.088 74.6436 184.276 73.0507 179.497 73.0507C174.491 73.0507 170.566 74.6436 167.721 77.8293C164.877 80.9013 163.455 85.168 163.455 90.6293V142H130.004V15.7067H163.455V59.9093C166.413 55.5858 170.395 52.1155 175.401 49.4987C180.521 46.768 186.381 45.4027 192.98 45.4027ZM291.548 143.195C281.991 143.195 273.4 141.204 265.777 137.221C258.268 133.239 252.352 127.55 248.028 120.155C243.704 112.759 241.543 104.055 241.543 94.0427C241.543 84.144 243.704 75.4969 248.028 68.1013C252.465 60.7058 258.439 55.0169 265.948 51.0347C273.571 47.0524 282.161 45.0613 291.719 45.0613C301.276 45.0613 309.809 47.0524 317.319 51.0347C324.942 55.0169 330.915 60.7058 335.239 68.1013C339.676 75.4969 341.895 84.144 341.895 94.0427C341.895 103.941 339.676 112.645 335.239 120.155C330.915 127.55 324.942 133.239 317.319 137.221C309.696 141.204 301.105 143.195 291.548 143.195ZM291.548 114.181C296.213 114.181 300.081 112.475 303.153 109.061C306.339 105.534 307.932 100.528 307.932 94.0427C307.932 87.5573 306.339 82.608 303.153 79.1947C300.081 75.7813 296.27 74.0747 291.719 74.0747C287.168 74.0747 283.356 75.7813 280.284 79.1947C277.212 82.608 275.676 87.5573 275.676 94.0427C275.676 100.642 277.155 105.648 280.113 109.061C283.072 112.475 286.883 114.181 291.548 114.181Z" fill="white"/> <path d="M439.808 113.499V142H425.301C400.839 142 388.608 129.883 388.608 105.648V74.0747H376.832V46.256H388.608V23.0453H422.229V46.256H439.637V74.0747H422.229V106.16C422.229 108.777 422.798 110.654 423.936 111.792C425.188 112.93 427.236 113.499 430.08 113.499H439.808ZM499.695 143.195C490.137 143.195 481.547 141.204 473.924 137.221C466.415 133.239 460.498 127.55 456.175 120.155C451.851 112.759 449.689 104.055 449.689 94.0427C449.689 84.144 451.851 75.4969 456.175 68.1013C460.612 60.7058 466.585 55.0169 474.095 51.0347C481.718 47.0524 490.308 45.0613 499.865 45.0613C509.423 45.0613 517.956 47.0524 525.465 51.0347C533.088 55.0169 539.062 60.7058 543.385 68.1013C547.823 75.4969 550.041 84.144 550.041 94.0427C550.041 103.941 547.823 112.645 543.385 120.155C539.062 127.55 533.088 133.239 525.465 137.221C517.842 141.204 509.252 143.195 499.695 143.195ZM499.695 114.181C504.36 114.181 508.228 112.475 511.3 109.061C514.486 105.534 516.079 100.528 516.079 94.0427C516.079 87.5573 514.486 82.608 511.3 79.1947C508.228 75.7813 504.416 74.0747 499.865 74.0747C495.314 74.0747 491.503 75.7813 488.431 79.1947C485.359 82.608 483.823 87.5573 483.823 94.0427C483.823 100.642 485.302 105.648 488.26 109.061C491.218 112.475 495.03 114.181 499.695 114.181ZM597.101 59.568C599.718 55.1307 603.416 51.6036 608.195 48.9867C612.973 46.3698 618.605 45.0613 625.091 45.0613C632.714 45.0613 639.597 47.0524 645.741 51.0347C651.999 55.0169 656.892 60.7058 660.419 68.1013C664.06 75.4969 665.88 84.144 665.88 94.0427C665.88 103.941 664.06 112.645 660.419 120.155C656.892 127.55 651.999 133.239 645.741 137.221C639.597 141.204 632.714 143.195 625.091 143.195C618.605 143.195 612.973 141.886 608.195 139.269C603.53 136.652 599.832 133.125 597.101 128.688V187.739H563.651V46.256H597.101V59.568ZM631.917 94.0427C631.917 87.7849 630.211 82.9493 626.797 79.536C623.498 76.0089 619.402 74.2453 614.509 74.2453C609.617 74.2453 605.464 76.0089 602.051 79.536C598.751 83.0631 597.101 87.8987 597.101 94.0427C597.101 100.3 598.751 105.193 602.051 108.72C605.464 112.247 609.617 114.011 614.509 114.011C619.402 114.011 623.498 112.247 626.797 108.72C630.211 105.079 631.917 100.187 631.917 94.0427Z" fill="' + ThemeColor + '"/> </svg>';

var MaxPostCharAmount = 400;

setCSS("body", "background-color", PageColor);


const GoogleCloudStorgeURL = "https://storage.googleapis.com/parcel-7d05a.appspot.com/"; //"https://photopcdn.exotektechnolog.repl.co/";

// MOVE TO JSS:

function removeCSS(Element, Attribute) {
  if (typeof Element == "string") {
    Element = document.getElementById(Element);
  }

  var OriginalStyle = Element.getAttribute("style").split("; ");

  OriginalStyle.pop();
  for (i = 0; i < OriginalStyle.length; i += 1) {
    CurrentCheck = "|| " + OriginalStyle[i] + " ||";
    FirstPart = CurrentCheck.split("|| ").pop().split(": ")[0];
    SecondPart = CurrentCheck.split(": ").pop().split(" ||")[0];

    if (FirstPart === Attribute) {
      OriginalStyle[i] = "";
    }
  }
  var ReapplyStyle = "";
  for (p = 0; p < OriginalStyle.length; p += 1) {
    if (OriginalStyle[p] != "") {
      ReapplyStyle = ReapplyStyle + OriginalStyle[p] + "; ";
    }
  }
  Element.setAttribute("style", ReapplyStyle);

  //Element.style.removeProperty(Attribute);
}

function URLParams(Key, Value) {
  const Url = new URL(window.location);
  if (Value != null) {
    Url.searchParams.set(Key, Value);
  } else {
    Url.searchParams.delete(Key);
  }
  window.history.pushState({}, '', Url);
}

function RemoveAllURLParams() {
  const Url = new URL(window.location).searchParams;
  for (const Key of Url.keys()) {
    URLParams(Key);
  }
}

class Swipe {
  // CREDIT: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
  constructor(element) {
    this.xDown = null;
    this.yDown = null;
    this.element = typeof (element) === 'string' ? document.querySelector(element) : element;

    this.element.addEventListener('touchstart', function (evt) {
      this.xDown = evt.touches[0].clientX;
      this.yDown = evt.touches[0].clientY;
    }.bind(this), { passive: true });

  }

  onLeft(callback) {
    this.onLeft = callback;

    return this;
  }

  onRight(callback) {
    this.onRight = callback;

    return this;
  }

  onUp(callback) {
    this.onUp = callback;

    return this;
  }

  onDown(callback) {
    this.onDown = callback;

    return this;
  }

  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
      if (this.xDiff > 0) {
        this.onLeft();
      } else {
        this.onRight();
      }
    } else {
      if (this.yDiff > 0) {
        this.onUp();
      } else {
        this.onDown();
      }
    }

    // Reset values.
    this.xDown = null;
    this.yDown = null;
  }

  run() {
    this.element.addEventListener('touchmove', function (evt) {
      try {
        this.handleTouchMove(evt).bind(this);
      } catch { }
    }.bind(this), { passive: true });
  }
}

function DisableScrolling() {
  var x = window.scrollX;
  var y = window.scrollY;
  window.onscroll = function () { window.scrollTo(x, y); };
}

function EnableScrolling() {
  window.onscroll = function () { };
}

var PreviousTitles = [SiteTitle];
function SetPageTitle(NewTitle) {
  NewTitle += " | " + SiteTitle;
  if (document.title != NewTitle) {
    PreviousTitles.push(NewTitle);
    document.title = NewTitle;
  }
}
function RevertTitle(ConfirmString) {
  if (ConfirmString == null || document.title == ConfirmString) {
    if (PreviousTitles.length > 1) {
      PreviousTitles.pop();
    }
    document.title = PreviousTitles[PreviousTitles.length - 1];
  }
}
function OverideTitle(NewTitle) {
  NewTitle += " | " + SiteTitle;
  if (document.title != NewTitle) {
    PreviousTitles = [SiteTitle, NewTitle]
    document.title = NewTitle;
  }
}

function CheckElementVisible(Element, ScrollFrame) {
  return (ScrollFrame.scrollTop - Element.offsetHeight + 10 < Element.offsetTop && Element.offsetTop < ScrollFrame.scrollTop + ScrollFrame.clientHeight - 30);
}

function DeviceIsMobile() {
  // CREDIT: https://medium.com/simplejs/detect-the-users-device-type-with-a-simple-javascript-check-4fc656b735e1
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

function TimestampToString(Seconds) {
  var Values = {
    Year: 31536000,
    Month: 2678400,
    Week: 604800,
    Day: 86400,
    Hour: 3600,
    Minute: 60,
    Second: 1,
  }
  var Result = {};

  var ValueKeys = Object.keys(Values);
  for (var i = 0; i < ValueKeys.length; i++) {
    var ValueTake = Values[ValueKeys[i]];

    while (Seconds - ValueTake > 0) {
      if (Result[ValueKeys[i]] == null) {
        Result[ValueKeys[i]] = 1;
      } else {
        Result[ValueKeys[i]] += 1;
      }
      Seconds -= ValueTake;
    }
  }

  var Formatted = "";
  var ResultKeys = Object.keys(Result);
  for (var i = 0; i < ResultKeys.length; i++) {
    var Item = Result[ResultKeys[i]];

    if (Item > 1) {
      Formatted += Item + " " + ResultKeys[i] + "s  ";
    } else {
      Formatted += Item + " " + ResultKeys[i] + "  ";
    }
  }

  return Formatted;
}

var TabIsOpen = true;
// CREDIT: https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
document.addEventListener("visibilitychange", async function () {
  if (document.hidden == true) {
    TabIsOpen = false;
  } else {
    LastPong = Date.now();
    TabIsOpen = true;
  }
}, false);

function DecideProfilePic(UserData) {
  if (UserData != null && UserData.Settings != null && UserData.Settings.ProfilePic != null) {
    return UserData.Settings.ProfilePic;
  }
  return "DefaultProfilePic";
}

function CleanString(String) {
  if (String == null) {
    return null;
  }

  /*
  String = String.replace(/\&/g, '&#38;');
  String = String.replace(/\;/g, '&#59;');
  
  //ChatText = ChatText.replaceAll("#", "&#35;");

  //ChatText = ChatText.replace(/&zwj/g, ''); // Invisible charecter.
  String = String.replace(/\s/g, ' ');
  String = String.replace(/\&nbsp\;/g, ' ');
  */

  String = String.replace(/\=/g, '&#61;');
  String = String.replace(/\?/g, "&#63;");

  // XSS Protection:
  String = String.replace(/\</g, '&#60;');
  String = String.replace(/\>/g, '&#62;');

  return String;
}

function CreateAbbreviatedCount(Element, Count) {
  if (Count != null) {
    var AbbCount = Count;
    // ABBREVIATE LATER

    if (Element != null) {
      Element.setAttribute("OfficialCount", Count);
      Element.innerHTML = AbbCount;
    } else {
      return AbbCount;
    }
  }
}
var TypingDisabled = false;
find("body").addEventListener("keydown", function (event) {
  if (TypingDisabled == true) {
    event.preventDefault();http://127.0.0.1:5501/PhotopClient/?user=60bd0243edf9d8003785ad79
    return false;
  }
});

function UnderlineHoverOn(Elements) {
  for (var i = 0; i < Elements.length; i++) {
    setCSS(Elements[i], "text-decoration", "underline");
  }
}
function UnderlineHoverOff(Elements) {
  for (var i = 0; i < Elements.length; i++) {
    removeCSS(Elements[i], "text-decoration");
  }
}

var LoadScriptMetadata = null;

createElement("SideBarHolder", "div", "Primary", [
  ["position", "relative"],
  ["width", "225px"],
  ["float", "left"],
  ["left", "8px"],
  ["top", "0px"]
]);

createElement("SideBar", "div", "SideBarHolder", [
  ["position", "sticky"],
  ["display", "inline-block"],
  ["width", "100%"],
  ["max-height", "100vh"],
  ["overflow-y", "auto"],
  ["direction", "rtl"],
  ["float", "left"],
  ["left", "0px"],
  ["top", "0px"]
]).className = "StandardScroll";

createElement("TopImage", "div", "SideBar", [
  ["position", "relative"],
  ["width", "100%"],
  ["background-color", LeftSidebarColor],
  ["text-align", "center"],
  ["margin-top", "8px"],
  ["direction", "ltr"],
  ["justify-content", "center"],
  ["align-items", "center"],

  ["border-radius", "12px"],
]);
createElement("ExotekLogoDisplay", "div", "TopImage", [
  ["position", "relative"],
  ["width", "90%"],
  ["left", "50%"],
  ["transform", "translate(-50%, 0%)"],
  ["padding-top", "12px"],
  ["padding-bottom", "12px"],
  ["cursor", "pointer"]
  //["content", "url(./Images/PhotopLogo1.svg)"]
]).innerHTML = PhotopLogoSVG;

createElement("MainButtonHolder", "div", "SideBar", [
  ["box-sizing", "border-box"],
  ["width", "100%"],
  ["margin-top", "8px"],
  ["padding", "1px 6px 5px 6px"],
  ["background-color", LeftSidebarColor],
  ["direction", "ltr"],
  ["border-radius", "12px"],
]);

function CreateSideButton(ID, Text, Title, SVG) {
  var NewButton = createElement(ID, "div", "MainButtonHolder", [
    ["position", "relative"],
    ["display", "flex"],
    ["width", "100%"],
    ["height", "50px"],
    ["margin-top", "5px"],
    ["margin-bottom", "1px"],
    ["align-items", "center"],
    ["background-color", ContentColorLayer3],
    ["border-radius", "8px"],
    ["cursor", "pointer"],
  ]);
  if (SVG != null) {
    createElement(ID + "Icon", "div", NewButton, [
      ["width", "35px"],
      ["height", "35px"],
      ["margin-left", "7.5px"]
    ]).innerHTML = SVG;
  }
  var ButtonTx = createElement(ID, "div", NewButton, [
    ["margin-left", "6px"],
  
    // Text:
    ["font-size", "26px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA]
  ]);
  ButtonTx.textContent = Text;
  NewButton.setAttribute("title", Title || Text);
  return NewButton;
}

async function MobileCloseNavButtons() {
  var NavButtonHolder = find("NavButtonHolder");
  if (NavButtonHolder != null && NavButtonHolder.hasAttribute("Open") == true) {
    NavButtonHolder.style.left = "-70%";
    await sleep(400);
    NavButtonHolder.removeAttribute("Open");
  }
}

var RefreshHomeButton = CreateSideButton("RefreshHomeButton", "Home", "Home", '<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_101:2)"> <mask id="mask0_101:2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="12" y="78" width="231" height="187"> <path d="M12.1473 78.6676H242.853V264.925H12.1473V78.6676Z" fill="' + ThemeColor + '"/> </mask> <g mask="url(#mask0_101:2)"> <path d="M50.2857 60.2117H203.549C206.863 60.2117 209.549 62.898 209.549 66.2117V225.643C209.549 228.956 206.863 231.643 203.549 231.643H159.813C156.499 231.643 153.813 228.956 153.813 225.643V192.424C153.813 178.064 142.172 166.424 127.813 166.424H126.605C112.246 166.424 100.605 178.064 100.605 192.424V225.643C100.605 228.956 97.9186 231.643 94.6049 231.643H50.2857C46.972 231.643 44.2857 228.956 44.2857 225.643V66.2117C44.2857 62.898 46.972 60.2117 50.2857 60.2117Z" stroke="' + ThemeColor + '" stroke-width="20"/> </g> <mask id="mask1_101:2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="-3" y="0" width="261" height="103"> <path d="M-3 0H258V102.045H-3V0Z" fill="' + ThemeColor + '"/> </mask> <g mask="url(#mask1_101:2)"> <path d="M12.3748 101.977L127.5 18.1542L242.625 101.977V130.561H12.3748V101.977Z" stroke="' + ThemeColor + '" stroke-width="20"/> </g> </g> <defs> <clipPath id="clip0_101:2"> <rect width="256" height="256" fill="' + ThemeColor + '"/> </clipPath> </defs> </svg>');
RefreshHomeButton.onclick = function () {
  SwitchPage("Home");
  GetPosts({
    Add: "Top",
    Limit: 15
  });
  MobileCloseNavButtons();
}

var PostNavButton = CreateSideButton("PostHomeButton", "Post", "Create Post", '<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M235 158.988H172.506C164.774 158.988 158.506 165.256 158.506 172.988V235C158.506 238.314 155.82 241 152.506 241H101.529C98.2156 241 95.5293 238.314 95.5293 235V172.988C95.5293 165.256 89.2613 158.988 81.5293 158.988H20C16.6863 158.988 14 156.302 14 152.988V102.012C14 98.698 16.6863 96.0117 20 96.0117H81.5293C89.2613 96.0117 95.5293 89.7437 95.5293 82.0117V20C95.5293 16.6863 98.2156 14 101.529 14H152.506C155.82 14 158.506 16.6863 158.506 20V82.0117C158.506 89.7437 164.774 96.0117 172.506 96.0117H235C238.314 96.0117 241 98.698 241 102.012V152.988C241 156.302 238.314 158.988 235 158.988Z" stroke="' + ThemeColor + '" stroke-width="20"/> </svg>');
PostNavButton.onclick = function () {
  if (CurrentPage != "Home") {
    SwitchPage("Home");
    GetPosts({
      Add: "Top",
      Limit: 15
    });
  }

  var PostCreate = find("CreatePostTextHolder");
  if (PostCreate != null) {
    PostCreate.focus();
  }
  MobileCloseNavButtons();
}

var YourProfileButton = CreateSideButton("YourProfileButton", "Profile", "View Profile", '<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_102:25)"> <path d="M242 260C242 272.368 232.248 285.987 211.038 297.105C190.3 307.976 160.958 315 128 315C95.0417 315 65.6996 307.976 44.9615 297.105C23.7515 285.987 14 272.368 14 260C14 247.632 23.7515 234.013 44.9615 222.895C65.6996 212.024 95.0417 205 128 205C160.958 205 190.3 212.024 211.038 222.895C232.248 234.013 242 247.632 242 260Z" stroke="' + ThemeColor + '" stroke-width="20"/> <circle cx="128" cy="105" r="63" stroke="' + ThemeColor + '" stroke-width="20"/> </g> <defs> <clipPath id="clip0_102:25"> <rect width="256" height="256"/> </clipPath> </defs> </svg>');
YourProfileButton.onclick = function () {
  if (UserID != null) {
    LoadProfilePage(UserID);
  }
  MobileCloseNavButtons();
}

var SettingsButton = CreateSideButton("SettingsButton", "Settings", "Change Settings", '<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M126.5 149C138.374 149 148 139.374 148 127.5C148 115.626 138.374 106 126.5 106C114.626 106 105 115.626 105 127.5C105 139.374 114.626 149 126.5 149Z" fill="' + ThemeColor + '"/> <path d="M101 64L108.972 12.846C109.048 12.3591 109.467 12 109.96 12H144.04C144.533 12 144.952 12.3591 145.028 12.846L153 64" stroke="' + ThemeColor + '" stroke-width="20"/> <path d="M153 192L145.028 243.154C144.952 243.641 144.533 244 144.04 244H109.96C109.467 244 109.048 243.641 108.972 243.154L101 192" stroke="' + ThemeColor + '" stroke-width="20"/> <path d="M84.5744 182.517L36.2877 201.19C35.8281 201.367 35.3074 201.184 35.061 200.757L18.0211 171.243C17.7747 170.816 17.876 170.274 18.2598 169.964L58.5744 137.483" stroke="' + ThemeColor + '" stroke-width="20"/> <path d="M169.426 73.4833L217.712 54.8103C218.172 54.6326 218.693 54.8162 218.939 55.243L235.979 84.757C236.225 85.1838 236.124 85.7265 235.74 86.0357L195.426 118.517" stroke="' + ThemeColor + '" stroke-width="20"/> <path d="M195.426 137.483L235.74 169.964C236.124 170.274 236.225 170.816 235.979 171.243L218.939 200.757C218.693 201.184 218.172 201.367 217.712 201.19L169.426 182.517" stroke="' + ThemeColor + '" stroke-width="20"/> <path d="M58.5744 118.517L18.2598 86.0357C17.876 85.7265 17.7747 85.1838 18.0211 84.757L35.061 55.243C35.3074 54.8162 35.8281 54.6326 36.2877 54.8103L84.5744 73.4833" stroke="' + ThemeColor + '" stroke-width="20"/> <path d="M194 128C194 165.003 164.003 195 127 195C89.9969 195 60 165.003 60 128C60 90.9969 89.9969 61 127 61C164.003 61 194 90.9969 194 128Z" stroke="' + ThemeColor + '" stroke-width="20"/> </svg>');
SettingsButton.onclick = function () {
  LoadScriptMetadata = null;
  loadScript(LoadScripts.Settings);
  SetPageTitle("Settings");
  MobileCloseNavButtons();
}

var LogoutButton = CreateSideButton("LogoutButton", "Logout", "Logout of Account", '<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.4865 124.509L123.607 32.3383C127.507 29.0437 133.478 31.8162 133.478 36.922V78.9462C133.478 82.2599 136.165 84.9462 139.478 84.9462H240C243.314 84.9462 246 87.6325 246 90.9462V162.258C246 165.572 243.314 168.258 240 168.258H139.478C136.165 168.258 133.478 170.944 133.478 174.258V219.259C133.478 224.334 127.569 227.117 123.656 223.884L14.5363 133.718C11.6525 131.335 11.6286 126.923 14.4865 124.509Z" stroke="' + ThemeColor + '" stroke-width="20"/> </svg>');
LogoutButton.onclick = function () {
  SwitchPage("Home");
  SignOutOfAccount();
  MobileCloseNavButtons();
}

/*
if (DeviceIsMobile() == false && navigator.userAgent.toLowerCase().includes(" electron/") == false) {
  createElement("DownloadDesktopApp", "div", "SideBar", [
      ["position", "relative"],
      ["width", "100%"],
      ["margin", "8px 0px 8px 0px"],
      ["height", "128px"],
      ["background-color", LeftSidebarColor],
      ["direction", "ltr"],
      ["border-radius", "12px"]
  ]);

  var SVGElem = createElement("DesktopIconSvg", "svg", "DownloadDesktopApp", [
      ["position", "absolute"],
      ["top", "10px"],
      ["left", "10px"],
      ["height", "70px"],
      ["width", "70px"]
  ], "http://www.w3.org/2000/svg");
  SVGElem.setAttribute("viewBox", "0 0 512 512");
  createElement("DesktopIconSvg", "path", "DesktopIconSvg", null, "http://www.w3.org/2000/svg").setAttribute("d", "m467 14.292h-422c-24.813 0-45 20.187-45 45v305c0 24.813 20.187 45 45 45h151.198l-13.189 58.416h-63.275v30h272.532v-30h-63.275l-13.189-58.416h151.198c24.813 0 45-20.187 45-45v-305c0-24.813-20.187-45-45-45zm-422 30h422c8.271 0 15 6.729 15 15v240h-452v-240c0-8.271 6.729-15 15-15zm240.047 365 13.189 58.416h-84.471l13.189-58.416zm181.953-30h-422c-8.271 0-15-6.729-15-15v-35h452v35c0 8.271-6.729 15-15 15z");
  SVGElem.setAttribute("fill", ThemeColor);
  var PhotopLogo = createElement("PhotopLogoSvg", "div", "DownloadDesktopApp", [
      ["position", "absolute"],
      ["top", "10px"],
      ["left", "17.5px"],
      ["height", "50px"],
      ["width", "55px"],
      ["content", "url('./Images/PhotopLogo1.svg')"]
  ]);
  createElement("DesktopTitleTx", "div", "DownloadDesktopApp", [
      ["position", "relative"],
      ["top", "10px"],
      ["left", "86px"],
      ["width", "calc(100% - 92px)"],

      // Text:
      ["font-size", "22px"],
      ["overflow-wrap", "break-word"],
      ["font-family", FontTypeA],
      ["font-weight", "500"],
      ["color", FontColorA],
      ["text-align", "left"]
  ]).innerHTML = "Desk<b style='font-size: 24px; color:" + ThemeColor + "'>Top</b>";
  createElement("DesktopDescTx", "div", "DownloadDesktopApp", [
      ["position", "relative"],
      ["margin-top", "10px"],
      ["left", "86px"],
      ["width", "calc(100% - 92px)"],

      // Text:
      ["font-size", "12px"],
      ["overflow-wrap", "break-word"],
      ["font-family", FontTypeA],
      ["font-weight", "500"],
      ["color", "#bbbbbb"],
      ["text-align", "left"]
  ]).textContent = "Hangout even more by downloading the desktop app!";

  var DownloadDesktopButton = createElement("DesktopDownloadB", "a", "DownloadDesktopApp", [
      ["position", "absolute"],
      ["bottom", "10px"],
      ["left", "10px"],
      ["width", "calc(100% - 20px)"],
      ["background-color", ThemeColor],
      ["border-radius", "8px"],
      ["padding-top", "4px"],
      ["padding-bottom", "2px"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "18px"],
      ["overflow-wrap", "break-word"],
      ["text-decoration", "none"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "center"]
  ]);
  DownloadDesktopButton.textContent = "Download";
  DownloadDesktopButton.setAttribute("href", "https://github.com/DarkStudioHost/PhotopDesktop/releases/download/1.0.0-beta/PhotopSetup.exe");
  DownloadDesktopButton.setAttribute("title", "Download Photop Desktop")
}
*/

// Product Hunt:
createElement("ProductHuntDisplay", "div", "SideBar", [
  ["position", "relative"],
  ["width", "100%"],
  ["margin", "8px 0px 8px 0px"],
  ["background-color", LeftSidebarColor],
  ["direction", "ltr"],
  ["border-radius", "12px"]
]);
createElement("TitleTx", "div", "ProductHuntDisplay", [
  ["position", "relative"],
  ["top", "8px"],
  ["left", "8px"],
  ["width", "calc(100% - 16px)"],

  // Text:
  ["font-size", "22px"],
  ["overflow-wrap", "break-word"],
  ["font-family", FontTypeA],
  ["font-weight", "500"],
  ["color", FontColorA],
  ["text-align", "center"]
]).textContent = "Help Photop!";
createElement("DescTx", "div", "ProductHuntDisplay", [
  ["position", "relative"],
  ["margin-top", "10px"],
  ["left", "8px"],
  ["width", "calc(100% - 16px)"],

  // Text:
  ["font-size", "12px"],
  ["overflow-wrap", "break-word"],
  ["font-family", FontTypeA],
  ["font-weight", "500"],
  ["color", "#bbbbbb"],
  ["text-align", "center"]
]).innerHTML = "Upvote and comment on <i>Product Hunt</i> to help Photop reach more people!";
var LinkProductHunt = createElement("LinkProductHunt", "a", "ProductHuntDisplay", [
  ["position", "relative"],
  ["margin", "6px 0px 4px 0px"],
  ["left", "8px"],
  ["width", "calc(100% - 16px)"],
  ["content", "url('./Images/ProductHuntFeatured.svg')"]
]);
LinkProductHunt.href = "https://www.producthunt.com/posts/photop";
LinkProductHunt.setAttribute("target", "_blank");
//

createElement("ExtraInfoHolder", "div", "SideBar", [
  ["position", "relative"],
  ["width", "100%"],
  ["margin-top", "8px"],
  ["margin-bottom", "8px"],
  ["background-color", LeftSidebarColor],
  ["direction", "ltr"],
  ["border-radius", "12px"],

  ["text-align", "center"],
  ["justify-content", "center"],
  ["align-items", "center"]
]);
var TermsOfUseB = createElement("TermsofUseExtraInfoButton", "div", "ExtraInfoHolder", [
  ["position", "relative"],
  ["display", "inline-flex"],
  ["margin-top", "6px"],

  ["cursor", "pointer"],

  // Text:
  ["font-size", "14px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", FontColorA],
  ["text-align", "center"],
  ["justify-content", "center"],
  ["align-items", "center"]
]);
TermsOfUseB.textContent = "Terms of Use ●";
TermsOfUseB.addEventListener("click", function () {
  URLParams("page", "tos");
  loadScript(LoadScripts.TOS);
});
var PrivacyPolicyB = createElement("PrivicyPolicyExtraInfoButton", "div", "ExtraInfoHolder", [
  ["position", "relative"],
  ["display", "inline-flex"],
  ["padding-left", "4px"],

  ["cursor", "pointer"],

  // Text:
  ["font-size", "14px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", FontColorA],
  ["text-align", "center"],
  ["justify-content", "center"],
  ["align-items", "center"]
]);
PrivacyPolicyB.textContent = "Privacy Policy";
PrivacyPolicyB.addEventListener("click", function () {
  URLParams("page", "privacy");
  loadScript(LoadScripts.Privacy);
});
var RulesB = createElement("RulesExtraInfoButton", "div", "ExtraInfoHolder", [
  ["position", "relative"],
  ["display", "inline-flex"],
  ["padding-left", "4px"],

  ["cursor", "pointer"],

  // Text:
  ["font-size", "14px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", FontColorA],
  ["text-align", "center"],
  ["justify-content", "center"],
  ["align-items", "center"]
]);
RulesB.textContent = "Rules ●";
RulesB.addEventListener("click", function () {
  URLParams("page", "rules");
  loadScript(LoadScripts.Rules);
});
var AboutB = createElement("AboutExtraInfoButton", "div", "ExtraInfoHolder", [
  ["position", "relative"],
  ["display", "inline-flex"],
  ["padding-left", "4px"],

  ["cursor", "pointer"],

  // Text:
  ["font-size", "14px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", FontColorA],
  ["text-align", "center"],
  ["justify-content", "center"],
  ["align-items", "center"]
]);
AboutB.textContent = "About ●";
AboutB.addEventListener("click", function () {
  window.location = "https://photop.live/?from=photopweb";
});
var TwitterB = createElement("TwitterExtraInfoButton", "div", "ExtraInfoHolder", [
  ["position", "relative"],
  ["display", "inline-flex"],
  ["padding-left", "4px"],

  ["cursor", "pointer"],

  // Text:
  ["font-size", "14px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", FontColorA],
  ["text-align", "center"],
  ["justify-content", "center"],
  ["align-items", "center"]
]);
TwitterB.textContent = "Twitter ●";
TwitterB.addEventListener("click", function () {
  window.open("https://twitter.com/PhotopMedia");
});
var DiscordB = createElement("DiscordExtraInfoButton", "div", "ExtraInfoHolder", [
  ["position", "relative"],
  ["display", "inline-flex"],
  ["padding-left", "4px"],

  ["cursor", "pointer"],

  // Text:
  ["font-size", "14px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", FontColorA],
  ["text-align", "center"],
  ["justify-content", "center"],
  ["align-items", "center"]
]);
DiscordB.textContent = "Discord";
DiscordB.addEventListener("click", function () {
  window.open("https://discord.gg/gnBVPbrAPd");
});
createElement("Copyright", "div", "ExtraInfoHolder", [
  ["position", "relative"],
  ["display", "inline-flex"],
  ["padding-top", "12px"],
  ["margin-bottom", "6px"],

  // Text:
  ["font-size", "11px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", "#bbbbbb"],
  ["text-align", "center"],
  ["justify-content", "center"],
  ["align-items", "center"]
]).textContent = "©2021 Exotek LLC - All rights reserved.";

var CurrentPage = "Home";
var SwitchTimeout = 0;

async function CloseMobileLiveChat() {
  var MobileLiveChatHolder = find("LiveChatHolder");
  if (MobileLiveChatHolder != null && MobileLiveChatHolder.hasAttribute("Open") == true) {
    removeCSS("body", "position");
    removeCSS("Primary", "overflow");
    window.scrollTo(0, ScrolledToMobile);

    MobileLiveChatHolder.style.left = "110%";
    await sleep(400);

    MobileLiveChatHolder.removeAttribute("Open");
    MobileLiveChatHolder.firstChild.remove();
  }
}

async function SwitchPage(Page, BypassCurrent) {
  CloseMobileLiveChat();

  window.scrollTo(window.scrollX, 0);
  
  if (CurrentPage == Page && BypassCurrent != true) {
    return false;
  }

  var MainContent = find("MainContent");
  if (MainContent == null) {
    return false;
  }
  
  if (Date.now() - SwitchTimeout < 1000 && BypassCurrent != true) {
    return;
  }
  SwitchTimeout = Date.now();

  CurrentPage = Page;

  var Nodes = MainContent.childNodes;
  var RemoveNodes = [];
  for (var i = 0; i < Nodes.length; i++) {
    var Node = Nodes[i];
    if (Node.hasAttribute("Solid") == false) {
      RemoveNodes.push(Node);
    }
  }
  for (var n = 0; n < RemoveNodes.length; n++) {
    RemoveNodes[n].remove();
  }
  
  RemoveAllURLParams();
  GettingNewPosts = false;
  if (find("FollowerBackBlur") != null) {
    find("FollowerBackBlur").remove();
  }
  if (Page == "Profile") {
    if (PostDisplayHolder != null) {
      PostDisplayHolder.remove();
    }
    setCSS("LoginForm", "visibility", "hidden");
    setCSS("LoginForm", "position", "absolute");
    setCSS("CreatePost", "visibility", "hidden");
    setCSS("CreatePost", "position", "absolute");
    setCSS("ViewRefreshBar", "display", "none");
  } else if (Page == "Home") {
    LoadMoreType = "Posts";
    removeCSS("LoginForm", "visibility");
    setCSS("LoginForm", "position", "relative");
    removeCSS("CreatePost", "visibility");
    setCSS("CreatePost", "position", "relative");
    setCSS("ViewRefreshBar", "display", "block");
    if (PostDisplayHolder == null || (ViewingProfileID != null && (find("PostDisplayHolder") == null || find("PostDisplayHolder").parentNode.id != "ProfileContentHolder"))) {
      CreatePostDisplay();
    }
    ViewingProfileID = null;
  }
  return true;
}

function ShowPopUp(Title, Disc, Buttons) {
  TypingDisabled = true;

  SetPageTitle(Title + "");
  var BackBlur = createElement("PopUpBackBlur", "div", "body", [
    ["position", "fixed"],
    ["width", "100%"],
    ["height", "100%"],
    ["backdrop-filter", "blur(2px)"],
    ["-webkit-backdrop-filter", "blur(2px)"],
    ["left", "0px"],
    ["top", "0px"],
    ["z-index", "999"]
  ]);
  var PopUp = createElement("PopUp", "div", BackBlur, [
    ["position", "relative"],
    ["width", "100%"],
    ["max-width", "425px"],
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
  PopUp.className = "StandardScroll";
  createElement("Title", "div", PopUp, [
    ["position", "relative"],
    ["margin-top", "8px"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],

    // Text:
    ["font-size", "32px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA],
    ["text-align", "left"]
  ]).textContent = Title;
  createElement("Description", "div", PopUp, [
    ["position", "relative"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],

    // Text:
    ["font-size", "20px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", FontColorA],
    ["text-align", "left"]
  ]).innerHTML = Disc;
  var ButtonHolder = createElement("MainButtonHolder", "div", PopUp, [
    ["position", "relative"],
    //["min-height", "45px"],
    //["margin-top", "8px"],
    ["margin-bottom", "8px"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],
    ["text-align", "right"]
  ]);
  for (var i = 0; i < Buttons.length; i++) {
    var Button = Buttons[i];

    var ButtonObj = createElement(Button[0] + "PopUpButton", "div", ButtonHolder, [
      ["position", "relative"],
      ["display", "inline-flex"],
      ["width", "fit-content"],
      ["height", "45px"],
      ["margin-left", "8px"],
      ["margin-top", "8px"],
      ["background-color", Button[1]],
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
    ButtonObj.textContent = Button[0];

    function ClickFunction(ClickB, Obj) {
      Obj.addEventListener("click", function () {
        TypingDisabled = false;
        if (ClickB[2] != null) {
          var Function = window[ClickB[2]];
          if (typeof Function === "function") {
            if (Title == "It's Better Together") {
              window.scrollTo(0, 0);
            }
            Function();
          }
        }

        if (BackBlur != null) {
          BackBlur.remove();
          RevertTitle();
        }
      });
    }

    ClickFunction(Button, ButtonObj);
  }
}

var CurrentDropdown = null;
var LastClickTime = Date.now();
function CreateDropdown(Element, Buttons, Offset, Side) {
  LastClickTime = Date.now();
  var ItemRect = Element.getBoundingClientRect();
  if (Offset == null) {
    Offset = 0;
  }
  var SetTop = ItemRect.top;
  if (SetTop < 0) {
    SetTop = 6;
  }
  var SelectDropData = [
    ["position", "fixed"],
    ["display", "block"],
    ["top", SetTop + "px"],
    ["padding-bottom", "4px"],
    ["z-index", "100"],
    ["background-color", ContentColorLayer2],
    ["border-radius", "10px"],
    ["box-shadow", "0 6px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"]
  ];
  if (Side != null && Side.toLowerCase() == "left") {
    SelectDropData.push(["right", window.innerWidth - ItemRect.left + Offset + "px"])
  } else {
    SelectDropData.push(["left", ItemRect.right + Offset + "px"])
  }
  if (CurrentDropdown != null) {
    CurrentDropdown.remove();
  }
  CurrentDropdown = createElement("SelectDropdown", "div", "body", SelectDropData);

  for (var i = 0; i < Buttons.length; i++) {
    var Button = Buttons[i];

    var ButtonObj = createElement(Button[0] + "DropdownButton", "div", CurrentDropdown, [
      ["position", "relative"],
      ["display", "flex"],
      ["min-width", "130px"],
      ["height", "28px"],
      ["margin-left", "4px"],
      ["margin-right", "4px"],
      ["margin-top", "4px"],
      ["background-color", BorderColor],
      ["border-radius", "6px"],
      ["cursor", "pointer"],

      // Text:
      ["padding-left", "10px"],
      ["padding-right", "10px"],
      ["font-size", "16px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"]
    ]);
    ButtonObj.setAttribute("onMouseOver", "this.style.backgroundColor = '" + Button[1] + "'");
    ButtonObj.setAttribute("onMouseOut", "this.style.backgroundColor = '" + BorderColor + "'");
    ButtonObj.textContent = Button[0];

    function ClickFunction(ClickB, Obj, SendData) {
      Obj.addEventListener("mousedown", function () {
        if (ClickB[2] != null) {
          var Function = window[ClickB[2]];
          if (typeof Function === "function") {
            Function(ClickB, Element, ButtonObj);
          }
        } else {
          ShowPopUp("In the Works...", "You found a feature that's not done yet, please wait a bit.", [["Okay", "#618BFF", null]]);
        }
        if (CurrentDropdown != null) {
          CurrentDropdown.remove();
        }
      });
    }

    ClickFunction(Button, ButtonObj);
  }

  var DropdownRect = CurrentDropdown.getBoundingClientRect();
  if ((DropdownRect.top + CurrentDropdown.clientHeight) > (window.innerHeight || document.documentElement.clientHeight)) {
    setCSS(CurrentDropdown, "top", ((window.innerHeight || document.documentElement.clientHeight) - CurrentDropdown.clientHeight - 6) + "px");
  }

  // WIDTH:
  if ((DropdownRect.left + CurrentDropdown.clientWidth) > (window.innerWidth || document.documentElement.clientWidth)) {
    setCSS(CurrentDropdown, "left", ((window.innerWidth || document.documentElement.clientWidth) - CurrentDropdown.clientWidth - 6) + "px");
    removeCSS(CurrentDropdown, "right");
  }
  if (DropdownRect.left < 6) {
    setCSS(CurrentDropdown, "left", "6px");
    removeCSS(CurrentDropdown, "right");
  }
}

var PreloadedPreviews = {};
var CurrentPreview = null;
function CreateUserPreview(Element, Offset, LoadUserID) {
  if (LoadUserID.length != 24) {
    return;
  }

  LastClickTime = Date.now();
  var ItemRect = Element.getBoundingClientRect();
  if (Offset == null) {
    Offset = 0;
  }
  var SetTop = ItemRect.top;
  if (SetTop < 0) {
    SetTop = 6;
  }
  if (CurrentPreview != null) {
    CurrentPreview.remove();
  }
  CurrentPreview = createElement("UserPreview", "div", "body", [
    ["position", "fixed"],
    ["display", "block"],
    ["left", ItemRect.right + Offset + "px"],
    ["width", "280px"],
    ["top", (SetTop + 16) + "px"],
    ["min-height", "217px"],
    ["z-index", "100"],
    ["background-color", ContentColorLayer2],
    ["border-radius", "10px"],
    ["overflow", "hidden"],
    ["box-shadow", "0 6px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"]
  ]);
  var HidePreviewContentUntilLoad = null;
  if (PreloadedPreviews[LoadUserID] == null) {
    HidePreviewContentUntilLoad = createElement("HideContentUntilLoad", "div", CurrentPreview, [
      ["position", "absolute"],
      ["top", "0px"],
      ["left", "0px"],
      ["width", "100%"],
      ["height", "100%"],
      ["z-index", "100"],
      ["opacity", 1],
      ["background-color", ContentColorLayer2],
      ["transition", "all 0.3s ease"],
      ["pointer-events", "none"]
    ]);
  }

  var PreviewRect = CurrentPreview.getBoundingClientRect();
  if ((PreviewRect.top + CurrentPreview.clientHeight) > (window.innerHeight || document.documentElement.clientHeight)) {
    setCSS(CurrentPreview, "top", ((window.innerHeight || document.documentElement.clientHeight) - CurrentPreview.clientHeight - 6) + "px");
  }

  // LEFT:
  if ((PreviewRect.left + CurrentPreview.clientWidth) > (window.innerWidth || document.documentElement.clientWidth)) {
    setCSS(CurrentPreview, "right", ((window.innerWidth || document.documentElement.clientWidth) - ItemRect.left - Offset - 10) + "px");
    removeCSS(CurrentPreview, "left");
    //setCSS(CurrentPreview, "left", ((window.innerWidth || document.documentElement.clientWidth) - CurrentPreview.clientWidth - 20) + "px");
  }

  PreviewRect = CurrentPreview.getBoundingClientRect();

  if (PreviewRect.left < 6) {
    setCSS(CurrentPreview, "left", "6px");
  }
  if (PreviewRect.right < 6) {
    setCSS(CurrentPreview, "right", "6px");
  }

  function RenderProfilePreview(Data) {
    var UserInfo = Data.UserInfo;

    if (UserInfo.ProfileData == null) {
      UserInfo.ProfileData = {};
    }

    var BannerElementType = "img";
    if (UserInfo.Settings == null || UserInfo.Settings.ProfileBanner == null) {
        BannerElementType = "div";
    }
    var ProfileBanner = createElement("PreviewProfileBanner", BannerElementType, CurrentPreview, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["width", "100%"],
      ["height", "100px"],
      ["object-fit", "cover"],
      ["background-color", ContentColor]
    ]);
    if (UserInfo.Settings != null && UserInfo.Settings.ProfileBanner != null) {
      ProfileBanner.src = GoogleCloudStorgeURL + "ProfileBanners/" + UserInfo.Settings.ProfileBanner;
    }

    var ProfileTopHolder = createElement("PreviewProfileTopHolder", "div", CurrentPreview, [
      ["position", "relative"],
      ["display", "flex"],
      //["flex-wrap", "wrap"],
      ["width", "calc(100% - 10px)"],
      ["left", "10px"]
    ]);

    var ProfileInfoHolder = createElement("PreviewProfileInfoHolder", "div", ProfileTopHolder, [
      ["position", "relative"],
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["align-content", "flex-end"],
      ["flex", "1"],
      ["margin-top", "-40px"],
      ["overflow", "hidden"]
    ]);
    var UserProfileProfilePic = createElement("PreviewUserProfilePic", "img", ProfileInfoHolder, [
      ["position", "relative"],
      ["box-sizing", "border-box"],
      ["width", "80px"],
      ["height", "80px"],
      ["margin-right", "7px"],
      ["background-color", ContentColor],
      ["border-width", "6px"],
      ["border-color", ContentColorLayer2],
      ["border-style", "solid"],
      ["object-fit", "cover"],
      ["border-radius", "18px"]
    ]);
    UserProfileProfilePic.src = GoogleCloudStorgeURL + "ProfileImages/" + DecideProfilePic(UserInfo);
    var ProfileUsernameText = createElement("PreviewUsername", "div", ProfileInfoHolder, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["align-self", "flex-end"],
      ["height", "fit-content"],
      ["max-width", "100%"],
      ["margin-right", "4px"],
      ["margin-bottom", "8px"],

      // Text:
      ["font-size", "26px"],
      ["font-family", FontTypeA],
      ["font-weight", "1000"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["white-space", "nowrap"],
      ["text-overflow", "ellipsis"],
      ["overflow", "hidden"]
    ]);
    SetUsernameRole(ProfileUsernameText, UserInfo, "16px", true);
    var ProfileButtonsHolder = createElement("PreviewProfileButtonsHolder", "div", ProfileTopHolder, [
      ["position", "relative"],
      ["right", "4px"],
      ["top", "2px"],
      ["min-width", "fit-content"]
    ]);
    if (LoadUserID != UserID && UserID != null) {
      var FollowButtonHolder = createElement("PreviewFollowButtonHolder", "div", ProfileButtonsHolder, [
        ["position", "relative"],
        ["display", "inline-block"]
      ]);
      var FollowButton = createElement("PreviewFollowButton", "div", FollowButtonHolder, [
        ["position", "relative"],
        ["display", "flex"],
        ["height", "30px"],
        ["padding", "0 8px 0 8px"],
        ["background-color", ThemeColor],
        ["border-radius", "8px"],
        ["cursor", "pointer"],

        // Text:
        ["font-size", "18px"],
        ["overflow-wrap", "break-word"],
        ["white-space", "pre-wrap"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#ffffff"],
        ["text-align", "center"],
        ["justify-content", "center"],
        ["align-items", "center"]
      ]);

      if (Data.IsFollowing == true) {
        FollowButton.textContent = "Unfollow";
        setCSS(FollowButton, "background-color", "#FF5786");
        FollowButton.setAttribute("title", "Unfollow " + UserInfo.User);
      } else {
        FollowButton.textContent = "Follow";
        FollowButton.setAttribute("title", "Follow " + UserInfo.User);
      }
    }

    var ProfileStatHolder = createElement("PreviewFollowerStatHolder", "div", CurrentPreview, [
      ["position", "relative"],
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["flex", "1"],
      ["margin-top", "2px"],
      ["justify-content", "space-evenly"],
      ["min-width", "fit-content"]
    ]);
    var FollowerCountTx = createElement("PreviewFollowersStat", "div", ProfileStatHolder, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "16px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", FontColorA],
      ["text-align", "right"]
    ]);
    FollowerCountTx.setAttribute("OfficialCount", UserInfo.ProfileData.Followers)
    var EndFollowerType = "Followers";
    if (UserInfo.ProfileData.Followers == 1) {
      EndFollowerType = "Follower";
    }
    FollowerCountTx.innerHTML = "<b>" + (UserInfo.ProfileData.Followers || 0) + "</b> " + EndFollowerType;

    if (LoadUserID != UserID && UserID != null) {
      function ChangeCount(ChangeAmount) {
        FollowerCountTx.setAttribute("OfficialCount", (parseInt(FollowerCountTx.getAttribute("OfficialCount")) || 0) + ChangeAmount)
        EndFollowerType = "Followers";
        if (parseInt(FollowerCountTx.getAttribute("OfficialCount")) == 1) {
          EndFollowerType = "Follower";
        }
        FollowerCountTx.innerHTML = "<b>" + FollowerCountTx.getAttribute("OfficialCount") + "</b> " + EndFollowerType;
        PreloadedPreviews[LoadUserID].UserInfo.ProfileData.Followers = parseInt(FollowerCountTx.getAttribute("OfficialCount"));
      }
      
      var PendingResponse = false;
      FollowButton.addEventListener("mouseup", function () {
        if (PendingResponse == false) {
          if (FollowButton.textContent == "Follow") {
            PendingResponse = true;
            FollowButton.textContent = "Unfollow";
            setCSS(FollowButton, "background-color", "#FF5786");
            ChangeCount(1);
            FollowButton.setAttribute("title", "Unfollow " + UserInfo.User);
            PreloadedPreviews[LoadUserID].IsFollowing = true;
            IncreasePreviewFollowingCount(1);
            SendRequest("FollowUser", { FollowUserID: LoadUserID }, function (Metadata, Data) {
              if (Data.Code != 200) {
                FollowButton.textContent = "Follow";
                setCSS(FollowButton, "background-color", ThemeColor);
                ChangeCount(-1);
                FollowButton.setAttribute("title", "Follow " + UserInfo.User);
                PreloadedPreviews[LoadUserID].IsFollowing = false;
                IncreasePreviewFollowingCount(-1);
              }
              PendingResponse = false;
            });
          } else if (FollowButton.textContent == "Unfollow") {
            PendingResponse = true;
            FollowButton.textContent = "Follow";
            setCSS(FollowButton, "background-color", ThemeColor);
            FollowButton.setAttribute("title", "Follow " + UserInfo.User);
            ChangeCount(-1);
            PreloadedPreviews[LoadUserID].IsFollowing = false;
            IncreasePreviewFollowingCount(-1);
            SendRequest("UnfollowUser", { UnfollowUserID: LoadUserID }, function (Metadata, Data) {
              if (Data.Code != 200) {
                FollowButton.textContent = "Unfollow";
                setCSS(FollowButton, "background-color", "#FF5786");
                ChangeCount(1);
                FollowButton.setAttribute("title", "Unfollow " + UserInfo.User);
                PreloadedPreviews[LoadUserID].IsFollowing = true;
                IncreasePreviewFollowingCount(1);
              }
              PendingResponse = false;
            });
          }
        }
      });
    }

    var FollowingCountTx = createElement("PreviewFollowingStat", "div", ProfileStatHolder, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "16px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", FontColorA],
      ["text-align", "right"]
    ]);
    FollowingCountTx.setAttribute("OfficialCount", UserInfo.ProfileData.Following)
    FollowingCountTx.innerHTML = "<b>" + (UserInfo.ProfileData.Following || 0) + "</b> Following";

    FollowerCountTx.setAttribute("TypeRender", "ViewFollowers");
    FollowingCountTx.setAttribute("TypeRender", "ViewFollowing");
    CurrentPreview.setAttribute("ProfileUserID", LoadUserID);
    
    FollowerCountTx.setAttribute("onmouseover", "UnderlineHoverOn([this])");
    FollowingCountTx.setAttribute("onmouseover", "UnderlineHoverOn([this])");
    FollowerCountTx.setAttribute("onmouseout", "UnderlineHoverOff([this])");
    FollowingCountTx.setAttribute("onmouseout", "UnderlineHoverOff([this])");
    
    if (UserInfo.ProfileData != null && UserInfo.ProfileData.Description != null) {
      var PreviewProfileDescription = createElement("PreviewProfileDescription", "div", CurrentPreview, [
        ["position", "relative"],
        ["margin-top", "6px"],
        ["padding-left", "10px"],
        ["padding-right", "10px"],
        ["max-height", "150px"],

        // Text:
        ["font-size", "14px"],
        ["overflow-wrap", "break-word"],
        ["font-family", FontTypeA],
        ["font-weight", "400"],
        ["color", FontColorA],
        ["text-overflow", "ellipsis"],
        ["overflow", "hidden"]
      ]);
      PreviewProfileDescription.innerHTML = CleanString(UserInfo.ProfileData.Description);
      PreviewProfileDescription.innerHTML = PreviewProfileDescription.innerHTML.replace(/\&nbsp\;/g, " ");
    }

    var ViewProfileButton = createElement("PreviewViewProfileButton", "div", CurrentPreview, [
      ["position", "relative"],
      ["display", "flex"],
      ["box-sizing", "border-box"],
      ["width", "calc(100% - 16px)"],
      ["height", "36px"],
      ["margin", "8px 8px 8px 8px"],
      ["padding", "0 8px 0 8px"],
      ["background-color", BorderColor],
      ["border-radius", "8px"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "20px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"]
    ]);
    ViewProfileButton.textContent = "View Profile";
    ViewProfileButton.setAttribute("title", "View Profile");
    ViewProfileButton.addEventListener("mouseup", function () {
      LoadProfilePage(LoadUserID);
      CurrentPreview.remove();
    });

    var PreviewRect = CurrentPreview.getBoundingClientRect();
    if ((PreviewRect.top + CurrentPreview.clientHeight) > (window.innerHeight || document.documentElement.clientHeight)) {
      setCSS(CurrentPreview, "top", ((window.innerHeight || document.documentElement.clientHeight) - CurrentPreview.clientHeight - 6) + "px");
    }

    CurrentPreview.style.transition = "all 0.3s ease";
    setTimeout(function () {
      CurrentPreview.style.top = ((CurrentPreview.style.top.replace(/px/g, "")) - 16) + "px";
      if (HidePreviewContentUntilLoad != null) {
        HidePreviewContentUntilLoad.style.opacity = 0;
      }
    }, 1);
  }

  if (PreloadedPreviews[LoadUserID] == null) {
    var PreloadIndex = Object.keys(PreloadedPreviews);
    if (PreloadIndex.length > 50) {
      var SmallestNum = Date.now();
      var SmallestUserID = null;
      for (var i = 0; i < PreloadIndex.length; i++) {
        var UserPreviewID = PreloadIndex[i];
        if (PreloadedPreviews[UserPreviewID].AddedTime < SmallestNum) {
          SmallestNum = PreloadedPreviews[UserPreviewID].AddedTime;
          SmallestUserID = UserPreviewID;
        }
      }
      if (SmallestUserID != null) {
        delete PreloadedPreviews[SmallestUserID];
      }
    }
    SendRequest("GetUserInfo", { GetUserID: LoadUserID }, function (Metadata, Data) {
      if (Data.Code == 200) {
        if (CurrentPreview.childNodes.length > 1) {
          return;
        }
        Data.AddedTime = Date.now();

        PreloadedPreviews[LoadUserID] = Data;
        RenderProfilePreview(Data);
      } else {
        if (Element.hasAttribute("TypeRender") == true) {
          Element.removeAttribute("TypeRender");
          Element.removeAttribute("LoadUserID");
          Element.removeAttribute("style");
        }
        if (CurrentPreview != null) {
          CurrentPreview.remove();
        }
      }
    });
  } else {
    PreloadedPreviews[LoadUserID].AddedTime = Date.now();
    RenderProfilePreview(PreloadedPreviews[LoadUserID]);
  }
}

function IncreasePreviewFollowingCount(ChangeAmount) {
  if (UserID == null) {
    return;
  }
  if (PreloadedPreviews[UserID] == null) {
    return;
  }
  
  if (PreloadedPreviews[UserID].UserInfo.ProfileData != null) {
    if (PreloadedPreviews[UserID].UserInfo.ProfileData.Following != null) {
      PreloadedPreviews[UserID].UserInfo.ProfileData.Following = Math.max(PreloadedPreviews[UserID].UserInfo.ProfileData.Following + ChangeAmount, 0);
    } else {
      PreloadedPreviews[UserID].UserInfo.ProfileData.Following = Math.max(ChangeAmount, 0);
    }
  } else {
    PreloadedPreviews[UserID].UserInfo.ProfileData = { Following: Math.max(ChangeAmount, 0) };
  }
}

document.addEventListener("mousedown", function (event) {
  if (CurrentDropdown != null && LastClickTime + 50 < Date.now()) {
    CurrentDropdown.remove();
  }
  if (CurrentPreview != null && LastClickTime + 50 < Date.now()) {
    var PreviewRect = CurrentPreview.getBoundingClientRect();
    if ((event.clientX < PreviewRect.left || event.clientX > (PreviewRect.left + CurrentPreview.clientWidth)) || (event.clientY < PreviewRect.top || event.clientY > (PreviewRect.top + CurrentPreview.clientHeight))) {
      CurrentPreview.remove();
    }
  }
});

function HighlightedMedia(MediaURL) {
  SetPageTitle("Enlarged Media");
  var BackBlur = createElement("MediaBackBlur", "div", "body", [
    ["position", "fixed"],
    ["width", "100%"],
    ["height", "100%"],
    ["backdrop-filter", "blur(4px)"],
    ["-webkit-backdrop-filter", "blur(4px)"],
    ["left", "0px"],
    ["top", "0px"],
    ["z-index", "5"]
  ]);
  var NewMedia = createElement("MediaDisplay", "div", BackBlur, [
    ["position", "relative"],
    ["display", "inline-block"],
    ["visibility", "hidden"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"],
    ["left", "50%"],
    ["top", "50%"],
    ["transform", "translate(-50%, -50%)"]
  ]);
  var MediaImage = createElement("MediaImage", "img", NewMedia, [
    ["position", "relative"],
    ["display", "inline-block"],
    ["min-width", "100px"],
    ["min-height", "100px"],
    ["max-width", "60vw"],
    ["max-height", "60vh"],
    ["object-fit", "scale-down"],
    ["background-color", ContentColorLayer2],
    ["border-radius", "12px"],
    ["border-top-right-radius", "22px"]
  ]);
  MediaImage.src = MediaURL;
  createElement("CloseMediaButton", "div", NewMedia, [
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
    ["font-weight", "1800"],
    ["color", "#cccccc"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"]
  ]);
  CloseMediaButton.innerHTML = "&times;";
  BackBlur.addEventListener("click", function () {
    BackBlur.remove();
    RevertTitle();
  });
  MediaImage.onload = function (e) {
    setCSS(NewMedia, "visibility", "visible");
  }
}

function ReportContent(Data) {
  SetPageTitle("Report");
  Data = Data[3];
  var BackBlur = createElement("ReportBackBlur", "div", "body", [
    ["position", "fixed"],
    ["width", "100%"],
    ["height", "100%"],
    ["backdrop-filter", "blur(2px)"],
    ["-webkit-backdrop-filter", "blur(2px)"],
    ["left", "0px"],
    ["top", "0px"],
    ["z-index", "999"]
  ]);
  var ReportFrame = createElement("ReportFrame", "div", BackBlur, [
    ["position", "relative"],
    ["width", "100%"],
    ["max-width", "425px"],
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
  ReportFrame.className = "StandardScroll";
  createElement("Title", "div", ReportFrame, [
    ["position", "relative"],
    ["margin-top", "8px"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],

    // Text:
    ["font-size", "32px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA],
    ["text-align", "left"]
  ]).textContent = "Report User or Content";
  createElement("Description", "div", ReportFrame, [
    ["position", "relative"],
    ["margin-left", "8px"],
    ["margin-right", "8px"],

    // Text:
    ["font-size", "20px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", FontColorA],
    ["text-align", "left"]
  ]).innerHTML = "Please select a reason why <b>" + Data.User + "</b> is breaking the rules.";
  var ButtonHolder = createElement("MainButtonHolder", "div", ReportFrame, [
    ["position", "relative"],
    ["margin", "8px 8px 8px 8px"],
    ["text-align", "right"]
  ]);
  function CreateReportButton(ButtonText) {
    var RButton = createElement(ButtonText + "ReportB", "div", ButtonHolder, [
      ["position", "relative"],
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
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "500"],
      ["color", FontColorA],
      ["text-align", "left"]
    ]);
    RButton.textContent = ButtonText;
    RButton.setAttribute("onMouseOver", "if (this.className != 'SelectedReportReason') { this.style.backgroundColor = '" + ContentColor + "'; this.style.fontWeight = 900 }");
    RButton.setAttribute("onMouseOut", "if (this.className != 'SelectedReportReason') { this.style.backgroundColor = 'rgba(0, 0, 0, 0)'; this.style.fontWeight = 500 }");
    RButton.addEventListener("click", function () {
      var SelectedReasons = document.getElementsByClassName("SelectedReportReason");
      for (var i = 0; i < SelectedReasons.length; i++) {
        if (SelectedReasons[i] != RButton) {
          setCSS(SelectedReasons[i], "background-color", "#ffffff00");
          setCSS(SelectedReasons[i], "font-weight", 500);
          SelectedReasons[i].className = "";
        }
      }
      RButton.className = "SelectedReportReason";
      setCSS(RButton, "background-color", "#FFCB70");
      setCSS(RButton, "font-weight", 900);
      CreateSubmitButtons("Report", "#FFCB70");
    });
  }
  CreateReportButton("Inappropriate Content");
  CreateReportButton("Inappropriate Username");
  CreateReportButton("Threats or Endangerment");
  CreateReportButton("Hate Speech, Harrasment, or Abuse");
  CreateReportButton("Evading Bans, Mutes, or Blocks");
  CreateReportButton("Spamming");
  CreateReportButton("Spreading Rumors or False Information");
  CreateReportButton("Posting Malacious Content or Links");
  CreateReportButton("May be Inflecting Physical Harm");
  CreateReportButton("Other");
  var CloseButton = null;
  function CreateSubmitButtons(ButtonName, Color) {
    if (find(ButtonName + "PopUpButton") != null) {
      return; // Submit button is already displayed.
    }
    var ButtonObj = createElement(ButtonName + "PopUpButton", "div", ButtonHolder, [
      ["position", "relative"],
      ["display", "inline-flex"],
      ["width", "fit-content"],
      ["height", "45px"],
      ["margin-left", "8px"],
      ["margin-top", "8px"],
      ["background-color", Color],
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
    ButtonObj.textContent = ButtonName;
    ButtonObj.addEventListener("click", function () {
      RevertTitle();
      if (ButtonName == "Report") {
        var SendData = {
          //User: Data.User,
          Reason: document.getElementsByClassName("SelectedReportReason")[0].textContent,
          //Text: Data.Text,
          ReportContentID: Data._id,
          //Link: window.location.hostname + "/?post=" + Data._id
        };
        if (Data.Text == null) {
          SendData.Type = "User";
        } else if (Data.PostID == null) {
          SendData.Type = "Post";
        } else {
          SendData.Type = "Chat";
        }

        ReportUser(SendData);
        ShowPopUp("Report Submited", "Your report has been sent to Photop Moderators and will be reviewed shortly. <b>Thank you</b>, for helping to keep the Photop Community safe.", [["Okay", "#618BFF", null]]);
      }
      BackBlur.remove();
    });
    if (CloseButton != null && ButtonName == "Report") {
      ButtonHolder.insertBefore(ButtonObj, CloseButton);
    }
    return ButtonObj;
  }
  CloseButton = CreateSubmitButtons("Close", "#B3B3B3");
}

function OpenModerationPage(Data) {
  Data = Data[3];

  if (Data[0] == "Ban") {
    if (CheckPermision(LoginUserRole, "CanBanUsers") == true) {
      SelectedModerationData = { UserID: Data[1], User: Data[2] };
      loadScript(LoadScripts.Moderation);
    }
  }
}

function RefreshPage() {
  location.reload();
}

var BackBlur = null;
function ViewFollowData(Type, ViewUserID) {
  var LoadUserFollowData = PreloadedPreviews[ViewUserID];
  if (LoadUserFollowData == null) {
    return;
  }

  if (BackBlur != null) {
    BackBlur.remove();
  }
  if (CurrentPreview != null) {
    CurrentPreview.remove();
  }

  BackBlur = createElement("FollowerBackBlur", "div", "body", [
    ["position", "fixed"],
    ["width", "100%"],
    ["height", "100%"],
    ["backdrop-filter", "blur(2px)"],
    ["-webkit-backdrop-filter", "blur(2px)"],
    ["left", "0px"],
    ["top", "0px"],
    ["z-index", "50"]
  ]);
  var FollowFrame = createElement("FollowFrame", "div", BackBlur, [
    ["position", "relative"],
    ["width", "100%"],
    ["max-width", "500px"],
    ["max-height", "100%"],
    ["border-style", "solid"],
    ["border-radius", "12px"],
    ["border-color", BorderColor],
    ["border-width", "4px"],
    ["left", "50%"],
    ["top", "50%"],
    ["transform", "translate(-50%, -50%)"],
    ["overflow-y", "hidden"],
    ["background-color", LeftSidebarColor]
  ]);

  var TitleDisplayEnd = "'s ";
  if (Type == "Following") {
    TitleDisplayEnd = " is ";
  }

  createElement("Title", "div", FollowFrame, [
    ["position", "relative"],
    ["top", "0px"],
    ["padding", "8px 8px 4px 8px"],
    ["background-color", LeftSidebarColor],
    ["box-shadow", "-12px 6px 5px " + LeftSidebarColor],
    ["z-index", "8"],

    // Text:
    ["font-size", "32px"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", FontColorA],
    ["text-align", "left"]
  ]).textContent = LoadUserFollowData.UserInfo.User + TitleDisplayEnd + Type;
  //SetPageTitle(LoadUserFollowData.UserInfo.User + TitleDisplayEnd + Type + "");
  var FollowDataHolder = createElement("FollowDataHolder", "div", FollowFrame, [
    ["position", "relative"],
    ["box-sizing", "border-box"],
    ["padding", "6px 0px 6px 0px"],
    ["max-height", "min(450px, 50vh)"],
    ["margin-left", "8px"],
    ["text-align", "right"],
    ["overflow-y", "auto"]
  ]);
  FollowDataHolder.className = "StandardScroll";
  
  var LoadingFollowerData = createElement("LoadingFollowerData", "div", FollowDataHolder, [
      ["position", "relative"],
      ["width", "calc(100% - 30px)"],
      ["left", "15px"],
      ["margin", "6px 0px 6px 0px"],

      // Text:
      ["font-size", "16px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#aaaaaa"],
      ["text-align", "center"]
  ]);
  LoadingFollowerData.textContent = "Loading users... Please wait...";

  function CreateFollowTiles(IDs, Users) {
    for (var i = 0; i < IDs.length; i++) {
      CreateTile();
      function CreateTile() {
        var LoadUserID = IDs[i];
        if (LoadUserID == null) {
          return;
        }
        var UserData = Users[LoadUserID];
        if (UserData == null) {
          return;
        }
        var Tile = createElement("FollowUserTile", "div", FollowDataHolder, [
          ["position", "relative"],
          ["display", "flex"],
          ["flex-wrap", "wrap"],
          ["background-color", ContentColorLayer3],
          ["width", "calc(100% - 12px)"],
          ["left", "6px"],
          ["min-height", "50px"],
          ["border-radius", "12px"],
          ["margin-top", "6px"],
          ["align-items", "center"]
        ]);
        var FollowDataUserPic = createElement("FollowDataUserPic", "div", Tile, [
          ["position", "relative"],
          ["display", "inline-block"],
          ["width", "35px"],
          ["height", "35px"],
          ["border-radius", "8px"],
          ["float", "left"],
          ["margin-left", "7.5px"],
          ["object-fit", "cover"],
          ["cursor", "pointer"],
          ["content", "url('" + GoogleCloudStorgeURL + "ProfileImages/" + DecideProfilePic(UserData) + "')"]
        ]);
        var FollowDataUsername = createElement("FollowDataUsername", "div", Tile, [
          ["position", "relative"],
          ["display", "inline-block"],
          ["float", "left"],
          ["margin-left", "4px"],
          ["cursor", "pointer"],
    
          // Text:
          ["font-size", "18px"],
          ["font-family", FontTypeA],
          ["font-weight", "900"],
          ["color", FontColorA],
          ["text-align", "left"]
        ]);
        FollowDataUsername.textContent = UserData.User;
        SetUsernameRole(FollowDataUsername, UserData);
        FollowDataUsername.setAttribute("LoadUserID", LoadUserID);
        FollowDataUserPic.setAttribute("LoadUserID", LoadUserID);

        if (LoadUserID != UserID && UserID != null) {
          var FollowUserB = createElement("FollowUserB", "div", Tile, [
            ["position", "relative"],
            ["display", "inline-block"],
            ["height", "fit-content"],
            ["background-color", ThemeColor],
            ["padding-left", "6px"],
            ["padding-right", "6px"],
            ["padding-top", "4px"],
            ["padding-bottom", "4px"],
            ["margin-left", "auto"],
            ["border-radius", "8px"],
            ["margin-right", "10.5px"],
            ["cursor", "pointer"],
      
            // Text:
            ["font-size", "18px"],
            ["font-family", FontTypeA],
            ["font-weight", "900"],
            ["color", "#ffffff"],
            ["text-align", "left"]
          ]);
    
          if (UserData.IsFollowing == true) {
            FollowUserB.textContent = "Unfollow";
            setCSS(FollowUserB, "background-color", "#FF5786");
            FollowUserB.setAttribute("title", "Unfollow " + UserData.User);
          } else {
            FollowUserB.textContent = "Follow";
            FollowUserB.setAttribute("title", "Follow " + UserData.User);
          }

          var PendingResponse = false;
          FollowUserB.addEventListener("mouseup", function () {
            if (PendingResponse == false) {
              if (FollowUserB.textContent == "Follow") {
                PendingResponse = true;
                FollowUserB.textContent = "Unfollow";
                setCSS(FollowUserB, "background-color", "#FF5786");
                FollowUserB.setAttribute("title", "Unfollow " + UserData.User);
                if (PreloadedPreviews[LoadUserID] != null) {
                  PreloadedPreviews[LoadUserID].IsFollowing = true;
                }
                SendRequest("FollowUser", { FollowUserID: LoadUserID }, function (Metadata, Data) {
                  if (Data.Code != 200) {
                    FollowUserB.textContent = "Follow";
                    setCSS(FollowUserB, "background-color", ThemeColor);
                    FollowUserB.setAttribute("title", "Follow " + UserData.User);
                    if (PreloadedPreviews[LoadUserID] != null) {
                      PreloadedPreviews[LoadUserID].IsFollowing = false;
                    }
                  }
                  PendingResponse = false;
                });
              } else if (FollowUserB.textContent == "Unfollow") {
                PendingResponse = true;
                FollowUserB.textContent = "Follow";
                setCSS(FollowUserB, "background-color", ThemeColor);
                FollowUserB.setAttribute("title", "Follow " + UserData.User);
                if (PreloadedPreviews[LoadUserID] != null) {
                  PreloadedPreviews[LoadUserID].IsFollowing = false;
                }
                SendRequest("UnfollowUser", { UnfollowUserID: LoadUserID }, function (Metadata, Data) {
                  if (Data.Code != 200) {
                    FollowUserB.textContent = "Unfollow";
                    setCSS(FollowUserB, "background-color", "#FF5786");
                    FollowUserB.setAttribute("title", "Unfollow " + UserData.User);
                    if (PreloadedPreviews[LoadUserID] != null) {
                      PreloadedPreviews[LoadUserID].IsFollowing = true;
                    }
                  }
                  PendingResponse = false;
                });
              }
            }
          });
        }
      }
    }
  }

  function AddEndOfFollowers() {
    createElement("EndOfFollowers", "div", FollowDataHolder, [
        ["position", "relative"],
        ["width", "calc(100% - 30px)"],
        ["left", "15px"],
        ["margin", "6px 0px 6px 0px"],

        // Text:
        ["font-size", "16px"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#aaaaaa"],
        ["text-align", "center"]
    ]).textContent = "That's everyone...";
  }

  var LastTimestamp = 0;
  SendRequest("GetFollowData", { Type: Type, GetUserID: ViewUserID, Amount: 25 }, function (Metadata, Data) {
    if (Data.Code != 200 || LoadingFollowerData == null) {
      return;
    }
    if (Data.FollowUserIds.length < 1) {
      var NobodyText = "Following";
      if (Type == "Following") {
        NobodyText = "Followed";
      }
      LoadingFollowerData.textContent = "Nobody is " + NobodyText + "...";
    } else {
      if (Data.FollowUserIds.length > 24) {
        LastTimestamp = Data.LastTimestamp;
      }
      LoadingFollowerData.remove();

      CreateFollowTiles(Data.FollowUserIds, Data.Users);

      if (Data.FollowUserIds.length > 12 && Data.FollowUserIds.length < 25) {
        AddEndOfFollowers();
      }
    }
  });

  var LoadingMore = false;
  FollowDataHolder.addEventListener("scroll", function() {
    if (LastTimestamp > 0 && LoadingMore == false) {
      if (FollowDataHolder.offsetHeight + FollowDataHolder.scrollTop > FollowDataHolder.scrollHeight - 260) {
        LoadingMore = true;
        SendRequest("GetFollowData", { Type: Type, GetUserID: ViewUserID, Amount: 15, Before: LastTimestamp }, function (Metadata, Data) {
          if (Data.Code != 200 || FollowDataHolder == null) {
            return;
          }
          if (Data.FollowUserIds.length < 15) {
            LastTimestamp = 0;
          } else {
            LastTimestamp = Data.LastTimestamp;
          }
          
          CreateFollowTiles(Data.FollowUserIds, Data.Users);

          if (Data.FollowUserIds.length < 15) {
            AddEndOfFollowers();
          }

          LoadingMore = false;
        });
      }
    }
  });

  var ButtonHolder = createElement("FollowingHolder", "div", FollowFrame, [
    ["position", "relative"],
    ["margin", "0px 8px 8px 8px"],
    ["text-align", "right"],
    ["box-shadow", "-12px -0.4rem 5px " + LeftSidebarColor]
  ]);
  var CloseButton = createElement("FollowDataCloseButton", "div", ButtonHolder, [
    ["position", "relative"],
    ["display", "inline-flex"],
    ["width", "fit-content"],
    ["height", "45px"],
    ["margin-left", "8px"],
    ["margin-top", "8px"],
    ["background-color", "#B3B3B3"],
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
  CloseButton.textContent = "Close";
  CloseButton.addEventListener("click", function () {
    //RevertTitle();
    BackBlur.remove();
  });
}

var CurrentMentionPreview = null;
var LastMentionText = "";
var LastMentionUsers = [];
var LastMentionHolderHeight = 0;
function CreateMentionPreview(Element) {
  if (Element == null) {
    RemoveMentionPreview();
    return;
  }
  var MentionText = Element.textContent.replace(/@/g, "");
  if (MentionText.length < 1) {
    RemoveMentionPreview();
    return;
  }

  async function CreateInterface(UserAccounts, Element) {
    var LastHeight = 0;
    var LastMentionHolder = find("MentionPreviewTileHolder");
    if (LastMentionHolder != null) {
      LastHeight = LastMentionHolder.clientHeight;
    }
    RemoveMentionPreview();
    var ItemRect = Element.getBoundingClientRect();
    CurrentMentionPreview = createElement("MentionPreview", "div", "body", [
      ["position", "relative"],
      ["width", "max-content"],
      ["height", LastHeight + "px"],
      ["left", ItemRect.left + 6 + "px"],
      ["top", ItemRect.top + ItemRect.height + "px"],
      ["padding", "4px 4px 4px 4px"],
      ["z-index", "100"],
      ["overflow", "hidden"],
      ["background-color", ContentColorLayer2],
      ["border-radius", "8px"],
      ["box-shadow", "0 6px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"],
      ["transition", "all 0.2s ease"]
    ]);
    MentionPreviewTileHolder = createElement("MentionPreviewTileHolder", "div", CurrentMentionPreview, [
      ["position", "relative"],
      ["display", "flex"],
      ["flex-direction", "column"],
      ["width", "max-content"],
      ["gap", "4px"],
      ["z-index", "100"]
    ]);

    // LEFT:
    var MentionRect = CurrentMentionPreview.getBoundingClientRect();
    if ((MentionRect.top + CurrentMentionPreview.clientHeight) > (window.innerHeight || document.documentElement.clientHeight)) {
      setCSS(CurrentMentionPreview, "top", ((window.innerHeight || document.documentElement.clientHeight) - CurrentMentionPreview.clientHeight - 6) + "px");
    }
    if ((MentionRect.left + CurrentMentionPreview.clientWidth) > (window.innerWidth || document.documentElement.clientWidth)) {
      setCSS(CurrentMentionPreview, "left", ((window.innerWidth || document.documentElement.clientWidth) - CurrentMentionPreview.clientWidth - 6) + "px");
      removeCSS(CurrentMentionPreview, "right");
    }
    if (MentionRect.left < 6) {
      setCSS(CurrentMentionPreview, "left", "6px");
      removeCSS(CurrentMentionPreview, "right");
    }

    for (var i = 0; i < UserAccounts.length; i++) {
      CreateTile();
      function CreateTile() {
        var UserData = UserAccounts[i];
        var Tile = createElement("MentionUserTile", "div", MentionPreviewTileHolder, [
          ["position", "relative"],
          ["display", "flex"],
          ["object-fit", "border-box"],
          ["width", "fit-content"],
          ["min-width", "225px"],
          ["padding", "4px 4px 4px 4px"],
          ["border-radius", "6px"],
          ["align-items", "center"],
          ["background-color", ContentColorLayer3],
          ["cursor", "pointer"]
        ]);
        createElement("MentionUserPic", "div", Tile, [
          ["position", "relative"],
          ["display", "inline-block"],
          ["width", "35px"],
          ["height", "35px"],
          ["border-radius", "6px"],
          ["float", "left"],
          ["object-fit", "cover"],
          ["content", "url('" + GoogleCloudStorgeURL + "ProfileImages/" + DecideProfilePic(UserData) + "')"]
        ]);
        var MentionUsername = createElement("MentionUsername", "div", Tile, [
          ["position", "relative"],
          ["display", "inline-block"],
          ["float", "left"],
          ["margin-left", "6px"],
    
          // Text:
          ["font-size", "18px"],
          ["font-family", FontTypeA],
          ["font-weight", "900"],
          ["color", FontColorA],
          ["text-align", "left"]
        ]);
        MentionUsername.textContent = UserData.User;
        SetUsernameRole(MentionUsername, UserData);

        Tile.addEventListener("mouseup", function() {
          Element.textContent = "@" + UserData.User + " ";
          SetCursor(Element.parentNode, Element.parentNode.textContent.length);
        });
      }
    }
    await sleep(25);
    CurrentMentionPreview.style.height = MentionPreviewTileHolder.clientHeight + "px";
  }

  if (LastMentionText != MentionText) {
    SendRequest("Search", { Type: "Users", Search: MentionText }, async function (Metadata, Data) {
      if (Data.Code == 200) {
        if (Data.Result.length > 0) {
          LastMentionText = MentionText;
          LastMentionUsers = Data.Result;
          CreateInterface(Data.Result, Element);
        } else {
          RemoveMentionPreview();
        }
      }
    });
  } else {
    LastMentionText = MentionText;
    CreateInterface(LastMentionUsers, Element);
  }
}
function RemoveMentionPreview() {
  if (CurrentMentionPreview != null) {
    CurrentMentionPreview.remove();
  }
}

// MAIN SITE LOAD:

createElement("MainContent", "div", "Primary", [
  ["position", "relative"],
  ["padding", "0px"],
  ["width", "calc(100% - 225px - 24px)"],
  ["min-height", "calc(100vh + 1px)"],
  ["margin-left", "16px"],
  ["top", "0px"]
]);

var ConnectingToServer = createElement("ConnectingToServer", "div", "MainContent", [
  ["position", "sticky"],
  ["width", "100%"],
  ["top", "8px"],
  ["margin-top", "8px"],
  ["background-color", ContentColor],
  ["box-sizing", "border-box"],
  ["border-radius", "12px"],
  ["border-bottom-right-radius", "8px"],
  ["border-bottom-left-radius", "8px"],
  ["border-color", "#FF6BAE"],
  ["border-style", "solid"],
  ["border-width", "0px"],
  ["border-bottom-width", "8px"],
  ["box-shadow", "0px 6px 5px " + PageColor + ", 0px -25px 0px " + PageColor],
  ["z-index", "30"],

  //["overflow-y", "hidden"]
]);
ConnectingToServer.setAttribute("Solid", "true");

var SVGElem = createElement("NoConnectionIconSvg", "svg", ConnectingToServer, [
  ["position", "absolute"],
  ["top", "10px"],
  ["left", "10px"],
  ["height", "50px"],
  ["width", "50px"]
], "http://www.w3.org/2000/svg");
SVGElem.setAttribute("viewBox", "0 0 24 24");
createElement("NoConnectionIconSvg", "path", "NoConnectionIconSvg", null, "http://www.w3.org/2000/svg").setAttribute("d", "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm8.647 7h-3.221a19.676 19.676 0 00-2.821-4.644A10.031 10.031 0 0120.647 7zM16.5 12a10.211 10.211 0 01-.476 3H7.976a10.211 10.211 0 01-.476-3 10.211 10.211 0 01.476-3h8.048a10.211 10.211 0 01.476 3zm-7.722 5h6.444A19.614 19.614 0 0112 21.588 19.57 19.57 0 018.778 17zm0-10A19.614 19.614 0 0112 2.412 19.57 19.57 0 0115.222 7zM9.4 2.356A19.676 19.676 0 006.574 7H3.353A10.031 10.031 0 019.4 2.356zM2.461 9H5.9a12.016 12.016 0 00-.4 3 12.016 12.016 0 00.4 3H2.461a9.992 9.992 0 010-6zm.892 8h3.221A19.676 19.676 0 009.4 21.644 10.031 10.031 0 013.353 17zm11.252 4.644A19.676 19.676 0 0017.426 17h3.221a10.031 10.031 0 01-6.042 4.644zM21.539 15H18.1a12.016 12.016 0 00.4-3 12.016 12.016 0 00-.4-3h3.437a9.992 9.992 0 010 6z");
SVGElem.setAttribute("fill", "#FF6BAE");
createElement("NoConnectionTitle", "div", ConnectingToServer, [
  ["position", "relative"],
  ["width", "calc(100% - 75px)"],
  ["left", "68px"],
  ["top", "8px"],

  // Text:
  ["font-size", "24px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", "#FF6BAE"],
  ["text-align", "left"]
]).textContent = "Connecting to Photop";
createElement("NoConnectionDisc", "div", ConnectingToServer, [
  ["position", "relative"],
  ["width", "calc(100% - 80px)"],
  ["left", "72px"],
  ["margin-top", "10px"],
  ["margin-bottom", "8px"],

  // Text:
  ["font-size", "14px"],
  ["overflow-wrap", "break-word"],
  ["white-space", "pre-wrap"],
  ["font-family", FontTypeA],
  ["font-weight", "900"],
  ["color", "#bbbbbb"],
  ["text-align", "left"]
]).textContent = "Connecting to Photop! Check your internet connection if you don't connect in 30 seconds.";
ShowLoading();

var AnimationLoop = null;
function ShowLoading() {
  setCSS(ConnectingToServer, "display", "block");

  if (AnimationLoop == null) {
    setCSS(ConnectingToServer, "border-color", "#FF6BAE");
    setCSS(ConnectingToServer, "border-style", "solid");
    setCSS(ConnectingToServer, "border-width", "0px");
    setCSS(ConnectingToServer, "border-bottom-width", "8px");
    try {
      ConnectingToServer.animate([
        { borderColor: ContentColor, offset: 0.45 },
        { borderColor: "#FF6BAE" },
      ], 1000);
    } catch { }
    AnimationLoop = setInterval(function () {
      if (ConnectingToServer != null && getCSS(ConnectingToServer, "display") == "block") {
        setCSS(ConnectingToServer, "border-color", ContentColor);
        try {
          ConnectingToServer.animate([
            { borderColor: "#FF6BAE", offset: 0.45 },
            { borderColor: ContentColor },
          ], 1000);
        } catch { }
      } else {
        clearInterval(AnimationLoop);
      }
    }, 1000);
  }
}
function HideLoading() {
  setCSS("ConnectingToServer", "display", "none");
}

loadScript(LoadScripts.Feed);