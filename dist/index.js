// convert rgb to hex
const componentFromStr = (numStr, percent) => {
  let num = Math.max(0, parseInt(numStr, 10));
  return percent ? Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
}

const rgbToHex = (rgb) => {
  let rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
  let result, r, g, b, hex = "";
  if ( (result = rgbRegex.exec(rgb)) ) {
    r = componentFromStr(result[1], result[2]);
    g = componentFromStr(result[3], result[4]);
    b = componentFromStr(result[5], result[6]);

    hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  return hex;
}

const colorData = (favorites) => {
  let set = favorites.map((item,index) => {
    let bgColor = "rgb(" + item.colors[0].toString() + ")";
    let textColor = "rgb(" + item.colors[1].toString() + ")";
    let box = document.createElement("div");
    box.style.backgroundColor = bgColor;
    box.style.color = textColor;
    box.className = "box";
    box.addEventListener("click", function(){handleClick(this)});
    return box;
  });

  set.forEach((box, index) => {
    $(".container").append(box);
    animate(box,index);
  });
};


// retrieve data from JSON
const getData = () => {
  $.ajax({
    method: "GET",
    url: "./data.json",
    success: data => colorData(data.favorites),
    error: err => console.log("error " + err.status)
  });
}

// Animate in the boxes
const animate = (box, index) => {
  let delay = index * 200;
  setTimeout(function(){
    $(box).addClass("enter")
  }, delay)
}

// copy css
const copy = (e) => {
  
  let id = parseInt(e.target.getAttribute("data-copy"));
  let copyStr; 

  if(id === 1) {
    let bgColor = rgbToHex(document.documentElement.style.getPropertyValue("--bgColor"));
    let textColor = rgbToHex(document.documentElement.style.getPropertyValue("--textColor"));
    copyStr = "background-color: " + bgColor + ";" + "\n color: " + textColor + ";";
  }

  if(id === 2) {
    let textColor = rgbToHex(document.documentElement.style.getPropertyValue("--bgColor"));
    let bgColor = rgbToHex(document.documentElement.style.getPropertyValue("--textColor"));
    copyStr = "background-color: " + bgColor + ";" + "\n color: " + textColor + ";";
  }
  console.log(copyStr);
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(copyStr).select();
  document.execCommand("copy");
  $temp.remove();
}

const handleClick = (box) => {
  let scrollTop = $(document).scrollTop();
  let bgColor = box.style.backgroundColor;
  let textColor = box.style.color;
  document.documentElement.style.setProperty("--bgColor", bgColor);
  document.documentElement.style.setProperty("--textColor", textColor);
  $(".modal").addClass("show");
  $(".modal").css("top", scrollTop);

  code(box);
  
}

const code = (box) => {
  let style = box.style;
  let background = rgbToHex(style.backgroundColor);
  let text = rgbToHex(style.color);
  $("#code-1 p:first-child").text(generateCode("background-color", background));
  $("#code-1 p:nth-child(2)").text(generateCode("color", text));
  $("#code-2 p:first-child").text(generateCode("background-color", text));
  $("#code-2 p:nth-child(2)").text(generateCode("color", background));
}

function generateCode(attr, color) {
  return attr + ": " + color + ";";
}

// close modal
const closeModal = (modal) => {
    $(".modal").removeClass("show");
}

const tweetMe = (tweet) => {
  let tweetContent = "Check out this color collection by @sa_sha26! http://bit.ly/2yf5BuQ 💜";
  $(tweet).attr("href", "https://twitter.com/intent/tweet?text="+ tweetContent);
}

// toggle background
let current = 0;
let reverse;
const toggleBg = () => {
  let background = ["#FFFFFF", "#F5F5F5", "#666666", "#333333", "#000000"];
  reverse = ["#FFFFFF", "#F5F5F5", "#F6F6F6", "#444444", "#444444"].reverse();
  current++;
  document.documentElement.style.setProperty("--toggleBg", background[current]);
  document.documentElement.style.setProperty("--toggleBtn", reverse[current]);
  if(current >= background.length) {
    current = 0;
  }
};

$(document).ready(function(){
  getData();

  $(".close").click(function(){
    closeModal(this);
 });

  $("#tweet").click(function(){
    tweetMe(this);
  });

  $(".copy").click(function(e){
    copy(e);
    $(this).addClass("copied");

    setTimeout(() => {
      $(this).removeClass("copied");
    }, 300);
  });

  $("#toggle").click(() => {
    console.log("hello");
    toggleBg();
  });

  $(".about").click(() => $("#about").css("transform", "translateY(0%)"));
});
