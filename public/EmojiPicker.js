var EmojiLibaryScript = loadScript("EmojiLibrary.js");

var TileSize = 28; //64

var EmojiEditorLoaded = true;

var LastClickTime = Date.now();

var EmojiPicker = null;

function SetCaretPosition(elem, caretPos) {
    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

async function LoadEmojiEditor(event, FilterEmojiNames, CaretPos) {
  if (EmojiPicker != null) {
    EmojiPicker.remove();
    if (FilterEmojiNames == null) {
      EmojiPicker = null;
      EmojiEditorOpen = false;
      return;
    }
  }
  LastClickTime = Date.now();

  var ItemRect = EmojiEditorLoadSource.getBoundingClientRect();
  EmojiPicker = createElement("EmojiPicker", "div", "body", [
      ["position", "relative"],
      ["display", "block"],
      ["width", "340px"],
      ["height", "350px"],
      ["max-width", "100vw"],
      ["max-height", "100vh"],
      //["left", "50%"],
      ["top", ItemRect.top + 12 + "px"],
      ["left", ItemRect.left + 12 + "px"],
      ["z-index", "100"],
      ["overflow", "hidden"],
      // ["transform", "translateX(-50%)"],
      ["background-color", ContentColorLayer2],
      ["border-radius", "10px"],
      ["box-shadow", "0 6px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"]
  ]);

  createElement("PickerTitle", "div", EmojiPicker, [
      ["position", "relative"],
      ["display", "flex"],
      ["width", "100%"],
      ["padding-top", "6px"],
      ["padding-bottom", "4px"],
      ["left", "0px"],
      ["border-style", "solid"],
      ["border-color", "#aaaaaa"],
      ["border-width", "0px 0px 2px 0px"],

      // Text:
      ["font-size", "26px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"]
  ]).textContent = "Emoji Picker";

  var EmojiSelect = createElement("EmojiSelect", "div", EmojiPicker, [
      ["position", "relative"],
      //["padding-top", "6px"],
      ["margin-left", "4px"],
      //["padding-bottom", "12px"],
      ["width", "calc(100% - 4px)"],
      ["height", "calc(100% - 42px)"],
      ["overflow", "hidden"],
      ["overflow-y", "auto"]
  ]);
  EmojiSelect.className = "StandardScroll";

  var SearchEmojiBar = createElement("PickerSearch", "input", EmojiSelect, [
      ["position", "relative"],
      ["width", "calc(100% - 4px)"],
      ["left", "0px"],
      ["padding-left", "4px"],
      ["padding-top", "6px"],
      ["background-color", ContentColorLayer2],
      ["border-style", "hidden"],

      // Text:
      ["font-size", "20px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"]
  ]);
  SearchEmojiBar.placeholder = "Search Emojis...";
  if (SearchEmojiBar != null && CaretPos != null) {
    SearchEmojiBar.value = FilterEmojiNames;
    SetCaretPosition(SearchEmojiBar, CaretPos);
  }
  var EmojiTimeout = null;
  SearchEmojiBar.addEventListener("input", function (event) {
    clearTimeout(EmojiTimeout);
    EmojiTimeout = setTimeout(function() {
      LoadEmojiEditor(null, SearchEmojiBar.value, event.target.selectionStart);
    }, 500);
  });

  EmojiSelect.addEventListener("mousedown", function(event) {
    var Path = event.path || (event.composedPath && event.composedPath());
    if (Path[0].tagName.toString() == "A" && Path[0].id.includes("Emoji")) {
      if (LastCursorObject == null) {
        LastCursorObject = CreatePostTextHolder;
      }
      if (LastCursorPos > LastCursorObject.innerText.replaceAll("&nbsp;", " ").length) {
        LastCursorPos = LastCursorObject.innerText.replaceAll("&nbsp;", " ").length;
      }
      LastCursorObject.innerText = LastCursorObject.innerText.substring(0, LastCursorPos) + Path[0].innerText + LastCursorObject.innerText.substring(LastCursorPos);
      //LastCursorObject.innerText = LastCursorObject.innerText.substring(0, LastCursorPos) + "emoji[" + Path[0].innerText + "]" + LastCursorObject.innerText.substring(LastCursorPos);
      // /Path[0].innerText[0]
      //LastCursorObject.innerHTML = LastCursorObject.innerHTML.replaceAll("?", '<span textspan="">' + Path[0].innerText[0] + "</span>");
      RenderNewText();
      LastCursorPos += Path[0].innerText.length;

      var FrequentEmojis = JSON.parse(localStorage.getItem("FrequentEmojis")) || [];
      var ApplyEmojis = [];
      for (var a = 0; a < FrequentEmojis.length; a++) {
        if (FrequentEmojis[a].Name != Path[0].getAttribute("title").toLowerCase()) {
          ApplyEmojis.push(FrequentEmojis[a]);
        }
      }
      ApplyEmojis.push({ Name: Path[0].getAttribute("title").toLowerCase(), Char: Path[0].innerText });
      
      if (ApplyEmojis.length > 40) {
        ApplyEmojis.shift();
      }

      localStorage.setItem("FrequentEmojis", JSON.stringify(ApplyEmojis));
    }
  });

  EmojiEditorOpen = false;

  var FilterArray = EmojiData;
  if (FilterEmojiNames == null || FilterEmojiNames == "") {
    FilterArray = JSON.parse(JSON.stringify(EmojiData));
    var FrequentEmojis = JSON.parse(localStorage.getItem("FrequentEmojis")) || [];
    for (var f = 0; f < FrequentEmojis.length; f++) {
      FilterArray.unshift({ group: "Recently Used", char: FrequentEmojis[f].Char, name: FrequentEmojis[f].Name });
    }
  }
  var LoopArray = FilterArray.filter(function(val) {
    var CanDisplay = true;
    if (FilterEmojiNames != null && FilterEmojiNames != "") {
      if (val.name.toLowerCase().includes(FilterEmojiNames.toLowerCase()) == false) {
        CanDisplay = false;
      }
    }
    return val.name.includes(":") == false && CanDisplay == true;
  });
  for (var e = 0; e < LoopArray.length; e++) {
    var Emoji = LoopArray[e];
    if (EmojiPicker != null) {
      var SetGroup = find("EmojiPickerGroupHolder" + Emoji.group);
      if (SetGroup == null) {
        var GroupBody = createElement("EmojiPickerGroup" + Emoji.group, "div", EmojiSelect, [
            ["position", "relative"],
            ["top", "0px"],
            ["width", "100%"],
            //["padding-bottom", "2px"],
            //["margin-bottom", "8px"]
        ]);
        createElement("EmojiPickerGroupTitle" + Emoji.group, "div", GroupBody, [
            ["position", "sticky"],
            ["top", "0px"],
            ["width", "calc(100% - 2px)"],
            ["background-color", ContentColorLayer2],
            ["padding-top", "4px"],
            ["padding-bottom", "4px"],
            ["padding-left", "2px"],
            ["z-index", "20"],

            // Text:
            ["font-size", "18px"],
            ["font-family", FontTypeA],
            ["font-weight", "900"],
            ["color", "#cccccc"]
        ]).textContent = Emoji.group;
        SetGroup = createElement("EmojiPickerGroupHolder" + Emoji.group, "div", GroupBody, [
            ["position", "relative"],
            ["width", "100%"],
            ["display", "grid"],
            ["gap", "4px"],
            ["grid-template-columns", "repeat(auto-fit, " + TileSize + "px)"],
            ["padding-bottom", "16px"],
        ])
      }
      var NewEmoji = createElement("Emoji" + e, "a", SetGroup, [
          ["position", "relative"],
          ["display", "block"],
          ["width", TileSize + "px"],
          ["height", TileSize + "px"],
          //["background-color", "green"],
          ["font-size", (TileSize-4) + "px"],
          ["cursor", "pointer"],

          ["-webkit-user-select", "none"],
          ["-khtml-user-select", "none"],
          ["-moz-user-select", "none"],
          ["-o-user-select", "none"],
          ["user-select", "none"]
      ]);
      NewEmoji.textContent = Emoji.char;
      NewEmoji.setAttribute("title", Emoji.name);
      await sleep(1);
    } else {
      break;
    }
  }
  //EmojiEditorLoadSource = null;
}

EmojiLibaryScript.addEventListener("load", LoadEmojiEditor);

find("Primary").addEventListener("click", function() {
  if (EmojiPicker != null && LastClickTime+100 < Date.now()) {
    EmojiPicker.remove();
    EmojiPicker = null;
    EmojiEditorOpen = false;
  }
});


/*
var SriteSheet = "./Images/EmojiSpriteSheet.png";
var HeightDimension = 33;
var WidthDimension = 34;
var TileSize = 64; //64

var EmojiEditorLoaded = true;

var LastClickTime = Date.now();

var EmojiPicker = null;

async function LoadEmojiEditor() {
  LastClickTime = Date.now();
  if (EmojiPicker != null) {
    EmojiPicker.remove();
  }

  var ItemRect = EmojiEditorLoadSource.getBoundingClientRect();
  EmojiPicker = createElement("EmojiPicker", "div", "body", [
      ["position", "relative"],
      ["display", "block"],
      ["width", "300px"],
      ["height", "350px"],
      ["max-width", "100vw"],
      ["max-height", "100vh"],
      //["left", "50%"],
      ["top", ItemRect.top + 12 + "px"],
      ["left", ItemRect.left + 12 + "px"],
      ["z-index", "100"],
      ["overflow", "hidden"],
      // ["transform", "translateX(-50%)"],
      ["background-color", ContentColorLayer2],
      ["border-radius", "10px"],
      ["box-shadow", "0 6px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"]
  ]);

  createElement("PickerTitle", "div", EmojiPicker, [
      ["position", "relative"],
      ["display", "flex"],
      ["width", "100%"],
      ["padding-top", "6px"],
      ["padding-bottom", "4px"],
      ["left", "0px"],
      ["border-style", "solid"],
      ["border-color", "#aaaaaa"],
      ["border-width", "0px 0px 2px 0px"],

      // Text:
      ["font-size", "26px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"]
  ]).textContent = "Emoji Picker";
  
  var EmojiSelect = createElement("EmojiSelect", "div", EmojiPicker, [
      ["position", "relative"],
      ["display", "grid"],
      ["gap", "2px"],
      ["grid-template-columns", "repeat(auto-fit, " + TileSize + "px)"],
      ["align", "top"],
      ["padding-top", "6px"],
      ["padding-left", "2px"],
      ["padding-bottom", "12px"],
      ["width", "100%"],
      ["height", "calc(100% - 60px)"],
      ["overflow-y", "auto"]
  ]);
  EmojiSelect.className = "StandardScroll";

  EmojiEditorOpen = false;
  
  for (var h = 0; h < HeightDimension; h++) {
    for (var r = 0; r < WidthDimension; r++) {
      if (EmojiPicker != null) {
        createElement("Emoji" + h + r, "a", EmojiSelect, [
            ["position", "relative"],
            ["display", "block"],
            ["width", TileSize + "px"],
            ["height", TileSize + "px"],
            //["background-color", "green"],
            ["cursor", "pointer"],
            ["background", "url(" + SriteSheet + ")"],
            ["background-position", (100/WidthDimension)*r + "% " + (100/HeightDimension)*h + "%"],
            //["transform", "scale(" + FactorRate/TileSize + ")"]
            //["background-size", "150% 150%"]
        ]);
        await sleep(2);
      } else {
        break;
      }
    }
    if (EmojiPicker == null) {
      break;
    } else {
      await sleep(2);
    }
  }

  //EmojiEditorLoadSource = null;
}

LoadEmojiEditor();

find("Primary").addEventListener("click", function() {
  if (EmojiPicker != null && LastClickTime+20 < Date.now()) {
    EmojiPicker.remove();
  }
});
*/