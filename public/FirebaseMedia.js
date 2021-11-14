// RETIRED


var storage = null;

var AppScript = loadScript("https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js");

AppScript.addEventListener('load', function () {
  var StoreScript = loadScript("https://www.gstatic.com/firebasejs/8.2.9/firebase-storage.js");
  StoreScript.addEventListener('load', function () {
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

    storage = firebase.storage();
  });
});

async function UploadImage(URLImage, Name, Metadata) {
  if (storage == null) {
    // Firebase didn't load for some reason (Cause it sucks).
    return;
  }
  //console.log(URLImage);
  var BlobImage = await fetch(URLImage).then(r => r.blob());
  var Reference = storage.ref().child("PostImages/" + Name).put(BlobImage, Metadata).then((snapshot) => {
    //console.log('Uploaded a blob or file!');
  }).catch((error) => {
    console.error("Error adding media: ", error);
  });
  URL.revokeObjectURL(URLImage); // Remove blob to stop taking up user's memory.
}

/*
// ImageToBinary("URL", function(Binary) { } );
function ImageToBinary(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}
*/