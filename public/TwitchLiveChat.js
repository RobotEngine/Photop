// Connects to Twitch Live Chat:
// If this breaches Twitch TOS - Please contact exotekservices@gmail.com with the subject line of: Twitch Live Chat In Photop Breaches Twitch TOS

var LoadedTwitchLiveScript = true;

var TwitchWebSocket = "wss://irc-ws.chat.twitch.tv/";
var TwitchUser = "justinfan" + GenerateUserID();

var ConnectedChats = {};

function AddTwitchLiveChat(PostID, Channel) {
  if (ConnectedChats[PostID] != null) {
    if (ConnectedChats[PostID].readyState != WebSocket.CLOSED) {
      ConnectedChats[PostID].close();
    }
    //return;
  }

  var NewSocket = new WebSocket(TwitchWebSocket);

  ConnectedChats[PostID] = NewSocket;

  var LastMessage = Date.now();
  NewSocket.onopen = function(Event) {
    NewSocket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
    NewSocket.send("PASS PHOTOP");
    NewSocket.send("NICK " + TwitchUser);
    NewSocket.send("USER " + TwitchUser);
    NewSocket.send("JOIN #" + Channel);
                                         
    var Interval = setInterval(function() {
      if (NewSocket.readyState != WebSocket.CLOSED) {
        if (LastMessage < Date.now() + 300000) {
          NewSocket.send("PING :tmi.twitch.tv");
        } else {
          delete ConnectedChats[PostID];
          AddTwitchLiveChat(PostID, Channel);
        }
      } else {
        clearInterval(Interval);
      }
    }, 60000);
  }

  NewSocket.onmessage = async function(Data) {
    LastMessage = Date.now();
    // var RenderedChat = false;
    var PostIsNull = true;
    var LiveChatFrame = find(PostID + "LiveChat");
    if (LiveChatFrame != null) {
      var ScrollFrame = LiveChatFrame.querySelector("#Chat");
      if (ScrollFrame != null) {
        PostIsNull = false;
        var ObjectRect = ScrollFrame.getBoundingClientRect();
        if ((ObjectRect.y)+(ScrollFrame.offsetHeight) > 0 && ObjectRect.y < (window.innerHeight || document.documentElement.clientHeight)) {
          // Chat is in Frame:
          // RenderedChat = true;
          var RecievedDataArray = Data.data.split("\n");
          if (RecievedDataArray[RecievedDataArray.length-1] == "") {
            RecievedDataArray.pop();
          }
          if (RecievedDataArray != null && RecievedDataArray.length > 0) {
            for (var i = 0; i < RecievedDataArray.length; i++) {
              var RecievedData = RecievedDataArray[i];
              if (RecievedData.includes("@badge-info=") == true && RecievedData.includes(";display-name=") == true && RecievedData.includes(";user-id=") == true && RecievedData.includes(" #" + Channel + " :") == true) {
                // It was a new chat message:
                
                var Users = {};
                Users[GetDataFromSocket(RecievedData, "user-id")] = { User: GetDataFromSocket(RecievedData, "display-name") };

                RenderChatMessage(null, [{
                  Source: "Twitch",
                  _id: GetDataFromSocket(RecievedData, "id"),
                  UserID: GetDataFromSocket(RecievedData, "user-id"),
                  PostID: PostID,
                  Text: RecievedData.substring(RecievedData.indexOf(" #" + Channel + " :")+(" #" + Channel + " :").length)
                }], Users);
              } else if (RecievedData.includes(":tmi.twitch.tv CLEARMSG ") == true) {
                // A user chat was deleted:
                // Must make it say "Chat Deleted"

                var ChatBody = find(GetDataFromSocket(RecievedData, "target-msg-id") + "Chat");
                if (ChatBody != null) {
                  var ChatText = ChatBody.querySelector("#ChatText");
                  if (ChatText != null) {
                    ChatText.innerHTML = "<i style='color:#bbbbbb'>Chat Deleted</i>";
                  }
                }
              } else if (RecievedData.includes(":tmi.twitch.tv CLEARCHAT ") == true) {
                // A user was banned:
                // Must make it say "Chat Deleted"

                var ChatUsername = RecievedData.substring(RecievedData.indexOf(" #" + Channel + " :")+(" #" + Channel + " :").length);
                var ModChats = document.getElementsByClassName(ChatUsername.substring(0, ChatUsername.length-2) + "ChatText");
                for (var d = 0; d < ModChats.length; d++) {
                  try {
                    ModChats[d].innerHTML = "<i style='color:#bbbbbb'>Chat Deleted</i>";
                    var ParentChatBody = ModChats[d].parentNode;
                    if (ParentChatBody != null) {
                      var UsernameDisplay = ParentChatBody.querySelector("#ChatUsername");
                      UsernameDisplay.innerHTML = "<b><i style='color:#cccccc'>User Hidden</i></b>";
                    }
                  } catch(error) {
                    console.warn(error);
                  }
                }
              }
            }
          }
        }
      }
    }
    if (PostIsNull == true) {
      if (NewSocket.readyState != WebSocket.CLOSED) {
        NewSocket.close();
      }
    }
    /*
    if (RenderedChat == false) {
      if (NewSocket.readyState != WebSocket.CLOSED) {
        NewSocket.close();
      }
      delete ConnectedChats[PostID];
    }
    */
  }
}

function RemoveTwitchLiveChat(PostID) {
  if (ConnectedChats[PostID] != null) {
    if (ConnectedChats[PostID].readyState != WebSocket.CLOSED) {
      ConnectedChats[PostID].close();
    }
  }
}

function GetDataFromSocket(SocketData, Find) {
  Find = ";" + Find + "=";
  var StartSnip = SocketData.indexOf(Find)+Find.length;
  return SocketData.substring(StartSnip, SocketData.indexOf(";", StartSnip+1));
}

function GenerateUserID() {
  return Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
}