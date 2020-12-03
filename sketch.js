var canvas;
var body;
var miniGames = [];
var nuovoColore = "";
var gameIndex = 0;


function preload(){
    miniGames.push(gioco_tanga);
    miniGames[gameIndex].loadRes();
}

function setup() {

    body = select("body");
    canvas = createCanvas(body.width, body.height);
    calcScaleAttr(body.width, body.height);

    miniGames[gameIndex].constructor();
}

function draw() {
    translate(getTranslation().x,getTranslation().y);
    scale(getScale().w,getScale().h);

    miniGames[gameIndex].draw(Canvas_resized);
    Canvas_resized = false;
}

function keyPressed(){
    if(miniGames[gameIndex].keyPressed !== undefined){
        miniGames[gameIndex].keyPressed();
    }

    if(keyCode == ESCAPE) {
      quitGame();
    }
}

function quitGame() {
  window.location.href = "index.html";
}

function mousePressed(){
    if(miniGames[gameIndex].mousePressed !== undefined){
        miniGames[gameIndex].mousePressed();
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function gameCompleted(success){

    if(success){
      setTimeout(function() {
        alert("REJOICE, YOU HAVE REACHED THE COMPLETION STATE OF THIS INTERACTIVE EXPERIENCE!");
        quitGame();
      }, 1000);
    }
    else{
        if(confirm("RIP, DO YOU WANNA PLAY AGAIN?")) {
          miniGames[gameIndex].constructor();
        }
        else {
          quitGame();
        }
    }
}
