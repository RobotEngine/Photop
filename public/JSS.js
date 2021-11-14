function createElement(ElementName, ElementType, SetParent, Attributes, NS) {
    "use strict";
    
    if (SetParent == null) {
        return null;
    } else {
        if (typeof SetParent === "string" || typeof SetParent === "number") {
            SetParent = document.getElementById(SetParent);
        }
    }
    
    var NewElement,
        StyleApply = "",
        i;
    
    if (NS == null) {
        NewElement = document.createElement(ElementType);
    } else {
        NewElement = document.createElementNS(NS, ElementType);
    }
    
    if (Attributes == null) {
        Attributes = [];
    }
    
    if (SetParent === null) {
        document.body.appendChild(NewElement);
    } else {
        SetParent.appendChild(NewElement);
    }
    
    for (i = 0; i < Attributes.length; i += 1) {
        StyleApply = StyleApply + Attributes[i][0] + ": " + Attributes[i][1] + "; ";
    }
    NewElement.setAttribute("style", StyleApply);
    NewElement.setAttribute("id", ElementName);
    
    return NewElement;
}

function setCSS(ElementName, Attribute, NewValue) {
    "use strict";
    
    if (ElementName == null) {
        return null;
    } else {
        if (typeof ElementName === "string" || typeof ElementName === "number") {
            ElementName = document.getElementById(ElementName);
        }
    }
    
    var Element = ElementName,
        OriginalStyle = Element.getAttribute("style").split("; "),
        FoundAttribute = false,
        i,
        p,
        ReapplyStyle = "",
        CurrentCheck,
        FirstPart,
        SecondPart;
    OriginalStyle.pop();
    for (i = 0; i < OriginalStyle.length; i += 1) {
        CurrentCheck = "|| " + OriginalStyle[i] + " ||";
        FirstPart = CurrentCheck.split("|| ").pop().split(": ")[0];
        SecondPart = CurrentCheck.split(": ").pop().split(" ||")[0];
        
        if (FirstPart === Attribute) {
            OriginalStyle[i] = Attribute + ": " + NewValue;
            FoundAttribute = true;
        }
    }
    if (FoundAttribute === false) {
        OriginalStyle.push(Attribute + ": " + NewValue);
    }
    for (p = 0; p < OriginalStyle.length; p += 1) {
        ReapplyStyle = ReapplyStyle + OriginalStyle[p] + "; ";
    }
        
    Element.setAttribute("style", ReapplyStyle);
}

function getCSS(ElementName, Attribute) {
    "use strict";
    
    if (ElementName == null) {
        return null;
    } else {
        if (typeof ElementName === "string" || typeof ElementName === "number") {
            ElementName = document.getElementById(ElementName);
        }
    }
    
    var Element = ElementName,
        OriginalStyle = Element.getAttribute("style").split("; "),
        i,
        CurrentCheck,
        FirstPart,
        SecondPart;
    
    if (OriginalStyle.length < 2) {
        return "";
    }
    if (OriginalStyle[OriginalStyle-1] == "") {
        OriginalStyle.pop();
    }
    
    for (i = 0; i < OriginalStyle.length; i += 1) {
        CurrentCheck = "|| " + OriginalStyle[i] + " ||";
        FirstPart = CurrentCheck.split("|| ").pop().split(": ")[0];
        SecondPart = CurrentCheck.split(": ").pop().split(" ||")[0];
        
        if (FirstPart === Attribute) {
            return SecondPart;
        }
    }
    
    // Try again but with all CSS properties:

    if (Element && Element.currentStyle) {
        return Element.currentStyle[Attribute];
    }
    else if (Element && window.getComputedStyle) {
        return document.defaultView.getComputedStyle(Element, null).getPropertyValue(Attribute);
    }
    
    
}

function find(ElementName) {
    "use strict";
    
    return document.getElementById(ElementName);
}

function findClass(ClassName) {
    "use strict";
    
    return document.getElementsByClassName(ClassName);
}

function standardButtonAnim(ElementName, SizeX, SizeY) {
    "use strict";
    
    if (ElementName == null) {
        return null;
    } else {
        if (typeof ElementName === "string" || typeof ElementName === "number") {
            ElementName = document.getElementById(ElementName);
        }
    }
    
    ElementName.animate([
        {"height": (SizeX*0.8) + "px", "width": (SizeY*0.8) + "px", offset: 0.3},
        {"height": SizeX + "px", "width": SizeY + "px"},
    ], {
        duration: 250
    });
    
    //["box-shadow", "0px 1.5px 6px rgba(255, 117, 197, 0.4)"],
}

function ranInt(Min, Max) {
    "use strict";
    return Math.floor(Math.random() * (Max - Min)) + Min;
}

function setClass(ElementName, ClassName) {
    "use strict";
    
    document.getElementById(ElementName).className = ClassName;
}

function removeAllChilds(Parent) {
    while (Parent.firstChild) {
        Parent.removeChild(Parent.firstChild);
    }
}

function getElementUnderMouse(Event) {
    return document.elementFromPoint(Event.clientX, Event.clientY);
}


function getScript(ScriptUrl) {
    return document.getElementById(ScriptUrl);
}

function loadScript(ScriptUrl) {
    var AlreadyLoadedScript = getScript(ScriptUrl);
    if (AlreadyLoadedScript != null) {
        AlreadyLoadedScript.remove();
    }
    
    var LoadScript = document.createElement('script');
    LoadScript.src = ScriptUrl;
    LoadScript.id = ScriptUrl;
    document.body.appendChild(LoadScript);
    
    return LoadScript;
}

function removeScript(ScriptUrl) {
    var AlreadyLoadedScript = getScript(ScriptUrl);
    if (AlreadyLoadedScript != null) {
        AlreadyLoadedScript.remove();
    }
}

function getImageDimensions(file) {
  return new Promise (function (resolved, rejected) {
    var i = new Image();
    i.onload = function(){
      resolved(i.height);
    };
    i.onerror = function(){
      resolved(0);
    };
    i.src = file;
  })
}

function SetURLEnd(End) {
    if(window.location.protocol == 'file:' || (window.location.origin.includes("https") == false)) { return null; }
    
    window.history.pushState(End, End, "/" + End);
}

function GetPageURLPath(Part) {
    if(window.location.protocol == 'file:' || (window.location.origin.includes("https") == false)) { return null; }
    
    return window.location.pathname.split("/")[Part];
}

async function sendRequest(Link, Method, Body) {
    const Data = {
      method: Method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    if (Body != null) {
        Data.body = JSON.stringify(Body);
    }
    
    const response = await fetch(Link, Data);
    /*
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    */
    return response.json();
}

function getCookieValue(CName) {
    // CREDIT: https://www.w3schools.com/js/js_cookies.asp
    
    var name = CName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
    }
    return null;
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}