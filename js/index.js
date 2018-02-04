const audioFiles = [
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", //Green
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", //Red
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", //Yellow
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3" //Blue
];
const errorAudio = new Audio('http://soundbible.com/mp3/Computer%20Error-SoundBible.com-1655839472.mp3');
const winAudio = new Audio('https://www.myinstants.com/media/sounds/victory-fanfare-variation.MP3');

simonSequence=[];
userSequence=[];
let newMove, generateStep, id, color, level=0, error=0, gameStarted=0, gameOn=1, strictButton=0, strictON=0, winLevel=20;


//New game
$(".start").click(function(){
  if(gameOn){
    gameStarted=1;
    error = false;
    level=1
    playSimonSequence();
  }});

//User input
$(".pad").click(function(){
  if (gameStarted)
    id=$(this).attr("id");
  color = $(this).attr("class").split(" ")[1]; 
  userSequence.push(id);
  padChosen(id, color);
  checkSequences();
  sequenceComplete();
  checkWin();
});

$(".strict").click(function(){

  if (gameOn) {
    if (gameStarted == 0){
      if (strictButton == 0) 
      {strictButton=1;
       $("#circle").addClass("circle-on");
       strictON=1
      }

      else {
        $(".circle").removeClass("circle-on");  
        strictButton = 0; 
        strictON=0}

    }}})

//Sequence plays
function playSimonSequence(){
  $(".display").text(level);  

  if(!error) {
    generateNewStep();
  }
  if(error && strictON) {
    generateNewStep();
  }  

  let i = 0;
  let myInterval = setInterval(function(){
    id = simonSequence[i];
    color = $("#"+id).attr("class").split(" ")[1];
    padChosen(id, color);
    i++;
    if(i == simonSequence.length){
      i=0;
      clearInterval(myInterval);
    }}
                               , 700);

}
//Compare sequences

function checkSequences(){
  for (let i=0; i < userSequence.length; i++){
    if(userSequence[i] != simonSequence[i]){
      userSequence=[];
      displayError();
      playSimonSequence();
    }
  }
}

//Sequence complete
function sequenceComplete(){
  if (userSequence.length == simonSequence.length && userSequence.length <winLevel) {
    error = 0;
    userSequence = [];
    level++;
    playSimonSequence();
  }
}

function displayError(){
  if (strictON) {
    simonSequence = [];
    level=1;}
  error=1
  errorAudio.play();
  let counter=0
  let myError=setInterval(function(){
    $(".display").text("--");
    counter++;
    if(counter == 3){
      $(".display").text(level);
      clearInterval(myError);
      counter=0
    }
  }, 500);

}

//Add temporary class and play audio
function padChosen(id, color){
  color = $("#"+id).attr("class").split(" ")[1];
  $("#"+id).addClass(color+"-active");
  playAudio(id)
  setTimeout(function(){
    $("#"+id).removeClass(color+"-active");
  }, 300);
}

//Random number 

function generateNewStep(){
  let newMove = Math.floor(Math.random() * 4);  
  simonSequence.push(newMove);
}

//Check for winner
function checkWin(){
  if (userSequence.length == winLevel) {
    winAudio.play();
    $(".display").text("Win").addClass("smallerText");
    alert("Congratulations! You win");
    userSequence=[];
    simonSequence=[];
    level=0;
    gameStarted == 0;
  }}

//Play audio
function playAudio(id) {
  let sound = new Audio(audioFiles[id]);
  sound.play();
}

$(".switch").click(function() {    
  gameOn = (gameOn == false) ? true : false;
  if(gameOn) {
    $(".inner-switch").addClass("switch-right");
    $(".display").text("--")
    gameOn=1;
  }
  else {
    $(".inner-switch").removeClass("switch-right");
    $(".display").text("");
    gameOn=0;
    userSequence=[];
    simonSequence=[];
    level=0;
    $(".circle").removeClass("circle-on");  
    strictButton = 0; 
    strictON=0;
    gameStarted = 0;
  }    
})