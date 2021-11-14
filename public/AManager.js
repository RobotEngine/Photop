
var CampaignFileNames = [
  ["Ad_Logo_for_Meme_RV.png", "https://www.roblox.com/games/5412621627"],  // [ROBLOX] Meme RV
  ["Untitled1355_20210303131542.png", "https://www.roblox.com/games/5592006405"],  // [ROBLOX] Obby Mania
  ["ad_for_Haunted_house.png", "https://www.roblox.com/games/5817717927"],  // [ROBLOX] Haunted House
  ["MemeRVAd.png", "https://www.roblox.com/games/5412621627"],  // [ROBLOX] Meme RV
]

createElement("SponseredContent", "div", "Primary", [
    ["position", "relative"],
    ["display", "inline-block"],
    ["float", "right"],
    ["padding", "0px"],
    ["vertical-align", "top"],
    ["width", "160px"],
    ["margin-left", "8px"]
]);

for (var i = 0; i < CampaignFileNames.length; i++) {
  async function CreateCampain(i) {
    var Campain = createElement("SponseredA", "div", "SponseredContent", [
        ["position", "relative"],
        ["width", "100%"],
        ["margin-top", "8px"],
        ["border-radius", "12px"],
        ["cursor", "pointer"],

        ["content", "url('" + GoogleCloudStorgeURL + "DisplayAdvertising/" + CampaignFileNames[i][0] + "')"]
    ]);
    if (CampaignFileNames[i][1] != null) {
      Campain.addEventListener("mouseup", function() {
        open(CampaignFileNames[i][1]);
      });
    }
  }
  CreateCampain(i);
}