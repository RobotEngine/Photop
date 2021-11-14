var UserDetails = {};
var CompressFirebaseDataID = null;
var LoginUsername = "";
// var LoginToken = getCookieValue("LoginCookie");

// const = require("firebase");
// Required for side-effects
// require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
var ProjectKeys = {
  apiKey: "AIzaSyAo_uUkNH0dlQKDVUKrvAknpORRZhp99zk",
  authDomain: "parcel-7d05a.firebaseapp.com",
  projectId: "parcel-7d05a",
  storageBucket: "parcel-7d05a.appspot.com",
  messagingSenderId: "967056884979",
  appId: "1:967056884979:web:ee98892eb7ad1aa3696386",
  measurementId: "G-X8VENXYGS6"
};
firebase.initializeApp(ProjectKeys);
// firebase.analytics();

var db = firebase.firestore();
var storage = firebase.storage();

/*
db.collection("Posts").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    db.collection("Posts").doc(doc.id).update({
        Visible: true
    });
  });
});
*/

var FirebaseURL = "https://firestore.googleapis.com/v1/projects/" + ProjectKeys + "/databases/(default)/documents/";

var CreateDataForUpdate = null;
async function CreateAccount(Data) {
  var DataSendBack = null;
  // Add Auth With Email (YUCK):
  await firebase.auth().createUserWithEmailAndPassword(Data.Username.toLowerCase() + "@exotek.net", Data.Password)
  .then((userCredential) => {
    // Signed in:
    CreateDataForUpdate = Data.Username;
    var user = userCredential.user;
    user.updateProfile({
      displayName: Data.Username,
      photoURL: "DefaultProfilePic.svg"
    });

    db.collection("Users").doc(Data.Username.toLowerCase()).set(Data)
    .then((docRef) => {
      //console.log("Document written with ID: ", docRef);
      //DataSendBack = true;
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      //DataSendBack = error;
    });

    //console.log(userCredential);
    // ...
    DataSendBack = true;
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    //console.log(error);
    DataSendBack = error;
    // ..
  });
  
  return DataSendBack;
}

async function LoginToAccount(Data) {
  var DataSendBack = null;

  await db.collection('Users').doc(Data.Username.toLowerCase()).update({
    Password: Data.Password,
    VisitorData: CompressFirebaseDataID,
    Logins: firebase.firestore.FieldValue.increment(1)
  }).then((docRef) => {
    firebase.auth().signInWithEmailAndPassword(Data.Username.toLowerCase() + "@exotek.net", Data.Password)
    .then((userCredential) => {
      // Signed in
      //var user = userCredential.user;
      // ...
      GetPosts({  // Get the beginning posts:
        Add: "Top",
        Limit: 10
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
    //LoginUsername = Data.Username;
    DataSendBack = true;
  })
  .catch((error) => {
    //console.error("Error adding document: ", error);
    DataSendBack = error;
  });

  return DataSendBack;
}

var DisableConnectionWatch = false
async function AddPost(Data, QuotesFinnalize, ImageUpload) {
  DisconnectPostListener();
  await db.collection("Posts").add(Data)
  .then((docRef) => {
    //console.log("Document written with ID: ", docRef.id);

    var DoneQuotes = []; // Prevent user spamming quotes.
    QuotesFinnalize.forEach((Quote) => {
      if (DoneQuotes[Quote] == null) {
        DoneQuotes[Quote] = "AlreadyMentioned";

        db.collection("Posts").doc(Quote).update({
          Quotes: firebase.firestore.FieldValue.increment(1)
        });
      }
    });

    for (var i = 0; i < ImageUpload.length; i++) {
      var Image = ImageUpload[i];
      UploadImage(Image.id, docRef.id+i, {contentType: "image/png", ID: firebase.auth().getUid()});
      Image = "Uploaded";
    }
    var ImageHolder = find("CreateMediaHolder");
    while (ImageHolder.firstChild) {
      ImageHolder.firstChild.remove();
    }
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });

  setCSS("ViewRefreshBar", "display", "none");
  await sleep(150);
  GetPosts({
    Add: "Top",
    Limit: 10
  });
}

async function UploadImage(URLImage, Name, Metadata) {
 //console.log(URLImage);
  var BlobImage = await fetch(URLImage).then(r => r.blob());
  var Reference = storage.ref().child("PostImages/" + Name).put(BlobImage, Metadata).then((snapshot) => {
    //console.log('Uploaded a blob or file!');
  })
  .catch((error) => {
    console.error("Error adding media: ", error);
  });
  URL.revokeObjectURL(URLImage);
}

var PostListener = null;
function ConnectSocket() {
  var ConnectionTime = GetFirebaseTimestamp();
  PostListener = db.collection("Posts").where("Visible", "==", true).where("Timestamp", ">", ConnectionTime).onSnapshot((querySnapshot) => {
    if (DisableConnectionWatch == true) {
      PostListener();
    } else {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          if (change.doc.data().Timestamp > ConnectionTime && change.doc.data().ID != firebase.auth().getUid()) {
            console.log("HERE");
            var ViewRefreshBar = find("ViewRefreshBar");
            setCSS(ViewRefreshBar, "display", "block");
            ViewRefreshBar.innerHTML = "New posts have been added. Do you want to <div style='display: inline-block; background-color:" + ThemeColor + "; opacity: 0.9; border-radius: 6px; padding-left: 4px; padding-right: 4px; padding-top: 1px; padding-bottom: 1px; cursor: pointer; color: #ffffff'>Refresh</span>";
            PostListener();  // Disconnect.
          }
        }
      });
    }
  });
}
function DisconnectPostListener() {
  DisableConnectionWatch = true;
  if (PostListener != null) {
    PostListener();  // Disconnect.
  }
}

var PostLikesFromUser = [];
var GettingNewPosts = false;
var OldestPostTime = 0;
function GetPosts(Data, ViewingOlderPost) {
  if (GettingNewPosts == false) {
    GettingNewPosts = true;
    if (Data.Add == "Top") {
      setCSS(ViewRefreshBar, "display", "none");
      window.scrollTo(0, 0); // Make sure it doesn't keep adding (A million requests).
      OldestPostTime = GetFirebaseTimestamp();
    }
    //setCSS("ViewRefreshBar", "display", "none");
    db.collection("Posts").orderBy("Timestamp", "desc").where("Visible", "==", true).where("Timestamp", "<", OldestPostTime).limit(Data.Limit).get().then((querySnapshot) => {
      if (Data.Add == "Top") { // Clear all posts:
        CreatePostDisplay();
      }
      PostLikesFromUser = [];
      if (firebase.auth().getUid() != null) {
        var LikeCheck = [];
        querySnapshot.forEach((doc) => {
          LikeCheck.push(doc.id);
        });
        if (LikeCheck.length > 0) {
          db.collection("Likes").where("UserID", "==", firebase.auth().getUid()).where("PostID", "in", LikeCheck).get().then((queryLikeSnapshot) => {
            queryLikeSnapshot.forEach((doc) => {
              PostLikesFromUser[doc.data().PostID] = doc.id;
            });
            RenderNewPosts();
          });
        } else {
          RenderNewPosts();
        }
      } else {
        RenderNewPosts();
      }
      function RenderNewPosts() {
        querySnapshot.forEach((doc) => {
          OldestPostTime = doc.data().Timestamp;
          var IsLiking = false;
          if (PostLikesFromUser[doc.id] != null) {
            IsLiking = true;
          }
          CreatePostView(doc.id, doc.data(), "PostDisplayHolder", IsLiking);
        });
        GettingNewPosts = false;
      }
    });

    if (Data.Add != "Merge") {
      DisableConnectionWatch = false;
      ConnectSocket();
    }
  }
}

function GetPostsFromID(Data, Quote) {
  if (GettingNewPosts == false) {
    if (Quote != null) {
      if (Quote.textContent == "/Post_Invalid") {
        ShowPopUp("Hypothetical Post?", "This post could not be located in the database. The post author most likely mistyped the quote text.", [ ["Okay", "#618BFF", null] ]);
        return;
      }
    }
    GettingNewPosts = true;
    OldestPostTime = GetFirebaseTimestamp();
    setCSS("ViewRefreshBar", "display", "none");
    db.collection("Posts").doc(Data.PostID).get().then((PostFromSearch) => {
      if (PostFromSearch == null || PostFromSearch.data() == null || PostFromSearch.data().Timestamp == null) {
        if (Quote != null) {
          GettingNewPosts = false;
          Quote.textContent = "/Post_Invalid";
          ShowPopUp("Hypothetical Post?", "This post could not be located in the database. The post author most likely mistyped the quote text.", [ ["Okay", "#618BFF", null] ]);
        }
        return;
      }
      window.scrollTo(0, 0);
      OldestPostTime = PostFromSearch.data().Timestamp;
      db.collection("Posts").orderBy("Timestamp", "desc").where("Visible", "==", true).where("Timestamp", "<", OldestPostTime).limit(Data.Limit).get().then((querySnapshot) => {
        CreatePostDisplay();
        var ViewRefreshBar = find("ViewRefreshBar");
        setCSS(ViewRefreshBar, "display", "block");
        ViewRefreshBar.innerHTML = "Your are viewing older posts. Do you want to <div style='display: inline-block; background-color:" + ThemeColor + "; opacity: 0.9; border-radius: 6px; padding-left: 4px; padding-right: 4px; padding-top: 1px; padding-bottom: 1px; cursor: pointer; color: #ffffff'>Go Back</div>";
        PostLikesFromUser = [];
        if (firebase.auth().getUid() != null) {
          var LikeCheck = [PostFromSearch.id];
          querySnapshot.forEach((doc) => {
            LikeCheck.push(doc.id);
          });
          if (LikeCheck.length > 0) {
            db.collection("Likes").where("UserID", "==", firebase.auth().getUid()).where("PostID", "in", LikeCheck).get().then((queryLikeSnapshot) => {
              queryLikeSnapshot.forEach((doc) => {
                PostLikesFromUser[doc.data().PostID] = doc.id;
              });
              RenderNewPosts([PostFromSearch], true);
              RenderNewPosts(querySnapshot);
            });
          } else {
            RenderNewPosts([PostFromSearch], true);
            RenderNewPosts(querySnapshot);
          }
        } else {
          RenderNewPosts([PostFromSearch], true);
          RenderNewPosts(querySnapshot);
        }
      });
    });
    function RenderNewPosts(querySnapshot, IsFind) {
      querySnapshot.forEach((doc) => {
        async function CreatePostUI() {
          await sleep(1);
          OldestPostTime = doc.data().Timestamp;
          var IsLiking = false;
          if (PostLikesFromUser[doc.id] != null) {
            IsLiking = true;
          }
          CreatePostView(doc.id, doc.data(), "PostDisplayHolder", IsLiking);
          if (IsFind == true) {
            var Object = find(Data.PostID);
            if (Object != null) {
              Object.animate([
                { backgroundColor: "#A743E0", offset: 0.3},
                { backgroundColor: ContentColor },
              ], 500);
            }
          }
        }
        CreatePostUI();
      });
      GettingNewPosts = false;
    }

    DisconnectPostListener();
  }
}

function DeletePost(Data) {

}

/*
async function HasLikedPost(PostID, Data, PostContainer) {
  var HasLiked = false;
  if (firebase.auth().getUid() != null) {
    await db.collection("Posts").doc(PostID).collection('Likes').doc(firebase.auth().getUid()).get().then((Snapshot) => {
      if (Snapshot.data() != null && Snapshot.data().IsLiked == null) {
        HasLiked = true;
      }
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
  }
  CreatePostButtons(PostID, Data, PostContainer, HasLiked)
  return HasLiked;
}
*/
function LikePost(PostID, IsLiking) {
  if (firebase.auth().getUid() == null) {
    ShowPopUp("It's Better Together", "Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style='color: #FF5786'>Like</b> a post!", [ ["Sign In", ThemeColor, "StartSignIn"], ["Sign Up", "#2AF5B5", "StartSignUp"], ["Later", "#B3B3B3", null] ]);
    return "NotLoggedIn";
  }
  if (IsLiking == false) {
    db.collection("Likes").add({UserID: firebase.auth().getUid(), PostID: PostID}).then((NewLike) => {
      db.collection("Posts").doc(PostID).update({
          Likes: firebase.firestore.FieldValue.increment(1)
      });
      PostLikesFromUser[PostID] = NewLike.id;
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
  } else {
    if (PostLikesFromUser[PostID] != null) {
      db.collection("Likes").doc(PostLikesFromUser[PostID]).delete() //.update({
      //  IsLiked: false
      //})
      .then(() => {
        db.collection("Posts").doc(PostID).update({
            Likes: firebase.firestore.FieldValue.increment(-1)
        });
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
    }
  }
}

var CurrentActionSelectPost = null;
function FinishActionConfirm() {
  if (CurrentActionSelectPost[2] != null && CurrentActionSelectPost[3] != null) {
    //if (CurrentActionSelectPost[2].ID == firebase.auth().getUid()) {
      db.collection("Posts").doc(CurrentActionSelectPost[1]).update({
          Visible: false
      });
      CurrentActionSelectPost[3].remove();
    //}
  }
}
function PostActions(Data) {
  Data = Data[3];
  if (Data[0] == "Delete") {
    CurrentActionSelectPost = Data;
    ShowPopUp("Delete Post?", "Are you sure you want to <b>delete</b> your post?", [ ["Delete", "#FF4174", "FinishActionConfirm"], ["No", "#B3B3B3", null] ]);
  }
}


function SendChat(Data) {
  db.collection("Chats").add(Data)
  .then((docRef) => {
   //console.log("Document written with ID: ", docRef.id);
    db.collection("Posts").doc(Data.PostID).update({
        Chats: firebase.firestore.FieldValue.increment(1)
    });
  }).catch((error) => {
      console.error("Error: ", error);
  });
}
var POST_CHAT_COUNT_AS_ACTIVE_TIME = 180; // Seconds.
var WaitingToLoad = [];
var ActiveFireConnections = {};
setInterval(function() {
  var LoadedPosts = document.getElementsByClassName("Posts");
  var RemovePosts = [];
  for(var i = 0; i < LoadedPosts.length; i++) {
    var CheckPost = LoadedPosts[i];
    var ObjectRect = CheckPost.getBoundingClientRect();
    if ((ObjectRect.x + ObjectRect.width) < 0 || (ObjectRect.y + ObjectRect.height) < 0 || (ObjectRect.x > window.innerWidth || ObjectRect.y > window.innerHeight)) {
      if (WaitingToLoad.includes(CheckPost.id) == true) {
        RemovePosts.push(CheckPost.id);
      }
      var VideoFrame = find(CheckPost.id + "VideoPlayback");
      if (VideoFrame != null && VideoFrame.src != "about:blank") {
        VideoFrame.src = "about:blank";
      }
    } else {
      var VideoFrame = find(CheckPost.id + "VideoPlayback");
      if (VideoFrame != null && VideoFrame.src == "about:blank") {
        VideoFrame.src = VideoFrame.getAttribute("PlaySrc") || "about:blank";
      }
      // Post is on-screen:
      if (WaitingToLoad.includes(CheckPost.id) == true) {
        var MaintainAttribute = CheckPost.getAttribute("HasLiveConnection");
        if (MaintainAttribute == null) {
          InitiateConnect(CheckPost);
          function InitiateConnect(LivePost) {
            // Load Post Chat:
            // Connect to Firestore Listener:
            var IsActiveCheck = ActiveFireConnections[LivePost.id];
            if (IsActiveCheck != null) {
              IsActiveCheck[0]();
            }
            LivePost.setAttribute("HasLiveConnection", true);
            LivePost.removeAttribute("LoadedChats");
            ActiveFireConnections[LivePost.id] = null;
            var ActiveUsers = {};
            var Connection = db.collection("Chats").orderBy("Timestamp", "asc").where("PostID", "==", LivePost.id).limitToLast(25).onSnapshot((querySnapshot) => {
              var ChatRect = LivePost.getBoundingClientRect();
              if ((ChatRect.x + ChatRect.width) < 0 || (ChatRect.y + ChatRect.height) < 0 || (ChatRect.x > window.innerWidth || ChatRect.y > window.innerHeight)) {
                Connection(); // Disconnect the active connection.
                LivePost.setAttribute("HasLiveConnection", false);
              } else {
                var LiveChatFrame = find(LivePost.id + "LiveChat");
                if (LiveChatFrame != null) {
                  var ScrollFrame = LiveChatFrame.querySelector("#Chat");
                  function CreateChat(doc) {
                    var Holder = ScrollFrame.querySelector("#Holder");
                    if (Holder == null) {
                      var NewChatContainer = createElement("Holder", "div", ScrollFrame, [
                        ["position", "relative"],
                        ["width", "100%"],
                        ["margin-top", "8px"]
                      ]);
                      NewChatContainer.setAttribute("dir", "ltr");
                      Holder = NewChatContainer;
                    }
                    var ChatData = doc.data();
                    ActiveUsers[ChatData.User] = ChatData.Timestamp;
                    var ChatMessage = createElement(doc.id + "ChatMessage", "div", Holder, [
                      ["position", "relative"],
                      ["display", "block"],
                      ["flex", "0 0 auto"],
                      ["width", "calc(100% - 8px)"],
                      ["min-height", "35px"],
                      ["bottom", "0px"],
                      ["margin-left", "4px"],
                      ["margin-top", "2px"],
                      ["margin-bottom", "2px"],
                      ["padding-top", "4px"],
                      ["padding-bottom", "4px"],
                      ["z-index", "6"],
                      ["border-radius", "8px"],
                      ["overflow", "hidden"],
                      ["border-radius", "8px"]
                    ]);
                    createElement("ChatProfilePic", "div", ChatMessage, [
                      ["position", "absolute"],
                      ["width", "35px"],
                      ["height", "35px"],
                      ["left", "6px"],
                      ["top", "6px"],
                      ["border-radius", "10px"],

                      ["content", "url('" + "https://firebasestorage.googleapis.com/v0/b/parcel-7d05a.appspot.com/o/" + ChatData.ProfilePic + "?alt=media" + "')"]
                    ]);
                    createElement("ChatUsername", "div", ChatMessage, [
                      ["position", "relative"],
                      ["display", "block"],
                      ["width", "calc(100% - 50px)"],
                      //["height", "18px"],
                      ["left", "45px"],
                      ["top", "0px"],

                      // Text:
                      ["font-size", "16px"],
                      ["white-space", "nowrap"],
                      ["text-overflow", "ellipsis"],
                      ["overflow", "hidden"],
                      ["font-family", FontTypeA],
                      ["font-weight", "900"],
                      ["color", FontColorA],
                      ["text-align", "left"]
                    ]).textContent = ChatData.User;
                    createElement("ChatText", "div", ChatMessage, [
                      ["position", "relative"],
                      ["width", "calc(100% - 60px)"],
                      ["left", "45px"],
                      ["margin-top", "2px"],

                      // Text:
                      ["font-size", "14px"],
                      ["font-family", FontTypeA],
                      ["font-weight", "400"],
                      ["color", FontColorA],
                      ["text-align", "left"],
                      ["overflow-wrap", "break-word"],
                      ["whitespace", "pre-wrap"]
                    ]).textContent = ChatData.Text;
                    ChatMessage.setAttribute("onMouseOver", "this.style.backgroundColor = '" + ContentColor + "'");
                    ChatMessage.setAttribute("onMouseOut", "this.style.backgroundColor = 'rgba(0,0,0,0)'");
                    ChatMessage.addEventListener("click", function() {
                      var DropdownChatButtons = [
                        ["Copy Username", ThemeColor, "CopyClipboardText", ChatData.User],
                        ["Copy Text", ThemeColor, "CopyClipboardText", ChatData.Text],
                        ["Copy ID", ThemeColor, "CopyClipboardText", "/Chat_" + doc.id]
                      ];
                      if (ChatData.ID != firebase.auth().getUid()) {
                        DropdownChatButtons.unshift(["Block User", "#FF8652", null]);
                        DropdownChatButtons.unshift(["Report", "#FFCB70", "ReportContent", ChatData]);
                      }
                      CreateDropdown(ChatMessage, DropdownChatButtons, -6, "Left");
                    });
                    return [Holder, ChatMessage];
                  }
                  if (LivePost.getAttribute("LoadedChats") == null) {
                    LivePost.setAttribute("LoadedChats", true);
                    var EndMessage = null;
                    querySnapshot.forEach((doc) => {
                      EndMessage = CreateChat(doc);
                    });
                    if (EndMessage != null) {
                      ScrollFrame.scrollTo(0, ScrollFrame.scrollTop+ScrollFrame.clientHeight+1000);
                    }
                  } else {
                    var EndMessage = null;
                    var NewChats = 0;
                    querySnapshot.docChanges().forEach((change) => {
                      if (change.type === "added") {
                        EndMessage = CreateChat(change.doc);
                        NewChats += 1;
                      }
                    });
                    if (EndMessage != null) {
                      if (ScrollFrame.scrollTop+ScrollFrame.clientHeight+EndMessage[1].clientHeight+20 > ScrollFrame.scrollHeight) {
                        ScrollFrame.scrollTo(0, ScrollFrame.scrollTop+ScrollFrame.clientHeight+EndMessage[1].clientHeight+20);
                      }
                    }
                    if (NewChats > 0) {
                      var ChatCounter = find(LivePost.id + "Chats");
                      ChatCounter.childNodes[0].nodeValue = parseInt(ChatCounter.textContent) + NewChats;
                    }
                  }
                  var ActiveUserCount = 0;
                  var ActiveUserKeys = Object.keys(ActiveUsers);
                  for (var i = 0; i < ActiveUserKeys.length; i++) {
                    if (ActiveUsers[ActiveUserKeys[i]]+POST_CHAT_COUNT_AS_ACTIVE_TIME > GetFirebaseTimestamp()) {
                      ActiveUserCount += 1;
                    } else {
                      ActiveUsers[ActiveUserKeys[i]] = null;
                    }
                  }
                  var EndChat = "Chatters";
                  if (ActiveUserCount == 1) {
                    EndChat = "Chatter";
                  }
                  find(LivePost.id + "ChatTitleLiveUsers").textContent = "• " + ActiveUserCount + " " + EndChat;
                }
              }
            });
            ActiveFireConnections[LivePost.id] = [Connection, LivePost];
          }
        }
      } else {
        WaitingToLoad.push(CheckPost.id);
      }
    }
  }
  RemovePosts.forEach((Post) => {
    WaitingToLoad = WaitingToLoad.filter(a => a !== Post);
    var IsActive = ActiveFireConnections[Post];
    if (IsActive != null) {
      IsActive[0](); // Disconnect the active connection.
      IsActive[1].removeAttribute("HasLiveConnection");
      if (IsActive[1] != null) {
        var Holder = find(IsActive[1].id + "LiveChat").querySelector("#Chat").querySelector("#Holder");
        if (Holder != null) {
          Holder.remove();
        }
      }
      ActiveFireConnections[Post] = null;
    }
  });
  //WaitingToLoad = [];
}, 2000);



function GetFirebaseTimestamp() {
  var TimeParse = firebase.firestore.Timestamp.now();
  return parseFloat(TimeParse.seconds + "." + TimeParse.nanoseconds)
}

function FormRandomID() {
  var Result = "";
  var Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()_-+={}[]|<>,./?";
  var CharactersLength = Characters.length;
  for (var i = 0; i < CharactersLength; i++) {
    Result += Characters[Math.floor(Math.random() * CharactersLength)];
  }
  return Result;
}

/*
async function CreateAccessToken() {
  if (LoginUsername == "") {
    return; // TODO: Prompt Sign Up
  }

  var Result = "";
  var Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()_-+={}[]|<>,./?";
  var CharactersLength = Characters.length;
  for (var i = 0; i < CharactersLength; i++) {
    Result += Characters[Math.floor(Math.random() * CharactersLength)];
  }

  await db.collection("AccessTokens").doc(LoginUsername.toLowerCase()).set({
    Token: Result,
    Expires: GetFirebaseTimestamp() + 31536000
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef);
    DataSendBack = true;
  })
  .catch((error) => {
    //console.error("Error adding document: ", error);
    DataSendBack = error;
  });

  return Result;
}
*/

function createCookie(Name, Expire, Value) {
  var Date = new Date();
  Date.setTime(GetFirebaseTimestamp.seconds + Expire);
  var Expires = "expires=" + Date.toUTCString();
  document.cookie =  Name + "=" + Value + ";" + Expires + ";path=/";

}
/*
db.collection("users").add({
    Username: "Barf",
    Password: "Puke",
    Email: "barf@barf.com"
})
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});


db.collection("users").doc("D6gZ8BzYzXvCJsLJQRSE").get().then((doc) => {
      var Data = doc.data();
      console.log(Data);
      for (var i=0; i < Data.length; i++) {
        console.log(Data[i]);
      }
        //console.log(`${doc.id} => ${doc.data()}`);
});
*/

/*
db.collection("users").where("Username", "==", "Barf").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
})
.catch((error) => {
    console.log("Error getting documents: ", error);
});
*/

// 8R7h3gJ1lGTN93nM6gZS

/*
// Credit: http://net.ipcalf.com/  (View Source)
var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection; // window.RTCPeerConnection ||
if (RTCPeerConnection) (function () {
  var rtc = new RTCPeerConnection({iceServers:[]});
  //if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
    rtc.createDataChannel('', {reliable:false});
  //};
  
  rtc.onicecandidate = function (evt) {
    if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
  };
  rtc.createOffer(function (offerDesc) {
    grepSDP(offerDesc.sdp);
    rtc.setLocalDescription(offerDesc);
  }, function (e) { console.warn("offer failed", e); });
  
  
  var addrs = Object.create(null);
  addrs["0.0.0.0"] = false;
  function updateDisplay(newAddr) {
    if (newAddr in addrs) return;
    else addrs[newAddr] = true;
    var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
    UserDetails.LANIdentifier = displayAddrs.join(" or perhaps ") || null;
    
    if (UserDetails.LANIdentifier != null) {
      //console.log(UserDetails.LANIdentifier);
      GetIP(UserDetails.LANIdentifier).catch((error) => {
          console.error('Error:', error);
          // GetIP();
      });
    }
    //console.log(UserDetails.LANIdentifier);
  }
  
  function grepSDP(sdp) {
    var hosts = [];
    sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
      if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
        var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
        addr = parts[4],
        type = parts[7];
        if (type === 'host') updateDisplay(addr);
      } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
        var parts = line.split(' '),
            addr = parts[2];
        updateDisplay(addr);
      }
    });
  }
})(); else {
  console.log("Error");
}

//console.log(UserDetails.LANIdentifier);
*/

function FormatFingerprint() {
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, '');
  uid += navigator_info.plugins.length;
  uid += screen_info.height || '';
  uid += screen_info.width || '';
  uid += screen_info.pixelDepth || '';
  return uid;
}

async function GetIP() { //LAN
  // await sleep(100);

  const Request = {
    method: "GET",
    headers: {
      //'Content-Type': 'text/plain',
    },
  }

  const response = await fetch("https://api.ipify.org?format=json", Request); // Could Use: https://api.ipinfodb.com/v3/ip-city/?key=25864308b6a77fd90f8bf04b3021a48c1f2fb302a676dd3809054bc1b07f5b42&format=json
  // Use for admin lookup: http://www.geoplugin.net/json.gp?ip=<IP HERE>

  var Data = await response.json()
  var IP = Data.ip;
  // var LanCompress = LAN.substring(0, LAN.length-6);
  UserDetails.Identifier = IP;
  UserDetails.Fingerprint = FormatFingerprint();

  var IdentifyStore = null;
  await db.collection("VisitorLog").where("Fingerprint", "==", UserDetails.Fingerprint).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        IdentifyStore = doc.id;
        CompressFirebaseDataID = doc.id;
    });
  })

  if (IdentifyStore == null) {
    db.collection("VisitorLog").add({
        Fingerprint: UserDetails.Fingerprint,
        IP: IP,
        Visits: 1,
        LoginAccounts: {}
    })
    .then((docRef) => {
      IdentifyStore = docRef.id;
      CompressFirebaseDataID = docRef.id;
      //console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
  } else {
    db.collection('VisitorLog').doc(IdentifyStore).update({
        Visits: firebase.firestore.FieldValue.increment(1)
    });
  }
  
  return Data;
}
GetIP();