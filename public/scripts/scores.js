var endFX = new Audio('../sounds/end.wav')

$(function(){

  $('#mascot-sad img').hide();
  $('#mascot-happy img').hide();
  $('#mascot-meh img').hide();
    showScore();
    startConfetti();
    endFX.play()
})

//gets a user's most recent score and displays it
function showScore(){
    var queryString = window.location.search
    var score = new URLSearchParams(queryString).get("score")
    if (score > 7) {
      $('#mascot-happy img').show();
    }
    else if (score <= 7 && score > 4) {
      $('#mascot-meh img').show();
    }
    else if(score <=4){
      $('#mascot-sad img').show()
    }
    $('#score').html(score + '/10')
}

function tweet() {
  var queryString = window.location.search
  var score = new URLSearchParams(queryString).get("score")
  window.location.href = `//twitter.com/intent/tweet?text=I%20got%20${score}/10%20on%20GeoQuiz!%20Click%20the%20link%20to%20try%20and%20beat%20my%20score` + `%3A&url=http%3A%2F%2Fgeo-quiz.xyz%2F`
}

function startConfetti(){
    var myCanvas = document.getElementById("my-canvas")
    console.log(myCanvas)
    var myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true
      });
      myConfetti({
        particleCount: 100,
        spread: 160
        // any other options from the global
        // confetti function
      });
    console.log("start confetti")
    myConfetti()
}