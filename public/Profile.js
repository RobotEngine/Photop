
var ProfileUserData = {};

function CreateMiniTextNotif(Parent, Text) {
  var NewMiniNotif = createElement("MiniNotif", "div", Parent, [
    ["position", "relative"],
    ["margin", "24px 20px 24px 20px"],

    // Text:
    ["font-size", "20px"],
    ["font-family", FontTypeA],
    ["font-weight", "500"],
    ["color", FontColorA],
    ["text-align", "center"]
  ]);
  NewMiniNotif.textContent = Text;
  return NewMiniNotif;
}

async function LoadProfile(ProfileUserID, IgnoreAlreadyOn) {
  if (IgnoreAlreadyOn != true && CurrentPage == "Profile" && ViewingProfileID == ProfileUserID) {
    window.scrollTo(window.scrollX, 0);
    return;
  }

  // REMOVE NORMAL ELEMENTS:
  ViewingProfileID = ProfileUserID;
  if (SwitchPage("Profile", true) == false) {
    return;
  }

  URLParams("user", ProfileUserID);

  // LOAD PROFILE ELEMENTS:
  SendRequest("GetProfile", { ProfileUserID: ViewingProfileID }, function (Metadata, Data) {
    if (Data.Code != 200) {
      if (CurrentPage != "Profile") {
        return;
      }

      if (Data.Code == 403) {
        createElement("BlockedUserTitle", "div", "MainContent", [
          ["position", "relative"],
          ["margin", "36px 20px 0px 20px"],

          // Text:
          ["font-size", "68px"],
          ["font-family", FontTypeA],
          ["font-weight", "1000"],
          ["color", FontColorA],
        ]).textContent = "Welp...";
        createElement("BlockedUserDescription", "div", "MainContent", [
          ["position", "relative"],
          ["margin", "8px 20px 0px 20px"],

          // Text:
          ["font-size", "24px"],
          ["font-family", FontTypeA],
          ["font-weight", "500"],
          ["color", "#cccccc"],
        ]).textContent = "It appears your are blocking this user, you must unblock them to view their profile!";
        var UnblockUserButton = createElement("UnblockUserButton", "a", "MainContent", [
          ["display", "flex"],
          ["background-color", ThemeColor],
          ["border-radius", "12px"],
          ["margin", "16px 20px 0px 20px"],
          ["padding", "8px 0px 8px 0px"],
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
        UnblockUserButton.textContent = "Unblock";
        UnblockUserButton.setAttribute("title", "Unblock this User");
        UnblockUserButton.addEventListener("mouseup", function () {
          UnblockUsers([ProfileUserID], "ProfileBlock");
          find("BlockedUserTitle").remove();
          find("BlockedUserDescription").remove();
          find("UnblockUserButton").remove();
        });
      } else {
        createElement("NonExistUserTitle", "div", "MainContent", [
          ["position", "relative"],
          ["margin", "36px 20px 0px 20px"],

          // Text:
          ["font-size", "68px"],
          ["font-family", FontTypeA],
          ["font-weight", "1000"],
          ["color", FontColorA],
        ]).textContent = "Aw Darn! D:";
        createElement("NonExistUserDescription", "div", "MainContent", [
          ["position", "relative"],
          ["margin", "8px 20px 0px 20px"],

          // Text:
          ["font-size", "24px"],
          ["font-family", FontTypeA],
          ["font-weight", "500"],
          ["color", "#cccccc"],
        ]).textContent = "Well hmmmmmm... this user either doesn't exist or was removed. Click the " + '"Home"' + " button on the side to continue browsing posts!";
      }
      return;
    }

    ProfileUserData = Data.UserInfo;

    if (ProfileUserData.ProfileData == null) {
      ProfileUserData.ProfileData = {};
    }

    PreloadedPreviews[ProfileUserID] = { IsFollowing: Data.IsFollowing, UserInfo: ProfileUserData, AddedTime: Date.now() }; // Update Preview

    SetPageTitle(ProfileUserData.User + "'s Profile");

    var UserProfileInfo = createElement("UserProfileInfo", "div", "MainContent", [
      ["position", "relative"],
      ["width", "100%"],
      ["margin-top", "8px"],
      ["overflow", "hidden"],
      ["z-index", "15"]
    ]);
    var BannerElementType = "img";
    if (ProfileUserData.Settings == null || ProfileUserData.Settings.ProfileBanner == null) {
      BannerElementType = "div";
    }
    var ProfileBanner = createElement("ProfileBanner", BannerElementType, UserProfileInfo, [
      ["position", "relative"],
      ["width", "100%"],
      ["height", "250px"],
      ["object-fit", "cover"],
      ["border-radius", "12px"],
      ["background-color", ContentColor]
    ]);
    if (ProfileUserData.Settings != null && ProfileUserData.Settings.ProfileBanner != null) {
      ProfileBanner.src = GoogleCloudStorgeURL + "ProfileBanners/" + ProfileUserData.Settings.ProfileBanner;
      ProfileBanner.addEventListener("mouseup", function () {
        HighlightedMedia(ProfileBanner.src);
      });
    }
    var ProfileTopHolder = createElement("ProfileTopHolder", "div", UserProfileInfo, [
      ["position", "relative"],
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["width", "calc(100% - 25px)"],
      ["left", "25px"]
    ]);
    var ProfileInfoHolder = createElement("ProfileInfoHolder", "div", ProfileTopHolder, [
      ["position", "relative"],
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["align-content", "flex-end"],
      ["flex", "1"],
      ["max-width", "100%"],
      ["min-width", "fit-content"],
      ["min-height", "135px"],
      ["margin-top", "-80px"],
      ["overflow", "hidden"],
      ["pointer-events", "none"]
    ]);
    var UserProfileProfilePic = createElement("UserProfileProfilePic", "img", ProfileInfoHolder, [
      ["position", "relative"],
      ["box-sizing", "border-box"],
      ["width", "20vw"],
      ["max-width", "135px"],
      ["min-width", "94px"],
      ["max-height", "135px"],
      ["aspect-ratio", "1 / 1"],
      ["margin-right", "7px"],
      ["background-color", ContentColor],
      ["border-width", "6px"],
      ["border-color", PageColor],
      ["border-style", "solid"],
      ["object-fit", "cover"],
      ["border-radius", "18px"],
      ["pointer-events", "all"]
    ]);
    UserProfileProfilePic.src = GoogleCloudStorgeURL + "ProfileImages/" + DecideProfilePic(ProfileUserData);
    UserProfileProfilePic.addEventListener("mouseup", function () {
      HighlightedMedia(UserProfileProfilePic.src);
    });
    var ProfileUsernameText = createElement("Username", "div", ProfileInfoHolder, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["align-self", "flex-end"],
      ["height", "fit-content"],
      ["max-width", "100%"],
      ["margin-bottom", "8px"],
      ["margin-right", "10px"],

      // Text:
      ["font-size", "36px"],
      ["font-family", FontTypeA],
      ["font-weight", "1000"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["white-space", "nowrap"],
      ["text-overflow", "ellipsis"],
      ["overflow", "hidden"]
    ]);
    SetUsernameRole(ProfileUsernameText, ProfileUserData, "22px");
    var ProfileButtonsHolder = createElement("ProfileButtonsHolder", "div", ProfileTopHolder, [
      ["position", "relative"],
      ["margin-top", "8px"],
      ["min-width", "fit-content"]
    ]);
    if (ProfileUserID != UserID && UserID != null) {
      var FollowButtonHolder = createElement("FollowButtonHolder", "div", ProfileButtonsHolder, [
        ["position", "relative"],
        ["display", "inline-block"],
        ["margin-right", "8px"],
        ["margin-bottom", "6px"]
      ]);
      var FollowButton = createElement("FollowButton", "div", FollowButtonHolder, [
        ["position", "relative"],
        ["display", "flex"],
        ["height", "36px"],
        ["padding", "0 8px 0 8px"],
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

      if (Data.IsFollowing == true) {
        FollowButton.textContent = "Unfollow";
        setCSS(FollowButton, "background-color", "#FF5786");
        FollowButton.setAttribute("title", "Unfollow " + ProfileUserData.User);
      } else {
        FollowButton.textContent = "Follow";
        FollowButton.setAttribute("title", "Follow " + ProfileUserData.User);
      }
    }

    var EditButtonHolder = createElement("EditButtonHolder", "div", ProfileButtonsHolder, [
      ["position", "relative"],
      ["display", "inline-block"],
      ["height", "36px"],
    ]);
    var EditButton = createElement("EditButton", "div", EditButtonHolder, [
      ["position", "relative"],
      ["display", "flex"],
      ["height", "36px"],
      ["padding", "0 8px 0 8px"],
      ["background-color", "#555555"],
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
    if (ProfileUserID != UserID) {
      var EditButtonDotIcon = createElement("EditButtonDotIcon", "svg", EditButton, [
        ["height", "20px"],
        ["width", "20px"],
      ], "http://www.w3.org/2000/svg");
      EditButtonDotIcon.setAttribute("viewBox", "0 0 41.915 41.915");
      var GTag = createElement("EditButtonDotIconOptionsG", "g", EditButtonDotIcon, null, "http://www.w3.org/2000/svg");
      var Svg = ["M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z", "M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z", "M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"];
      for (var i = 0; i < Svg.length; i += 1) {
        createElement("Svg", "path", "EditButtonDotIconOptionsG", null, "http://www.w3.org/2000/svg").setAttribute("d", Svg[i]);
      }
      GTag.setAttribute("fill", "#ffffff");
    } else {
      EditButton.textContent = "Edit";
    }
    EditButton.addEventListener("click", function () {
      if (ProfileUserID != UserID) {
        var DropdownPostButtons = [
          ["Copy Username", ThemeColor, "CopyClipboardText", ProfileUserData.User],
          ["Copy UserID", ThemeColor, "CopyClipboardText", ProfileUserID]
        ];
        if (UserID != null && CheckPermision(LoginUserRole, "CanBanUsers") == true) {
          DropdownPostButtons.unshift(["Ban User", "#FF5C5C", "OpenModerationPage", ["Ban", ProfileUserID, ProfileUserData.User]]);
        }
        if (UserID != null) {
          DropdownPostButtons.unshift(["Block User", "#FF8652", "BlockUser", [ProfileUserID, ProfileUserData.User]]);
          DropdownPostButtons.unshift(["Report", "#FFCB70", "ReportContent", { _id: ProfileUserID, User: ProfileUserData.User }]);
        }
        CreateDropdown(EditButton, DropdownPostButtons, -10.5, "Left");
      } else {
        LoadScriptMetadata = "ProfileScreen";
        loadScript(LoadScripts.Settings);
        SetPageTitle("Settings");
      }
    });

    var ExtraProfileInfo = createElement("ExtraProfileInfo", "div", "MainContent", [
      ["position", "relative"],
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["width", "calc(100% - 25px)"],
      ["margin-top", "8px"],
      ["margin-left", "25px"],
      ["overflow", "hidden"],
      ["z-index", "15"]
    ]);
    var ProfileSocialHolder = createElement("ProfileSocialHolder", "div", ExtraProfileInfo, [
      ["position", "relative"],
      ["float", "left"],
      ["width", "100%"],
      ["height", "fit-content"],
      ["margin-right", "8px"],
      ["margin-bottom", "8px"],
      ["max-width", "135px"],
      ["overflow", "hidden"]
    ]);
    var ProfileStatHolder = createElement("ProfileStatHolder", "div", ProfileSocialHolder, [
      ["display", "flex"],
      ["width", "100%"],
      ["cursor", "pointer"]
    ]);
    var CountHolder = createElement("CountHolder", "div", ProfileStatHolder, [
      ["position", "relative"],
      ["width", "fit-content"]
    ]);
    var FollowerCountTx = createElement("FollowerCountTx", "div", CountHolder, [
      ["position", "relative"],

      // Text:
      ["font-size", "18px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "right"]
    ]);
    CreateAbbreviatedCount(FollowerCountTx, ProfileUserData.ProfileData.Followers || 0);

    if (ProfileUserID != UserID && UserID != null) {
      var PendingResponse = false;
      FollowButton.addEventListener("mouseup", function () {
        PreloadedPreviews[ProfileUserID].AddedTime = Date.now();

        if (PendingResponse == false) {
          if (FollowButton.textContent == "Follow") {
            PendingResponse = true;
            FollowButton.textContent = "Unfollow";
            setCSS(FollowButton, "background-color", "#FF5786");
            CreateAbbreviatedCount(FollowerCountTx, parseInt(FollowerCountTx.getAttribute("OfficialCount")) + 1);
            FollowButton.setAttribute("title", "Unfollow " + ProfileUserData.User);
            PreloadedPreviews[ProfileUserID].IsFollowing = true;
            PreloadedPreviews[ProfileUserID].UserInfo.ProfileData.Followers = parseInt(FollowerCountTx.getAttribute("OfficialCount"));
            IncreasePreviewFollowingCount(1);
            SendRequest("FollowUser", { FollowUserID: ViewingProfileID }, function (Metadata, Data) {
              if (Data.Code != 200) {
                FollowButton.textContent = "Follow";
                setCSS(FollowButton, "background-color", ThemeColor);
                CreateAbbreviatedCount(FollowerCountTx, parseInt(FollowerCountTx.getAttribute("OfficialCount")) - 1);
                FollowButton.setAttribute("title", "Follow " + ProfileUserData.User);
                PreloadedPreviews[ProfileUserID].IsFollowing = false;
                PreloadedPreviews[ProfileUserID].UserInfo.ProfileData.Followers = parseInt(FollowerCountTx.getAttribute("OfficialCount"));
                IncreasePreviewFollowingCount(-1);
              }
              PendingResponse = false;
            });
          } else if (FollowButton.textContent == "Unfollow") {
            PendingResponse = true;
            FollowButton.textContent = "Follow";
            setCSS(FollowButton, "background-color", ThemeColor);
            FollowButton.setAttribute("title", "Follow " + ProfileUserData.User);
            CreateAbbreviatedCount(FollowerCountTx, parseInt(FollowerCountTx.getAttribute("OfficialCount")) - 1);
            PreloadedPreviews[ProfileUserID].IsFollowing = false;
            PreloadedPreviews[ProfileUserID].UserInfo.ProfileData.Followers = parseInt(FollowerCountTx.getAttribute("OfficialCount"));
            IncreasePreviewFollowingCount(-1);
            SendRequest("UnfollowUser", { UnfollowUserID: ViewingProfileID }, function (Metadata, Data) {
              if (Data.Code != 200) {
                FollowButton.textContent = "Unfollow";
                setCSS(FollowButton, "background-color", "#FF5786");
                CreateAbbreviatedCount(FollowerCountTx, parseInt(FollowerCountTx.getAttribute("OfficialCount")) + 1);
                FollowButton.setAttribute("title", "Unfollow " + ProfileUserData.User);
                PreloadedPreviews[ProfileUserID].IsFollowing = true;
                PreloadedPreviews[ProfileUserID].UserInfo.ProfileData.Followers = parseInt(FollowerCountTx.getAttribute("OfficialCount"));
                IncreasePreviewFollowingCount(1);
              }
              PendingResponse = false;
            });
          }
        }
      });
    }

    createElement("FollowingCount", "div", CountHolder, [
      ["position", "relative"],
      ["margin-top", "4px"],

      // Text:
      ["font-size", "18px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "900"],
      ["color", FontColorA],
      ["text-align", "right"]
    ]).innerHTML = ProfileUserData.ProfileData.Following || 0;
    var LabelHolder = createElement("LabelHolder", "div", ProfileStatHolder, [
      ["position", "relative"],
      ["width", "fit-content"],
      ["margin-left", "6px"]
    ]);
    var FollowerAmountEnd = "Followers";
    if (ProfileUserData.ProfileData.Followers == 1) {
      FollowerAmountEnd = "Follower";
    }
    var FollowerLabel = createElement("FollowerLabel", "div", LabelHolder, [
      ["position", "relative"],

      // Text:
      ["font-size", "18px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", "#cccccc"],
      ["text-align", "left"]
    ]);
    FollowerLabel.textContent = FollowerAmountEnd;
    FollowingLabel = createElement("FollowingLabel", "div", LabelHolder, [
      ["position", "relative"],
      ["margin-top", "4px"],

      // Text:
      ["font-size", "18px"],
      ["overflow-wrap", "break-word"],
      ["white-space", "pre-wrap"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", "#cccccc"],
      ["text-align", "left"]
    ]);
    FollowingLabel.textContent = "Following";

    FollowerCountTx.setAttribute("TypeRender", "ViewFollowers");
    FollowerLabel.setAttribute("TypeRender", "ViewFollowers");
    FollowingCount.setAttribute("TypeRender", "ViewFollowing");
    FollowingLabel.setAttribute("TypeRender", "ViewFollowing");
    ProfileStatHolder.setAttribute("ProfileUserID", ViewingProfileID);

    // Underline:
    FollowerCountTx.setAttribute("onmouseover", "UnderlineHoverOn([this, 'FollowerLabel'])");
    FollowerLabel.setAttribute("onmouseover", "UnderlineHoverOn([this, 'FollowerCountTx'])");
    FollowingCount.setAttribute("onmouseover", "UnderlineHoverOn([this, 'FollowingLabel'])");
    FollowingLabel.setAttribute("onmouseover", "UnderlineHoverOn([this, 'FollowingCount'])");
    FollowerCountTx.setAttribute("onmouseout", "UnderlineHoverOff([this, 'FollowerLabel'])");
    FollowerLabel.setAttribute("onmouseout", "UnderlineHoverOff([this, 'FollowerCountTx'])");
    FollowingCount.setAttribute("onmouseout", "UnderlineHoverOff([this, 'FollowingLabel'])");
    FollowingLabel.setAttribute("onmouseout", "UnderlineHoverOff([this, 'FollowingCount'])");

    var ProfileSocialLinksHolder = createElement("ProfileSocialLinksHolder", "div", ProfileSocialHolder, [
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["gap", "3px"],
      ["width", "100%"],
      ["margin-top", "6px"]
    ]);

    if (ProfileUserData.ProfileData != null && ProfileUserData.ProfileData.Socials != null) {
      var SocialKeys = Object.keys(ProfileUserData.ProfileData.Socials);
      for (var s = 0; s < SocialKeys.length; s++) {
        var MediaInfo = SocialKeys[s];
        var SocialData = SocialLinkData[MediaInfo.substring(0, MediaInfo.indexOf("_"))]
        var VisitProfileB = createElement("VisitProfile" + MediaInfo, "a", ProfileSocialLinksHolder, [
          ["box-sizing", "border-box"],
          ["width", "31.5px"],
          ["height", "31.5px"],
          ["padding", "4px"],
          ["background-color", SocialData[1]],
          ["content", "url('./Images/SocialNetworks/" + SocialData[0] + ".svg')"],
          ["border-radius", "6px"],
          ["cursor", "pointer"]
        ]);
        var SocialProfileName = ProfileUserData.ProfileData.Socials[MediaInfo];
        if (SocialData[3] != null) {
          SocialProfileName = SocialData[3] + SocialProfileName;
        }
        VisitProfileB.setAttribute("title", SocialData[0] + " (" + SocialProfileName + ")");
        if (SocialData[2] != "PROMPT_USERNAME") {
          VisitProfileB.setAttribute("href", SocialData[2].replace(/USERID_GOES_HERE/g, MediaInfo.substring(MediaInfo.indexOf("_")+1)).replace(/USERNAME_GOES_HERE/g, ProfileUserData.ProfileData.Socials[MediaInfo]));
          VisitProfileB.setAttribute("target", "_blank");
        } else {
          VisitProfileB.setAttribute("onmouseup", 'ShowPopUp("' + SocialData[0] + '", "<i>' + ProfileUserData.ProfileData.Socials[MediaInfo] + '</i>", [ ["Close", "#618BFF"] ])');
        }
      }
    }

    var ProfileDescriptionHolder = createElement("ProfileDescriptionHolder", "div", ExtraProfileInfo, [
      ["position", "relative"],
      ["box-sizing", "border-box"],
      ["flex", "1 1 300px"],
      ["overflow", "hidden"]
    ]);
    if (ProfileUserData.ProfileData != null && ProfileUserData.ProfileData.Description != null) {
      var ProfileDescription = createElement("ProfileDescription", "div", ProfileDescriptionHolder, [
        ["position", "relative"],
        ["max-height", "250px"],

        // Text:
        ["font-size", "16px"],
        ["overflow-wrap", "break-word"],
        ["white-space", "pre-wrap"],
        ["font-family", FontTypeA],
        ["font-weight", "400"],
        ["color", FontColorA],
        ["text-align", "left"],
        ["text-overflow", "ellipsis"],
        ["overflow", "hidden"]
      ]);
      ProfileDescription.innerHTML = CleanString(ProfileUserData.ProfileData.Description).replace(/\n/g, "<br/>");
      ProfileDescription.innerHTML = ProfileDescription.innerHTML.replace(/\&nbsp\;/g, " ");
    }

    var ProfileDetailSlotHolder = createElement("ProfileDetailSlotHolder", "div", ProfileDescriptionHolder, [
      ["position", "relative"],
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["margin-top", "12px"]
    ]);

    function CreateAccountDetail(HTMLText, IconPath) {
      var ProfileDetailSlotJoin = createElement("ProfileDetailSlotJoin", "div", ProfileDetailSlotHolder, [
        ["position", "relative"],
        ["display", "flex"],
        ["align-items", "center"],
        ["margin-right", "24px"],
        ["margin-bottom", "8px"]
      ]);
      var DetailIcon = createElement("DetailIcon", "svg", ProfileDetailSlotJoin, [
        ["position", "relative"],
        ["width", "20px"],
        ["height", "20px"],
      ], "http://www.w3.org/2000/svg");
      DetailIcon.setAttribute("viewBox", "0 0 512 512");
      DetailIcon.setAttribute("fill", ThemeColor);
      DetailIcon.innerHTML = IconPath;
      createElement("DetailText", "div", ProfileDetailSlotJoin, [
        ["position", "relative"],
        ["margin-left", "6px"],

        // Text:
        ["font-size", "16px"],
        ["overflow-wrap", "break-word"],
        ["white-space", "pre-wrap"],
        ["font-family", FontTypeA],
        ["font-weight", "400"],
        ["color", FontColorA],
        ["text-align", "left"]
      ]).innerHTML = HTMLText;
    }

    var CreationDate = new Date(ProfileUserData.CreationTime);
    var SplitDate = CreationDate.toLocaleDateString().split("/");
    CreateAccountDetail("Joined <b>" + MonthNames[SplitDate[0] - 1] + " " + SplitDate[1] + ", " + SplitDate[2] + "</b>", '<g> <g> <path d="M452,40h-24V0h-40v40H124V0H84v40H60C26.916,40,0,66.916,0,100v352c0,33.084,26.916,60,60,60h392 c33.084,0,60-26.916,60-60V100C512,66.916,485.084,40,452,40z M472,452c0,11.028-8.972,20-20,20H60c-11.028,0-20-8.972-20-20V188 h432V452z M472,148H40v-48c0-11.028,8.972-20,20-20h24v40h40V80h264v40h40V80h24c11.028,0,20,8.972,20,20V148z"/> </g> </g> <g> <g> <rect x="76" y="230" width="40" height="40"/> </g> </g> <g> <g> <rect x="156" y="230" width="40" height="40"/> </g> </g> <g> <g> <rect x="236" y="230" width="40" height="40"/> </g> </g> <g> <g> <rect x="316" y="230" width="40" height="40"/> </g> </g> <g> <g> <rect x="396" y="230" width="40" height="40"/> </g> </g> <g> <g> <rect x="76" y="310" width="40" height="40"/> </g> </g> <g> <g> <rect x="156" y="310" width="40" height="40"/> </g> </g> <g> <g> <rect x="236" y="310" width="40" height="40"/> </g> </g> <g> <g> <rect x="316" y="310" width="40" height="40"/> </g> </g> <g> <g> <rect x="76" y="390" width="40" height="40"/> </g> </g> <g> <g> <rect x="156" y="390" width="40" height="40"/> </g> </g> <g> <g> <rect x="236" y="390" width="40" height="40"/> </g> </g> <g> <g> <rect x="316" y="390" width="40" height="40"/> </g> </g> <g> <g> <rect x="396" y="310" width="40" height="40"/> </g> </g>');

    if (ProfileUserData.SetLocation != null) {
      CreateAccountDetail("Located in <b>" + CleanString(ProfileUserData.SetLocation) + "</b>", '<g> <g> <path d="M255.999,0C152.786,0,68.817,85.478,68.817,190.545c0,58.77,29.724,130.103,88.349,212.017 c42.902,59.948,85.178,102.702,86.957,104.494c3.27,3.292,7.572,4.943,11.879,4.943c4.182,0,8.367-1.558,11.611-4.683 c1.783-1.717,44.166-42.74,87.149-101.86c58.672-80.701,88.421-153.007,88.421-214.912C443.181,85.478,359.21,0,255.999,0z M255.999,272.806c-50.46,0-91.511-41.052-91.511-91.511s41.052-91.511,91.511-91.511s91.511,41.052,91.511,91.511 S306.457,272.806,255.999,272.806z"/> </g> </g>');
    }

    var ProfileNavBar = createElement("ProfileNavBar", "div", "MainContent", [
      ["position", "sticky"],
      ["display", "flex"],
      ["flex-wrap", "wrap"],
      ["width", "100%"],
      ["left", "0px"],
      ["top", "8px"],
      ["margin-top", "16px"],
      ["background-color", ContentColor],
      ["border-radius", "12px"],
      ["overflow", "hidden"],
      ["border-top-width", "8px"],
      ["box-shadow", "0px 6px 5px " + PageColor + ", 0px -25px 0px " + PageColor],
      ["z-index", "14"]
    ]);

    function CreateProfileNavButton(ButtonText, ButtonColor) {
      var NewNavButton = createElement("ProfileNavButton" + ButtonText, "div", ProfileNavBar, [
        ["position", "relative"],
        ["display", "flex"],
        ["flex", "1"],
        ["box-sizing", "border-box"],
        ["min-width", "fit-content"],
        ["overflow", "hidden"],
        ["padding", "10px 10px 4px 10px"],
        //["border-radius", "8px"],
        ["border-width", "0px"],
        ["border-bottom-width", "6px"],
        ["border-color", "rgba(0, 0, 0, 0)"],
        ["border-style", "solid"],
        ["cursor", "pointer"],

        // Text:
        ["font-size", "22px"],
        ["overflow-wrap", "break-word"],
        ["white-space", "pre-wrap"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", FontColorA],
        ["text-align", "center"],
        ["justify-content", "center"],
        ["align-items", "center"]
      ]);
      NewNavButton.textContent = ButtonText;

      if (ButtonText == "Posts") {
        setCSS(NewNavButton, "color", ButtonColor);
        setCSS(NewNavButton, "border-color", ButtonColor);
      }

      NewNavButton.addEventListener("mouseup", function () {
        if (getCSS(NewNavButton, "color") != ButtonColor) {
          var BarButtonChildren = ProfileNavBar.childNodes;
          for (var i = 0; i < BarButtonChildren.length; i++) {
            setCSS(BarButtonChildren[i], "color", FontColorA);
            setCSS(BarButtonChildren[i], "border-color", "rgba(0, 0, 0, 0)");
          }
          setCSS(NewNavButton, "color", ButtonColor);
          setCSS(NewNavButton, "border-color", ButtonColor);

          SwitchProfilePage(ButtonText);
        }
      });

      return NewNavButton;
    }

    CreateProfileNavButton("Posts", ThemeColor);
    CreateProfileNavButton("Chats", "#2AF5B5");
    CreateProfileNavButton("Likes", "#FF5786");
    //CreateProfileNavButton("Media", "#C95EFF");

    var ProfileContentHolder = createElement("ProfileContentHolder", "div", "MainContent", [
      ["position", "relative"],
      ["margin-top", "8px"],
      ["width", "100%"],
      ["margin-bottom", "8px"]
    ]);

    // Load Posts:
    this.LoadPosts = async function () {
      var ContentHolder = createElement("PostDisplayHolder", "div", ProfileContentHolder);

      var Posts = Data.Posts;
      var Likes = {};

      if (Posts.length < 1) {
        CreateMiniTextNotif(ContentHolder, "This user hasn't posted anything, yet...");
        return;
      }

      for (var l = 0; l < Data.Likes.length; l++) {
        var SetObject = Data.Likes[l];
        var UserIDSet = SetObject._id;
        Likes[UserIDSet] = "";
      }
      for (var i = 0; i < Posts.length; i++) {
        var PostLoad = Posts[i];
        var IsLiking = false;
        if (Likes[PostLoad._id + UserID] != null) {
          IsLiking = true;
        }
        if (PostLoad.IsLiked == null) {
          PostLoad.IsLiked = IsLiking;
        }
        OldestPostTime = PostLoad.Timestamp;
        try {
          CreatePostView(PostLoad._id, PostLoad, ProfileUserData, ContentHolder, IsLiking, true);
        } catch (err) {
          console.log(err);
        };
      }

      if (Posts != null && Posts.length < 15) {
        MaxLoadedPosts = true;
        if (Posts.length > 0) {
          CreateMiniTextNotif(ContentHolder, "That's all for now...");
        }
      } else {
        MaxLoadedPosts = false;
      }

      LoadMoreType = "Posts";

      SetupPostChats(false);
      LoadEmbedPreviews();
    }
    this.LoadPosts();

    this.LoadChats = function () {
      createElement("ChatDisplayHolder", "div", ProfileContentHolder, [
        ["display", "flex"],
        ["flex-wrap", "wrap"],
        ["gap", "12px"],
        ["padding-top", "4px"]
      ]);

      if (Data.Chats.length < 1) {
        setCSS("ChatDisplayHolder", "display", "block");
        removeCSS("ChatDisplayHolder", "padding-top");
        CreateMiniTextNotif("ChatDisplayHolder", "This user hasn't chatted anything, yet...");
        return;
      }

      LoadMoreType = "Chats";

      var Replies = {};
      if (Data.Replies != null) {
        for (var r = 0; r < Data.Replies.length; r++) {
          var SetObject = Data.Replies[r];
          Replies[SetObject._id] = SetObject;
        }
      }

      LoadProfileChats(Data.Chats, Replies);

      if (Data.Chats.length < 25) {
        MaxLoadedChats = true;
        if (Data.Chats.length > 0) {
          CreateMiniTextNotif(ProfileContentHolder, "That's all for now...");
        }
      } else {
        MaxLoadedChats = false;
      }

      //CreateMiniTextNotif(ContentHolder, "This user hasn't sent any chats, yet...");
    }

    this.LoadLikes = function () {
      var ContentHolder = createElement("LikeDisplayHolder", "div", ProfileContentHolder);

      if (Data.LikePostData.length < 1) {
        CreateMiniTextNotif(ContentHolder, "This user hasn't liked anything, yet...");
        return;
      }

      var Posts = {};
      var Users = {};
      var Likes = {};

      for (var u = 0; u < Data.UserLikePostUsers.length; u++) {
        var SetObject = Data.UserLikePostUsers[u];
        Users[SetObject._id] = SetObject;
      }
      for (var l = 0; l < Data.Likes.length; l++) {
        var SetObject = Data.Likes[l];
        Likes[SetObject._id] = "";
      }
      for (var p = 0; p < Data.UserLikePosts.length; p++) {
        var SetObject = Data.UserLikePosts[p];
        Posts[SetObject._id] = SetObject;
      }
      for (var i = 0; i < Data.LikePostData.length; i++) {
        var LikePostLoad = Data.LikePostData[i];
        var PostLoad = Posts[LikePostLoad._id.substring(0, LikePostLoad._id.length / 2)];
        if (PostLoad != null) {
          var IsLiking = false;
          if (Likes[PostLoad._id + UserID] != null) {
            IsLiking = true;
          }
          if (PostLoad.IsLiked == null) {
            PostLoad.IsLiked = IsLiking;
          }
          OldestPostTime = PostLoad.Timestamp;
          try {
            CreatePostView(PostLoad._id, PostLoad, Users[PostLoad.UserID], ContentHolder, IsLiking, true);
          } catch (err) {
            console.log(err);
          };
        }
      }

      if (Data.LikePostData.length < 15) {
        MaxLoadedPosts = true;
        if (Data.LikePostData.length > 0) {
          CreateMiniTextNotif(ContentHolder, "That's all for now...");
        }
      } else {
        MaxLoadedPosts = false;
      }

      LoadMoreType = "LikedPosts";
      var LastLikeItemTime = null;
      if (Data.LikePostData[Data.LikePostData.length - 1] != null) {
        LastLikeItemTime = Data.LikePostData[Data.LikePostData.length - 1].Timestamp;
      }
      CustumLoadData = { LastItemTime: LastLikeItemTime };

      SetupPostChats(false);
      LoadEmbedPreviews();
    }

    function SwitchProfilePage(Page) {
      while (ProfileContentHolder.firstChild) {
        ProfileContentHolder.firstChild.remove();
      }

      window.scrollTo(window.scrollX, 0);

      if (this["Load" + Page] != null) {
        this["Load" + Page]();
      }
    }
  });
}

async function LoadProfileChats(Chats, Replies) {
  for (var c = 0; c < Chats.length; c++) {
    var ChatData = Chats[c];

    var ChatMessage = createElement(ChatData._id + "Chat", "div", "ChatDisplayHolder", [
      ["position", "relative"],
      ["display", "inline-block"],
      ["box-sizing", "border-box"],
      ["flex", "1 1 250px"],
      ["min-height", "47px"],
      ["padding-top", "6px"],
      ["padding-bottom", "4px"],
      ["background-color", ContentColor],
      ["z-index", "4"],
      ["border-radius", "10px"],
      ["overflow", "hidden"],
      ["cursor", "pointer"]
    ]);
    if (ChatData.ReplyID != null && Replies[ChatData.ReplyID] != null) {
      var ReplyData = Replies[ChatData.ReplyID];
      var ReplyHolder = createElement("ReplyHolder", "div", ChatMessage, [
        ["position", "relative"],
        ["width", "calc(100% - 6px)"],
        ["height", "16px"],
        ["overflow", "hidden"],

        // Text:
        ["font-size", "12px"],
        ["white-space", "nowrap"],
        ["text-overflow", "ellipsis"],
        ["overflow", "hidden"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#aaaaaa"],
        ["text-align", "left"],
        ["vertical-align", "top"]
      ]);
      createElement("QuoteLine", "div", ReplyHolder, [
        ["position", "absolute"],
        ["display", "inline-block"],
        ["width", "20px"],
        ["height", "10px"],
        ["margin-left", "23.5px"],
        ["margin-top", "6px"],
        ["border-style", "solid"],
        ["border-width", "0px"],
        ["border-left-width", "3px"],
        ["border-top-width", "3px"],
        ["border-color", "#666666"],
        ["box-sizing", "border-box"],
        ["border-top-left-radius", "8px"]
      ]);
      var ReplyUsername = createElement("ReplyUsername", "span", ReplyHolder, [
        ["position", "relative"],
        //["display", "inline-block"],
        ["margin-left", "47.5px"],
        ["margin-bottom", "2px"],
        ["padding-left", "2px"],
        ["cursor", "pointer"],

        // Text:
        ["font-size", "12px"],
        ["overflow", "hidden"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#cccccc"],
        ["text-align", "left"]
      ]);
      var ReplyText = createElement("ReplyText", "span", ReplyHolder, [
        ["position", "relative"],
        //["display", "inline-block"],
        ["margin-left", "4px"],
        ["margin-bottom", "2px"],
        //["width", "calc(100% - " + (ReplyHolder.clientWidth - (23.5 + QuoteLine.clientWidth + 4 + ReplyUsername.clientWidth)) + "px)"],
        ["cursor", "pointer"],

        // Text:
        ["font-size", "12px"],
        ["white-space", "nowrap"],
        ["font-family", FontTypeA],
        ["font-weight", "900"],
        ["color", "#aaaaaa"],
        ["text-align", "left"]
      ]);
      if (ReplyData != null) {
        ReplyHolder.setAttribute("ReplyID", ChatData.ReplyID);

        if (ReplyData.UserData.User != null) {
          ReplyUsername.textContent = ReplyData.UserData.User;
        }

        ReplyText.innerHTML = CleanString(ReplyData.Text);
        ReplyText.innerHTML = ReplyText.innerHTML.replace(/\&nbsp;/g, " ");
      } else {
        ReplyUsername.innerHTML = "<i style='color: #aaaaaa'>Deleted</i>"
      }
    }

    //SetOnLoad.ChatProfilePic = 
    createElement("ChatProfilePic", "div", ChatMessage, [
      ["position", "absolute"],
      ["width", "35px"],
      ["height", "35px"],
      ["left", "6px"],
      ["border-radius", "8px"],
      ["object-fit", "cover"],

      ["content", "url('" + GoogleCloudStorgeURL + "ProfileImages/" + DecideProfilePic(ProfileUserData) + "')"]
    ]);
    //SetOnLoad.ChatUsername = 
    var ChatUsername = createElement("ChatUsername", "div", ChatMessage, [
      ["position", "relative"],
      ["display", "block"],
      ["width", "calc(100% - 50px)"],
      //["height", "18px"],
      ["left", "45px"],
      ["margin-top", "-2px"],

      // Text:
      ["font-size", "15px"],
      ["white-space", "nowrap"],
      ["text-overflow", "ellipsis"],
      ["overflow", "hidden"],
      ["font-family", FontTypeA],
      ["font-weight", "500"],
      ["color", FontColorA],
      ["text-align", "left"]
    ]);
    SetUsernameRole(ChatUsername, ProfileUserData);

    if (ChatData.Timestamp != null) {
      var CalcTimestamp = Math.floor((Date.now() - ChatData.Timestamp) / 1000);
      if (CalcTimestamp < 1) {
        CalcTimestamp = 1; // Prevent negative timestamps.
      }
      var AmountDivide = 1;
      var End = "s"; // Second
      if (CalcTimestamp > 31536000 - 1) {
        AmountDivide = 31536000;
        End = "y"; // Year
      } else if (CalcTimestamp > 2592000 - 1) {
        AmountDivide = 2592000;
        End = "mo"; // Month
      } else if (CalcTimestamp > 604800 - 1) {
        AmountDivide = 604800;
        End = "w"; // Week
      } else if (CalcTimestamp > 86400 - 1) {
        AmountDivide = 86400;
        End = "d"; // Day
      } else if (CalcTimestamp > 3600 - 1) {
        AmountDivide = 3600;
        End = "h"; // Hour
      } else if (CalcTimestamp > 60 - 1) {
        AmountDivide = 60;
        End = "m"; // Minute
      }
      var TimeToSet = Math.round(CalcTimestamp / AmountDivide) || "0";
      ChatUsername.innerHTML = ChatUsername.innerHTML + " <span title='Sent: " + new Date(ChatData.Timestamp) + "' style='font-size: 12px; color: #bbbbbb'>" + TimeToSet + End + "</span>";
    }

    ChatData.Text = CleanString(ChatData.Text);

    var ChatText = createElement("ChatText", "div", ChatMessage, [
      ["position", "relative"],
      ["display", "block"],
      ["width", "calc(100% - 60px)"],
      ["left", "45px"],
      ["margin-top", "1px"],

      // Text:
      ["font-size", "14px"],
      ["font-family", FontTypeA],
      ["font-weight", "400"],
      ["color", FontColorA],
      ["text-align", "left"],
      ["overflow-wrap", "break-word"]
    ]);
    ChatText.innerHTML = CleanString(ChatData.Text);
    ChatText.innerHTML = ChatText.innerHTML.replace(/\&nbsp;/g, " ").replace(/\$\[NEWLINE\]\;/g, "<br/>");
    ChatText.className = ProfileUserData.User + "ChatText";

    ChatMessage.setAttribute("PostID", ChatData.PostID);
    ChatMessage.setAttribute("Timestamp", ChatData.Timestamp);
    ChatMessage.setAttribute("User", ProfileUserData.User);
    ChatMessage.setAttribute("Text", ChatData.Text);
    ChatMessage.setAttribute("TypeRender", "LoadChatFromID");

    createElement("LoadChat" + ChatData._id, "span", ChatMessage, [
      ["position", "absolute"],
      ["width", "100%"],
      ["height", "100%"],
      ["left", "0px"],
      ["top", "0px"],
      ["z-index", "10"]
    ]).setAttribute("TypeRender", "LoadChatFromID");
  }
}

ProfilePageJSLoaded = true;