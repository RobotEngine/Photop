var ViewPost = {};

// Click on Link:
var ConsiderLink = null;
function ConfirmLinkClick() {
  window.open(ConsiderLink);
}

function CopyClipboardText(Data) {
  navigator.clipboard.writeText(Data[3]).then(function() {
    //console.log('Async: Copying to clipboard was successful!');
  }, function(Error) {
    console.error('Async: Could not copy text: ', Error);
  });
}

var RoleTypes = {
  "Owner": ["👑", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true, CanUnbanUser: true }],
  "Moderator": ["🛡️", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true, CanUnbanUser: false }],
  "Developer": ["👨‍💻", { CanDeletePosts: false, CanDeleteChats: false, CanBanUsers: false, CanUnbanUser: false }],
  "Contributor": ["🔧", { CanDeletePosts: false, CanDeleteChats: false, CanBanUsers: false, CanUnbanUser: false }],
  "Verified": ["📢", { CanDeletePosts: false, CanDeleteChats: false, CanBanUsers: false, CanUnbanUser: false }],
  "Partner": ["📷", { CanDeletePosts: false, CanDeleteChats: false, CanBanUsers: false, CanUnbanUser: false }],
  "Tester": ["🧪", { CanDeletePosts: false, CanDeleteChats: false, CanBanUsers: false, CanUnbanUser: false }]
};
var RoleKeyTypes = Object.keys(RoleTypes);
function SetUsernameRole(TextHolder, UserData, FontSize, LimitSingleBadge) {
  if (TextHolder == null) {
    return;
  }
  var FullString = "";
  if (UserData.Role != null) {
    var Roles = UserData.Role;
    if (Array.isArray(Roles) == false) {
      Roles = [ Roles ];
    }
    if (FontSize != null) {
      FullString += "<div style='display: flex; align-items: center; white-space: pre'>";
    }
    if (FontSize == null || LimitSingleBadge == true) {
      Roles = [ Roles[0] ];
    }
    for (var i = 0; i < Roles.length; i++) {
      var RoleName = Roles[i];
      var AddRole = RoleTypes[RoleName];
      if (AddRole != null) {
        var SetString = "";
        //var RoleIconURL = "./Images/RoleIcons/" + RoleName + ".png";
        if (FontSize == null) {
          //FontSize = getCSS(TextHolder, "font-size").replace(/px/g, "");
          //SetString = "<span style='height: " + (FontSize-4) + "px; padding: 0px 2px 0px 2px; margin-right: 3px; border-radius: 6px; content: url(" + RoleIconURL + ")' title='" + RoleName + "'></span>";
          SetString = "<span style='background-color: #505068; padding: 0px 2px 0px 2px; margin-right: 6px; border-radius: 6px' title='" + RoleName + "'>" + AddRole[0] + "</span>";
        } else {
          SetString = "<span style='background-color: #505068; padding: 0px 2px 0px 2px; margin-right: 6px; border-radius: 6px; font-size: " + FontSize + "' title='" + RoleName + "'>" + AddRole[0] + "</span>";
        }
        FullString += SetString;
      }
    }
  }
  FullString += UserData.User;
  if (FontSize != null) {
    FullString += "</div>";
  }
  TextHolder.innerHTML = FullString;
}
function CheckPermision(Roles, Permision) {
  if (Roles != null && Permision != null) {
    var Permisions = {};
    if (Array.isArray(Roles) == true) {
      for (var i = 0; i < Roles.length; i++) {
        var RoleData = RoleTypes[Roles[i]];
        if (RoleData != null) {
          RoleData = RoleData[1];
          var Keys = Object.keys(RoleData);
          for (var p = 0; p < Keys.length; p++) {
            if (Permisions[Keys[p]] == null || Permisions[Keys[p]] == false) {
              Permisions[Keys[p]] = RoleData[Keys[p]];
            }
          }
        }
      }
    } else {
      Permisions = RoleTypes[Roles][1];
    }
    return Permisions[Permision] == true;
  }
  return false;
}

async function CreatePostButtons(ID, Data, UserData, PostContainer, IsLikingPost, FromClick, IsLikeData) {
  Data.User = UserData.User;
  
  if (IsLikeData != true) {
    Data.IsLiked = IsLikingPost;
  }

  var ButtonHolderWidth = "58%";
  if (MobileVersion == true) {
    ButtonHolderWidth = "100%";
  }
  var PostButtonHolder = createElement(ID + "PostButtonHolder", "div", PostContainer, [
      ["position", "absolute"],
      ["display", "inline-block"],
      ["z-index", "10"],
      ["bottom", "12px"],
      ["width", ButtonHolderWidth],
      ["height", "20px"],
      ["text-align", "left"],
  ]);

  function createSVGButtonImage(ButtonID, PxSize, Color, Border, Svg) {
    var SVGElem = createElement(ButtonID + "Svg", "svg", ButtonID, [
        ["position", "absolute"],
        ["height", PxSize + "px"],
        ["width", PxSize + "px"],
        ["top", (PostButtonHolder.clientHeight-PxSize)/2 + "px"],
        ["left", -1*(PxSize+2) + "px"],
        ["cursor", "pointer"]
    ], "http://www.w3.org/2000/svg");
    SVGElem.setAttribute("viewBox", "0 0 512 512")
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

  var LikePostButton = createElement(ID + "Likes", "div", ID + "PostButtonHolder", [
    ["position", "relative"],
    ["display", "inline-flex"],
    ["height", "100%"],
    ["width", "25%"],
    ["left", "15%"],

    // Text:
    ["font-size", "18px"],
    ["font-family", FontTypeA],
    ["font-weight", "400"],
    ["color", "#999999"],
    ["text-align", "left"],
    ["align-items", "center"],
  ]);
  if (Data.Likes == null) {
    Data.Likes = 0;
  }
  LikePostButton.textContent = Data.Likes;
  if (Data.IsLiked == true) {
    var LikeSVGImage = createSVGButtonImage(ID + "Likes", 20, "#FF5786", {Color: "#FF5786", Size: 0}, ["m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm088-109.289063zm0 0"]);
    setCSS(LikePostButton, "color", "#FF5786");
    LikePostButton.setAttribute("title", "Unlike Post");

    if (FromClick == true) {
      LikeSVGImage.animate([
        { width: "70%", height: "40px", left: "-48px", top: "-15px", offset: 0.3 },
        { width: "25%", height: "100%", },
      ], 150);
    }
  } else {
    LikePostButton.setAttribute("title", "Like Post");
    createSVGButtonImage(ID + "Likes", 20, "#999999", {Color: FontColorA, Size: 0}, ["m256 455.515625c-7.289062 0-14.316406-2.640625-19.792969-7.4375-20.683593-18.085937-40.625-35.082031-58.21875-50.074219l-.089843-.078125c-51.582032-43.957031-96.125-81.917969-127.117188-119.3125-34.644531-41.804687-50.78125-81.441406-50.78125-124.742187 0-42.070313 14.425781-80.882813 40.617188-109.292969 26.503906-28.746094 62.871093-44.578125 102.414062-44.578125 29.554688 0 56.621094 9.34375 80.445312 27.769531 12.023438 9.300781 22.921876 20.683594 32.523438 33.960938 9.605469-13.277344 20.5-24.660157 32.527344-33.960938 23.824218-18.425781 50.890625-27.769531 80.445312-27.769531 39.539063 0 75.910156 15.832031 102.414063 44.578125 26.191406 28.410156 40.613281 67.222656 40.613281 109.292969 0 43.300781-16.132812 82.9375-50.777344 124.738281-30.992187 37.398437-75.53125 75.355469-127.105468 119.308594-17.625 15.015625-37.597657 32.039062-58.328126 50.167969-5.472656 4.789062-12.503906 7.429687-19.789062 7.429687zm-112.96875-425.523437c-31.066406 0-59.605469 12.398437-80.367188 34.914062-21.070312 22.855469-32.675781 54.449219-32.675781 88.964844 0 36.417968 13.535157 68.988281 43.882813 105.605468 29.332031 35.394532 72.960937 72.574219 123.476562 115.625l.09375.078126c17.660156 15.050781 37.679688 32.113281 58.515625 50.332031 20.960938-18.253907 41.011719-35.34375 58.707031-50.417969 50.511719-43.050781 94.136719-80.222656 123.46875-115.617188 30.34375-36.617187 43.878907-69.1875 43.878907-105.605468 0-34.515625-11.605469-66.109375-32.675781-88.964844-20.757813-22.515625-49.300782-34.914062-80.363282-34.914062-22.757812 0-43.652344 7.234374-62.101562 21.5-16.441406 12.71875-27.894532 28.796874-34.609375 40.046874-3.453125 5.785157-9.53125 9.238282-16.261719 9.238282s-12.808594-3.453125-16.261719-9.238282c-6.710937-11.25-18.164062-27.328124-34.609375-40.046874-18.449218-14.265626-39.34375-21.5-62.097656-21.5zm0 0"]);
  }

  var QuotePostButton = createElement(ID + "Quotes", "div", ID + "PostButtonHolder", [
    ["position", "relative"],
    ["display", "inline-flex"],
    ["height", "100%"],
    ["width", "25%"],
    ["left", "15%"],

    // Text:
    ["font-size", "18px"],
    ["font-family", FontTypeA],
    ["font-weight", "400"],
    ["color", "#999999"],
    ["text-align", "left"],
    ["align-items", "center"],
  ]);
  QuotePostButton.textContent = Data.Quotes || 0;
  QuotePostButton.setAttribute("title", "Quote Post");
  var QuoteSVGImage = createSVGButtonImage(ID + "Quotes", 25, "#999999", {Color: FontColorA, Size: 0}, ["m186.206 200.529h-156.111c7.232-64.279 61.282-114.588 127.464-114.588h14.324v-28.647h-14.324c-86.878 0-157.559 70.681-157.559 157.559v171.882c0 7.917 6.406 14.324 14.324 14.324h171.882c7.917 0 14.324-6.406 14.324-14.324v-171.882c-.001-7.917-6.407-14.324-14.324-14.324zm-14.324 171.883h-143.235v-143.236h143.235z", "m444.029 200.529h-156.111c7.232-64.279 61.282-114.588 127.464-114.588h14.324v-28.647h-14.324c-86.878 0-157.559 70.681-157.559 157.559v171.882c0 7.917 6.406 14.324 14.324 14.324h171.882c7.917 0 14.324-6.406 14.324-14.324v-171.882c0-7.917-6.406-14.324-14.324-14.324zm-14.323 171.883h-143.235v-143.236h143.235z"]);

  // Filled: ["m0 204.647v175.412h175.412v-175.412h-116.941c0-64.48 52.461-116.941 116.941-116.941v-58.471c-96.728 0-175.412 78.684-175.412 175.412z", "m409.294 87.706v-58.471c-96.728 0-175.412 78.684-175.412 175.412v175.412h175.412v-175.412h-116.941c0-64.48 52.461-116.941 116.941-116.941z"]
  
  var ChatElementCount = createElement(ID + "Chats", "div", ID + "PostButtonHolder", [
    ["position", "relative"],
    ["display", "inline-flex"],
    ["height", "100%"],
    ["width", "25%"],
    ["left", "15%"],

    // Text:
    ["font-size", "18px"],
    ["font-family", FontTypeA],
    ["font-weight", "400"],
    ["color", ThemeColor],
    ["text-align", "left"],
    ["align-items", "center"],
  ]);
  ChatElementCount.textContent = Data.Chats || 0;
  ChatElementCount.setAttribute("title", "Chat About Post");
  var ChatSVGImage = createSVGButtonImage(ID + "Chats", 25, ThemeColor, {Color: FontColorA, Size: 0}, [ ["circle", "256", "256", "63.2"], "m141.695 141.695-21.213-21.213c-36.251 36.251-56.215 84.379-56.215 135.518s19.964 99.267 56.216 135.518l21.213-21.213c-30.586-30.585-47.429-71.18-47.429-114.305s16.843-83.72 47.428-114.305z", "m96.273 96.273-21.212-21.212c-48.404 48.403-75.061 112.662-75.061 180.939s26.657 132.536 75.061 180.939l21.213-21.213c-42.737-42.737-66.274-99.462-66.274-159.726s23.537-116.989 66.273-159.727z", "m436.939 75.061-21.213 21.213c42.737 42.737 66.274 99.462 66.274 159.726s-23.537 116.989-66.273 159.727l21.213 21.213c48.403-48.404 75.06-112.663 75.06-180.94s-26.657-132.536-75.061-180.939z", "m391.518 120.482-21.213 21.213c30.585 30.585 47.428 71.18 47.428 114.305s-16.844 83.72-47.429 114.305l21.213 21.213c36.251-36.251 56.216-84.379 56.216-135.518s-19.964-99.267-56.215-135.518z", "m346.095 165.905-21.213 21.213c18.433 18.433 28.584 42.896 28.584 68.882s-10.151 50.449-28.584 68.882l21.213 21.213c24.1-24.099 37.372-56.096 37.372-90.095s-13.272-65.996-37.372-90.095z", "m165.905 165.905c-24.1 24.099-37.372 56.095-37.372 90.095s13.272 65.996 37.372 90.095l21.213-21.213c-18.433-18.433-28.584-42.896-28.584-68.882s10.151-50.449 28.584-68.882z"]);

  var ExtraButton = createElement(ID + "Extra", "div", ID + "PostButtonHolder", [
    ["position", "relative"],
    ["display", "inline-flex"],
    ["top", "4px"],
    ["height", "100%"],
    ["left", "15%"],
  ]);
  var OptionsButton = createElement(ID + "OptionsButton", "svg", ID + "Extra", [
    ["position", "absolute"],
    ["height", "20px"],
    ["width", "20px"],
    ["top", "0px"],
    ["left", "-22px"],
    ["cursor", "pointer"]
  ], "http://www.w3.org/2000/svg");
  OptionsButton.setAttribute("viewBox", "0 0 41.915 41.915")
  var GTag = createElement(ID + "OptionsG", "g", ID + "OptionsButton", null, "http://www.w3.org/2000/svg");
  var Svg = ["M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z", "M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z", "M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"];
  for (var i = 0; i < Svg.length; i += 1) {
    createElement("Svg", "path", ID + "OptionsG", null, "http://www.w3.org/2000/svg").setAttribute("d", Svg[i]);
  }
  GTag.setAttribute("fill", "#999999");

  ExtraButton.addEventListener("click", function() {
    ShowPostDropdown(ExtraButton, ID, Data, PostContainer);
  });
  
  LikePostButton.addEventListener("click", function() {
    if (UserID != null) {
      PostButtonHolder.remove();
      LikePost(ID, Data.IsLiked);
      if (Data.IsLiked == false) {
        Data.Likes += 1;
        Data.IsLiked = true;
      } else {
        Data.Likes -= 1;
        Data.IsLiked = false;
      }
      Data.Chats = ChatElementCount.textContent;
      /*
      if (IsLikeData != null) {
        var SetNewLikeData = [];
        for (var l = 0; l < IsLikeData.length; l++) {
          if (IsLikeData[l]._id != (ID + UserID)) {
            SetNewLikeData.push({ _id: IsLikeData[l]._id });
          }
        }
        if (IsLikingPost == true) {
          SetNewLikeData.push({ _id: (ID + UserID) })
        }
        IsLikeData = SetNewLikeData;
        console.log(IsLikeData)
      }
      */
      IsLikingPost = Data.IsLiked;
      CreatePostButtons(ID, Data, UserData, PostContainer, IsLikingPost, true, IsLikeData);
    } else {
      ShowPopUp("It's Better Together", "Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style='color: #FF5786'>Like</b> a post!", [ ["Sign In", ThemeColor, "StartSignIn"], ["Sign Up", "#2AF5B5", "StartSignUp"], ["Later", "#B3B3B3", null] ]);
    }
  });

  QuotePostButton.addEventListener("click", function() {
    if (UserID == null) {
      ShowPopUp("It's Better Together", "Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style='color: #C95EFF'>Quote</b> a post!", [ ["Sign In", ThemeColor, "StartSignIn"], ["Sign Up", "#2AF5B5", "StartSignUp"], ["Later", "#B3B3B3", null] ]);
      return "NotLoggedIn";
    }
    SwitchPage("Home");
    var PostCreate = find("CreatePostTextHolder");
    if (PostCreate != null) {
      QuoteSVGImage.animate([
        { width: "70%", height: "40px", left: "-48px", top: "-15px", offset: 0.3 },
        { width: "25%", height: "100%", },
      ], 150);

      var SearchAdd = "/Post_" + ID;
      PostCreate.focus();
      if (PostCreate.textContent.includes(SearchAdd) == false) {
        PostCreate.textContent = SearchAdd + " ";
        RenderNewText();
      }
      SetCursor(PostCreate, PostCreate.textContent.length);
    }
  });
  ChatElementCount.addEventListener("click", function() {
    if (UserID == null) {
      ShowPopUp("It's Better Together", "Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style='color: " + ThemeColor + "'>Chat</b> on a post!", [ ["Sign In", ThemeColor, "StartSignIn"], ["Sign Up", "#2AF5B5", "StartSignUp"], ["Later", "#B3B3B3", null] ]);
      return "NotLoggedIn";
    }
    ChatSVGImage.animate([
      { width: "70%", height: "40px", left: "-50px", top: "-15px", offset: 0.3 },
      { width: "25%", height: "100%", },
    ], 150);
    var TextBoxType = find(ID + "TextBox");
    if (TextBoxType != null) {
      TextBoxType.focus();
    }
  });
}

async function CreatePostView(ID, Data, UserData, Parent, IsLikingPost, IsLikeData) {
  if (ID == null || Data == null || UserData == null || Parent == null) {
    return;
  }
  var PostContainer = createElement(ID, "div", Parent, [
      ["position", "relative"],
      ["width", "100%"],
      ["min-height", "200px"],
      ["margin-top", "8px"],
      ["background-color", ContentColor],
      ["border-radius", "12px"],

      ["overflow-y", "hidden"]
  ]);
  PostContainer.className = "Posts";

  var DisplayType = "flex";
  var BodyWidth = "58%";
  if (MobileVersion == true) {
    DisplayType = "none";
    BodyWidth = "100%";
  }

  var Post = createElement(ID + "Post", "div", PostContainer, [
      ["position", "relative"],
      ["width", BodyWidth],
      ["min-height", "200px"],
      ["max-height", "400px"]
  ]);
  var PostInfo = createElement(ID + "UserHolder", "div", Post, [
      ["position", "relative"],
      ["width", "100%"],
      ["min-height", "54px"],
      ["z-index", "10"],
      ["cursor", "pointer"]
  ]);
  var PostContent = createElement(ID + "Content", "div", Post, [
      ["position", "relative"],
      ["width", "100%"],
      ["max-height", "304px"],
      ["z-index", "5"],
      ["overflow", "hidden"],
      ["cursor", "pointer"]
  ]);
  PostContent.className = "StandardScroll";
  createElement("Spacer", "div", Post, [
      ["position", "relative"],
      ["width", "100%"],
      ["height", "40px"]
  ]);
  createElement(ID + "ProfilePic", "div", PostInfo, [
      ["position", "absolute"],
      ["width", "44px"],
      ["height", "44px"],
      ["left", "6px"],
      ["top", "6px"],
      ["object-fit", "cover"],
      ["border-radius", "8px"],

      ["content", "url('" + GoogleCloudStorgeURL + "ProfileImages/" + DecideProfilePic(UserData) + "')"]
  ]).setAttribute("LoadUserID", Data.UserID);

  var UsernameText = createElement(ID + "User", "div", PostInfo, [
      ["position", "relative"],
      ["display", "inline-table"],
      ["max-width", "calc(100% - 70px)"],
      ["left", "54px"],
      ["min-height", "24px"],
      ["padding-bottom", "4px"],
      ["top", "6px"],

      // Text:
      ["font-size", "20px"],
      ["font-family", FontTypeA],
      ["font-weight", "500"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["white-space", "nowrap"],
      ["text-overflow", "ellipsis"],
      ["overflow", "hidden"]
  ]);
  SetUsernameRole(UsernameText, UserData);
  UsernameText.setAttribute("LoadUserID", Data.UserID);
  UsernameText.className = UserData.User + "PostText";

  var CalcTimestamp = Math.floor((Date.now() - Data.Timestamp) / 1000);
  if (CalcTimestamp < 1) {
    CalcTimestamp = 1; // Prevent negative timestamps.
  }
  var AmountDivide = 1;
  var End = "Second";
  if (CalcTimestamp > 31536000-1) {
    AmountDivide = 31536000;
    End = "Year";
  } else if (CalcTimestamp > 2592000-1) {
    AmountDivide = 2592000;
    End = "Month";
  } else if (CalcTimestamp > 604800-1) {
    AmountDivide = 604800;
    End = "Week";
  } else if (CalcTimestamp > 86400-1) {
    AmountDivide = 86400;
    End = "Day";
  } else if (CalcTimestamp > 3600-1) {
    AmountDivide = 3600;
    End = "Hour";
  } else if (CalcTimestamp > 60-1) {
    AmountDivide = 60;
    End = "Minute";
  }
  var TimeToSet = Math.round(CalcTimestamp / AmountDivide);
  if (TimeToSet > 1) {
    // Add "S":
    End += "s";
  }
  
  var PinnedText = "";
  if (CurrentPage == "Profile" && ProfileUserData != null && ProfileUserData.ProfileData != null && ProfileUserData.ProfileData.PinnedPost == ID) {
    PinnedText = " (Pinned)";
  }
  var PostInfo = createElement(ID + "PostInfo", "div", PostInfo, [
      ["position", "relative"],
      ["max-width", "calc(100% - 70px)"],
      ["margin-top", "1px"],
      ["height", "18px"],
      ["left", "54px"],

      // Text:
      ["font-size", "14px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#999999"],
      ["text-align", "left"],
      ["white-space", "nowrap"],
      ["text-overflow", "ellipsis"],
      ["overflow", "hidden"]
  ]);
  PostInfo.textContent = TimeToSet + " " + End + " Ago" + PinnedText;
  PostInfo.setAttribute("title", "Posted: " + new Date(Data.Timestamp) + PinnedText);

  var PostText = createElement(ID + "TextHolder", "div", PostContent, [
      ["position", "relative"],
      ["display", "block"],
      ["width", "95%"],
      ["max-height", "100%"],
      ["margin-left", "3.5%"],
      //["padding-bottom", "12px"],
      ["z-index", "5"],

      // Text:
      ["font-size", "20px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow", "hidden"]
  ]);

  /*
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

  createElement(ID + "ClickArea", "div", PostContainer.id, [
      ["position", "absolute"],
      ["width", "100%"],
      ["height", "100%"],
      ["top", "0px"],
      ["left", "0px"],
      ["cursor", "pointer"]
  ]);

  //var PostButtonHolder = null;
  //var LikePostButton = null
  //var QuotePostButton = null;
  //var ChatElementCount = null;
  //var OptionsButton = null;
  //var IsLikingPost = await HasLikedPost(ID);
  
  //HasLikedPost(ID, Data, PostContainer);
  //CreatePostButtons();
  CreatePostButtons(ID, Data, UserData, PostContainer, IsLikingPost, null, IsLikeData);
  
  var Chat = createElement(ID + "LiveChat", "div", PostContainer, [
      ["position", "absolute"],
      ["display", DisplayType],
      ["flex-flow", "column"],
      ["width", "calc(42% - 6px)"],
      ["right", "0px"],
      ["top", "0px"],
      ["height", "100%"],
      ["overflow", "hidden"],
      ["background-color", ContentColorLayer2],
      ["z-index", "10"]
  ]);
  if (MobileVersion == true) {
    setCSS(Chat, "border-radius", "8px");
  }

  var ChatTitle = createElement("ChatTitle", "div", Chat, [
      ["position", "relative"],
      ["display", "flex"],
      ["flex", "0 1 auto"],
      ["width", "100%"],
      ["height", "35px"],
      ["left", "0px"],
      ["top", "0px"],
      ["align-items", "center"],
      ["background-color", ContentColorLayer3]
  ]);
  createElement("ChatTitleLiveCircle", "div", ChatTitle, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["width", "12px"],
      ["height", "12px"],
      ["margin-left", "10px"],
      ["background-color", "red"],
      ["border-radius", "60%"]
  ]);
  createElement("ChatTitleLiveText", "div", ChatTitle, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["margin-left", "8px"],
      
      ["border-radius", "60px"],

      // Text:
      ["font-size", "18px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "red"],
  ]).textContent = "Live";
  createElement(ID + "ChatTitleLiveUsers", "div", ChatTitle, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["margin-left", "4px"],
      ["border-radius", "60px"],

      // Text:
      ["font-size", "14px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#BFBFBF"],
  ]).textContent = "• " + " Loading...";

  var ChatContainer = createElement("Chat", "div", Chat, [
    ["position", "relative"],
    ["display", "flex"],
    ["flex", "1 1 45px"],
    ["flex-direction", "column"],
    ["width", "100%"],
    ["overflow", "auto"]
  ]);
  ChatContainer.className = "StandardScroll";
  //ChatContainer.setAttribute("tabindex", "-1");
  
  if (MobileVersion == true) {
    var swiper = new Swipe(PostContainer);
    swiper.onLeft(async function() {
      if (find("NavButtonHolder").hasAttribute("Open") == false) {
        ScrolledToMobile = window.scrollY;
        //setCSS("PostContent", "display", "hidden");
        
        //DisableScrolling();

        var MobileChatHolder = find("LiveChatHolder");
        MobileChatHolder.setAttribute("Open", "");

        setCSS(Chat, "display", "flex");
        setCSS(Chat, "width", "calc(100% - 16px)");
        setCSS(Chat, "height", "calc(100% - 16px)"); //(window.innerHeight - 16) + "px");
        setCSS(Chat, "max-height", (window.innerHeight - 16) + "px");
        setCSS(Chat, "left", "8px");
        setCSS(Chat, "top", "8px");
        removeCSS(Chat, "right");

        MobileChatHolder.appendChild(Chat);
        ChatContainer.scrollTo(0, ChatContainer.scrollHeight);
        //setCSS(MobileChatHolder, "display", "block");
        MobileChatHolder.style.left = "0%";
        await sleep(400);

        setCSS("Primary", "overflow", "hidden");
        setCSS("body", "position", "fixed");
        //setCSS("body", "scroll-behavior", "none");
      }
    });
    swiper.run();
  }

  createElement(ID + "ChatTopMessage", "div", ChatContainer, [
    ["position", "relative"],
    ["width", "80%"],
    ["left", "10%"],
    ["margin-top", "12px"],
    ["margin-bottom", "10px"],

    // Text:
    ["font-size", "16px"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", "#bbbbbb"],
    ["text-align", "center"],
    ["overflow-wrap", "break-word"],
    ["white-space", "pre-wrap"]
  ]).textContent = "Loading Chat Messages...";
  
  var ChatCreateContainer = createElement("ChatType", "div", Chat, [
      ["position", "relative"],
      ["display", "block"],
      ["flex", "0 1 auto"],
      ["width", "100%"],
      ["left", "0px"],
      ["bottom", "0px"],
      ["padding-top", "1px"],
      ["padding-bottom", "1px"],
      ["background-color", ContentColorLayer3]
  ]);
  var ChatBox = createElement(ID + "TextBox", "span", ChatCreateContainer, [
      ["position", "relative"],
      ["display", "block"],
      ["min-width", "calc(100% - 73px)"],
      ["max-width", "calc(100% - 73px)"],
      ["min-height", "25px"],
      ["max-height", "100px"],
      ["margin-top", "4px"],
      ["margin-bottom", "4px"],
      ["left", "5px"],
      ["padding-top", "5px"],
      ["background-color", ContentColorLayer2],
      ["border-width", "0px"],
      ["border-radius", "6px"],
      ["padding-left", "6px"],
      ["overflow-y", "auto"],

      // Text:
      ["font-size", "16px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-line"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", "#aaaaaa"],
      ["text-align", "left"],
      ["resize", "none"]
  ]);
  ChatBox.setAttribute("role", "textbox");
  ChatBox.setAttribute("contenteditable", "true");
  ChatBox.setAttribute("onpaste", "return clipBoardRead(event)");
  ChatBox.setAttribute("title", "Create Chat");
  ChatBox.textContent = "Time to Chat";
  ChatBox.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });
  ChatBox.addEventListener("focus", function(e) {
    if (ChatBox.textContent == "Time to Chat") {
      ChatBox.textContent = "";
      setCSS(ChatBox, "color", FontColorA);
    }
    SetPageTitle("Creating Chat");
  });
  ChatBox.addEventListener("focusout", function(e) {
    if (ChatBox.textContent.length < 1) {
      ChatBox.textContent = "Time to Chat";
      setCSS(ChatBox, "color", "#aaaaaa");
    }
    RevertTitle();
  });
  /*
  ChatBox.addEventListener("input", function(e) {
    ChatBox.textContent = ChatBox.textContent;
  });
  */

  var SendChatButton = createElement("SendChatButton", "div", ChatCreateContainer, [
      ["position", "absolute"],
      ["display", "flex"],
      ["width", "52px"],
      ["height", "30px"],
      ["top", "5px"],
      ["right", "5px"],
      ["background-color", ThemeColor],
      ["border-radius", "6px"],
      ["cursor", "pointer"],

      // Text:
      ["font-size", "16px"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", "#ffffff"],
      ["text-align", "center"],
      ["justify-content", "center"],
      ["align-items", "center"],
      ["resize", "none"]
  ]);
  SendChatButton.textContent = "Chat";
  SendChatButton.setAttribute("title", "Send Chat");
  function SendChatAction() {
    ChatBox.textContent = ChatBox.textContent.trim();  // Clear formatting
    if (TypingDisabled == true) {
      return;
    }
    if (UserID == null) {
      ShowPopUp("It's Better Together", "Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style='color: " + ThemeColor + "'>Chat</b> on a post!", [ ["Sign In", ThemeColor, "StartSignIn"], ["Sign Up", "#2AF5B5", "StartSignUp"], ["Later", "#B3B3B3", null] ]);
      return;
    }
    if (ChatBox.textContent == "" || getCSS(ChatBox, "color") == "#aaaaaa" && ChatBox.textContent == "Time to Chat") {
      ShowPopUp("Write a Chat", "You can't chat... NOTHING! Write something!", [ ["Okay", "#618BFF", null] ]);
      return;
    }
    if (ChatBox.textContent.length < 1) {
      ShowPopUp("Must be Longer", "Your chat must be at least <b>2 characters</b> long before you can post.", [ ["Okay", "#618BFF", null] ]);
      return;
    }
    if (ChatBox.textContent.length > 200) { // 200 Character Limit.
      ShowPopUp("Text Overload", "Your chat cannot be longer than <b>200 Characters</b>!", [ ["Okay", "#618BFF", null] ]);
      return;
    }
    var SendChatData = {
      PostID: ID,
      Text: ChatBox.textContent,
    };
    var PreviewExtras = {};
    var ReplyFrame = ChatCreateContainer.querySelector("#ReplyToFrame");
    if (ReplyFrame != null) {
      PreviewExtras.Replies = {};
      var ReplyID = ReplyFrame.getAttribute("ReplyChatID");
      PreviewExtras.Replies[ReplyID] = { UserData: { User: ReplyFrame.querySelector("#UserAlert").childNodes[1].textContent }, Text: find(ReplyID + "Chat").querySelector("#ChatText").textContent};
      SendChatData.ReplyID = ReplyID;
      setCSS(ReplyID + "Chat", "background-color", "rgba(0, 0, 0, 0)");
      setCSS(ChatCreateContainer.querySelector("#SendChatButton"), "margin-top", "0px");
      ReplyFrame.remove();
    }
    SendChat(SendChatData, PreviewExtras);
  }
  SendChatButton.addEventListener("click", function() {
    SendChatAction();
    ChatBox.textContent = "Time to Chat";
    setCSS(ChatBox, "color", "#aaaaaa");
  });
  ChatBox.addEventListener("keyup", function(event) {
    if (event.which === 13 && event.shiftKey === false) {
      SendChatAction();
      ChatBox.textContent = "";
    }
  });

  var EmbedLink = null;
  var PreviewEmbedLink = null;

  // GENERATE TEXT:
  var StandardText = CleanString(Data.Text);
  
  //StandardText = StandardText.replaceAll("&", "&#38;");
  //StandardText = StandardText.replaceAll("$", "&#36;");
  StandardText = StandardText.replace(/\?/g, "&#63;");
  //StandardText = StandardText.replaceAll("#", "&#35;");
  StandardText = StandardText.replace(/\=/g, "&#61;");

  //StandardText = StandardText.replaceAll("&#160;", "test");

  // XSS Protection:
  StandardText = StandardText.replace(/\</g, "&#60;");
  StandardText = StandardText.replace(/\>/g, "&#62;");
  var NewHTML = "";

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

      var CheckIndexFor = " ";
      if (HighlightChars[Search].EndChar != null) {
        CheckIndexFor = HighlightChars[Search].EndChar;
      }
      var EndIndex = IndexSort.indexOf(CheckIndexFor, Index+1);

      if (EndIndex < 0) {
        EndIndex = StandardText.length;
      }

      var DollarKeyIndex = IndexSort.indexOf("$", Index+1);
      if (DollarKeyIndex > -1 && DollarKeyIndex < EndIndex) {
        EndIndex = DollarKeyIndex;
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

      if (HighlightChars[Search].IncludeKeys != null && HighlightChars[Search].IncludeKeys == false) {
        SearchIndex += Search.length;
        EndIndex += HighlightChars[Search].EndChar.length;
      }

      var TextAdd = StandardText.substring(SearchIndex, SearchEndIndex); // Get just the highlighted string

      if (HighlightChars[Search].MustInclude == null || TextAdd.includes(HighlightChars[Search].MustInclude) == true) {
        // Add the string before the search:
        NewHTML += StandardText.substring(0, Index);

        var StyleType = HighlightChars[Search].Type;
        var SetStyle = HighlightChars[Search].Style;

        var TagSet = HighlightChars[Search].Tag || "span";

        var AddHTMLStart = '<' + TagSet + ' ';
        var AddHTMLEnd = "</" + TagSet + ">";
        
        var AnyExtra = "";
        
        if (StyleType == "Mention" ) {

          var StartSnip = TextAdd.indexOf("&#60;")+5;
          var UserCutID = TextAdd.substring(StartSnip, TextAdd.indexOf("&#62;", StartSnip+23));
          var RealUsernameText = TextAdd.substring(0, TextAdd.indexOf("&#60;"));

          if (UserCutID.length == 24 && RealUsernameText.length > 0) {
            TextAdd = RealUsernameText;
            AddHTMLStart += 'loaduserid="' + UserCutID + '" ';
          } else {
            StyleType = null;
            SetStyle = "";
          }
          /*
          AddHTMLStart += 'title="You Where Mentioned!" ';
          AnyExtra += " background-color: #A41F2A";
          */
        }

        // Add the new InnerHTML:
        AddHTMLStart += 'style="' + SetStyle + AnyExtra + '"';
        
        if (StyleType == "Quote") {
          DataPostEmbedLoad.push(["Post", TextAdd.substring(6), ID, PostContent]);
        }
        if (StyleType == "ChatLoad") {
          DataPostEmbedLoad.push(["Chat", TextAdd.substring(6), ID, PostContent]);
        }

        if (StyleType != null && (HighlightChars[Search].IncludeKeys == null || HighlightChars[Search].IncludeKeys == true)) {
          if (StyleType == "Link") {
            AddHTMLStart += ' onMouseOver="this.style.textDecoration = ' + "'underline'" + '" onMouseOut="this.style.textDecoration = ' + "'none'" + '"';
            if (TextAdd.substring(0, 4) != "http") {
              TextAdd = "https://" + TextAdd;
            }
            if (TextAdd.includes("https://www.youtube.com/") == true || TextAdd.includes("https://youtu.be/") == true) {
              if (UserDisplaySettings["Embed YouTube Videos"] == true) {
                EmbedLink = TextAdd;
              }
            }
            if (TextAdd.includes("https://www.twitch.tv/") == true) {
              if (UserDisplaySettings["Embed Twitch Streams"] == true || UserDisplaySettings["Embed Twitch Live Chat"] == true) {
                EmbedLink = TextAdd;
              }
            }
            if (TextAdd.includes("https://studio.code.org/projects/") == true) {
              if (UserDisplaySettings["Embed code.org Projects"] == true) {
                EmbedLink = TextAdd;
              }
            }
            if (TextAdd.includes("https://scratch.mit.edu/projects/") == true) {
              if (UserDisplaySettings["Embed Scratch Games"] == true) {
                EmbedLink = TextAdd;
              }
            }
            if (TextAdd.substring(TextAdd.length-4) == ".gif" || TextAdd.substring(TextAdd.length-4) == ".mp4") {
              if (UserDisplaySettings["Embed GIFs"] == true) {
                EmbedLink = TextAdd;
              }
            }
            if (EmbedLink == null) {
              PreviewEmbedLink = TextAdd;
            }
          } else { // || TextAdd != ("@" + Username).trim()) {
            AddHTMLStart += ' onMouseOver="this.style.backgroundColor = ' + "adjust(this.style.color, 75)" + '" onMouseOut="this.style.backgroundColor = ' + "'rgba(255, 255, 255, 0)'" + '"';
          }

          AddHTMLStart += ' typerender="' + StyleType + '"';
        }
        AddHTMLStart += ' textspan="">';

        NewHTML += AddHTMLStart + TextAdd + AddHTMLEnd;
        
        StandardText = StandardText.substring(EndIndex);
      } else {
        if (TextAdd.includes(HighlightChars[Search].MustInclude) == false) {
          NewHTML += StandardText.substring(0, EndIndex);
          StandardText = StandardText.substring(EndIndex);
        }
      }
    }
  }
  NewHTML += StandardText;

  //NewHTML = NewHTML.replaceAll("    ", "<br/><br/>");
  //NewHTML = NewHTML.replaceAll("  ", "<br/>");
  NewHTML = NewHTML.replace(/\$\[NEWLINE\]\;/g, "<br/>").replace(/\$\[NEWLINE\]/g, "<br/>");

  /*
  var brFound = findAllIndexes(NewHTML, "<br/><br/>");
  if (brFound.length > 0 && NewHTML.substring(brFound[brFound.length-1]-5, brFound[brFound.length-1]) != "<br/>") {
    NewHTML = NewHTML.substring(0, brFound[brFound.length-1]) + NewHTML.substring(brFound[brFound.length-1]+10);
    NewHTML += "<br/>";
  }
  */

  /*
  var re = new RegExp(String.fromCharCode(160), "g");
  NewHTML = NewHTML.replace(re, " ");
  */
  PostText.innerHTML = NewHTML;
  PostText.innerHTML = PostText.innerHTML.replace(/\&nbsp\;/g, " ");

  if (PreviewEmbedLink != null) {
    createElement("LinkPreview" + PreviewEmbedLink, "div", PostContent, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["width", "95%"],
        ["margin-left", "3.5%"],
        ["margin-top", "4px"],
        ["border-radius", "12px"],
        ["background-color", ContentColorLayer2],
        ["z-index", "8"],
        ["cursor", "pointer"],
        ["vertical-align", "top"]
    ]).className = "LinkPreview";
  }
  
  // IMAGE UPLOADS:
  var MediaHolder = null;
  if ((Data.Media != null && Object.keys(Data.Media).length > 0) || EmbedLink != null) {
    var MediaHolderCSS = [
        ["position", "relative"],
        ["display", "inline-block"],
        ["max-width", "95%"],
        ["margin-left", "3.5%"],
        ["margin-top", "4px"],
        ["border-radius", "8px"],
        ["z-index", "5"],
        ["cursor", "pointer"],
        ["vertical-align", "top"],
        ["overflow", "hidden"],
        ["overflow-x", "auto"],
        ["white-space", "nowrap"]
    ];
    MediaHolder = createElement(ID + "MediaHolder", "div", PostContent, MediaHolderCSS);
    MediaHolder.className = "StandardScroll";
    if (Data.Media != null && Data.Media.ImageCount != null) {
      for (var i = 0; i < Data.Media.ImageCount; i++) {
        function NewViewImage() {
          var Image = createElement("Image", "img", MediaHolder, [
            ["position", "relative"],
            ["display", "inline-block"],
            ["height", "122px"],
            ["min-width", "35px"],
            ["margin-right", "8px"],
            ["border-radius", "8px"],
            ["z-index", "5"]
          ]);
          Image.src = GoogleCloudStorgeURL + "PostImages/" + ID + i;
          Image.setAttribute("TypeRender", "ImageExpand");
        }
        NewViewImage();
      }
    }
  }

  // EMBED VIDEOS:
  if (EmbedLink != null) {
    var URLData = new URL(EmbedLink.replace(/&#63;/g, "?").replace(/&#61;/g, "=").replace(/&#38;/g, "&"));
    if (EmbedLink.includes("https://www.youtube.com/") == true) {
      var EmbedID = (new URLSearchParams(URLData.search)).get("v");
      
      if (EmbedID != null) {
        var Video = CreateEmbedFrame("https://www.youtube.com/embed/" + EmbedID + "?&autoplay=1&mute=1", "364px", "204.25px", "YouTube", ID, MediaHolder)
        Video.setAttribute("frameborder", "0");
        Video.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        Video.setAttribute("allowfullscreen", "");
      }
    } else if (EmbedLink.includes("https://youtu.be/") == true) {
      var EndSlash = URLData.pathname.indexOf("/", 1);
      if (EndSlash < 0) {
        EndSlash = URLData.pathname.length;
      }
      var EmbedID = URLData.pathname.substring(1, EndSlash);

      if (EmbedID != null) {
        var Video = CreateEmbedFrame("https://www.youtube.com/embed/" + EmbedID + "?&autoplay=1&mute=1", "364px", "204.25px", "YouTube", ID, MediaHolder)
        Video.setAttribute("frameborder", "0");
        Video.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        Video.setAttribute("allowfullscreen", "");
      }
    } else if (EmbedLink.includes("https://www.twitch.tv/") == true) {
      var EndSlash = URLData.pathname.indexOf("/", 1);
      if (EndSlash < 0) {
        EndSlash = URLData.pathname.length;
      }
      var EmbedID = URLData.pathname.substring(1, EndSlash);

      if (EmbedID != null) {
        var SendLink = "https://player.twitch.tv/?channel=" + EmbedID + "&parent=" + window.location.host + "&muted=true";
        var Height = "204.25px";
        if (UserDisplaySettings["Embed Twitch Streams"] == false) {
          SendLink = null;
          Height = "0px";
        }
        var Stream = CreateEmbedFrame(SendLink, "364px", Height, "Twitch", ID, MediaHolder)
        
        Stream.setAttribute("allowfullscreen", true);
        Stream.setAttribute("TwitchChannel", EmbedID);
      }
    } else if (EmbedLink.includes("https://studio.code.org/projects/") == true) {
      CreateEmbedFrame(EmbedLink + "/embed", "352px", "620px", "code.org", ID, MediaHolder)
    } else if (EmbedLink.includes("https://scratch.mit.edu/projects/") == true) {
      var StartSlash = URLData.pathname.indexOf("/projects/")+10;
      var EndSlash = URLData.pathname.indexOf("/", StartSlash);
      if (EndSlash < 0) {
        EndSlash = URLData.pathname.length;
      }
      var EmbedID = URLData.pathname.substring(StartSlash, EndSlash);

      if (EmbedID != null) {
        CreateEmbedFrame("https://scratch.mit.edu/projects/embed/" + EmbedID, "354px", "308px", "Scratch", ID, MediaHolder)
      }
    } else if (EmbedLink.substring(EmbedLink.length-4) == ".gif" || EmbedLink.substring(EmbedLink.length-4) == ".mp4") {
      var PreviewType = EmbedLink.substring(EmbedLink.length-4);
      var SetElemType = "img";
      if (PreviewType == "mp4") {
        SetElemType = "video";
      }
      var SitePreviewMedia = createElement("SitePreviewMedia", SetElemType, MediaHolder, [
        ["position", "relative"],
        ["max-width", "364px"],
        ["max-height", "204.25px"],
        ["object-fit", "cover"],
        ["margin-right", "8px"],
        ["border-radius", "12px"],
        ["background-color", ContentColorLayer3],
        ["z-index", "5"]
      ]);
      SitePreviewMedia.src = "https://exotekcdn.exotektechnolog.repl.co/" + encodeURIComponent(EmbedLink);
      if (SetElemType == "video") {
        SitePreviewMedia.muted = true;
        SitePreviewMedia.loop = true;
        SitePreviewMedia.play();
        SitePreviewMedia.autoplay = true;
      } else {
        SitePreviewMedia.setAttribute("TypeRender", "ImageExpand");
      }
    }
    
    /* || TextAdd.includes("https://twitch.tv/") == true) {
      EmbedLink = TextAdd;
    }
    */
  }


  //ClickArea.onclick = ClickPostExpand;
  //PostText.onclick = ClickPostExpand;
}

function CreateEmbedFrame(URL, Width, Height, Sitename, ID, MediaHolder) {
  var EmbedHolderCSS = [
    ["position", "relative"],
    ["width", Width],
    ["height", Height],
    ["min-width", "35px"],
    ["margin-right", "8px"],
    ["border-radius", "12px"],
    ["background-color", ContentColorLayer3],
    ["border-style", "hidden"],
    ["z-index", "5"]
  ];
  if (Height == "0px") {
    EmbedHolderCSS.push(["display", "none"]);
  } else {
    EmbedHolderCSS.push(["display", "inline-block"]);
  }
  var EmbedHolder = createElement(ID + "EmbedHolder", "div", MediaHolder, EmbedHolderCSS);
  createElement("LoadingTitle", "div", EmbedHolder, [
    ["position", "absolute"],
    ["display", "flex"],
    ["top", "0px"],
    ["left", "0px"],
    ["height", "100%"],
    ["width", "100%"],
    ["z-index", "5"],

    // Text:
    ["font-size", "18px"],
    ["font-family", FontTypeA],
    ["font-weight", "900"],
    ["color", "#bbbbbb"],
    ["text-align", "center"],
    ["justify-content", "center"],
    ["align-items", "center"]
  ]).textContent = "Loading " + Sitename + "...";
  var EmbedIframe = createElement(ID + "SiteEmbed", "iframe", EmbedHolder, [
    ["position", "relative"],
    ["height", "100%"],
    ["width", "100%"],
    ["border-radius", "12px"],
    ["border-style", "hidden"],
    ["z-index", "6"]
  ]);
  EmbedIframe.setAttribute("PlaySrc", URL);
  EmbedIframe.src = "about:blank";

  return EmbedIframe;
}

// componentToHex (typeRGB - "c"): Converts RGB into HEX color code.
// CREDIT: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

// adjust (typeRGB - "color", typeINT - "amount"): Makes RGB Color slightly brighter or darker.
// CREDIT: https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function adjust(color, amount) {
  var ColorsOnly = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/),
  Red = ColorsOnly[0],
  Green = ColorsOnly[1],
  Blue = ColorsOnly[2];

  color = "#" + componentToHex(Red) + componentToHex(Green) + componentToHex(Blue);

  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Scroll To Bottom (Load Older):
var LastScroll = 0;
var LoadMoreType = "Posts";
var CustumLoadData = {};
window.addEventListener("scroll", function(event) {
  
  if ((window.innerHeight + window.scrollY) >= find("Primary").offsetHeight-500) {
    if (LastScroll < Date.now()) {
      if (LoadMoreType == "Posts") {
        var GetPostData = {  // Load more posts:
          Add: "Merge",
          Limit: 10
        };
        if (ViewingProfileID != null && find("PostDisplayHolder") != null && find("PostDisplayHolder").childNodes.length > 14) {
          GetPostData.FromUserID = ViewingProfileID;
          GetPostData.ExcludePinned = true;
        }
        GetPosts(GetPostData);
        LastScroll = Date.now() + 1500;
      } else if (LoadMoreType == "Chats" && find("ChatDisplayHolder") != null && find("ChatDisplayHolder").lastChild != null) {
        var LoadFromTimestamp = find("ChatDisplayHolder").lastChild.getAttribute("Timestamp");
        if (LoadFromTimestamp > 0) {
          GetChats({ Add: "Merge", Amount: 35, GetUserID: ViewingProfileID, Before: LoadFromTimestamp });
        }
      } else if (LoadMoreType == "LikedPosts") {
        if (CustumLoadData.LastItemTime > 0) {
          GetProfileLikes({ Add: "Merge", Amount: 15, GetUserID: ViewingProfileID, Before: CustumLoadData.LastItemTime });
        }
      }
    }
  }
  
  // User Dropwdown - Most is in MainUi
  if (CurrentDropdown != null && LastClickTime < Date.now()) {
    CurrentDropdown.remove();
  }
  // User Preview - Most is in MainUi
  if (CurrentPreview != null && LastClickTime < Date.now()) {
    CurrentPreview.remove();
  }
}, {passive: true});

var PreviousPostSelect = null;
find("body").addEventListener("mousedown", function(event) {
  if (event.button != 0) {
    return;
  }

  var Path = event.path || (event.composedPath && event.composedPath());

  if (Path[0].hasAttribute("LoadUserID") == true) {
    CreateUserPreview(Path[0], 4, Path[0].getAttribute("LoadUserID"));
    return;
  }

  if (Path[0].hasAttribute("TypeRender")) {  // Disable clicking when on highlight. //Path[0].tagName.toString() == "SPAN" && 
    var SpanText = Path[0].textContent;
    var Type = Path[0].getAttribute("TypeRender");
    
    if (Type == "Link") {
      ConsiderLink = SpanText;
      var StartSlash = SpanText.indexOf("://") + 3;
      var EndSnip = SpanText.indexOf("/", StartSlash);
      if (EndSnip < 1) {
        EndSnip = SpanText.length;
      }
      var EndURLSnip = SpanText.substring(0, EndSnip);
      
      if (SpanText.substring(0, 7) == "http://") {
        ShowPopUp("Wait A Minute...", "Are you sure you want to go to <b style='color: #FF5786'>" + EndURLSnip + "</b>? This site isn't secure and could be a fake version of a legitimate site.", [ ["Open Site", "#475059", "ConfirmLinkClick"], ["Cancel", "#618BFF", null] ]);
      } else {
        ShowPopUp("Wait A Minute...", "Are you sure you want to go to <b style='color: #3D87FF'>" + EndURLSnip + "</b>? Links could be dangerous so make sure you only visit sites that you trust.", [ ["Open Site", "#618BFF", "ConfirmLinkClick"], ["Cancel", "#475059", null] ]);
      }
    } else if (Type == "Quote") {
      var GoToPost = Path[0].getAttribute("QuoteEmbedLink") || SpanText.replace("/Post_", "");
      var ObjectElem = find(GoToPost);

      if (ObjectElem != null) {
        var ObjectRect = ObjectElem.getBoundingClientRect();
        if ((ObjectRect.x + ObjectRect.width) < 0 || (ObjectRect.y + ObjectRect.height) < 0 || (ObjectRect.x > window.innerWidth || ObjectRect.y > window.innerHeight)) {
          ObjectElem.scrollIntoView();
        }
        //var xScroll = Object.scrollLeft || document.documentElement.scrollLeft;
        //var yScroll = Object.scrollTop || document.documentElement.scrollTop;
        
        //window.scrollTo((Object.offsetLeft + xScroll + Object.clientLeft), (Object.offsetTop + yScroll + Object.clientTop) - 8);
        ObjectElem.animate([
          { backgroundColor: "#A743E0", offset: 0.1},
          { backgroundColor: "#A743E0", offset: 0.8},
          { backgroundColor: ContentColor },
        ], 1500);
      } else {
        GetPostsFromID({
          PostID: GoToPost,
          Limit: 9 // Not 10 because first post adds up to 10.
        }, Path[0]);
      }
    } else if (Type == "LoadChatFromID") {
      LoadReplyChat(Path[0].id.replace(/LoadChat/g, ""), true);
    } else if (Type == "ChatLoad") {
      LoadReplyChat(Path[0].textContent.replace(/\/Chat_/g, ""), true);
    } else if (Type == "UserLoad") {
      CreateUserPreview(Path[0], 4, Path[0].textContent.replace(/\/User_/g, ""));
    } else if (Type == "Mention") {
      CreateUserPreview(Path[0], 4, Path[0].getAttribute("LoadUserID"));
    } else if (Type == "ViewFollowers") {
      ViewFollowData("Followers", Path[0].parentNode.parentNode.getAttribute("ProfileUserID"));
    } else if (Type == "ViewFollowing") {
      ViewFollowData("Following", Path[0].parentNode.parentNode.getAttribute("ProfileUserID"));
    } else if (Type == "ImageExpand") {
      HighlightedMedia(Path[0].getAttribute("src"));
    } else if (Type == "RemoveSocialConnectionB") {
      SendRequest("RemoveSocialLink", { SocialID: Path[0].getAttribute("SocialID") });
      delete ProfileData.Socials[Path[0].getAttribute("SocialID")];
      var MaxConnectedCounter = find("MaxConnectedCounter");
      if (MaxConnectedCounter != null) {
        MaxConnectedCounter.innerHTML = "<b>" + Object.keys(ProfileData.Socials).length + "</b>/12 Accounts";
      }
      Path[0].parentNode.remove();
    } else if (Type == "WebsiteEmbed") {
      var LinkText = Path[0].id.substring(11);
      ConsiderLink = LinkText;
      var StartSlash = LinkText.indexOf("://") + 3;
      var EndSnip = LinkText.indexOf("/", StartSlash);
      if (EndSnip < 1) {
        EndSnip = LinkText.length;
      }
      var EndURLSnip = LinkText.substring(0, EndSnip);

      if (LinkText.substring(0, 7) == "http://") {
        ShowPopUp("Wait A Minute...", "Are you sure you want to go to <b style='color: #FF5786'>" + EndURLSnip + "</b>? This site isn't secure and could be a fake version of a legitimate site.", [ ["Open Site", "#475059", "ConfirmLinkClick"], ["Cancel", "#618BFF", null] ]);
      } else {
        ShowPopUp("Wait A Minute...", "Are you sure you want to go to <b style='color: #3D87FF'>" + EndURLSnip + "</b>? Links could be dangerous so make sure you only visit sites that you trust.", [ ["Open Site", "#618BFF", "ConfirmLinkClick"], ["Cancel", "#475059", null] ]);
      }
    }
    return;
  }

  // Chat Replies:
  if (Path[0].parentNode != null) {
    var ReplyID = Path[0].parentNode.getAttribute("ReplyID");
    if (ReplyID != null) {
      var ExistingChat = find(ReplyID + "Chat");
      if (ExistingChat != null) {
        if (CheckElementVisible(ExistingChat, ExistingChat.parentNode.parentNode) == false) {
          ExistingChat.parentNode.parentNode.scrollTo({
            top: ExistingChat.offsetTop - 25, //+ ExistingChat.parentNode.parentNode.scrollY,
            behavior: 'smooth'
          });
        }
        ExistingChat.animate([
          { backgroundColor: "#2AF5B5", offset: 0.1},
          { backgroundColor: "#2AF5B5", offset: 0.8},
          { backgroundColor: "rgba(0, 0, 0, 0)" },
        ], 1500);
      } else {
        LoadReplyChat(ReplyID);
      }
      return;
    }
  }

  var PostBody = null;
  var WasChatItem = false;
  for (var i = 0; i < Path.length; i++) {
    if (Path[i].id != null) {
      if (Path[i].id.includes("Chat") == true || Path[i].id.includes("ButtonHolder") == true || Path[i].id == "Image") {
        var DropdownClickData = Path[i].getAttribute("LiveChatClickData");
        if (DropdownClickData == null && Path[i].hasAttribute("FunctionHoverClickData") == true) {
          DropdownClickData = window[Path[i].getAttribute("FunctionHoverClickData")](Path[i]);
        }
        if (DropdownClickData != null) {
          if (DropdownClickData == "TwitchLiveChatPopUp") {
            ShowPopUp("Twitch Chat", "This is a chat from <a style='color: #6441a5' href='https://www.twitch.tv/p/en/about/' target='_blank'>Twitch.tv</a>, and is only viewable. Chatting on this post only appears here on <b>Photop</b>!", [ ["Okay", "#618BFF", null] ]);
          } else {
            CreateDropdown(Path[i], JSON.parse(DropdownClickData), -6, "Left");
          }
          return;
        }
        WasChatItem = true;
      }
      if (Path[i].className == "Posts") {
        PostBody = Path[i];
        break;
      }
    }
  }
  if (WasChatItem == true) {
    return;
  }
  if (PostBody != null) {
    var MediaHolder = find(PostBody.id + "MediaHolder");
    if (MediaHolder != null) {
      var MediaHolderRect = MediaHolder.getBoundingClientRect();
      if (event.clientY < (MediaHolder.offsetHeight + MediaHolderRect.y) && (MediaHolder.scrollWidth >= MediaHolderRect.width && event.clientY > (MediaHolder.offsetHeight + MediaHolderRect.y - 16))) {
        return;
      }
    }

    var ContentHolder = find(PostBody.id + "Content");
    var ContentHolderRect = ContentHolder.getBoundingClientRect();
    
    var ExpandAttribute = PostBody.getAttribute("Expand");
    if (ExpandAttribute == "Open" && (ContentHolderRect.height >= ContentHolder.scrollHeight || event.clientX > (ContentHolder.offsetWidth + ContentHolderRect.x) || event.clientX < (ContentHolder.offsetWidth + ContentHolderRect.x - 16))) {
      // Close Post:
      
      URLParams("post");
      RevertTitle();
      PostBody.setAttribute("Expand", "Closed");
      setCSS(PostBody, "height", "auto");
      setCSS(find(PostBody.id + "Content"), "overflow-y", "hidden");
      var LiveChatFrame = find(PostBody.id + "LiveChat");
      if (LiveChatFrame != null) {
        var ChatScrollFrame = LiveChatFrame.querySelector("#Chat");
        if (ChatScrollFrame != null) {
          ChatScrollFrame.scrollTo(0, ChatScrollFrame.scrollTop+ChatScrollFrame.clientHeight+1000);
        }
      }
    } else {
      // Open Post:
      if (PreviousPostSelect != null) {
        PreviousPostSelect.setAttribute("Expand", "Closed");
        setCSS(PreviousPostSelect, "height", "auto");
        setCSS(find(PreviousPostSelect.id + "Content"), "overflow-y", "hidden");
      }
      PostBody.setAttribute("Expand", "Open");
      setCSS(PostBody.id, "height", "399px");
      setCSS(find(PostBody.id + "Content"), "overflow-y", "auto");
      URLParams("post", PostBody.id);
      SetPageTitle("Enlarged Post");
      PreviousPostSelect = PostBody;
    }
  }
  // ChatContainer.scrollTop = ChatContainer.scrollHeight;
});

function ShowPostDropdown(ExtraButton, ID, Data, PostContainer) {
  var TextCopyPaste = Data.Text.replace(/\$\[NEWLINE\]/g, "\n");
  TextCopyPaste = TextCopyPaste.replace(/\&\#63\;/g, "?");
  TextCopyPaste = TextCopyPaste.replace(/\&\#61\;/g, "=");
  TextCopyPaste = TextCopyPaste.replace(/\&\#60\;/g, "<");
  TextCopyPaste = TextCopyPaste.replace(/\&\#62\;/g, ">");
  
  var RemovePingsArr = TextCopyPaste.split("@");
  for (var i = 0; i < RemovePingsArr.length; i++) {
    RemovePingsArr[i] = RemovePingsArr[i].substring(0, RemovePingsArr[i].indexOf("<")) + RemovePingsArr[i].substring(RemovePingsArr[i].indexOf(">")+1);
  }
  TextCopyPaste = RemovePingsArr.join("@");

  var DropdownPostButtons = [
    ["Copy Username", ThemeColor, "CopyClipboardText", Data.User],
    ["Copy Text", ThemeColor, "CopyClipboardText", TextCopyPaste],
    ["Copy ID", ThemeColor, "CopyClipboardText", "/Post_" + ID]
  ];
  if (Data.UserID != UserID) {
    if (CheckPermision(LoginUserRole, "CanBanUsers") == true) {
      DropdownPostButtons.unshift(["Ban User", "#FF5C5C", "OpenModerationPage", ["Ban", Data.UserID, Data.User]]);
    }
    if (UserID != null) {
      DropdownPostButtons.unshift(["Block User", "#FF8652", "BlockUser", [Data.UserID, Data.User]]);
      DropdownPostButtons.unshift(["Report", "#FFCB70", "ReportContent", Data]);
    }
  }
  if (Data.UserID == UserID) {
    if (ProfileData.PinnedPost != ID) {
      DropdownPostButtons.unshift(["Pin on Profile", ThemeColor, "PostActions", ["PinOnProfile", ID, Data, PostContainer]]);
    } else {
      DropdownPostButtons.unshift(["Unpin from Profile", ThemeColor, "PostActions", ["UnpinFromProfile", ID, Data, PostContainer]]);
    }
  }
  if (Data.UserID == UserID || CheckPermision(LoginUserRole, "CanDeletePosts") == true) {
    DropdownPostButtons.unshift(["Delete", "#FF5C5C", "PostActions", ["Delete", ID, Data, PostContainer]]);
  }

  CreateDropdown(ExtraButton, DropdownPostButtons, 4);
}

loadScript(LoadScripts.BridgeConnect);